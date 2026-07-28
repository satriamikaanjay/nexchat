import { useEffect, useRef, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export const useVoiceCall = ({ supabase, session, myProfile, callState, setCallState, remoteAudioRef, localVideoRef }) => {
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const channelRef = useRef(null);
  const pendingCandidates = useRef([]);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteIsVideoOff, setRemoteIsVideoOff] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('good');
  const [cameraFacingMode, setCameraFacingMode] = useState('user');

  const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  // ================= MESIN SUARA (AUDIO) =================
  const callingSoundRef = useRef(new Audio('/calling.mp3'));
  const ringtoneSoundRef = useRef(new Audio('/ringtone.mp3'));

  useEffect(() => {
    callingSoundRef.current.loop = true;
    ringtoneSoundRef.current.loop = true;
  }, []);

  useEffect(() => {
    // Mainkan/Matikan nada memanggil (User A)
    if (callState.status === 'calling') {
      callingSoundRef.current.play().catch(e => console.log("Audio Play Error:", e));
    } else {
      callingSoundRef.current.pause();
      callingSoundRef.current.currentTime = 0;
    }

    // Mainkan/Matikan nada dering (User B)
    if (callState.status === 'ringing') {
      ringtoneSoundRef.current.play().catch(e => console.log("Audio Play Error:", e));
    } else {
      ringtoneSoundRef.current.pause();
      ringtoneSoundRef.current.currentTime = 0;
    }
  }, [callState.status]);
  // ========================================================

  const sendSignal = (payload, targetChatId) => {
    if (!targetChatId) return;
    supabase.channel(`call-${targetChatId}`).send({ type: 'broadcast', event: 'call-signal', payload: payload });
  };

  const activeStatusRef = useRef(callState.status);
  const activeContactRef = useRef(callState.contact);
  useEffect(() => { activeStatusRef.current = callState.status; activeContactRef.current = callState.contact; }, [callState.status, callState.contact]);

  useEffect(() => {
    const handleUnload = () => {
      if (activeStatusRef.current !== 'idle' && activeContactRef.current?.contact_id) {
        supabase.channel(`call-${activeContactRef.current.contact_id}`).send({ type: 'broadcast', event: 'call-signal', payload: { type: 'hangup' } });
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  useEffect(() => {
    if (!myProfile?.chat_id) return;
    const callChannel = supabase.channel(`call-${myProfile.chat_id}`)
      .on('broadcast', { event: 'call-signal' }, async ({ payload }) => {
        
        if (payload.type === 'offer') {
          setCallState({ status: 'ringing', contact: payload.callerInfo, isCaller: false, offerData: payload.sdp, minimized: false, isVideo: payload.isVideo });
          if (Capacitor.isNativePlatform()) { /* ... Notifikasi Capacitor tetap sama ... */ }
        }

        if (payload.type === 'answer' && peerConnectionRef.current) {
          // CEK: Jangan proses jika state sudah 'stable' (berarti ini sinyal duplikat jaringan ngelag)
          if (peerConnectionRef.current.signalingState !== 'stable') {
            try {
              await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.sdp));
              
              // ---> JALANKAN ANTREAN DENGAN AMAN <---
              pendingCandidates.current.forEach(c => {
                 if (c) peerConnectionRef.current.addIceCandidate(c).catch(e => console.warn("ICE Antrean tertolak:", e));
              });
              pendingCandidates.current = []; 

              setCallState(prev => ({ ...prev, status: 'connecting' }));
              setTimeout(() => setCallState(prev => ({ ...prev, status: 'connected' })), 1200);
            } catch (err) {
              console.warn("Gagal memproses Answer dari jaringan lambat:", err);
            }
          } else {
             console.warn("Mengabaikan sinyal Answer duplikat. Koneksi sudah aman.");
          }
        }
        // ---> LOGIKA ANTREAN ICE CANDIDATE BARU <---
        if (payload.type === 'candidate' && peerConnectionRef.current) {
          // 1. Cek apakah sinyal candidate-nya benar-benar ada (tidak null/kosong)
          if (payload.candidate) {
            try {
              const rtcCandidate = new RTCIceCandidate(payload.candidate);
              
              // 2. Cek secara ketat apakah Pintu (RemoteDescription) sudah benar-benar jadi
              if (peerConnectionRef.current.remoteDescription && peerConnectionRef.current.remoteDescription.type) {
                peerConnectionRef.current.addIceCandidate(rtcCandidate).catch(e => console.warn("ICE tertolak (Aman):", e));
              } else {
                pendingCandidates.current.push(rtcCandidate);
              }
            } catch (err) {
              console.warn("Sinyal ICE rusak/kosong dari jaringan lambat. Diabaikan.");
            }
          }
        }

        if (payload.type === 'camera_toggle') setRemoteIsVideoOff(payload.isVideoOff);
        
        if (payload.type === 'hangup') {
          setCallState(prev => ({ ...prev, status: 'hanging_up' }));
          if (Capacitor.isNativePlatform()) LocalNotifications.cancel({ notifications: [{ id: 999 }] });
          setTimeout(() => endCall(true), 1500);
        }
      }).subscribe();

    channelRef.current = callChannel;
    return () => { supabase.removeChannel(callChannel); };
  }, [myProfile?.chat_id]);

  useEffect(() => {
    const startCall = async () => {
      try {
        const constraints = { audio: true, video: callState.isVideo ? { facingMode: cameraFacingMode, width: { ideal: 1280 }, height: { ideal: 720 } } : false };
        localStreamRef.current = await navigator.mediaDevices.getUserMedia(constraints);
        peerConnectionRef.current = new RTCPeerConnection(rtcConfig);

        if (callState.isVideo && localVideoRef?.current) localVideoRef.current.srcObject = localStreamRef.current;
        localStreamRef.current.getTracks().forEach(track => peerConnectionRef.current.addTrack(track, localStreamRef.current));
        peerConnectionRef.current.ontrack = (event) => { if (remoteAudioRef.current) remoteAudioRef.current.srcObject = event.streams[0]; };
        peerConnectionRef.current.onicecandidate = (event) => { if (event.candidate && callState.contact) sendSignal({ type: 'candidate', candidate: event.candidate }, callState.contact.contact_id); };
        
        peerConnectionRef.current.oniceconnectionstatechange = () => {
          if (peerConnectionRef.current) {
            const state = peerConnectionRef.current.iceConnectionState;
            if (state === 'disconnected') setNetworkStatus('bad');
            else if (state === 'connected' || state === 'completed') setNetworkStatus('good');
          }
        };

        if (callState.isCaller && callState.status === 'calling') {
          const offer = await peerConnectionRef.current.createOffer();
          await peerConnectionRef.current.setLocalDescription(offer);
          sendSignal({ type: 'offer', sdp: offer, isVideo: callState.isVideo, callerInfo: { contact_id: myProfile.chat_id, contact_username: myProfile.username, avatar_url: myProfile.avatar_url } }, callState.contact.contact_id);
        }
        if (!callState.isCaller && (callState.status === 'connecting' || callState.status === 'connected') && callState.offerData) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(callState.offerData));
          
          pendingCandidates.current.forEach(c => {
             if (c) peerConnectionRef.current.addIceCandidate(c).catch(e => console.warn("ICE Antrean tertolak:", e));
          });
          pendingCandidates.current = [];

          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          sendSignal({ type: 'answer', sdp: answer }, callState.contact.contact_id);
        }
      } catch (err) { console.error("Error WebRTC:", err); endCall(false); }
    };
    if (callState.status === 'calling' || callState.status === 'connecting' || callState.status === 'connected') { if (!peerConnectionRef.current) startCall(); }
  }, [callState.status]);

  const acceptCall = () => {
    setCallState(prev => ({ ...prev, status: 'connecting', minimized: false })); // Hilangkan minimize saat diangkat via notif
    if (Capacitor.isNativePlatform()) LocalNotifications.cancel({ notifications: [{ id: 999 }] }); // Hapus notif
  };
  const rejectCall = () => { 
    if (callState.contact?.contact_id) sendSignal({ type: 'hangup' }, callState.contact.contact_id); 
    if (Capacitor.isNativePlatform()) LocalNotifications.cancel({ notifications: [{ id: 999 }] });
    endCall(false); 
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) { audioTrack.enabled = !audioTrack.enabled; setIsMuted(!audioTrack.enabled); }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) { 
        videoTrack.enabled = !videoTrack.enabled; 
        setIsVideoOff(!videoTrack.enabled); 
        if (callState.contact) sendSignal({ type: 'camera_toggle', isVideoOff: !videoTrack.enabled }, callState.contact.contact_id);
      }
    }
  };

  const flipCamera = async () => { /* ... kode flip camera sama ... */
    if (!localStreamRef.current || !callState.isVideo) return;
    try {
      const newMode = cameraFacingMode === 'user' ? 'environment' : 'user';
      setCameraFacingMode(newMode);
      const oldVideoTrack = localStreamRef.current.getVideoTracks()[0];
      if (oldVideoTrack) { oldVideoTrack.stop(); localStreamRef.current.removeTrack(oldVideoTrack); }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: newMode } });
      const newVideoTrack = stream.getVideoTracks()[0];
      localStreamRef.current.addTrack(newVideoTrack);
      const sender = peerConnectionRef.current?.getSenders().find(s => s.track?.kind === 'video');
      if (sender) sender.replaceTrack(newVideoTrack);
      if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
    } catch (err) { console.error("Gagal membalik kamera:", err); }
  };

  const endCall = (fromRemote = false) => {
    if (localStreamRef.current) { localStreamRef.current.getTracks().forEach(track => track.stop()); localStreamRef.current = null; }
    if (peerConnectionRef.current) { peerConnectionRef.current.close(); peerConnectionRef.current = null; }
    setIsMuted(false); setIsVideoOff(false); setNetworkStatus('good'); setRemoteIsVideoOff(false);

    setCallState(prev => {
      if (!fromRemote && prev.contact && prev.status !== 'idle') sendSignal({ type: 'hangup' }, prev.contact.contact_id);
      return { status: 'idle', contact: null, isCaller: false, offerData: null, minimized: false, isVideo: false };
    });
  };

  return { acceptCall, rejectCall, endCall, toggleMute, isMuted, toggleVideo, isVideoOff, remoteIsVideoOff, networkStatus, flipCamera };
};