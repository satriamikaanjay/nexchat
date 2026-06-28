import { useState, useEffect, useRef, Fragment } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import myIcon from '../public/favicon.svg';

// ================= IKON SVG MINIMALIS =================
const Icons = {
  Chat: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
  User: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Settings: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Search: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>,
  More: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>,
  ArrowLeft: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>,
  Plus: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>,
  Send: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>,
  Attach: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
  Reply: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 11l8-8v5c7 0 10 3.5 10 10-2-3-5-4-10-4v5l-8-8z"></path></svg>,
  Download: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg>,
  File: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>,
  Check: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  DoubleCheck: () => <svg width="20" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="18 6 7 17 2 12"></polyline><polyline points="22 6 12 16 11 15"></polyline></svg>,
  Lock: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Copy: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  Trash: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
  Share: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>,
  Edit: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Clock: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Info: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Users: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  WhatsApp: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
  Instagram: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  TikTok: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>,
}

const Avatar = ({ url, name, size = 'w-10 h-10', className = '' }) => (
  url ? (
    <img src={url} alt={name} className={`${size} rounded-full object-cover shrink-0 border-[2px] md:border-[3px] border-black shadow-[2px_2px_0_0_#000] bg-white ${className}`} />
  ) : (
    <div className={`${size} rounded-full bg-[#ff5757] flex items-center justify-center font-black text-black shrink-0 border-[2px] md:border-[3px] border-black shadow-[2px_2px_0_0_#000] text-sm md:text-base ${className}`}>
      {name?.charAt(0).toUpperCase() || '?'}
    </div>
  )
)

const Modal = ({ isOpen, onClose, title, children, colors }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`${colors.panel} border-[3px] md:border-[4px] border-black rounded-[1.5rem] md:rounded-[2rem] w-full max-w-md shadow-[6px_6px_0_0_#000] md:shadow-[8px_8px_0_0_#000] overflow-hidden flex flex-col transform transition-transform`}>
        <div className={`p-4 md:p-5 border-b-[3px] md:border-b-[4px] border-black flex justify-between items-center bg-black/5`}>
          <h3 className="font-black text-lg md:text-xl uppercase tracking-wider">{title}</h3>
          <button onClick={onClose} className="hover:scale-110 active:scale-95 transition-transform p-1 bg-white rounded-full border-2 border-black text-black shadow-[2px_2px_0_0_#000]"><Icons.Plus className="rotate-45" /></button>
        </div>
        <div className="p-4 md:p-6 flex-1 bg-gradient-to-b from-transparent to-black/5">{children}</div>
      </div>
    </div>
  )
}

// ================= TEMA KARTUN / NEOBRUTALISM =================
const dict = {
  id: { chat: 'Obrolan', info: 'Sistem', settings: 'Setelan', profile: 'Profil', deleteAcc: 'Hapus Entitas', typeMsg: 'Ketik pesan...', noChat: 'Belum ada obrolan.', theme: 'Tema Visual', light: 'Mode Siang ☀️', dark: 'Mode Malam 🌙', save: 'SIMPAN!' },
}

const getTheme = (name) => {
  if (name === 'light') {
    return { 
      base: 'bg-[#ffde59]', 
      panel: 'bg-white', 
      border: 'border-black', 
      text: 'text-black font-bold tracking-wide', 
      textMuted: 'text-gray-700 font-bold', 
      primary: 'bg-[#ff5757] text-black border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-[0px_0px_0_0_#000]', 
      bubbleMe: 'bg-[#38b6ff] text-black border-[2px] md:border-[3px] border-black shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000]', 
      bubbleThem: 'bg-white text-black border-[2px] md:border-[3px] border-black shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000]', 
      navIcon: 'text-black hover:scale-125 active:scale-90 transition-transform' 
    }
  }
  return { 
    base: 'bg-[#2a1b3d]', 
    panel: 'bg-[#44318d]', 
    border: 'border-black', 
    text: 'text-white font-bold tracking-wide', 
    textMuted: 'text-[#d4c5f9] font-bold', 
    primary: 'bg-[#d83f87] text-white border-[3px] border-black shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-[0px_0px_0_0_#000]', 
    bubbleMe: 'bg-[#ff65a3] text-black border-[2px] md:border-[3px] border-black shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000]', 
    bubbleThem: 'bg-[#7a2048] text-white border-[2px] md:border-[3px] border-black shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000]', 
    navIcon: 'text-white hover:scale-125 active:scale-90 transition-transform' 
  }
}

const formatDateBadge = (dateString) => {
  const date = new Date(dateString); const today = new Date(); const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return 'HARI INI'
  if (date.toDateString() === yesterday.toDateString()) return 'KEMARIN'
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()
}

export default function App() {
  const [session, setSession] = useState(null)
  const [myProfile, setMyProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchMyProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setMyProfile(data)
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); if (session) fetchMyProfile(session.user.id); else setLoading(false) })
    supabase.auth.onAuthStateChange((_event, session) => { setSession(session); if (session) fetchMyProfile(session.user.id) })
  }, [])

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#ffde59] text-black font-black tracking-widest text-xl md:text-2xl uppercase border-[4px] md:border-[8px] border-black">MEMUAT... 🚀</div>
  if (!session || !myProfile) return <Auth onLoginSuccess={(user) => fetchMyProfile(user.id)} />

  return <MainApp session={session} myProfile={myProfile} setMyProfile={setMyProfile} />
}

function MainApp({ session, myProfile, setMyProfile }) {
  const [themeName, setThemeName] = useState(localStorage.getItem('app_theme') || 'light')
  const [activeMenu, setActiveMenu] = useState('chat')
  const [activeChat, setActiveChat] = useState(null) 
  
  const [globalMessages, setGlobalMessages] = useState([])
  const [contacts, setContacts] = useState([])
  const [groups, setGroups] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  
  // State untuk Pencarian Teman via Modal
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // State untuk Pencarian Teman via Beranda (Home)
  const [homeSearch, setHomeSearch] = useState('')
  const [homeSearchResults, setHomeSearchResults] = useState([])
  const [isHomeSearching, setIsHomeSearching] = useState(false)
  
  const [unknownProfiles, setUnknownProfiles] = useState({})
  const [blockedIds, setBlockedIds] = useState(() => {
    const saved = localStorage.getItem('blocked_ids')
    return saved ? JSON.parse(saved) : []
  })

  // State untuk kontak yang disembunyikan / dihapus
  const [hiddenIds, setHiddenIds] = useState(() => {
    const saved = localStorage.getItem('hidden_ids')
    return saved ? JSON.parse(saved) : []
  })
  
  // State untuk Custom Popup Konfirmasi
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, title: '', message: '', onConfirm: null, isAlertOnly: false 
  })
  
  const openConfirm = (title, message, onConfirm, isAlertOnly = false) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm, isAlertOnly })
  }

  const t = dict['id']
  const colors = getTheme(themeName)

  const handleSwitchChat = (chat) => {
    setActiveChat(chat);
  }

  useEffect(() => { localStorage.setItem('app_theme', themeName) }, [themeName])
  useEffect(() => { localStorage.setItem('blocked_ids', JSON.stringify(blockedIds)) }, [blockedIds])
  useEffect(() => { localStorage.setItem('hidden_ids', JSON.stringify(hiddenIds)) }, [hiddenIds])

  // Effect Untuk Cari Teman via Modal
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchInput.trim()) {
        setSearchResults([])
        return
      }
      setIsSearching(true)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .or(`chat_id.eq.${searchInput},username.ilike.%${searchInput}%`)
        .neq('chat_id', myProfile.chat_id)
        .limit(10)

      if (data) { setSearchResults(data) }
      setIsSearching(false)
    }, 500) 
    return () => clearTimeout(timer)
  }, [searchInput, myProfile.chat_id])

  // Effect Untuk Cari Teman via Beranda (Home Search)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!homeSearch.trim()) {
        setHomeSearchResults([])
        return
      }
      setIsHomeSearching(true)
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .or(`chat_id.eq.${homeSearch},username.ilike.%${homeSearch}%`)
        .neq('chat_id', myProfile.chat_id)
        .limit(15)

      if (data) setHomeSearchResults(data)
      setIsHomeSearching(false)
    }, 500) 
    return () => clearTimeout(timer)
  }, [homeSearch, myProfile.chat_id])

  useEffect(() => {
  const setupPushNotifications = async () => {
    // TAMBAHKAN PENGECEKAN INI:
    // Jika bukan di aplikasi HP (Android/iOS), hentikan fungsi di sini.
    if (!Capacitor.isNativePlatform()) {
      console.log("Push notifications diabaikan (hanya untuk mode native)");
      return;
    }

    // Hanya jika di HP, kode di bawah ini akan dijalankan:
    const { PushNotifications } = await import('@capacitor/push-notifications');
    
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive !== 'granted') return; 

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('profiles').update({ fcm_token: token.value }).eq('id', session.user.id);
      }
    });
  };

  setupPushNotifications();
}, []);


  useEffect(() => {
    const fetchGlobalMessages = async () => {
      const { data } = await supabase.from('messages').select('*').or(`sender_id.eq.${myProfile.chat_id},receiver_id.eq.${myProfile.chat_id}`).order('created_at', { ascending: true })
      if (data) setGlobalMessages(data)
    }
    fetchGlobalMessages()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') { fetchGlobalMessages(); }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => { document.removeEventListener('visibilitychange', handleVisibilityChange); }
  }, [myProfile.chat_id])

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    const channel = supabase.channel('global-chat-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        if (blockedIds.includes(msg.sender_id)) return;
        
        setHiddenIds(prev => prev.includes(msg.sender_id) ? prev.filter(id => id !== msg.sender_id) : prev);
        setGlobalMessages((prev) => [...prev, msg]);

        if (msg.sender_id !== myProfile.chat_id) {
          const isForMe = msg.receiver_id === myProfile.chat_id;
          const isForMyGroup = msg.group_id && groups.some(g => g.id === msg.group_id);

          if ((isForMe || isForMyGroup) && document.visibilityState === 'hidden' && Notification.permission === 'granted') {
            const notifTitle = isForMyGroup ? `Pesan Baru di Grup` : `Pesan dari ${msg.sender_id}`;
            const notifBody = msg.content || 'Mengirim berkas lampiran';
            const notification = new Notification(notifTitle, { body: notifBody });
            notification.onclick = () => { window.focus(); notification.close(); };
          }
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => {
        setGlobalMessages((prev) => prev.map(m => m.id === payload.new.id ? payload.new : m));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, (payload) => {
        setGlobalMessages((prev) => prev.filter(m => m.id !== payload.old.id));
      })
      .on('presence', { event: 'sync' }, () => {
        const onlineIds = Object.values(channel.presenceState()).flatMap(users => users.map(u => u.user_id));
        setOnlineUsers([...new Set(onlineIds)]);
      })
      .subscribe(async (status) => { if (status === 'SUBSCRIBED') await channel.track({ user_id: myProfile.chat_id }) })

    return () => { supabase.removeChannel(channel) }
  }, [myProfile.chat_id, groups, blockedIds])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const sharedId = params.get('id')
    if (sharedId && sharedId !== myProfile.chat_id) {
      setTimeout(() => {
        setSearchInput(sharedId)
        setIsAddContactOpen(true)
        window.history.replaceState({}, document.title, window.location.pathname)
      }, 500)
    }
  }, [myProfile.chat_id])

  useEffect(() => {
    const initData = async () => {
      const { data: myContacts } = await supabase.from('contacts').select('id, user_id, contact_id, contact_username, created_at, cleared_at').eq('user_id', session.user.id).order('created_at', { ascending: false })
      if (myContacts && myContacts.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('chat_id, avatar_url').in('chat_id', myContacts.map(c => c.contact_id))
        setContacts(myContacts.map(contact => ({ ...contact, avatar_url: profiles?.find(p => p.chat_id === contact.contact_id)?.avatar_url })))
      }
    }
    initData()
  }, [session.user.id])

  const savedContactIds = contacts.map(c => c.contact_id);
  const unknownContactIds = [...new Set(
    globalMessages
      .filter(m => m.receiver_id === myProfile.chat_id && m.sender_id !== myProfile.chat_id && !savedContactIds.includes(m.sender_id) && !blockedIds.includes(m.sender_id) && !hiddenIds.includes(m.sender_id))
      .map(m => m.sender_id)
  )];

  useEffect(() => {
    const missingIds = unknownContactIds.filter(id => !unknownProfiles[id]);
    if (missingIds.length === 0) return;

    const fetchMissingProfiles = async () => {
      const { data } = await supabase.from('profiles').select('chat_id, username, avatar_url').in('chat_id', missingIds);
      if (data) {
        setUnknownProfiles(prev => {
          const updated = { ...prev };
          data.forEach(p => { updated[p.chat_id] = p });
          return updated;
        });
      }
    };
    fetchMissingProfiles();
  }, [JSON.stringify(unknownContactIds)]) 

  const unknownContacts = unknownContactIds.map(id => ({
    id: `unknown-${id}`,
    contact_id: id,
    contact_username: unknownProfiles[id]?.username || id, 
    avatar_url: unknownProfiles[id]?.avatar_url || null,
    cleared_at: '1970-01-01',
  }));

  const handleQuickSaveContact = async (contactId, username, avatarUrl) => {
    const { data } = await supabase.from('contacts').insert([{ user_id: session.user.id, contact_id: contactId, contact_username: username, cleared_at: '1970-01-01' }]).select().single()
    if (data) { 
      setContacts([{ ...data, avatar_url: avatarUrl }, ...contacts]); 
    }
  }

  const handleBlockContact = (contactId) => {
    openConfirm('BLOKIR KONTAK', 'Beneran mau diblokir? 🚫', () => {
      setBlockedIds(prev => [...prev, contactId])
      if (activeChat?.contact_id === contactId) setActiveChat(null)
    })
  }

  const handleDeleteContact = (e, contactId) => {
    e.stopPropagation()
    openConfirm('HAPUS TEMAN', 'Yakin mau hapus teman ini? 🗑️', async () => {
      const { error } = await supabase.from('contacts').delete().eq('contact_id', contactId).eq('user_id', session.user.id)
      if (!error) {
        setContacts(contacts.filter(c => c.contact_id !== contactId))
        setHiddenIds(prev => [...prev, contactId]) 
        if (activeChat?.contact_id === contactId) setActiveChat(null)
      }
    })
  }

  const handleSearchContact = async (e) => {
    e.preventDefault()
    if (!searchInput.trim()) return
    setIsSearching(true)
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`chat_id.eq.${searchInput},username.ilike.%${searchInput}%`)
      .neq('chat_id', myProfile.chat_id)
      .limit(10)

    if (data) {
      setSearchResults(data)
    }
    setIsSearching(false)
  }

  const startChatWithUser = async (friendProfile) => {
    const existingContact = contacts.find(c => c.contact_id === friendProfile.chat_id)
    if (existingContact) {
      setActiveChat({ ...existingContact, type: 'personal' })
    } else {
      const { data } = await supabase.from('contacts').insert([{ 
        user_id: session.user.id, 
        contact_id: friendProfile.chat_id, 
        contact_username: friendProfile.username, 
        cleared_at: '1970-01-01' 
      }]).select().single()

      if (data) { 
        const newContact = { ...data, avatar_url: friendProfile.avatar_url };
        setContacts([newContact, ...contacts]); 
        setActiveChat({ ...newContact, type: 'personal' })
      } else {
        // Fallback langsung buka chat walau gagal simpan contact
        setActiveChat({ contact_id: friendProfile.chat_id, contact_username: friendProfile.username, avatar_url: friendProfile.avatar_url, type: 'personal', cleared_at: '1970-01-01' })
      }
    }
    setIsAddContactOpen(false)
    setSearchInput('')
    setSearchResults([])
    setHomeSearch('')
    setActiveMenu('chat')
  }

  const UpdateSection = () => (
  <div className="mb-6 p-4 border-[3px] border-black rounded-[1.5rem] bg-yellow-100 shadow-[4px_4px_0_0_#000]">
    <h3 className="font-black text-lg mb-1 underline">📢 Info Pembaruan v1.1</h3>
    <p className="text-sm font-bold">- Memperbaiki bug pada ruang chat</p>
    <p className="text-sm font-bold">- Tampilan diperbarui</p>
    <p className="text-sm font-bold">- Memperbaiki fitur pencarian teman</p>
    <p className="text-sm font-bold">- menambahkan beberapa fitur baru</p>
  </div>
);

 return (
    <div translate="no" className={`flex fixed inset-0 w-full font-sans overflow-hidden ${colors.base} ${colors.text}`}>
      
      {/* SIDEBAR */}
      <div className={`flex flex-col h-full w-full md:w-[380px] border-r-0 md:border-r-[4px] ${colors.border} ${colors.panel} ${activeChat ? 'hidden md:flex' : 'flex'} shadow-none md:shadow-[8px_0_0_0_rgba(0,0,0,0.1)] z-10 relative`}>
        
        {/* HEADER NAVBAR (Gaya WhatsApp) */}
        <div className={`flex items-center justify-between p-3 md:p-4 border-b-[3px] md:border-b-[4px] ${colors.border} h-[70px] md:h-[84px] shrink-0 bg-black/5`}>
            {/* Kiri: Avatar & Nama Web */}
            <div className="flex items-center gap-3 overflow-hidden">
                <Avatar url={myProfile.avatar_url} name={myProfile.username} size="w-10 h-10 md:w-12 md:h-12" />
                <h1 className="font-black text-lg md:text-xl uppercase tracking-widest truncate text-shadow-[2px_2px_0_0_#000]">NexChat!</h1>
            </div>
            
            {/* Kanan: Titik Tiga (Menu Profil & Setting) */}
            <div className="flex items-center shrink-0">
                <button 
                  onClick={() => setActiveMenu('settings')} 
                  className={`p-2 md:p-2.5 rounded-xl md:rounded-[1rem] bg-white text-black border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all`} 
                  title="Pengaturan"
                >
                  <Icons.Settings />
                </button>
            </div>
        </div>

        {/* MODAL CARI TEMAN */}
        <Modal isOpen={isAddContactOpen} onClose={() => {setIsAddContactOpen(false); setSearchResults([]); setSearchInput('');}} title="CARI TEMAN 👾" colors={colors}>
          <form onSubmit={handleSearchContact} className="space-y-4">
            <div>
              <label className={`text-xs md:text-sm font-black mb-2 block uppercase tracking-wide ${colors.text}`}>ID ATAU USERNAME</label>
              <div className="flex gap-2">
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Ketik ID atau Username..." className={`flex-1 p-3 md:p-4 text-black rounded-xl md:rounded-2xl bg-white border-[2px] md:border-[3px] border-black focus:outline-none focus:shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.2)] shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.1)] transition-all font-bold text-sm md:text-base`} />
                <button type="submit" disabled={isSearching} className={`px-4 md:px-6 ${colors.primary} font-black text-sm md:text-lg rounded-xl md:rounded-2xl uppercase tracking-wider`}>
                   {isSearching ? '...' : <Icons.Search />}
                </button>
              </div>
            </div>
          </form>
          <div className="mt-5 space-y-3 max-h-[40vh] overflow-y-auto pr-1">
             {searchResults.length === 0 && searchInput && !isSearching && (
                <p className="text-center font-bold text-xs md:text-sm uppercase opacity-70 mt-4">Pencarian tidak ditemukan.</p>
             )}
             {searchResults.map(user => (
               <div key={user.chat_id} className="flex items-center justify-between p-3 bg-white rounded-xl md:rounded-2xl border-[2px] md:border-[3px] border-black shadow-[3px_3px_0_0_#000]">
                 <div className="flex items-center gap-3 overflow-hidden">
                   <Avatar url={user.avatar_url} name={user.username} size="w-10 h-10 md:w-12 md:h-12" />
                   <div className="min-w-0">
                     <p className="font-black text-black text-sm md:text-base truncate uppercase">{user.username}</p>
                     <p className="text-[10px] md:text-xs font-mono text-gray-500 truncate">{user.chat_id}</p>
                   </div>
                 </div>
                 <button onClick={() => startChatWithUser(user)} className="ml-2 p-2 md:p-2.5 bg-[#38b6ff] text-black border-2 md:border-[3px] border-black rounded-lg md:rounded-xl shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center shrink-0">
                   <Icons.Chat />
                 </button>
               </div>
             ))}
          </div>
        </Modal>

        {/* ISI KONTEN TENGAH */}
        <div className="flex-1 overflow-y-auto relative" onClick={() => setIsHeaderMenuOpen(false)}>
          
          {/* Tampilan Setelan (Profile) */}
          {activeMenu === 'settings' && (
            <ProfileModule 
              session={session} 
              myProfile={myProfile} 
              setMyProfile={setMyProfile} 
              t={t} 
              colors={colors} 
              setActiveMenu={setActiveMenu} 
              openConfirm={openConfirm} 
            />
          )}

          {/* TAMPILAN ATUR TEMA (Halaman Baru dari Pengaturan) */}
          {activeMenu === 'theme' && (
            <div className="p-4 md:p-6 bg-gradient-to-b from-transparent to-black/5 min-h-full">
              <div className="flex items-center gap-3 mb-6 border-b-[3px] md:border-b-[4px] border-black pb-4">
                <button onClick={() => setActiveMenu('settings')} className="p-2 bg-white rounded-xl border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all"><Icons.ArrowLeft /></button>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider">Atur Tema 🎨</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 md:p-6 rounded-2xl border-[3px] md:border-[4px] border-black shadow-[4px_4px_0_0_#000]">
                  <label className="block text-xs md:text-sm font-black mb-3 uppercase text-black">Pilih Tema Visual</label>
                  <select value={themeName} onChange={(e) => setThemeName(e.target.value)} className="w-full p-3 md:p-4 text-sm md:text-base text-black font-bold rounded-xl md:rounded-2xl bg-gray-50 border-[2px] md:border-[3px] border-black shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.1)] focus:outline-none appearance-none cursor-pointer">
                    <option value="light">Mode Siang ☀️</option>
                    <option value="dark">Mode Malam 🌙</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Tampilan Daftar Chat (Beranda) */}
          {activeMenu === 'chat' && (
            <div className="flex flex-col min-h-full">
              <div className={`p-3 md:p-4 border-b-[3px] md:border-b-[4px] ${colors.border} flex gap-2 shrink-0 bg-black/5`}>
                <div className={`flex-1 flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl bg-white border-[2px] md:border-[3px] border-black shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.1)] md:shadow-[inset_3px_3px_0_0_rgba(0,0,0,0.1)] text-black focus-within:shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.2)] transition-all`}>
                  <Icons.Search />
                  <input type="text" value={homeSearch} onChange={(e) => setHomeSearch(e.target.value)} placeholder="CARI TEMAN..." className="bg-transparent border-none outline-none w-full text-sm md:text-base font-bold placeholder-gray-500 uppercase" />
                </div>
              </div>
              
              <div className="flex-1 p-3 space-y-3 pb-24">
                {homeSearch.trim() ? (
                  // ================= HASIL CARI TEMAN DI BERANDA =================
                  <div className="space-y-3">
                    {isHomeSearching ? (
                      <p className="text-center font-bold text-xs uppercase opacity-70 mt-4">Mencari...</p>
                    ) : homeSearchResults.length === 0 ? (
                      <p className="text-center font-bold text-xs uppercase opacity-70 mt-4">Pencarian Tidak Ditemukan.</p>
                    ) : (
                      homeSearchResults.map(user => {
                        const isSaved = contacts.some(c => c.contact_id === user.chat_id);
                        const isChatted = unknownContactIds.includes(user.chat_id);
                        const isNew = !isSaved && !isChatted;

                        return (
                          <div key={user.chat_id} onClick={() => startChatWithUser(user)} className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-[2px] md:border-[3px] border-black shadow-[3px_3px_0_0_#000] md:shadow-[4px_4px_0_0_#000] cursor-pointer flex items-center gap-3 md:gap-4 transition-all hover:-translate-y-1 bg-white text-black`}>
                            <div className="relative">
                              <Avatar url={user.avatar_url} name={user.username} size="w-12 h-12 md:w-14 md:h-14" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base md:text-lg truncate uppercase font-bold">
                                {user.username}
                                {isNew && <span className="text-[9px] md:text-[10px] font-black bg-[#00e676] text-black border-[2px] border-black px-2 py-0.5 rounded-full ml-2 shadow-[2px_2px_0_0_#000] uppercase">BARU</span>}
                              </h3>
                              <p className={`text-xs md:text-sm font-bold truncate mt-1 text-gray-500 font-mono`}>ID: {user.chat_id}</p>
                            </div>
                            <button className="p-2 md:p-2.5 bg-[#38b6ff] text-black border-2 md:border-[3px] border-black rounded-lg md:rounded-xl shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000] hover:-translate-y-1 transition-all flex items-center shrink-0">
                              <Icons.Chat />
                            </button>
                          </div>
                        )
                      })
                    )}
                  </div>
                ) : (
                  // ================= DAFTAR CHAT NORMAL =================
                  contacts.length === 0 && unknownContacts.length === 0 ? (
                    <div className={`p-6 md:p-10 text-center font-black uppercase text-lg md:text-xl mt-6 md:mt-10 opacity-50`}>SEPI BANGET... 🌵</div>
                  ) : (
                    <>
                      {unknownContacts.map(c => {
                        const isOnline = onlineUsers.includes(c.contact_id);
                        const unreadCount = globalMessages.filter(m => m.sender_id === c.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read).length;

                        return (
                          <div key={c.id} onClick={() => handleSwitchChat({...c, type: 'personal'})} className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-[2px] md:border-[3px] border-black shadow-[3px_3px_0_0_#000] md:shadow-[4px_4px_0_0_#000] cursor-pointer flex items-center gap-3 md:gap-4 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] md:hover:shadow-[6px_6px_0_0_#000] group ${activeChat?.contact_id === c.contact_id ? 'bg-[#ffde59] text-black scale-[1.02]' : 'bg-gray-100 text-black'}`}>
                            <div className="relative">
                              <Avatar url={c.avatar_url} name={c.contact_username} size="w-12 h-12 md:w-14 md:h-14" />
                              {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-[#00e676] border-[2px] border-black rounded-full shadow-[1px_1px_0_0_#000]"></span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-base md:text-lg truncate uppercase ${unreadCount > 0 ? 'font-black' : 'font-bold'}`}>
                                {c.contact_id}
                                {unreadCount > 0 && <span className="text-[9px] md:text-[10px] font-black bg-[#ff5757] text-white border-[2px] border-black px-2 py-0.5 rounded-full ml-2 shadow-[2px_2px_0_0_#000] uppercase">BARU</span>}
                              </h3>
                              {unreadCount > 0 ? (
                                <p className="text-[10px] md:text-xs font-black text-[#ff5757] mt-1 bg-red-100 inline-block px-2 py-0.5 rounded-full border border-black uppercase">Pesan Baru!</p>
                              ) : (
                                <p className={`text-xs md:text-sm font-bold truncate mt-1 text-gray-500`}>Siapa nih? 🤔</p>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {contacts.map(c => {
                        const isOnline = onlineUsers.includes(c.contact_id);
                        const clearedAtTime = new Date(c.cleared_at || '1970-01-01').getTime();
                        const unreadCount = globalMessages.filter(m => {
                          const isNotCleared = new Date(m.created_at).getTime() > clearedAtTime;
                          return isNotCleared && m.sender_id === c.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read;
                        }).length;

                        return (
                          <div key={c.id} onClick={() => handleSwitchChat({...c, type: 'personal'})} className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-[2px] md:border-[3px] border-black shadow-[3px_3px_0_0_#000] md:shadow-[4px_4px_0_0_#000] cursor-pointer flex items-center gap-3 md:gap-4 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] md:hover:shadow-[6px_6px_0_0_#000] group ${activeChat?.contact_id === c.contact_id ? 'bg-[#ffde59] text-black scale-[1.02]' : 'bg-white text-black'}`}>
                            <div className="relative">
                              <Avatar url={c.avatar_url} name={c.contact_username} size="w-12 h-12 md:w-14 md:h-14" />
                              {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 bg-[#00e676] border-[2px] border-black rounded-full shadow-[1px_1px_0_0_#000]"></span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-base md:text-lg truncate uppercase ${unreadCount > 0 ? 'font-black' : 'font-bold'}`}>{c.contact_username}</h3>
                              {unreadCount > 0 ? (
                                <p className="text-[10px] md:text-xs font-black text-[#ff5757] mt-1 bg-red-100 inline-block px-2 py-0.5 rounded-full border border-black uppercase">Pesan Baru!</p>
                              ) : (
                                <p className={`text-xs md:text-sm font-bold truncate mt-1 text-gray-500 font-mono`}>ID: {c.contact_id}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {unreadCount > 0 && (
                                <div className="bg-[#ff5757] text-white text-xs md:text-sm font-black w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full border-[2px] border-black shadow-[2px_2px_0_0_#000]">{unreadCount}</div>
                              )}
                              <button onClick={(e) => handleDeleteContact(e, c.contact_id)} className={`p-2 md:p-2.5 rounded-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-[#ff5757] text-white border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all`} title="Hapus">
                                <Icons.Trash />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )
                )}
              </div>
              <div className="absolute bottom-5 right-5 md:bottom-6 md:right-6 flex flex-col gap-4">
                <button onClick={() => setIsAddContactOpen(true)} className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#38b6ff] text-black border-[2px] md:border-[3px] border-black shadow-[3px_3px_0_0_#000] md:shadow-[4px_4px_0_0_#000] flex items-center justify-center transition hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] md:hover:-translate-y-2 md:hover:shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none`} title="Tambah Teman"><Icons.Plus /></button>
              </div>
            </div>
          )}

          

          {/* HALAMAN ABOUT & LAPOR BUG */}
          {activeMenu === 'about' && (
            <div className="p-4 md:p-6 space-y-6 bg-gradient-to-b from-transparent to-black/5 min-h-full pb-10">
              <div className="flex flex-col items-center mt-2">
                <div className={`w-20 h-20 md:w-24 md:h-24 mb-4 rounded-[1.5rem] bg-white border-[3px] md:border-[4px] border-black shadow-[4px_4px_0_0_#000] flex items-center justify-center text-black rotate-[-5deg] hover:rotate-[5deg] transition-transform`}>
                  <img src={myIcon} alt="Icon" className="w-20 h-20" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black uppercase text-shadow-[2px_2px_0_0_#000]">NexChat!</h2>
                <p className="font-bold text-sm bg-white border-[2px] border-black inline-block px-3 py-1 rounded-full shadow-[2px_2px_0_0_#000] mt-2">Versi 1.1 🚀</p>
              </div>
              
              <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0_0_#000]">
                <h3 className="font-black text-lg border-b-[2px] border-black pb-2 mb-2 uppercase text-[#38b6ff] text-shadow-[1px_1px_0_0_#000]">Deskripsi</h3>
                <p className="text-sm font-bold leading-relaxed text-black">NexChat adalah aplikasi chatting asik bergaya visual Neobrutalism. Dibangun untuk ngobrol tanpa batas, aman, dan super cepat!</p>
              </div>

              <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0_0_#000]">
                <h3 className="font-black text-lg border-b-[2px] border-black pb-2 mb-2 uppercase text-[#ffde59] text-shadow-[1px_1px_0_0_#000]">Info Developer</h3>
                <p className="text-sm font-bold leading-relaxed mb-3 text-black">Dikembangkan dengan ❤️ oleh <span className="text-[#ff5757] uppercase tracking-wider">Satria Mika Narendra</span>.</p>
                <div className="flex gap-2">
                  <a href="https://www.instagram.com/satriamika_/" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-[#d83f87] text-white rounded-xl border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 active:translate-y-0 transition-all font-black text-xs uppercase"><Icons.User /> Instagram</a>
                  <a href="https://github.com/satriamikaanjay" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 bg-gray-800 text-white rounded-xl border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 active:translate-y-0 transition-all font-black text-xs uppercase"><Icons.File /> GitHub</a>
                </div>
              </div>

              <UpdateSection />

              {/* SECTION LAPOR BUG MODIFIKASI */}
              <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[4px_4px_0_0_#000]">
                <h3 className="font-black text-lg border-b-[2px] border-black pb-2 mb-3 uppercase text-[#ff5757] text-shadow-[1px_1px_0_0_#000]">Lapor Bug 🐛</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const msg = e.target.bugMsg.value;
                  const devId = "id-x08fjoba"; // <<-- GANTI DENGAN ID CHAT MILIKMU (sebagai developer)
                  
                  // Mengirim pesan template
                  await supabase.from('messages').insert([{
                    sender_id: myProfile.chat_id,
                    receiver_id: devId,
                    content: `[LAPORAN BUG]\n\n${msg}`,
                    is_read: false
                  }]);

                  // Dapatkan profil developer lalu redirect ke ruang chat
                  const { data: devProfile } = await supabase.from('profiles').select('*').eq('chat_id', devId).single();
                  if (devProfile) {
                    startChatWithUser(devProfile); // Pindah ke menu chat otomatis
                  } else {
                    // Fallback jika belum pernah ada kontak Dev
                    startChatWithUser({ chat_id: devId, username: "Developer NexChat" });
                  }
                  e.target.reset();
                }} className="flex flex-col gap-3">
                  <textarea name="bugMsg" rows="3" required placeholder="Ceritain bug yang kamu temuin..." className="w-full p-3 rounded-xl border-[2px] border-black bg-gray-50 focus:outline-none focus:shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.1)] text-sm font-bold text-black resize-none"></textarea>
                  <button type="submit" className="w-full bg-[#00e676] text-black font-black uppercase py-2.5 rounded-xl border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2">
                    Kirim via NexChat <Icons.Send />
                  </button>
                </form>

                {/* Tautan Sosial Media */}
                <p className="text-[10px] md:text-xs font-bold text-center mt-4 uppercase">kalian bisa juga laporkan lewat</p>
                <div className="flex justify-center gap-3 mt-2">
                  <a href="https://wa.me/62895327503576" target="_blank" rel="noreferrer" className="p-2.5 bg-[#25D366] text-white rounded-xl border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all"><Icons.WhatsApp /></a>
                  <a href="https://www.instagram.com/satriamika_/" target="_blank" rel="noreferrer" className="p-2.5 bg-[#E1306C] text-white rounded-xl border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all"><Icons.Instagram /></a>
                  <a href="https://www.tiktok.com/@satria_fullstack_webdev" target="_blank" rel="noreferrer" className="p-2.5 bg-black text-white rounded-xl border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all"><Icons.TikTok /></a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAVIGATION (Gaya Telegram) */}
        <div className={`flex items-center justify-around px-2 border-t-[3px] md:border-t-[4px] ${colors.border} bg-white h-[70px] md:h-[80px] shrink-0 z-20`} style={{ paddingBottom: 'max(0px, env(safe-area-inset-bottom))' }}>
            <button onClick={() => setActiveMenu('chat')} className={`flex flex-col items-center justify-center w-[75px] h-[55px] rounded-xl border-[2px] border-transparent ${activeMenu === 'chat' ? 'bg-[#38b6ff] text-black border-black shadow-[3px_3px_0_0_#000]' : 'text-gray-500 hover:text-black hover:bg-gray-100'} transition-all`}>
                <Icons.Chat />
                <span className="text-[10px] font-black uppercase mt-1">Chat</span>
            </button>
            
            <button onClick={() => alert('Fitur Grup akan segera datang! 🚀')} className={`flex flex-col items-center justify-center w-[75px] h-[55px] rounded-xl border-[2px] border-transparent text-gray-400 cursor-not-allowed transition-all relative group`}>
                <Icons.Users />
                <span className="text-[10px] font-black uppercase mt-1">Grup</span>
                <span className="absolute -top-3 bg-[#ff5757] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-black shadow-[1px_1px_0_0_#000] rotate-[5deg]">SOON</span>
            </button>
            
            <button onClick={() => setActiveMenu('about')} className={`flex flex-col items-center justify-center w-[75px] h-[55px] rounded-xl border-[2px] border-transparent ${activeMenu === 'about' ? 'bg-[#ffde59] text-black border-black shadow-[3px_3px_0_0_#000]' : 'text-gray-500 hover:text-black hover:bg-gray-100'} transition-all`}>
                <Icons.Info />
                <span className="text-[10px] font-black uppercase mt-1">About</span>
            </button>
        </div>
      </div>

      {/* RUANG OBROLAN */}
      <div className={`flex-1 h-full flex flex-col relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
           <div className={`flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-transparent to-black/10`}>
              <div className={`w-24 h-24 md:w-32 md:h-32 mb-4 md:mb-6 rounded-[1.5rem] md:rounded-[2rem] bg-white border-[3px] md:border-[4px] border-black shadow-[6px_6px_0_0_#000] md:shadow-[8px_8px_0_0_#000] flex items-center justify-center text-black rotate-[-5deg] hover:rotate-[5deg] transition-transform cursor-pointer`}><Icons.Chat /></div>
              <p className={`font-black text-lg md:text-2xl uppercase tracking-widest text-shadow-[2px_2px_0_0_#000]`}>KLIK TEMAN BUAT NGOBROL!</p>
           </div>
        ) : (
          <ChatRoom 
            key={activeChat.id || activeChat.contact_id}
            session={session} myProfile={myProfile} t={t} colors={colors} 
            activeChat={activeChat} setActiveChat={setActiveChat} 
            contacts={contacts} setContacts={setContacts} groups={groups} setGroups={setGroups} 
            globalMessages={globalMessages} setGlobalMessages={setGlobalMessages} onlineUsers={onlineUsers}
            onQuickSave={handleQuickSaveContact} onBlock={handleBlockContact} blockedIds={blockedIds}
            openConfirm={openConfirm}
          />
        )}
      </div>

      {/* Pop Up Validasi */}
      <Modal isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} title={confirmDialog.title} colors={colors}>
        <div className="p-2 md:p-4 text-center text-black">
          <p className="font-bold text-base md:text-lg">{confirmDialog.message}</p>
          <div className="mt-6 md:mt-8 flex gap-3 md:gap-4">
             <button 
               onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} 
               className="flex-1 bg-white border-[2px] md:border-[3px] border-black rounded-xl md:rounded-2xl py-2 md:py-3 font-black shadow-[3px_3px_0_0_#000] hover:-translate-y-1 active:shadow-[0px_0px_0_0_#000] transition-all uppercase"
             >
               {confirmDialog.isAlertOnly ? 'OKE' : 'BATAL'}
             </button>
             {!confirmDialog.isAlertOnly && (
               <button 
                 onClick={() => { confirmDialog.onConfirm(); setConfirmDialog({ ...confirmDialog, isOpen: false }) }} 
                 className="flex-1 bg-[#ff5757] text-white border-[2px] md:border-[3px] border-black rounded-xl md:rounded-2xl py-2 md:py-3 font-black shadow-[3px_3px_0_0_#000] hover:-translate-y-1 active:shadow-[0px_0px_0_0_#000] transition-all uppercase"
               >
                 YAKIN!
               </button>
             )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

function ProfileModule({ userProfile, session, myProfile, setMyProfile, t, colors, setActiveMenu, openConfirm }) {
  const [newUsername, setNewUsername] = useState(myProfile.username)
  const [isSaving, setIsSaving] = useState(false); 
  const [isUploading, setIsUploading] = useState(false); 
  const fileInputRef = useRef(null)

  const handleUpdateName = async () => {
    if (!newUsername.trim() || newUsername === myProfile.username) return
    setIsSaving(true)
    const { error } = await supabase.from('profiles').update({ username: newUsername }).eq('id', session.user.id)
    if (!error) setMyProfile({ ...myProfile, username: newUsername })
    setIsSaving(false)
  }

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0]; if (!file) return; setIsUploading(true)
    const fileExt = file.name.split('.').pop(); 
    const filePath = `${session.user.id}/avatar_${Date.now()}.${fileExt}` 
    
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    
    if (error) {
      alert('Gagal mengunggah foto! Pesan Error: ' + error.message)
    } else {
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', session.user.id)
      setMyProfile(prev => ({ ...prev, avatar_url: data.publicUrl }))
    }
    setIsUploading(false)
  }

  const copyToClipboard = async (text) => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // Cara modern
    await navigator.clipboard.writeText(text);
  } else {
    // Fallback cara lama (untuk device yang memblokir clipboard)
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
  alert("ID berhasil disalin!");
};

const handleShareId = async () => {
    const textToShare = userProfile?.id; // Sesuaikan dengan data ID kamu
    if (!textToShare) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToShare);
        alert("ID berhasil disalin!");
      } else {
        // Fallback jika browser memblokir clipboard
        const textArea = document.createElement("textarea");
        textArea.value = textToShare;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("ID berhasil disalin!");
      }
    } catch (err) {
      console.error("Gagal menyalin:", err);
    }
  };

  

  return (
    <div className="p-4 md:p-6 space-y-5 md:space-y-6 bg-gradient-to-b from-transparent to-black/5 min-h-full pb-24">
      <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider border-b-[3px] md:border-[4px] border-black pb-3">Pengaturan ⚙️</h2>
      
      {/* 1. KARTU PROFIL & EDIT */}
      <div className="bg-white p-4 md:p-5 rounded-2xl md:rounded-[2rem] border-[3px] md:border-[4px] border-black shadow-[4px_4px_0_0_#000] flex flex-col items-center">
        <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current.click()}>
          <Avatar url={myProfile.avatar_url} name={myProfile.username} size="w-20 h-20 md:w-28 md:h-28" className="group-hover:rotate-6 transition-transform shadow-[4px_4px_0_0_#000]" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full bg-black/50">
            <span className="text-[10px] md:text-xs font-black text-white bg-[#ff5757] px-2 py-1 rounded-full border-2 border-black shadow-[2px_2px_0_0_#000]">{isUploading ? 'WAIT...' : 'GANTI'}</span>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleUploadAvatar} accept="image/*" className="hidden" />
        </div>

        <div className="w-full space-y-3 md:space-y-4">
          <div>
            <label className="block text-[10px] md:text-xs font-black mb-1 uppercase text-gray-600">Username</label>
            <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full p-2.5 md:p-3 rounded-xl bg-gray-50 border-[2px] border-black outline-none font-bold text-sm md:text-base text-black focus:shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.1)] transition-all" />
          </div>
          <div>
            <label className="block text-[10px] md:text-xs font-black mb-1 uppercase text-gray-600">ID Unik</label>
            <div className="flex gap-2">
              <input type="text" value={myProfile.chat_id} readOnly className="flex-1 p-2.5 md:p-3 rounded-xl bg-gray-200 border-[2px] border-black font-mono font-bold text-sm outline-none text-black truncate" />
              <button onClick={() => navigator.clipboard.writeText(myProfile.chat_id)} className="bg-[#38b6ff] px-4 rounded-xl border-[2px] border-black font-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all"><Icons.Copy /></button>
              
              {/* TOMBOL SHARE BARU */}
              <button onClick={handleShareId} className="bg-[#ffde59] px-4 rounded-xl border-[2px] border-black font-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all" title="Bagikan ID"><Icons.Share /></button>
            </div>
          </div>
          <button onClick={handleUpdateName} disabled={isSaving || newUsername === myProfile.username} className={`w-full py-2.5 md:py-3 rounded-xl border-[2px] border-black bg-[#00e676] text-black font-black text-sm uppercase shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0`}>
            {isSaving ? 'Menyimpan... ⏳' : 'Simpan Nama!'}
          </button>
        </div>
      </div>

      {/* 2. TOMBOL ATUR TEMA */}
      <button onClick={() => setActiveMenu('theme')} className="w-full p-4 rounded-2xl border-[3px] border-black bg-[#38b6ff] text-black font-black uppercase flex justify-between items-center shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all">
         <span>Atur Tema Visual 🎨</span>
         <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
      </button>

      {/* 3. TOMBOL LOGOUT */}
      <button onClick={() => openConfirm('KELUAR PINTU', 'Yakin mau keluar dari NexChat?', () => supabase.auth.signOut())} className="w-full p-4 rounded-2xl border-[3px] border-black bg-[#ff5757] text-white font-black uppercase flex justify-between items-center shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] transition-all">
         <span>Keluar / Logout 🚪</span>
         <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"></path></svg>
      </button>

      {/* 4. KIAT (TIP) DEV */}
      <div className="mt-6 p-4 rounded-2xl border-[3px] border-black bg-[#ffde59] text-black text-center shadow-[4px_4px_0_0_#000] rotate-[-2deg] hover:rotate-[2deg] transition-transform">
         <p className="font-black text-xs md:text-sm uppercase tracking-wider mb-1">💡 Kiat Developer</p>
         <p className="font-bold text-sm md:text-base">Fitur baru segera datang! Tetap pantau terus ya!</p>
      </div>

    </div>
  )
}

function ChatRoom({ session, myProfile, t, colors, activeChat, setActiveChat, contacts, setContacts, groups, setGroups, globalMessages, setGlobalMessages, onlineUsers, onQuickSave, onBlock, blockedIds, openConfirm }) {
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [pendingMessages, setPendingMessages] = useState([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)
  const [previewMedia, setPreviewMedia] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const chatContainerRef = useRef(null); 
  const [isAtBottom, setIsAtBottom] = useState(true); 
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false)
  
  const [replyingTo, setReplyingTo] = useState(null)
  const [activeMsgId, setActiveMsgId] = useState(null)
  const [editingMsg, setEditingMsg] = useState(null)
  
  const mediaInputRef = useRef(null); const channelRef = useRef(null); const messagesEndRef = useRef(null); const typingTimeoutRef = useRef(null)

  const isSavedContact = activeChat.type === 'personal' && contacts.some(c => c.contact_id === activeChat.contact_id);
  const isUnknownContact = activeChat.type === 'personal' && !isSavedContact;

  const clearedAtTime = new Date(activeChat.cleared_at || '1970-01-01').getTime();
  const filteredMessages = globalMessages.filter(msg => {
    if (blockedIds.includes(msg.sender_id)) return false; 
    const msgTime = new Date(msg.created_at).getTime();
    if (msgTime <= clearedAtTime) return false;
    return (msg.sender_id === myProfile.chat_id && msg.receiver_id === activeChat?.contact_id) || (msg.sender_id === activeChat?.contact_id && msg.receiver_id === myProfile.chat_id)
  })

  const unreadCount = filteredMessages.filter(m => !m.is_read && m.sender_id !== myProfile.chat_id).length;
  const firstUnreadMsgId = filteredMessages.find(m => !m.is_read && m.sender_id !== myProfile.chat_id)?.id;

  const handleClearChatLocal = () => {
    openConfirm('BERSIHKAN OBROLAN', 'Beneran mau bersihin obrolan ini? Semua pesan akan hilang dari layarmu! 🧹', async () => {
      setIsHeaderMenuOpen(false)
      const now = new Date().toISOString()
      await supabase.from('contacts').update({ cleared_at: now }).eq('contact_id', activeChat.contact_id).eq('user_id', session.user.id)
      setContacts(contacts.map(c => c.contact_id === activeChat.contact_id ? { ...c, cleared_at: now } : c))
      setActiveChat(prev => ({ ...prev, cleared_at: now }))
    })
  }

  const handleDeleteMessage = async (msgId) => {
  openConfirm('HAPUS PESAN', 'Yakin mau hapus pesan ini?', async () => {
    // Update isi pesan di database menjadi tanda dihapus
    const { error } = await supabase
      .from('messages')
      .update({ content: 'Pesan ini telah dihapus', is_deleted: true })
      .eq('id', msgId);
      
    if (!error) {
      // Tidak perlu setGlobalMessages secara manual, 
      // karena realtime Supabase akan otomatis mengupdate layar
    }
  });
}

const [toastMsg, setToastMsg] = useState(null)
  
  // Fungsi memunculkan pop-up custom
  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2000) // Hilang otomatis dalam 2 detik
  }

  // Fungsi mengubah ID menjadi Username dengan tepat
  const getSenderName = (senderId) => {
    if (senderId === myProfile.chat_id) return 'DIRI SENDIRI'
    if (activeChat && activeChat.contact_id === senderId) return activeChat.contact_username
    const contact = contacts?.find(c => c.contact_id === senderId)
    if (contact) return contact.contact_username
    return senderId
  }

  // Fungsi Copy Teks Anti-Error
  const handleCopyText = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => showToast("PESAN BERHASIL DISALIN! 📋"))
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = text
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
        showToast("PESAN BERHASIL DISALIN! 📋")
      } catch (err) {
        showToast("GAGAL MENYALIN PESAN! ❌")
      }
      document.body.removeChild(textArea)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAtBottom(entry.isIntersecting);
      },
      { root: chatContainerRef.current, rootMargin: '150px', threshold: 0 }
    );
    const bottomTarget = messagesEndRef.current;
    if (bottomTarget) observer.observe(bottomTarget);
    return () => { if (bottomTarget) observer.unobserve(bottomTarget); };
  }, [activeChat]);

  useEffect(() => {
    if (filteredMessages.length === 0) return;
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredMessages.length]);

  useEffect(() => {
    setIsHeaderMenuOpen(false); setIsContactInfoOpen(false); setReplyingTo(null); setEditingMsg(null); setActiveMsgId(null); setIsTyping(false);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'instant' }), 100);
  }, [activeChat]);

  useEffect(() => {
    if (pendingMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pendingMessages.length]);

  useEffect(() => {
    if (pendingMessages.length === 0 || isProcessingQueue) return;

    const processNextMessage = async () => {
      setIsProcessingQueue(true);
      const msgToProcess = pendingMessages[0];
      await new Promise(resolve => setTimeout(resolve, 1000));

      const payload = { 
        sender_id: msgToProcess.sender_id, content: msgToProcess.content, is_read: false, reply_to_id: msgToProcess.reply_to_id 
      };
      payload.receiver_id = msgToProcess.receiver_id;

      await supabase.from('messages').insert([payload]);
      setPendingMessages(prev => prev.slice(1));
      setIsProcessingQueue(false);
    };
    processNextMessage();
  }, [pendingMessages, isProcessingQueue]);

  useEffect(() => {
    if (!activeChat) return;
    const roomName = `typing-room-${[myProfile.chat_id, activeChat.contact_id].sort().join('-')}`;
      
    const channel = supabase.channel(roomName)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.sender_id !== myProfile.chat_id) setIsTyping(payload.status)
      }).subscribe()

    channelRef.current = channel; 
    return () => { supabase.removeChannel(channel) }
  }, [activeChat, myProfile.chat_id])

  const handleTyping = (e) => {
    setInputMessage(e.target.value)
    if (channelRef.current && activeChat) {
      channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { sender_id: myProfile.chat_id, status: true } })
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => { channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { sender_id: myProfile.chat_id, status: false } }) }, 2000)
    }
  }

 const handleSendMessage = async (e) => {
  if (e) e.preventDefault(); 
  if (!inputMessage.trim()) return;

  if (editingMsg) {
    await supabase.from('messages').update({ content: inputMessage }).eq('id', editingMsg.id);
    setEditingMsg(null); setInputMessage('');
    return;
  }

  const tempMsg = {
    id: `temp-${Date.now()}`, sender_id: myProfile.chat_id, content: inputMessage, is_read: false, reply_to_id: replyingTo?.id || null, created_at: new Date().toISOString(), status: 'pending'
  };
  
  tempMsg.receiver_id = activeChat.contact_id;
  setPendingMessages(prev => [...prev, tempMsg]); setInputMessage(''); setReplyingTo(null);
  channelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { sender_id: myProfile.chat_id, status: false } });
}

  const handleSendMedia = async (e) => {
    const files = Array.from(e.target.files); if (files.length === 0) return; setIsUploading(true); let uploadedFiles = []
    for (const file of files) {
      let fileType = 'document'; if (file.type.startsWith('image/')) fileType = 'image'; else if (file.type.startsWith('video/')) fileType = 'video'
      const fileExt = file.name.split('.').pop(); const filePath = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const { error } = await supabase.storage.from('chat_media').upload(filePath, file)
      if (!error) { const { data } = supabase.storage.from('chat_media').getPublicUrl(filePath); uploadedFiles.push({ url: data.publicUrl, type: fileType, name: file.name }) }
    }
    if (uploadedFiles.length > 0) {
      const payload = { sender_id: myProfile.chat_id, content: inputMessage, media_files: uploadedFiles, reply_to_id: replyingTo?.id || null, is_read: false }
      payload.receiver_id = activeChat.contact_id
      await supabase.from('messages').insert([payload]); setInputMessage(''); setReplyingTo(null)
    }
    setIsUploading(false); e.target.value = ''
  }

  useEffect(() => {
    if (!activeChat || activeChat.type === 'group') return;
    if (!isAtBottom) return; 

    const unreadMsgs = globalMessages.filter(m => m.sender_id === activeChat.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read)
    if (unreadMsgs.length > 0) {
      setGlobalMessages(prev => prev.map(m => (m.sender_id === activeChat.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read) ? { ...m, is_read: true } : m));
      supabase.from('messages').update({ is_read: true }).in('id', unreadMsgs.map(m => m.id)).then()
    }
  }, [activeChat, globalMessages, myProfile.chat_id, setGlobalMessages, isAtBottom]) 

  let lastDateLabel = null

  return (
    <>
    {toastMsg && (
        <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-[200] animate-bounce">
          <div className="bg-[#ffde59] border-[3px] border-black rounded-full px-6 py-2 shadow-[4px_4px_0_0_#000] text-black font-black uppercase tracking-wider text-sm md:text-base">
            {toastMsg}
          </div>
        </div>
      )}
      <Modal isOpen={isContactInfoOpen} onClose={() => setIsContactInfoOpen(false)} title="PROFIL SI DIA 👀" colors={colors}>
        <div className="flex flex-col items-center space-y-4 md:space-y-6 pb-2 md:pb-4">
          <Avatar url={activeChat?.avatar_url} name={activeChat?.contact_username} size="w-24 h-24 md:w-32 md:h-32" className="shadow-[4px_4px_0_0_#000] md:shadow-[6px_6px_0_0_#000]" />
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-black uppercase text-black">{activeChat?.contact_username}</h2>
            <p className={`text-xs md:text-sm font-bold mt-2 px-3 py-1 md:px-4 md:py-1 rounded-full border-2 border-black inline-block uppercase tracking-wider ${onlineUsers.includes(activeChat?.contact_id) ? 'bg-[#00e676] text-black shadow-[2px_2px_0_0_#000]' : 'bg-gray-200 text-gray-700 shadow-[2px_2px_0_0_#000]'}`}>
              {onlineUsers.includes(activeChat?.contact_id) ? 'Lagi Online! 🔥' : 'Sedang Tidur 💤'}
            </p>
          </div>
          <div className={`w-full p-4 md:p-5 rounded-xl md:rounded-[1.5rem] border-[2px] md:border-[3px] border-black bg-white flex items-center justify-between shadow-[3px_3px_0_0_#000] md:shadow-[4px_4px_0_0_#000]`}>
            <div>
              <p className={`text-[10px] md:text-xs uppercase font-black tracking-wider mb-1 text-gray-500`}>ID SISTEM</p>
              <p className="font-mono font-bold text-sm md:text-lg text-black">{activeChat?.contact_id}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(activeChat?.contact_id)} className={`p-2 md:p-3 rounded-lg md:rounded-2xl bg-[#38b6ff] text-black border-[2px] border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 hover:shadow-[3px_3px_0_0_#000] active:translate-y-1 active:shadow-none transition-all`}>
              <Icons.Copy />
            </button>
          </div>
        </div>
      </Modal>

      {/* Header Chat */}
      <div className={`h-[70px] md:h-[84px] flex items-center justify-between px-3 md:px-5 border-b-[3px] md:border-b-[4px] border-black ${colors.panel} shrink-0 bg-black/5`}>
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0 group cursor-pointer" onClick={() => setIsContactInfoOpen(true)}>
          <button onClick={(e) => { e.stopPropagation(); setActiveChat(null) }} className="md:hidden p-1.5 -ml-1 text-current hover:scale-110 active:scale-95 transition-transform"><Icons.ArrowLeft /></button>
          <Avatar url={activeChat.avatar_url} name={activeChat.contact_username} size="w-10 h-10 md:w-12 md:h-12" className="group-hover:-rotate-6 transition-transform" />
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-xl font-black truncate uppercase tracking-wide group-hover:text-[#ffde59] transition text-shadow-[1px_1px_0_0_rgba(0,0,0,0.5)]">{activeChat.contact_username}</h2>
            <p className={`text-[10px] md:text-xs font-bold mt-0.5 md:mt-1 truncate uppercase ${isTyping || onlineUsers.includes(activeChat.contact_id) ? 'text-[#00e676]' : colors.textMuted}`}>
              {isTyping ? 'MENGETIK... ✍️' : (onlineUsers.includes(activeChat.contact_id) ? 'ONLINE' : 'OFFLINE')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <div className="relative">
            <button onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)} className={`p-2 md:p-2.5 rounded-lg md:rounded-2xl bg-white text-black border-[2px] md:border-[3px] border-black shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000] hover:-translate-y-1 hover:shadow-[3px_3px_0_0_#000] md:hover:shadow-[5px_5px_0_0_#000] active:translate-y-1 active:shadow-none transition-all`}><Icons.More /></button>
            {isHeaderMenuOpen && (
              <div className={`absolute right-0 mt-3 w-48 md:w-56 ${colors.panel} border-[3px] md:border-[4px] border-black rounded-xl md:rounded-[1.5rem] shadow-[4px_4px_0_0_#000] md:shadow-[6px_6px_0_0_#000] z-50 overflow-hidden`}>
                <button onClick={handleClearChatLocal} className="w-full text-left px-4 py-3 md:py-4 text-sm md:text-base font-black bg-[#ff5757] text-white hover:bg-[#ff3b3b] transition-colors uppercase">Bersihkan Obrolan 🧹</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative min-h-0 bg-gradient-to-br from-transparent to-black/5">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 px-2" onClick={() => { setIsHeaderMenuOpen(false); setActiveMsgId(null); }}>
          
          {isUnknownContact && (
             <div className={`sticky top-2 z-50 mx-2 mt-4 p-3 md:p-4 rounded-xl md:rounded-2xl border-[2px] md:border-[3px] border-black bg-[#ffde59] text-black shadow-[3px_3px_0_0_#000] md:shadow-[4px_4px_0_0_#000] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4`}>
               <p className={`text-xs md:text-sm font-black uppercase`}>Nomor asik ini belum disimpen nih!</p>
               <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={() => onQuickSave(activeChat.contact_id, activeChat.contact_username, activeChat.avatar_url)} className="flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg md:rounded-xl bg-[#38b6ff] text-black border-[2px] border-black text-xs md:text-sm font-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 active:translate-y-0 transition-all uppercase">Simpan!</button>
                  <button onClick={() => onBlock(activeChat.contact_id)} className="flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg md:rounded-xl bg-[#ff5757] text-white border-[2px] border-black text-xs md:text-sm font-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 active:translate-y-0 transition-all uppercase">Blokir 🚫</button>
               </div>
             </div>
          )}

          <div className={`p-3 md:p-4 space-y-3 md:space-y-4 ${isUnknownContact ? 'pt-2' : ''}`}>
            <div className="flex justify-center mb-6 md:mb-8">
              <div className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-1.5 md:px-5 md:py-2 rounded-full border-[2px] border-black bg-white text-black shadow-[2px_2px_0_0_#000] flex items-center gap-2`}>
                <Icons.Lock /> <span>Enkripsi Aktif 🔒</span>
              </div>
            </div>

            {filteredMessages.map((msg, idx) => {
              
              const isMe = msg.sender_id === myProfile.chat_id;
              const dateLabel = formatDateBadge(msg.created_at)
              const prevMsg = idx > 0 ? filteredMessages[idx - 1] : null
              const showDateBadge = !prevMsg || formatDateBadge(prevMsg.created_at) !== dateLabel
              const timeString = new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              const repliedMsg = msg.reply_to_id ? globalMessages.find(m => m.id === msg.reply_to_id) : null
              const isActive = activeMsgId === msg.id
              const showUnreadDivider = msg.id === firstUnreadMsgId;

              return (
                <Fragment key={msg.id}>
                  {showUnreadDivider && (
                    <div className="flex justify-center my-4 md:my-6">
                      <span className="bg-[#ff5757] text-white border-[2px] border-black text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-[2px_2px_0_0_#000]">
                        {unreadCount} PESAN BARU! 🔥
                      </span>
                    </div>
                  )}
                  {showDateBadge && (
                    <div className="flex justify-center my-6 md:my-8">
                      <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white text-black border-[2px] border-black shadow-[2px_2px_0_0_#000]`}>{dateLabel}</span>
                    </div>
                  )}

                  {/* WRAPPER BARIS PESAN: Mengatur posisi Kiri / Kanan */}
                  <div className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                    
                    {/* CONTAINER BUBBLE + TOMBOL (Maksimal 85% layar di HP, 75% di Desktop) */}
                    <div className={`flex items-end gap-2 md:gap-3 max-w-[85%] md:max-w-[75%] group ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      
                      {/* BUBBLE CHAT */}
                      <div 
                        onClick={(e) => { e.stopPropagation(); setActiveMsgId(isActive ? null : msg.id); }}
                        className={`relative flex flex-col p-2 md:p-3 rounded-2xl border-[2px] md:border-[3px] border-black shadow-[3px_3px_0_0_#000] cursor-pointer transition-all ${isMe ? colors.bubbleMe : colors.bubbleThem} ${isActive ? 'scale-105 rotate-1' : 'hover:-translate-y-0.5'} z-10 min-w-0`}
                      >
                        {/* Buntut Bubble */}
                        <div className={`absolute bottom-2 ${isMe ? '-right-2 border-l-[10px] md:border-l-[12px] border-l-[#38b6ff] border-t-[10px] md:border-t-[12px] border-t-transparent border-b-[10px] md:border-b-[12px] border-b-transparent' : '-left-2 border-r-[10px] md:border-r-[12px] border-r-white border-t-[10px] md:border-t-[12px] border-t-transparent border-b-[10px] md:border-b-[12px] border-b-transparent'} `} style={{ filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,1))' }}></div>

                        {/* Konten Dalam Bubble */}
                        <div className="flex flex-col gap-1 md:gap-1.5 min-w-[80px] min-w-0 z-10">

                          {/* PESAN BALASAN (REPLY) */}
                          {repliedMsg && (
  <div className="p-2 mb-1 rounded-lg border-l-[3px] border-black bg-white/50 flex flex-col shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.1)] w-full min-w-0">
    {/* LABEL YANG SUDAH JADI USERNAME */}
    <p className="font-black mb-0.5 md:mb-1 text-[#ff5757] uppercase text-[10px]">
      MEMBALAS {getSenderName(repliedMsg.sender_id)}
    </p>
    <p className="text-xs md:text-sm font-bold text-black break-words whitespace-pre-wrap line-clamp-3">
      {repliedMsg.content || 'Berkas Terlampir 📎'}
    </p>
  </div>
)}

                          {/* MEDIA FILES */}
                          {msg.media_files && msg.media_files.length > 0 && (
                            <div className={`grid gap-2 ${msg.media_files.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} mt-1`}>
                              {msg.media_files.map((file, idx) => {
                                if (file.type === 'document') {
                                  return (
                                    <a key={idx} href={file.url} target="_blank" rel="noreferrer" download={file.name} className="relative group/media overflow-hidden rounded-lg border-[2px] border-black shadow-[2px_2px_0_0_#000] block hover:-translate-y-1 transition-transform bg-[#ffde59]">
                                      <div className="flex items-center justify-between gap-2 p-2 text-xs font-bold text-black min-w-0">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <Icons.File /> <span className="truncate min-w-0">{file.name}</span>
                                        </div>
                                        <Icons.Download />
                                      </div>
                                    </a>
                                  )
                                }
                                return (
                                  <div key={idx} className="relative group/media overflow-hidden rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0_0_#000]">
                                    {file.type === 'image' && <img src={file.url} alt="Media" onClick={() => setPreviewMedia({url: file.url, type: 'image'})} className="object-cover w-full h-32 md:h-48 cursor-pointer" />}
                                    {file.type === 'video' && <video src={file.url} onClick={() => setPreviewMedia({url: file.url, type: 'video'})} className="object-cover w-full h-32 md:h-48 cursor-pointer" />}
                                    <a href={file.url} target="_blank" rel="noreferrer" download={file.name} onClick={(e) => e.stopPropagation()} className="absolute top-2 right-2 p-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0_0_#000] bg-[#38b6ff] text-black hover:-translate-y-1 transition-transform z-20" title="Unduh">
                                      <Icons.Download />
                                    </a>
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {/* TEKS UTAMA PESAN: Kunci Rahasia Pembungkus Teks! */}
                          <p className="break-all whitespace-pre-wrap">
  {msg.content}
</p>

                          {/* WAKTU DAN CENTANG */}
                          <div className="flex items-center gap-1 text-[10px] font-black self-end opacity-80 pt-0.5 shrink-0">
                            <span>{timeString}</span>
                            {isMe && <span>{msg.is_read ? <Icons.DoubleCheck /> : <Icons.Check />}</span>}
                          </div>

                        </div>
                      </div>
                      
                      {/* TOMBOL AKSI (Copy/Reply/Edit) */}
                     {/* TOMBOL AKSI: Grid 2x2 di mobile, Flex-row di desktop */}
<div className={`transition-all grid grid-cols-2 md:flex md:flex-row items-center gap-1.5 shrink-0 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 md:group-hover:opacity-100 md:group-hover:scale-100'}`}>
  
  {/* Tombol Copy */}
  <button 
  onClick={(e) => { 
    e.stopPropagation(); 
    e.preventDefault();
    handleCopyText(msg.content); 
    setActiveMsgId(null); 
  }} 
  className="p-1.5 md:p-2 rounded-full bg-white text-black border-2 border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all" 
  title="Copy"
>
  <Icons.Copy />
</button>

  {/* Tombol Balas */}
  <button 
    onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); setEditingMsg(null); setActiveMsgId(null); }} 
    className="p-1.5 md:p-2 rounded-full bg-[#ffde59] text-black border-2 border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all" 
    title="Balas"
  >
    <Icons.Reply />
  </button>

  {/* Tombol Edit */}
  {isMe && !msg.is_deleted && (
  <button 
    onClick={(e) => { 
      e.stopPropagation(); 
      setEditingMsg(msg); 
      // PASTIKAN inputMessage diupdate persis dengan isi pesan yang diklik
      setInputMessage(msg.content); 
      setReplyingTo(null); 
      setActiveMsgId(null); 
    }} 
    className="p-1.5 md:p-2 rounded-full bg-[#38b6ff] text-black border-2 border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all" 
    title="Edit"
  >
    <Icons.Edit />
  </button>
)}

  {/* Tombol Hapus */}
  {isMe && !msg.is_deleted && (
    <button 
      onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }} 
      className="p-1.5 md:p-2 rounded-full bg-[#ff5757] text-white border-2 border-black shadow-[2px_2px_0_0_#000] hover:-translate-y-1 transition-all" 
      title="Hapus"
    >
      <Icons.Trash />
    </button>
  )}
</div>

                    </div>
                  </div>
                </Fragment>
              )
            })}

            {/* AREA PESAN PENDING / SEDANG DIKIRIM */}
            {pendingMessages.map((msg) => (
              <div key={msg.id} className="flex w-full justify-end mb-2 opacity-70 animate-pulse">
                <div className={`flex items-end gap-2 md:gap-3 max-w-[85%] md:max-w-[75%] flex-row-reverse`}>
                  <div className={`relative flex flex-col p-2 md:p-3 rounded-2xl border-[2px] border-black shadow-[3px_3px_0_0_#000] ${colors.bubbleMe} min-w-0`}>
                    
                    {/* Buntut Bubble */}
                    <div className="absolute bottom-2 -right-2 border-l-[10px] border-l-[#38b6ff] border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent" style={{ filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,1))' }}></div>
                    
                    <div className="flex flex-col gap-1 min-w-0 z-10">
                      {/* Tampilan Balasan (Jika ada) */}
                      {msg.reply_to_id && (
                        <div className="p-2 mb-1 rounded-lg border-l-[3px] border-black bg-white/50 flex flex-col min-w-0">
                           <p className="font-black text-[#ff5757] uppercase text-[10px]">MEMBALAS</p>
                           <p className="text-xs font-bold text-black break-words whitespace-pre-wrap">Pesan terlampir</p>
                        </div>
                      )}
                      
                      {/* TEKS PENDING: Diubah sesuai permintaanmu */}
                      <p className="text-sm md:text-[16px] font-bold break-words whitespace-pre-wrap leading-relaxed min-w-0 italic">
                        Sedang mengirim pesan... ⏳
                      </p>
                      
                      {/* Ikon Jam (Pending) */}
                      <div className="flex items-center gap-1 text-[10px] font-black self-end opacity-80 pt-1 shrink-0">
                        <span><Icons.Clock /></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} className="h-6" />
          </div>
        </div>

        {!isAtBottom && unreadCount > 0 && (
          <button 
            onClick={() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
            className="absolute bottom-4 right-1/2 translate-x-1/2 bg-[#ff5757] text-white text-xs md:text-sm font-black px-4 py-2 md:px-6 md:py-3 rounded-full border-[2px] md:border-[3px] border-black shadow-[3px_3px_0_0_#000] md:shadow-[4px_4px_0_0_#000] flex items-center gap-2 md:gap-3 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000] md:hover:shadow-[6px_6px_0_0_#000] active:translate-y-1 active:shadow-none transition-all z-50 animate-bounce uppercase"
          >
            <span className="bg-white text-black w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-sm font-black border-2 border-black">{unreadCount}</span>
            <span>Pesan Baru!</span>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="md:w-[16px] md:h-[16px]">
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </button>
        )}
      </div>

      {/* Area Input Chat */}
      <div className={`p-3 md:p-4 flex flex-col gap-2 md:gap-3 ${colors.panel} border-t-[3px] md:border-t-[4px] border-black shrink-0 z-20`} style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}>
        {editingMsg && (
  <div className="flex justify-between items-center bg-[#ffde59] border-[2px] md:border-[3px] border-black shadow-[3px_3px_0_0_#000] rounded-xl p-2 md:p-3 mx-1 mb-2">
    <div className="pl-1 flex-1 overflow-hidden text-black min-w-0">
      <p className="text-[10px] font-black uppercase tracking-wider mb-0.5">MENGEDIT PESAN ✏️</p>
      {/* Tampilkan dari editingMsg.content agar selalu akurat */}
      <p className="text-xs md:text-sm font-bold break-all whitespace-pre-wrap line-clamp-3">
  {editingMsg.content}
</p>
    </div>
    <button onClick={() => { setEditingMsg(null); setInputMessage(''); }} className="p-1 rounded-full bg-white border-2 border-black shrink-0 self-start mt-1">
      <Icons.Plus className="rotate-45 text-black" strokeWidth={4} />
    </button>
  </div>
)}
        {replyingTo && (
  <div className="flex justify-between items-center bg-[#38b6ff] border-[2px] md:border-[3px] border-black shadow-[3px_3px_0_0_#000] rounded-xl md:rounded-2xl p-2 md:p-3 mx-1 mb-2">
    <div className="pl-1 flex-1 overflow-hidden text-black min-w-0">
      <p className="text-[10px] font-black uppercase tracking-wider mb-0.5">
        MEMBALAS {getSenderName(replyingTo.sender_id)}
      </p>
      <p className="text-xs md:text-sm font-bold break-all whitespace-pre-wrap line-clamp-3">
        {replyingTo.content || 'Berkas Terlampir 📎'}
      </p>
    </div>
    <button onClick={() => setReplyingTo(null)} className="p-1 rounded-full bg-white border-2 border-black">
      <Icons.Plus className="rotate-45 text-black" strokeWidth={4} />
    </button>
  </div>
)}

        <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-3 items-end mx-1 md:mx-2">
          <input type="file" multiple ref={mediaInputRef} onChange={handleSendMedia} className="hidden" />
          <button type="button" disabled={isUploading} onClick={() => mediaInputRef.current.click()} className={`p-2.5 md:p-3.5 rounded-xl md:rounded-[1.2rem] bg-white text-black border-[2px] md:border-[3px] border-black shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000] hover:-translate-y-1 hover:shadow-[3px_3px_0_0_#000] md:hover:shadow-[5px_5px_0_0_#000] active:translate-y-1 active:shadow-none transition-all shrink-0 ${isUploading ? 'animate-pulse bg-gray-200' : ''}`}>
            <Icons.Attach />
          </button>
          
          <div className={`flex-1 bg-white border-[2px] md:border-[3px] border-black rounded-xl md:rounded-[1.2rem] shadow-[inset_3px_3px_0_0_rgba(0,0,0,0.1)] md:shadow-[inset_4px_4px_0_0_rgba(0,0,0,0.1)] min-h-[44px] md:min-h-[52px] flex items-center focus-within:shadow-[inset_0_-3px_0_0_rgba(0,0,0,0.2)] md:focus-within:shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.2)] transition-all py-1 md:py-1.5`}>
            <textarea 
              rows={1}
              value={inputMessage} 
              onChange={handleTyping} 
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; 
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e); 
                }
              }}
              placeholder={isUploading ? 'SIAPIN BERKAS... ⏳' : t.typeMsg} 
              className="w-full bg-transparent px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base font-bold outline-none resize-none max-h-[100px] md:max-h-[120px] overflow-y-auto text-black placeholder-gray-400" 
            />
          </div>
          
          <button type="submit" disabled={!inputMessage.trim() && !isUploading} className={`w-[44px] h-[44px] md:w-[54px] md:h-[54px] flex items-center justify-center rounded-xl md:rounded-[1.2rem] bg-[#ff5757] text-white border-[2px] md:border-[3px] border-black shadow-[2px_2px_0_0_#000] md:shadow-[3px_3px_0_0_#000] shrink-0 hover:-translate-y-1 hover:shadow-[3px_3px_0_0_#000] md:hover:shadow-[5px_5px_0_0_#000] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0_0_#000] md:disabled:hover:shadow-[3px_3px_0_0_#000] transition-all`}>
            <Icons.Send />
          </button>
        </form>
      </div>

      {previewMedia && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200" onClick={() => setPreviewMedia(null)}>
          <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
            <button onClick={() => setPreviewMedia(null)} className="p-2 md:p-3 bg-white border-[2px] md:border-[3px] border-black rounded-full shadow-[2px_2px_0_0_#000] hover:-translate-y-1 active:translate-y-0 transition-transform">
              <Icons.Plus className="rotate-45 text-black" />
            </button>
          </div>
          
          {previewMedia.type === 'image' && (
            <img src={previewMedia.url} onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full object-contain rounded-xl md:rounded-[2rem] border-[3px] md:border-[4px] border-white shadow-[8px_8px_0_0_#000]" alt="Preview" />
          )}
          
          {previewMedia.type === 'video' && (
            <video src={previewMedia.url} controls autoPlay onClick={(e) => e.stopPropagation()} className="max-h-full max-w-full object-contain rounded-xl md:rounded-[2rem] border-[3px] md:border-[4px] border-white shadow-[8px_8px_0_0_#000]" />
          )}
        </div>
      )}
    </>
  )
}