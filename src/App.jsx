import { useState, useEffect, useRef, Fragment } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import { Capacitor } from '@capacitor/core';
import myIcon from '../public/favicon.svg';
import StickerMaker from './StickerMaker';
import DeleteAccountModal from './DeleteAccountModal';
import GroupManager from './GroupManager';
import logoImg from './assets/logo.png';
import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from '@capacitor/push-notifications';
  


// ================= IKON SVG MODERN =================
const Icons = {
  Chat: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
  User: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Settings: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Search: (props) => <svg {...props} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>,
  MoreVertical: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>,
  ArrowLeft: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>,
  Plus: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>,
  Send: (props) => <svg {...props} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>,
  Attach: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
  Sticker: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>,
  Reply: (props) => <svg {...props} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 11l8-8v5c7 0 10 3.5 10 10-2-3-5-4-10-4v5l-8-8z"></path></svg>,
  Download: (props) => <svg {...props} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg>,
  File: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>,
  Check: (props) => <svg {...props} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  DoubleCheck: (props) => <svg {...props} width="20" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="18 6 7 17 2 12"></polyline><polyline points="22 6 12 16 11 15"></polyline></svg>,
  Lock: (props) => <svg {...props} width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Copy: (props) => <svg {...props} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  Trash: (props) => <svg {...props} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
  Info: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>,
  Users: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Target: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
  Star: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  StarSolid: (props) => <svg {...props} width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Palette: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>,
  Clock: (props) => <svg {...props} width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Edit: (props) => <svg {...props} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Spinner: (props) => (
    <svg {...props} className={`animate-spin ${props.className || ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  Globe: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
  Smartphone: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>,
  Instagram: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  LinkedIn: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>,
  GitHub: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>,
  TikTok: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>,
  // ICON TAMBAHAN UNTUK PORTOFOLIO
  Briefcase: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
}

// Komponen Background Spatial untuk Vibes Aplikasi Native
const SpatialBackground = ({ themeName }) => (
  <div className={`fixed inset-0 z-0 overflow-hidden flex items-center justify-center pointer-events-none transition-colors duration-500 ${themeName === 'dark' ? 'bg-[#050C09]' : 'bg-[#F4F7F5]'}`}>
    <div className={`absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] opacity-[0.15] blur-[150px] rounded-full transition-colors duration-500 ${themeName === 'dark' ? 'bg-[#0C8F5B]' : 'bg-[#78C951]'}`}></div>
    <div className={`absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] opacity-[0.1] blur-[120px] rounded-full transition-colors duration-500 ${themeName === 'dark' ? 'bg-[#78C951]' : 'bg-[#0C8F5B]'}`}></div>
    <div className={`absolute inset-0 opacity-60 transition-colors duration-500 ${themeName === 'dark' ? "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')]" : "bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTI4LDEyOCwxMjgsMC4wNSkiLz48L3N2Zz4=')]"}`}></div>
    <div className={`absolute font-black text-[180vw] md:text-[80vw] leading-none select-none tracking-tighter drop-shadow-2xl transition-colors duration-500 ${themeName === 'dark' ? 'text-white/[0.015]' : 'text-black/[0.02]'}`}>
      N
    </div>
  </div>
);

const Avatar = ({ url, name, size = 'w-10 h-10', className = '' }) => (
  url ? (
    <img src={url} alt={name} className={`${size} rounded-full object-cover shrink-0 border border-white/10 bg-white/10 transition-all duration-500 ease-out hover:scale-105 ${className}`} />
  ) : (
    <div className={`${size} rounded-full bg-gradient-to-br from-[#78C951] to-[#0C8F5B] flex items-center justify-center font-bold text-gray-900 shrink-0 shadow-sm text-sm md:text-base border border-white/10 ${className}`}>
      {name?.charAt(0).toUpperCase() || '?'}
    </div>
  )
)

const Modal = ({ isOpen, onClose, title, children, colors }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className={`${colors.panel} border ${colors.border} rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden flex flex-col transform transition-transform`}>
        <div className={`p-5 border-b ${colors.border} flex justify-between items-center bg-transparent`}>
          <h3 className={`font-bold text-lg ${colors.text}`}>{title}</h3>
          <button onClick={onClose} className={`p-1.5 rounded-full ${colors.hoverBg} transition-colors`}><Icons.Plus className="rotate-45 w-5 h-5" /></button>
        </div>
        <div className={`p-6 flex-1 bg-transparent ${colors.text}`}>{children}</div>
      </div>
    </div>
  )
}

// ================= KAMUS BAHASA =================
const dict = {
  id: {
    search: 'Cari teman atau obrolan...',
    empty: 'Belum ada obrolan. Mulai sapa teman!',
    chats: 'Obrolan',
    groups: 'Grup',
    tasks: 'Task',
    settings: 'Pengaturan',
    about: 'Tentang',
    new: 'Baru',
    typeMsg: 'Ketik pesan...',
    profile: 'Profil Anda',
    account: 'Akun',
    theme: 'Tema & Visual',
    support: 'Beri Dukungan',
    logout: 'Keluar / Logout',
    delAcc: 'Hapus Akun Permanen',
    lang: 'Bahasa Aplikasi',
    wp: 'Wallpaper Chat',
    upload: 'Pilih dari Galeri',
    save: 'Simpan Perubahan',
    cancel: 'Batal',
    yes: 'Ya',
    send: 'Kirim',
    reply: 'Balas',
    copy: 'Salin',
    edit: 'Edit',
    delMe: 'Hapus utk Saya',
    delAll: 'Hapus utk Semua',
    viewMedia: 'Lihat Media',
    saveMedia: 'Simpan ke Perangkat',
    review: 'Tinggalkan Ulasan Anda',
    reviewDesc: 'Ceritakan pengalaman atau saran Anda untuk NexChat...',
    infoDev: 'Kiat Developer: Aplikasi masih dalam tahap transisi versi modern.',
    searchFind: 'Cari Kontak',
    notFound: 'Kontak tidak ditemukan.',
    typing: 'mengetik...',
    online: 'online',
    offline: 'offline',
    contactInfo: 'Info Kontak',
    clearMe: 'Bersihkan Obrolan (Saya)',
    clearAll: 'Hapus Permanen (Semua)',
    msgDeleted: 'Pesan telah dihapus',
    replying: 'Membalas...',
    newMsgLabel: 'Pesan Baru',
    encrypted: 'Pesan ini dienkripsi secara end-to-end.',
    whoIsThis: 'Siapa nih? 👀',
    taskChat: 'Chat 5 teman anda',
    taskOnline: 'Online aplikasi selama 5 menit',
    taskShare: 'Share ID kamu 5 kali',
    taskGroup: 'Buat 3 Grup Baru (Dapatkan 5 Poin)',
    points: 'Poin',
    buyWp: 'Ganti Wallpaper (50 Poin)',
    notEnoughPts: 'Poin tidak cukup. Kerjakan task untuk mendapatkan poin!',
    claim: 'Klaim',
    claimed: 'Selesai',
    createGroup: 'Buat Grup Baru',
    groupName: 'Nama Grup Baru',
    groupDesc: 'Deskripsi Grup (Opsional)',
    searchId: 'Ketik ID atau Username...',
    changePhoto: 'Ganti Foto',
    usernameField: 'Nama Pengguna',
    bioField: 'Bio / Status',
    dangerZone: 'Zona Berbahaya',
    appTheme: 'Tema Aplikasi',
    lightMode: 'Mode Terang (Light)',
    darkMode: 'Mode Gelap (Dark)',
    recentReviews: 'Ulasan Terbaru',
    delContact: 'Hapus Kontak',
    delContactConfirm: 'Yakin ingin menghapus kontak ini dari beranda chat?',
    call: 'Hubungi',
    spamWarning: 'Jangan spam! Tunggu 2 detik sebelum mengirim pesan lagi ke grup.',
    groupCreated: 'Grup berhasil dibuat!',
    shareIdTask: 'Share ID (Task)',
    idCopied: 'ID Anda berhasil disalin ke clipboard!',
    clickBubbleNotice: '💡 Klik 2 kali pada pesan untuk melihat opsi menu lainnya.',
    confirmDeleteAccount: 'Konfirmasi Hapus Akun Permanen',
    inputPasswordToConfirm: 'Tindakan ini tidak bisa dibatalkan. Silakan masukkan password akun Anda untuk melanjutkan.',
    passwordField: 'Masukkan Password Anda',
    deleteAccountAction: 'Hapus Akun Saya Selamanya',
    wrongPassword: 'Password yang Anda masukkan salah. Gembok pengaman gagal dibuka!',
    accountDeletedSuccess: 'Akun Anda berhasil dihapus secara permanen dari database.',
    groupInfo: 'Info Grup',
    addMember: 'Tambah Anggota',
    inputMemberId: 'Masukkan ID Pengguna yang ingin ditambahkan:',
    successAddMember: 'Anggota berhasil ditambahkan ke grup!',
    failedAddMember: 'Gagal! Pastikan ID benar dan pengguna belum ada di grup.',
    leaveGroup: 'Keluar dari Grup',
    disbandGroup: 'Bubarkan Grup',
    copyGroupId: 'Salin ID Grup',
    changeGroupPP: 'Ubah PP',
    myGroups: 'Grup Saya',
    joinViaId: 'Gabung via ID Grup',
    join: 'Gabung',
    pasteGroupId: 'Tempel ID Grup (contoh: grp_12345)',
  },
  en: {
    search: 'Search chats...',
    empty: 'No chats yet. Start a conversation!',
    chats: 'Chats',
    groups: 'Groups',
    tasks: 'Tasks',
    settings: 'Settings',
    about: 'About',
    new: 'New',
    typeMsg: 'Type a message...',
    profile: 'Your Profile',
    account: 'Account',
    theme: 'Theme & Visual',
    support: 'Support & Feedback',
    logout: 'Logout',
    delAcc: 'Delete Account Permanently',
    lang: 'App Language',
    wp: 'Chat Wallpaper',
    upload: 'Upload from Gallery',
    save: 'Save Changes',
    cancel: 'Cancel',
    yes: 'Yes',
    send: 'Send',
    reply: 'Reply',
    copy: 'Copy',
    edit: 'Edit',
    delMe: 'Delete for Me',
    delAll: 'Delete for Everyone',
    viewMedia: 'View Media',
    saveMedia: 'Save Media',
    review: 'Leave a Review',
    reviewDesc: 'Share your experience or suggestions for NexChat...',
    infoDev: 'Developer Tip: Application is transitioning to modern version.',
    searchFind: 'Find Contacts',
    notFound: 'Contact not found.',
    typing: 'typing...',
    online: 'online',
    offline: 'offline',
    contactInfo: 'Contact Info',
    clearMe: 'Clear Chat (Me)',
    clearAll: 'Delete Permanently (All)',
    msgDeleted: 'Message was deleted',
    replying: 'Replying...',
    newMsgLabel: 'New Message',
    encrypted: 'This message is end-to-end encrypted.',
    whoIsThis: 'Who is this? 👀',
    taskChat: 'Chat 5 friends',
    taskOnline: 'Stay online for 5 minutes',
    taskShare: 'Share your ID 5 times',
    taskGroup: 'Create 3 New Groups (Earn 5 Points)',
    points: 'Points',
    buyWp: 'Change Wallpaper (50 Pts)',
    notEnoughPts: 'Not enough points. Complete tasks to earn more!',
    claimed: 'Claimed',
    claim: 'Claim',
    createGroup: 'Create New Group',
    groupName: 'New Group Name',
    groupDesc: 'Group Description (Optional)',
    searchId: 'Type ID or Username...',
    changePhoto: 'Change Photo',
    usernameField: 'Username',
    bioField: 'Bio / Status',
    dangerZone: 'Danger Zone',
    appTheme: 'App Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    recentReviews: 'Recent Reviews',
    delContact: 'Delete Contact',
    delContactConfirm: 'Are you sure you want to delete this contact from your home chat?',
    call: 'Call',
    spamWarning: 'Do not spam! Wait 2 seconds before sending another message to the group.',
    groupCreated: 'Group created successfully!',
    shareIdTask: 'Share ID (Task)',
    idCopied: 'Your ID has been copied to clipboard!',
    clickBubbleNotice: '💡 Double click on the message bubble to see more choices.',
    confirmDeleteAccount: 'Confirm Permanent Account Deletion',
    inputPasswordToConfirm: 'This action is irreversible. Please input your password to proceed.',
    passwordField: 'Enter Your Password',
    deleteAccountAction: 'Delete My Account Forever',
    wrongPassword: 'The password you entered is incorrect. Security check failed!',
    accountDeletedSuccess: 'Your account has been permanently purged from the database.',
    groupInfo: 'Group Info',
    addMember: 'Add Member',
    inputMemberId: 'Enter User ID to add:',
    successAddMember: 'Member successfully added to the group!',
    failedAddMember: 'Failed! Ensure the ID is correct and not already in the group.',
    leaveGroup: 'Leave Group',
    disbandGroup: 'Disband Group',
    copyGroupId: 'Copy Group ID',
    changeGroupPP: 'Change Picture',
    myGroups: 'My Groups',
    joinViaId: 'Join via Group ID',
    join: 'Join',
    pasteGroupId: 'Paste Group ID (e.g. grp_12345)',
  }
};

// ================= TEMA UI MODERN (SPATIAL DARK & GLASSY LIGHT) =================
const getTheme = (name) => {
  if (name === 'light') {
    return {
      base: 'bg-transparent', // Latar ditangani oleh SpatialBackground
      panel: 'bg-white/70 backdrop-blur-3xl',
      border: 'border-white/40',
      text: 'text-gray-900',
      textMuted: 'text-gray-500',
      primary: 'bg-[#0C8F5B] text-white hover:bg-[#097349]',
      bubbleMe: 'bg-gradient-to-br from-[#0C8F5B] to-[#096642] text-white shadow-md border border-[#0C8F5B]/20',
      bubbleThem: 'bg-white/90 text-gray-900 shadow-sm border border-gray-200',
      inputBg: 'bg-white/80',
      hoverBg: 'hover:bg-gray-100/50',
      danger: 'text-red-500 hover:bg-red-50',
      bubbleReplyMe: 'bg-black/20 border-white/40 text-white',
      bubbleReplyThem: 'bg-black/5 border-gray-300 text-gray-900',
      warningBg: 'bg-yellow-100/80 backdrop-blur-sm',
      warningText: 'text-yellow-800',
      dateBadge: 'bg-white/80 text-gray-600 border border-gray-200 backdrop-blur-md',
    }
  }
  return {
    base: 'bg-transparent', // Latar ditangani oleh SpatialBackground
    panel: 'bg-[#0A140F]/80 backdrop-blur-3xl',
    border: 'border-white/[0.08]',
    text: 'text-white',
    textMuted: 'text-[#8AB5A0]',
    primary: 'bg-[#78C951] text-[#0A140F] hover:shadow-[0_0_20px_rgba(120,201,81,0.3)]',
    bubbleMe: 'bg-gradient-to-br from-[#0C8F5B] to-[#096642] text-white shadow-lg border border-[#78C951]/20',
    bubbleThem: 'bg-[#101F17]/90 text-[#e9edef] shadow-md border border-[#1C3526]',
    inputBg: 'bg-[#101F17]',
    hoverBg: 'hover:bg-white/5',
    danger: 'text-red-400 hover:bg-red-900/20',
    bubbleReplyMe: 'bg-black/30 border-[#78C951]/50 text-white',
    bubbleReplyThem: 'bg-black/40 border-[#1C3526] text-[#e9edef]',
    warningBg: 'bg-[#101F17]/80 backdrop-blur-sm',
    warningText: 'text-[#78C951]',
    dateBadge: 'bg-[#101F17]/80 text-[#8AB5A0] border border-[#1C3526] backdrop-blur-md',
  }
}



// ================= CUSTOM MODAL COMPONENT =================
const CustomModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white/90 dark:bg-[#0A140F]/90 backdrop-blur-3xl w-full max-w-md rounded-[2rem] p-6 shadow-2xl border border-white/20 dark:border-white/10 animate-scale-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const formatDateBadge = (dateString) => {
  const date = new Date(dateString); const today = new Date(); const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return 'HARI INI'
  if (date.toDateString() === yesterday.toDateString()) return 'KEMARIN'
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function App() {
  const [session, setSession] = useState(null)
  const [myProfile, setMyProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchMyProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (data) {
      // Pastikan chat_id tidak kosong, ambil dari custom_id auth jika perlu
      if (!data.chat_id) {
         const { data: { user } } = await supabase.auth.getUser();
         const shortId = user?.user_metadata?.custom_id || "id-" + Math.random().toString(36).substring(2, 10);
         data.chat_id = shortId;
         await supabase.from('profiles').update({ chat_id: shortId }).eq('id', userId);
      }
      setMyProfile(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); if (session) fetchMyProfile(session.user.id); else setLoading(false) })
    supabase.auth.onAuthStateChange((_event, session) => { setSession(session); if (session) fetchMyProfile(session.user.id) })
  }, [])

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#050C09] overflow-hidden">
      <SpatialBackground themeName="dark" />
      <div className="relative z-10 flex flex-col items-center gap-6 p-10 bg-[#0E1A14]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 shadow-[0_0_60px_rgba(12,143,91,0.2)]">
        <Icons.Spinner className="text-[#78C951] w-12 h-12" />
        <p className="text-white font-semibold text-lg tracking-wide">Menghubungkan ke NexChat...</p>
      </div>
    </div>
  )
  if (!session || !myProfile) return <Auth onLoginSuccess={(user) => fetchMyProfile(user.id)} />

  return <MainApp session={session} myProfile={myProfile} setMyProfile={setMyProfile} />
}



function MainApp({ session, myProfile, setMyProfile }) {
  useEffect(() => {
    const setupNotifications = async () => {
      await PushNotifications.requestPermissions();

      PushNotifications.addListener('pushNotificationActionPerformed', async (action) => {
        const payload = action.notification.data;
        if (payload && payload.chat_id) {
          
          // 1. Arahkan ke menu yang tepat
          setActiveMenu(payload.type === 'group' ? 'groups' : 'chat');

          // 2. Fetch data kontak/grup dari Supabase agar bisa langsung dirender
          if (payload.type === 'group') {
            const { data } = await supabase.from('groups').select('*').eq('id', payload.chat_id).single();
            if (data) {
               setActiveChat({ 
                 contact_id: data.id, 
                 contact_username: data.name, 
                 avatar_url: data.avatar_url, 
                 type: 'group', 
                 admin_id: data.admin_id 
               });
            }
          } else {
            const { data } = await supabase.from('profiles').select('*').eq('chat_id', payload.chat_id).single();
            if (data) {
               setActiveChat({ 
                 contact_id: data.chat_id, 
                 contact_username: data.username, 
                 avatar_url: data.avatar_url, 
                 type: 'personal', 
                 bio: data.bio 
               });
            }
          }
        }
      });
    };
  }, []);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [themeName, setThemeName] = useState(localStorage.getItem('app_theme') || 'dark')
  const [language, setLanguage] = useState(localStorage.getItem('app_lang') || 'id')
  
  const [activeMenu, setActiveMenu] = useState('chat') 
  const [activeChat, setActiveChat] = useState(null) 
  
  const [globalMessages, setGlobalMessages] = useState([])
  const [contacts, setContacts] = useState([])
  const [groups, setGroups] = useState([])

  useEffect(() => {
  const initFCM = async () => {
  // 1. Minta izin push notification secara eksplisit
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive === 'granted') {
    // 2. Registrasi ke FCM
    await PushNotifications.register();
    
    // 3. Ambil token
    const token = await FCM.getToken();
    console.log("FCM Token:", token.token);
      
      // 3. Simpan ke database Supabase agar server nanti tahu mau kirim notif ke siapa
      await supabase
        .from('profiles')
        .update({ fcm_token: token.token })
        .eq('id', session.user.id);
    }
  };
  
  initFCM();
}, [session.user.id]);

  useEffect(() => {
    if (themeName === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeName]);

  useEffect(() => {
    if (!myProfile?.chat_id) return;

    const fetchMyGroups = async () => {
      const { data: memberships } = await supabase.from('group_members').select('group_id').eq('user_id', myProfile.chat_id);
      if (memberships && memberships.length > 0) {
        const groupIds = memberships.map(m => m.group_id);
        const { data: groupData } = await supabase.from('groups').select('*').in('id', groupIds);
        setGroups(groupData || []);
      } else {
        setGroups([]);
      }
    };

    fetchMyGroups();

    const myGroupsChannel = supabase.channel('my_group_memberships')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members', filter: `user_id=eq.${myProfile.chat_id}` }, () => {
         fetchMyGroups();
      })
      .subscribe();

    return () => supabase.removeChannel(myGroupsChannel);
  }, [myProfile?.chat_id]);
  
  const [onlineUsers, setOnlineUsers] = useState([])
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const [homeSearch, setHomeSearch] = useState('')
  const [homeSearchResults, setHomeSearchResults] = useState([])
  const [isHomeSearching, setIsHomeSearching] = useState(false)
  
  const [unknownProfiles, setUnknownProfiles] = useState({})
  const [blockedIds, setBlockedIds] = useState(() => {
    const saved = localStorage.getItem('blocked_ids')
    return saved ? JSON.parse(saved) : []
  })


  const [localDeletedMsgs, setLocalDeletedMsgs] = useState(() => {
    const saved = localStorage.getItem('local_deleted_msgs')
    return saved ? JSON.parse(saved) : []
  })
  const [hiddenIds, setHiddenIds] = useState(() => {
    const saved = localStorage.getItem('hidden_ids')
    return saved ? JSON.parse(saved) : []
  })



  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  // ================= TASKS & POINTS STATE =================
  const todayDate = new Date().toISOString().split('T')[0];
  const initialTaskState = {
    date: todayDate,
    chatProgress: [], 
    onlineMinutes: 0,
    shareCount: 0,
    claimedChat: false,
    claimedOnline: false,
    claimedShare: false
  };

  const [taskData, setTaskData] = useState(() => {
    // 1. PRIORITAS UTAMA: Ambil data dari Database Supabase (Cloud)
    if (myProfile?.daily_tasks) {
      const dbTasks = myProfile.daily_tasks;
      // Jika tanggal di database SAMA dengan hari ini, lanjutkan progress-nya
      if (dbTasks.date === todayDate) {
        return dbTasks;
      }
      // Jika BEDA HARI, abaikan data lama dan mulai ulang dari awal (reset)
      return initialTaskState;
    }
    
    // 2. BACKUP: Cek local storage jika database kosong (untuk user pertama kali transisi)
    const saved = localStorage.getItem(`tasks_${session.user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === todayDate) return parsed;
    }
    
    return initialTaskState;
  });

  // 3. SINKRONISASI: Simpan progress ke Cloud setiap kali ada perubahan
  useEffect(() => {
    const syncTasksToDatabase = async () => {
      // Update kolom 'daily_tasks' di tabel profiles agar sinkron di semua HP
      await supabase
        .from('profiles')
        .update({ daily_tasks: taskData })
        .eq('id', session.user.id);
    };

    // Tetap simpan di local storage sebagai backup sementara
    localStorage.setItem(`tasks_${session.user.id}`, JSON.stringify(taskData));
    
    // Kirim data terbaru ke Supabase
    if (session?.user?.id) {
      syncTasksToDatabase();
    }
  }, [taskData, session.user.id]);

  useEffect(() => {
    const contactsChannel = supabase.channel('realtime-contacts-delete')
      .on('postgres_changes', { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'contacts', 
          // Dengarkan perubahan hanya pada daftar kontak milik user ini
          filter: `user_id=eq.${session.user.id}` 
      }, (payload) => {
        const deletedRecordId = payload.old.id;
        
        // 1. Lenyapkan seketika dari list kontak di UI
        setContacts(prev => prev.filter(c => c.id !== deletedRecordId));
        
        // 2. Jika obrolannya sedang dibuka di layar, tutup paksa
        setActiveChat(prev => (prev && prev.id === deletedRecordId) ? null : prev);
      })
      .subscribe();
      
    return () => supabase.removeChannel(contactsChannel);
  }, [session.user.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaskData(prev => {
        if (prev.onlineMinutes < 5) return { ...prev, onlineMinutes: prev.onlineMinutes + 1 };
        return prev;
      });
    }, 60000); 
    return () => clearInterval(interval);
  }, []);

  const claimTask = async (taskKey) => {
    // 1. Update status task di UI (lokal)
    setTaskData(prev => ({ ...prev, [taskKey]: true }));
    
    // 2. Kalkulasi poin baru (ambil dari myProfile, default 0)
    const currentPoints = myProfile.points || 0;
    const newPoints = currentPoints + 5;
    
    // 3. Update profil di UI agar angka langsung berubah (Optimistic Update)
    setMyProfile(prev => ({ ...prev, points: newPoints }));
    
    // 4. Simpan poin terbaru secara permanen ke Supabase
    await supabase.from('profiles').update({ points: newPoints }).eq('id', session.user.id);
  };
  // ========================================================
  
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, title: '', message: '', onConfirm: null, isAlertOnly: false 
  })

  const [inAppNotif, setInAppNotif] = useState(null);
  const prevMessagesLength = useRef(globalMessages.length);

  
  
  const openConfirm = (title, message, onConfirm, isAlertOnly = false) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm, isAlertOnly })
  }

  const colors = getTheme(themeName)
  const t = dict[language]

  const handleSwitchChat = (chat) => {
    setActiveChat(chat);
    // Bersihkan notifikasi saat berpindah obrolan
    PushNotifications.removeAllDeliveredNotifications();
  }

  const isMainPage = ['chat', 'groups', 'tasks'].includes(activeMenu);

  useEffect(() => { localStorage.setItem('app_theme', themeName) }, [themeName])
  useEffect(() => { localStorage.setItem('app_lang', language) }, [language])
  useEffect(() => { localStorage.setItem('blocked_ids', JSON.stringify(blockedIds)) }, [blockedIds])
  useEffect(() => { localStorage.setItem('hidden_ids', JSON.stringify(hiddenIds)) }, [hiddenIds])

  // REALTIME LISTENER: Memperbarui profil secara instan tanpa perlu refresh
  useEffect(() => {
    const profileChannel = supabase.channel('public:profiles_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
        const updated = payload.new;
        
        // Update profil sendiri
        if (updated.id === session.user.id) setMyProfile(updated);
        
        // Update di daftar kontak tersimpan
        setContacts(prev => prev.map(c => c.contact_id === updated.chat_id ? { ...c, contact_username: updated.username, avatar_url: updated.avatar_url, bio: updated.bio } : c));
        
        // Update di cache kontak tidak dikenal (unknown)
        setUnknownProfiles(prev => ({
           ...prev,
           [updated.chat_id]: { ...prev[updated.chat_id], ...updated }
        }));

        // Update langsung jika kontak tersebut sedang diajak mengobrol
        setActiveChat(prev => (prev && prev.contact_id === updated.chat_id) ? { ...prev, contact_username: updated.username, avatar_url: updated.avatar_url, bio: updated.bio } : prev);
      })
      .subscribe();
    return () => supabase.removeChannel(profileChannel);
  }, [session.user.id, setMyProfile]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let backListener;
    const setupBackButton = async () => {
      const { App: CapacitorApp } = await import('@capacitor/app');
      backListener = await CapacitorApp.addListener('backButton', () => {
        if (isHeaderMenuOpen) setIsHeaderMenuOpen(false);
        else if (isAddContactOpen) setIsAddContactOpen(false);
        else if (activeChat) setActiveChat(null);
        else if (activeMenu !== 'chat') setActiveMenu('chat');
        else openConfirm('Keluar Aplikasi', 'Yakin keluar dari aplikasi?', () => { CapacitorApp.exitApp(); });
      });
    };
    setupBackButton();
    return () => { if (backListener) backListener.remove(); };
  }, [activeMenu, activeChat, isHeaderMenuOpen, isAddContactOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchInput.trim()) { setSearchResults([]); return }
      setIsSearching(true)
      const { data } = await supabase
  .from('profiles')
  .select('*')
  .or(`chat_id.eq.${searchInput},username.ilike.%${searchInput}%`) // Cari di chat_id
  .neq('chat_id', myProfile.chat_id) // Filter dengan chat_id
  .limit(10);
      if (data) { setSearchResults(data) }
      setIsSearching(false)
    }, 500) 
    return () => clearTimeout(timer)
  }, [searchInput, session.user.id])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!homeSearch.trim()) { setHomeSearchResults([]); return }
      setIsHomeSearching(true)
      const { data } = await supabase
  .from('profiles')
  .select('*')
  .or(`chat_id.eq.${searchInput},username.ilike.%${searchInput}%`) // Cari di chat_id
  .neq('chat_id', myProfile.chat_id) // Filter dengan chat_id
  .limit(10);
      if (data) setHomeSearchResults(data)
      setIsHomeSearching(false)
    }, 500) 
    return () => clearTimeout(timer)
  }, [homeSearch, session.user.id])

  useEffect(() => {
    const fetchGlobalMessages = async () => {
      // Siapkan query dasar (chat personal)
      let orQuery = `sender_id.eq.${myProfile.chat_id},receiver_id.eq.${myProfile.chat_id}`;
      
      // Jika user memiliki grup, tambahkan query untuk mengambil pesan grup tersebut
      if (groups && groups.length > 0) {
        const groupIds = groups.map(g => g.id).join(',');
        orQuery += `,receiver_id.in.(${groupIds})`;
      }

      const { data } = await supabase.from('messages')
        .select('*')
        .or(orQuery)
        .order('created_at', { ascending: true });
        
      if (data) setGlobalMessages(data);
    }
    
    fetchGlobalMessages();
  }, [myProfile.chat_id, groups]);

  useEffect(() => {
    // FIX 3: Tambahkan konfigurasi presence eksplisit di channel
    const channel = supabase.channel('global-chat-room', {
      config: {
        presence: {
          key: myProfile.chat_id,
        },
      },
    })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        if (blockedIds.includes(msg.sender_id)) return;
        setHiddenIds(prev => prev.includes(msg.sender_id) ? prev.filter(id => id !== msg.sender_id) : prev);
        
        // ================= LOGIKA NOTIFIKASI =================
        // Pastikan pesan bukan dari diri kita sendiri
        if (msg.sender_id !== myProfile.chat_id) {
            // Tentukan isi notifikasi berdasarkan tipe media
            let notifBody = msg.content || 'Pesan baru';
            
            if (msg.media_files && msg.media_files.length > 0) {
                const mediaType = msg.media_files[0].type;
                if (mediaType === 'sticker') notifBody = '🌟 Mengirim Stiker';
                else if (mediaType === 'image') notifBody = '📷 Mengirim Foto';
                else if (mediaType === 'video') notifBody = '🎥 Mengirim Video';
                else if (mediaType === 'document') notifBody = '📄 Mengirim Dokumen';
            }

            // Tentukan apakah pesan ini dari grup atau personal
            const isGroup = msg.receiver_id?.startsWith('grp_');
            const notifTitle = isGroup ? `Grup Baru` : `Pesan Baru`;

            // Jadwalkan Notifikasi
            PushNotifications.schedule({
                notifications: [
                    {
                        title: notifTitle,
                        body: notifBody,
                        id: Math.floor(Math.random() * 100000), // ID unik
                        schedule: { at: new Date(Date.now() + 100) } // Muncul seketika
                    }
                ]
            });
        }
        // =====================================================

        // Pastikan tidak ada pesan ganda dari temp update
        setGlobalMessages((prev) => {
          const isExist = prev.some(m => m.id === msg.id);
          if (isExist) return prev;
          return [...prev, msg];
        });
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
      .subscribe(async (status) => { 
        if (status === 'SUBSCRIBED') await channel.track({ user_id: myProfile.chat_id }) 
      });

    return () => { supabase.removeChannel(channel) }
  }, [myProfile.chat_id, groups, blockedIds])

  useEffect(() => {
    const initData = async () => {
      const { data: myContacts } = await supabase.from('contacts').select('id, user_id, contact_id, contact_username, created_at, cleared_at').eq('user_id', session.user.id).order('created_at', { ascending: false })
      if (myContacts && myContacts.length > 0) {
        // TAMBAHKAN 'bio' PADA SELECT
        const { data: profiles } = await supabase.from('profiles').select('chat_id, avatar_url, bio').in('chat_id', myContacts.map(c => c.contact_id))
        setContacts(myContacts.map(contact => ({ 
           ...contact, 
           avatar_url: profiles?.find(p => p.chat_id === contact.contact_id)?.avatar_url,
           bio: profiles?.find(p => p.chat_id === contact.contact_id)?.bio // Masukkan bio ke state
        })))
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
      // TAMBAHKAN 'bio' PADA SELECT
      const { data } = await supabase.from('profiles').select('chat_id, username, avatar_url, bio').in('chat_id', missingIds);
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
    bio: unknownProfiles[id]?.bio || null, // Ambil bio
    cleared_at: '1970-01-01',
  }));  

 const startChatWithUser = async (friendProfile) => {
  // Ambil ID teman. Ganti '.id' sesuai dengan properti ID yang ada di tabel profiles kamu (misal: friendProfile.id)
 const targetContactId = friendProfile.chat_id || friendProfile.id;

  // Proteksi: Jika ID tidak ditemukan, stop fungsi agar tidak crash ke Supabase
  if (!targetContactId) {
    console.error("Error: ID teman tidak ditemukan di dalam objek friendProfile!", friendProfile);
    return;
  }

  // Gunakan targetContactId yang sudah divalidasi
  const existingContact = contacts.find(c => c.contact_id === targetContactId)
  
  if (existingContact) {
    setActiveChat({ ...existingContact, type: 'personal' })
  } else {
    const { data } = await supabase
      .from('contacts')
      .insert([
        { 
          user_id: session.user.id, 
          contact_id: targetContactId, // <-- Sudah menggunakan ID yang valid
          contact_username: friendProfile.username, 
          cleared_at: '1970-01-01' 
        }
      ])
      .select()
      .maybeSingle()

    if (data) { 
      const newContact = { ...data, avatar_url: friendProfile.avatar_url };
      setContacts([newContact, ...contacts]); 
      setActiveChat({ ...newContact, type: 'personal' })
    } else {
      setActiveChat({ 
        contact_id: targetContactId, 
        contact_username: friendProfile.username, 
        avatar_url: friendProfile.avatar_url, 
        type: 'personal', 
        cleared_at: '1970-01-01' 
      })
    }
  }
  
  setIsAddContactOpen(false); 
  setSearchInput(''); 
  setSearchResults([]); 
  setHomeSearch(''); 
  setActiveMenu('chat')
}

  const handleDeleteUnknown = (contactId) => {
    openConfirm('Hapus Obrolan', 'Kontak ini tidak akan tampil lagi kecuali jika ada pesan baru masuk.', async () => {
      // Cross-device delete: Hapus semua pesan antara Anda dan kontak ini
      await supabase.from('messages').delete().or(`and(sender_id.eq.${myProfile.chat_id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${myProfile.chat_id})`);
      
      // Bersihkan dari state global langsung
      setGlobalMessages(prev => prev.filter(m => !(
        (m.sender_id === myProfile.chat_id && m.receiver_id === contactId) ||
        (m.sender_id === contactId && m.receiver_id === myProfile.chat_id)
      )));
    });
  };

  const handleSearchContact = async (e) => {
    e.preventDefault()
    if (!searchInput.trim()) return
    setIsSearching(true)
    const { data } = await supabase.from('profiles').select('*').or(`chat_id.eq.${searchInput},username.ilike.%${searchInput}%`).neq('id', session.user.id).limit(10)
    if (data) { setSearchResults(data) }
    setIsSearching(false)
  }

  const unreadChatsCount = globalMessages.filter(m => {
    // Abaikan jika pesan sudah dibaca, atau pesan itu kita yang kirim
    if (m.is_read || m.sender_id === myProfile.chat_id) return false;
    if (blockedIds.includes(m.sender_id) || localDeletedMsgs.includes(m.id)) return false;
    
    // Cek apakah pesan ini masuk ke chat personal (bukan dari grup)
    const isGroupMsg = m.receiver_id?.startsWith('grp_') || groups.some(g => g.id === m.receiver_id);
    return !isGroupMsg && m.receiver_id === myProfile.chat_id;
  }).length;

  const unreadGroupsCount = globalMessages.filter(m => {
    // Abaikan jika pesan sudah dibaca, atau pesan itu kita yang kirim
    if (m.is_read || m.sender_id === myProfile.chat_id) return false;
    if (localDeletedMsgs.includes(m.id)) return false;
    
    // Cek apakah pesan ini dikirim ke salah satu grup tempat saya bergabung
    return groups.some(g => g.id === m.receiver_id);
  }).length;

  return (
    <>
      <div translate="no" className={`flex fixed inset-0 w-full font-sans overflow-hidden bg-transparent ${colors.text} transition-colors duration-500 selection:bg-[#78C951] selection:text-white`}>
        <SpatialBackground themeName={themeName} />

        {/* Notifikasi Dalam Aplikasi */}
        

        {/* SIDEBAR MODERN SPATIAL */}
        <div className={`flex flex-col h-full w-full md:w-[400px] border-r ${colors.border} ${colors.panel} ${activeChat ? 'hidden md:flex' : 'flex'} shadow-2xl z-10 relative transition-all duration-500`}>
          
          {isMainPage && (
            <div className={`flex items-center justify-between p-4 border-b ${colors.border} h-[76px] shrink-0 bg-transparent z-50`}>
                <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setActiveMenu('settings')}>
                    <Avatar url={myProfile.avatar_url} name={myProfile.username} size="w-12 h-12" />
                    <div>
                      {/* Judul Statis Warna Hijau (Tanpa Hover) */}
                      <h1 className="font-black text-xl leading-tight tracking-tight text-[#0C8F5B] dark:text-[#78C951]">NexChat</h1>
                      <p className={`text-[11px] font-bold text-[#0C8F5B] dark:text-[#78C951]`}>{myProfile.points || 0} {t.points}</p>
                    </div>
                </div>
                
                <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setIsHeaderMenuOpen(!isHeaderMenuOpen); }} className={`relative p-2.5 rounded-2xl ${colors.hoverBg} transition-all ${colors.textMuted}`}>
                      <Icons.MoreVertical />
                      {/* Titik Merah Denyut (New Badge) di Ikon Titik Tiga */}
                      <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white dark:border-[#0A140F]"></span>
                      </span>
                    </button>
                    {isHeaderMenuOpen && (
                      <div className={`absolute right-0 mt-2 w-56 ${colors.panel} border ${colors.border} rounded-2xl shadow-xl z-[9999] overflow-hidden transform origin-top-right transition-all`}>
                        <button onClick={() => { setActiveMenu('about'); setIsHeaderMenuOpen(false); }} className={`w-full text-left px-5 py-3.5 text-sm font-medium ${colors.hoverBg} transition-colors flex items-center justify-between border-b ${colors.border}`}>
                          <div className="flex items-center gap-3">
                            <Icons.Info /> {t.about}
                          </div>
                          {/* Label NEW di Menu Tentang */}
                          <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">New</span>
                        </button>
                        <button onClick={() => { setActiveMenu('settings'); setIsHeaderMenuOpen(false); }} className={`w-full text-left px-5 py-3.5 text-sm font-medium ${colors.hoverBg} transition-colors flex items-center gap-3`}>
                          <Icons.Settings /> {t.settings}
                        </button>
                      </div>
                    )}
                </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto relative scrollbar-hide bg-transparent" onClick={() => setIsHeaderMenuOpen(false)}>
            {activeMenu === 'chat' && (
               <div className="flex flex-col min-h-full">
                  <div className={`p-4 border-b ${colors.border} shrink-0 bg-transparent`}>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${colors.inputBg} border ${colors.border} transition-all focus-within:border-[#0C8F5B] dark:focus-within:border-[#78C951] focus-within:ring-1 focus-within:ring-[#0C8F5B] dark:focus-within:ring-[#78C951]`}>
                      <Icons.Search className={`${colors.textMuted} w-4 h-4`} />
                      <input type="text" value={homeSearch} onChange={(e) => setHomeSearch(e.target.value)} placeholder={t.search} className={`bg-transparent border-none outline-none w-full text-sm font-medium ${colors.text} placeholder-gray-400 dark:placeholder-[#3D5A4C]`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-3 space-y-1 pb-24">
                    {homeSearch.trim() ? (
                      <div className="space-y-1">
                        {isHomeSearching ? (
                          <p className={`text-center text-sm ${colors.textMuted} mt-4`}>Mencari...</p>
                        ) : homeSearchResults.length === 0 ? (
                          <p className={`text-center text-sm ${colors.textMuted} mt-4`}>{t.notFound}</p>
                        ) : (
                          homeSearchResults.map(user => {
                            const isSaved = contacts.some(c => c.contact_id === user.chat_id);
                            const isNew = !isSaved && !unknownContactIds.includes(user.chat_id);
                            return (
                              <div key={user.chat_id} onClick={() => startChatWithUser(user)} className={`p-3 rounded-2xl ${colors.hoverBg} cursor-pointer flex items-center gap-4 transition-colors`}>
                                <Avatar url={user.avatar_url} name={user.username} size="w-12 h-12" />
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-bold truncate">
                                    {user.username}
                                    {isNew && <span className="text-[10px] bg-[#0C8F5B]/20 text-[#0C8F5B] dark:bg-[#78C951]/20 dark:text-[#78C951] px-2 py-0.5 rounded-full ml-2">{t.new}</span>}
                                  </h3>
                                  <p className={`text-xs ${colors.textMuted} truncate`}>ID: {user.chat_id}</p>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    ) : (
                      contacts.length === 0 && unknownContacts.length === 0 ? (
                        <div className={`p-10 text-center font-medium ${colors.textMuted} mt-10`}>{t.empty}</div>
                      ) : (
                        <>
                          {unknownContacts.map(c => {
                            const isOnline = onlineUsers.includes(c.contact_id);
                            const unreadCount = globalMessages.filter(m => m.sender_id === c.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read).length;
                            return (
                              <div key={c.id} className={`p-3 rounded-2xl flex flex-col gap-2 transition-colors ${activeChat?.contact_id === c.contact_id ? colors.inputBg : colors.hoverBg}`}>
                                
                                <div onClick={() => handleSwitchChat({...c, type: 'personal'})} className="cursor-pointer flex items-center gap-4">
                                  <div className="relative">
                                    <Avatar url={c.avatar_url} name={c.contact_username} size="w-12 h-12" />
                                    {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#78C951] border-2 border-white dark:border-[#0A140F] rounded-full shadow-[0_0_8px_rgba(120,201,81,0.5)]"></span>}
                                  </div>
                                  <div className={`flex-1 min-w-0 pb-1`}>
                                    <div className="flex justify-between items-center mb-1">
                                       <h3 className={`text-base truncate ${unreadCount > 0 ? 'font-bold' : 'font-medium'}`}>{c.contact_id}</h3>
                                       {unreadCount > 0 && <div className={`${colors.primary} text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full`}>{unreadCount}</div>}
                                    </div>
                                    <p className={`text-sm truncate ${unreadCount > 0 ? 'text-[#0C8F5B] dark:text-[#78C951] font-medium' : colors.textMuted}`}>{unreadCount > 0 ? t.newMsgLabel : t.whoIsThis}</p>
                                  </div>
                                </div>

                                <div className="flex gap-2 mt-1">
                                  <button onClick={() => startChatWithUser({ chat_id: c.contact_id, username: c.contact_username, avatar_url: c.avatar_url })} className={`flex-1 py-2 ${colors.primary} text-xs font-bold rounded-xl transition-all shadow-md`}>Simpan</button>
                                  <button onClick={() => handleDeleteUnknown(c.contact_id)} className="flex-1 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/40 transition-all border border-red-200 dark:border-red-900/30">Hapus</button>
                                </div>

                              </div>
                            )
                          })}

                          {contacts.filter(c => !blockedIds.includes(c.contact_id)).map(c => {
                            const isOnline = onlineUsers.includes(c.contact_id);
                            const clearedAtTime = new Date(c.cleared_at || '1970-01-01').getTime();
                            const unreadCount = globalMessages.filter(m => {
                              return new Date(m.created_at).getTime() > clearedAtTime && m.sender_id === c.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read;
                            }).length;

                            return (
                              <div key={c.id} onClick={() => handleSwitchChat({...c, type: 'personal'})} className={`p-3 rounded-2xl cursor-pointer flex items-center gap-4 transition-colors group ${activeChat?.contact_id === c.contact_id ? colors.inputBg + ' border border-[#78C951]/30' : colors.hoverBg + ' border border-transparent'}`}>
                                <div className="relative">
                                  <Avatar url={c.avatar_url} name={c.contact_username} size="w-12 h-12" />
                                  {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#78C951] border-2 border-white dark:border-[#0A140F] rounded-full shadow-[0_0_8px_rgba(120,201,81,0.5)]"></span>}
                                </div>
                                <div className={`flex-1 min-w-0 border-b ${colors.border} pb-3 pt-1`}>
                                  <div className="flex justify-between items-center mb-1">
                                     <h3 className={`text-base truncate ${unreadCount > 0 ? 'font-bold' : 'font-medium'} ${colors.text}`}>
  {c.contact_username}
</h3>
                                     <div className="flex gap-2 items-center">
                                        {unreadCount > 0 && <div className={`${colors.primary} text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm`}>{unreadCount}</div>}
                                     </div>
                                  </div>
                                  <p className={`text-sm truncate ${unreadCount > 0 ? 'text-[#0C8F5B] dark:text-[#78C951] font-bold' : colors.textMuted}`}>{unreadCount > 0 ? t.newMsgLabel : `ID: ${c.contact_id}`}</p>
                                </div>
                              </div>
                            )
                          })}
                        </>
                      )
                    )}
                  </div>
               </div>
            )}

            {activeMenu === 'groups' && (
   <GroupManager 
      session={session} 
      myProfile={myProfile} 
      colors={colors} 
      activeChat={activeChat} /* <--- TAMBAHKAN BARIS INI */
      setActiveChat={setActiveChat} 
      groups={groups}
      t={t} 
      setGroups={setGroups} 
      globalMessages={globalMessages} 
   />
)}
            
            {activeMenu === 'tasks' && (
               <div className={`p-6 min-h-full animate-in slide-in-from-right-4 bg-transparent`}>
                  <div className={`rounded-[2rem] p-8 text-white shadow-xl mb-8 flex items-center justify-between relative overflow-hidden ${colors.primary}`}>
                     <div className="absolute top-[-50%] right-[-10%] w-[200px] h-[200px] bg-white/10 rounded-full blur-2xl"></div>
                     <div className="relative z-10">
                        <p className="text-sm font-bold opacity-80 mb-1 uppercase tracking-wider">Total {t.points}</p>
                        <h2 className="text-5xl font-black">{myProfile.points || 0}</h2>
                     </div>
                     <Icons.StarSolid className="w-20 h-20 opacity-20 relative z-10 drop-shadow-lg" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-4 tracking-tight">Protokol Harian</h3>
                  
                  <div className="space-y-4 pb-10">
                    <div className={`p-5 rounded-[1.5rem] border ${colors.border} ${colors.panel} shadow-sm flex items-center justify-between gap-4 transition-all hover:border-[#78C951]/50`}>
                       <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">{t.taskChat}</h4>
                          <p className={`text-xs ${colors.textMuted} mb-3 font-medium`}>Progress: {taskData.chatProgress.length}/5</p>
                          <div className="w-full h-2 bg-gray-200 dark:bg-[#1C3526] rounded-full overflow-hidden"><div className={`h-full ${colors.primary}`} style={{ width: `${Math.min((taskData.chatProgress.length/5)*100, 100)}%` }}></div></div>
                       </div>
                       <button onClick={() => claimTask('claimedChat')} disabled={taskData.chatProgress.length < 5 || taskData.claimedChat} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${taskData.claimedChat ? 'bg-gray-100 dark:bg-white/5 text-gray-400' : taskData.chatProgress.length >= 5 ? colors.primary + ' hover:scale-105' : 'bg-gray-100 dark:bg-[#1C3526] text-gray-400'}`}>
                         {taskData.claimedChat ? t.claimed : t.claim}
                       </button>
                    </div>

                    <div className={`p-5 rounded-[1.5rem] border ${colors.border} ${colors.panel} shadow-sm flex items-center justify-between gap-4 transition-all hover:border-[#78C951]/50`}>
                       <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">{t.taskOnline}</h4>
                          <p className={`text-xs ${colors.textMuted} mb-3 font-medium`}>Progress: {taskData.onlineMinutes}/5 mnt</p>
                          <div className="w-full h-2 bg-gray-200 dark:bg-[#1C3526] rounded-full overflow-hidden"><div className={`h-full ${colors.primary}`} style={{ width: `${Math.min((taskData.onlineMinutes/5)*100, 100)}%` }}></div></div>
                       </div>
                       <button onClick={() => claimTask('claimedOnline')} disabled={taskData.onlineMinutes < 5 || taskData.claimedOnline} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${taskData.claimedOnline ? 'bg-gray-100 dark:bg-white/5 text-gray-400' : taskData.onlineMinutes >= 5 ? colors.primary + ' hover:scale-105' : 'bg-gray-100 dark:bg-[#1C3526] text-gray-400'}`}>
                         {taskData.claimedOnline ? t.claimed : t.claim}
                       </button>
                    </div>

                    <div className={`p-5 rounded-[1.5rem] border ${colors.border} ${colors.panel} shadow-sm flex items-center justify-between gap-4 transition-all hover:border-[#78C951]/50`}>
                       <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">{t.taskShare}</h4>
                          <p className={`text-xs ${colors.textMuted} mb-3 font-medium`}>Progress: {taskData.shareCount}/5</p>
                          <div className="w-full h-2 bg-gray-200 dark:bg-[#1C3526] rounded-full overflow-hidden"><div className={`h-full ${colors.primary}`} style={{ width: `${Math.min((taskData.shareCount/5)*100, 100)}%` }}></div></div>
                       </div>
                       <button onClick={() => claimTask('claimedShare')} disabled={taskData.shareCount < 5 || taskData.claimedShare} className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${taskData.claimedShare ? 'bg-gray-100 dark:bg-white/5 text-gray-400' : taskData.shareCount >= 5 ? colors.primary + ' hover:scale-105' : 'bg-gray-100 dark:bg-[#1C3526] text-gray-400'}`}>
                         {taskData.claimedShare ? t.claimed : t.claim}
                       </button>
                    </div>
                  </div>
               </div>
            )}

            {activeMenu.startsWith('settings') && (
  <SettingsManager 
     activeMenu={activeMenu} setActiveMenu={setActiveMenu} 
     session={session} myProfile={myProfile} setMyProfile={setMyProfile} 
     themeName={themeName} setThemeName={setThemeName} 
     language={language} setLanguage={setLanguage}
     colors={colors} openConfirm={openConfirm} t={t}
     taskData={taskData} setTaskData={setTaskData}
     setIsDeleteModalOpen={setIsDeleteModalOpen} 
  />
)}

            {activeMenu === 'about' && (
               <div className={`p-6 bg-transparent min-h-full animate-in slide-in-from-right-4`}>
                   <div className="flex items-center gap-3 mb-6">
                     <button onClick={() => setActiveMenu('chat')} className={`p-2.5 ${colors.panel} border ${colors.border} rounded-xl shadow-sm ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
                     <h2 className="text-xl font-bold">{t.about}</h2>
                   </div>
                   
                   <div className="flex flex-col items-center justify-center mt-6 mb-8 text-center">
                     <div className="w-24 h-24 bg-white dark:bg-gradient-to-br dark:from-[#13281E] dark:to-[#0A1710] border border-gray-100 dark:border-white/10 rounded-3xl flex items-center justify-center shadow-xl mb-4">

                       <img src={logoImg} alt="NexChat Logo" className="w-12 h-12" />


                     </div>
                     <h2 className="text-2xl font-black tracking-tight mb-1">NexChat Spatial</h2>
                     <p className={`font-bold text-xs ${colors.textMuted} bg-black/5 dark:bg-white/5 border ${colors.border} px-3 py-1 rounded-full inline-block`}>Versi 3.0 (Update Terbaru)</p>
                   </div>

                   {/* Kotak Info Pembaruan */}
                   <div className={`${colors.panel} border ${colors.border} rounded-2xl p-5 mb-6 shadow-sm`}>
                     <h3 className="font-bold text-sm text-[#0C8F5B] dark:text-[#78C951] mb-2 uppercase tracking-widest flex items-center gap-2">
                       <Icons.Star className="w-4 h-4" /> Info Pembaruan
                     </h3>
                     <ul className={`text-sm ${colors.textMuted} space-y-2 font-medium list-disc list-inside`}>
                       <li>Peningkatan UI/UX Spatial & Glassmorphism.</li>
                       <li>Penambahan fitur Multi-User Typing di Grup.</li>
                       <li>Notifikasi pesan belum dibaca (Unread Badges).</li>
                       <li>Optimalisasi pengiriman media dan sistem Anti-Bot.</li>
                     </ul>
                   </div>

                   {/* Tombol Akses (Web & APK) */}
                   <div className="flex gap-3 mb-10">
                      <button onClick={() => window.open('https://nexchat-eight.vercel.app/', '_blank')} className={`flex-1 py-3 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-[#0C8F5B] text-[#0C8F5B] dark:border-[#78C951] dark:text-[#78C951] hover:bg-[#0C8F5B]/10 dark:hover:bg-[#78C951]/10 transition-all text-center`}>
                        <Icons.Globe className="w-4 h-4" /> Versi Web
                      </button>
                      <button onClick={() => window.open('https://github.com/satriamikaanjay/nexchat/releases/download/v1.1/NexChat.apk', '_blank')} className={`flex-1 py-3 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-[#0C8F5B] dark:bg-[#78C951] text-white dark:text-[#0A140F] shadow-lg hover:opacity-90 transition-all text-center`}>
                        <Icons.Smartphone className="w-4 h-4" /> Versi APK
                      </button>
                   </div>

                   {/* Info Developer & Sosial Media */}
                   <div className="text-center pb-10">
                     <p className={`text-[10px] font-bold uppercase tracking-widest ${colors.textMuted} mb-3`}>Dikembangkan Oleh</p>
                     <h4 className="font-black text-lg mb-4">Satria Mika Narendra</h4>
                     
                     <div className="flex justify-center">
                        <button 
                          onClick={() => window.open('https://www.satriamika.my.id/', '_blank')} 
                          className={`px-6 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-3 ${colors.inputBg} border ${colors.border} hover:border-[#0C8F5B] hover:text-[#0C8F5B] dark:hover:border-[#78C951] dark:hover:text-[#78C951] transition-all shadow-sm group`}
                        >
                          <Icons.Briefcase className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                          Lihat Web Portofolio
                        </button>
                     </div>
                   </div>
               </div>
            )}
          </div>

          {isMainPage && (
            <div className={`flex items-center justify-around px-2 border-t ${colors.border} ${colors.panel} h-[68px] shrink-0 z-20 pb-safe backdrop-blur-xl`}>
                <button onClick={() => setActiveMenu('chat')} className={`relative flex flex-col items-center justify-center w-20 h-full transition-all ${activeMenu === 'chat' ? 'text-[#0C8F5B] dark:text-[#78C951]' : colors.textMuted}`}>
                    <div className="relative">
                      <Icons.Chat className="mb-1" />
                      {/* Badge Notifikasi Obrolan Personal */}
                      {unreadChatsCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-[#0A140F] shadow-sm">
                          {unreadChatsCount > 99 ? '99+' : unreadChatsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold">{t.chats}</span>
                </button>
                
                <button onClick={() => setActiveMenu('groups')} className={`relative flex flex-col items-center justify-center w-20 h-full transition-all ${activeMenu === 'groups' ? 'text-[#0C8F5B] dark:text-[#78C951]' : colors.textMuted}`}>
                    <div className="relative">
                      <Icons.Users className="mb-1" />
                      {/* Badge Notifikasi Grup */}
                      {unreadGroupsCount > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full border border-[#0A140F] shadow-sm">
                          {unreadGroupsCount > 99 ? '99+' : unreadGroupsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold">{t.groups}</span>
                </button>

                <button onClick={() => setActiveMenu('tasks')} className={`flex flex-col items-center justify-center w-20 h-full transition-all ${activeMenu === 'tasks' ? 'text-[#0C8F5B] dark:text-[#78C951]' : colors.textMuted}`}>
                    <Icons.Target className="mb-1" />
                    <span className="text-[10px] font-bold">{t.tasks}</span>
                </button>
            </div>
          )}
        </div>

        <Modal isOpen={isAddContactOpen} onClose={() => {setIsAddContactOpen(false); setSearchResults([]); setSearchInput('');}} title={t.searchFind} colors={colors}>
          <form onSubmit={handleSearchContact} className="space-y-4">
            <div className="flex gap-2">
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Ketik ID atau Username..." className={`flex-1 p-3 rounded-2xl ${colors.inputBg} border ${colors.border} focus:outline-none focus:border-[#0C8F5B] dark:focus:border-[#78C951] focus:ring-1 focus:ring-[#0C8F5B] dark:focus:ring-[#78C951] transition-all text-sm font-medium`} />
              <button type="submit" disabled={isSearching} className={`px-4 rounded-2xl transition-all shadow-md active:scale-95 ${colors.primary}`}>
                 {isSearching ? '...' : <Icons.Search />}
              </button>
            </div>
          </form>
          <div className="mt-4 space-y-2 max-h-[40vh] overflow-y-auto pr-1 scrollbar-hide">
             {searchResults.length === 0 && searchInput && !isSearching && (
                <p className={`text-center text-sm ${colors.textMuted} mt-4`}>{t.notFound}</p>
             )}
             {searchResults.map(user => (
               <div key={user.chat_id} className={`flex items-center justify-between p-3 rounded-2xl border ${colors.border} ${colors.hoverBg} cursor-pointer transition-colors`} onClick={() => startChatWithUser(user)}>
                 <div className="flex items-center gap-3 overflow-hidden">
                   <Avatar url={user.avatar_url} name={user.username} size="w-12 h-12" />
                   <div className="min-w-0">
                     <p className="font-bold text-sm truncate">{user.username}</p>
                     <p className={`text-[10px] ${colors.textMuted} truncate`}>{user.chat_id}</p>
                   </div>
                 </div>
                 <Icons.Chat className="text-[#0C8F5B] dark:text-[#78C951]" />
               </div>
             ))}
          </div>
        </Modal>

        {activeMenu === 'chat' && (
          <div className={`absolute bottom-[90px] right-6 md:bottom-24 md:right-[calc(100%-380px)] z-50 ${activeChat ? 'hidden md:block' : 'block'}`}>
              <button onClick={() => setIsAddContactOpen(true)} className={`${colors.primary} w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl active:scale-95 transition-all border border-white/20`} title="Tambah Teman">
                <Icons.Plus className="w-8 h-8" />
              </button>
          </div>
        )}

        <div className={`flex-1 h-full flex flex-col relative ${!activeChat ? 'hidden md:flex' : 'flex'} bg-transparent`}>
          {!activeChat ? (
             <div className={`flex-1 flex flex-col items-center justify-center z-10 relative bg-transparent`}>
                <div className={`w-32 h-32 mb-8 rounded-[2.5rem] ${colors.panel} border ${colors.border} shadow-2xl flex items-center justify-center text-[#0C8F5B] dark:text-[#78C951]`}>
                  <Icons.Chat className="w-12 h-12" />
                </div>
                <h2 className={`text-2xl font-black tracking-tight`}>Ruang Komunikasi</h2>
                <p className={`text-sm font-medium ${colors.textMuted} mt-2`}>Pilih kontak untuk memulai protokol enkripsi</p>
             </div>
          ) : (
            <ChatRoom 
              key={activeChat.id || activeChat.contact_id} 
              session={session} 
              myProfile={myProfile} 
              setMyProfile={setMyProfile} 
              colors={colors} 
              t={t}
              activeChat={activeChat} setActiveChat={setActiveChat} contacts={contacts} setContacts={setContacts} 
              globalMessages={globalMessages} setGlobalMessages={setGlobalMessages} onlineUsers={onlineUsers}
              blockedIds={blockedIds} openConfirm={openConfirm} localDeletedMsgs={localDeletedMsgs} setLocalDeletedMsgs={setLocalDeletedMsgs}
              taskData={taskData} setTaskData={setTaskData} 
              groups={groups} setGroups={setGroups} 
            />
          )}
        </div>

        <Modal isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} title={confirmDialog.title} colors={colors}>
          <div className="text-center">
            <p className="text-sm font-medium mb-8 leading-relaxed opacity-90">{confirmDialog.message}</p>
            <div className="flex gap-3">
               <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className={`flex-1 ${colors.inputBg} ${colors.hoverBg} rounded-xl py-3 font-bold transition-colors border ${colors.border}`}>
                 {t.cancel}
               </button>
               {!confirmDialog.isAlertOnly && (
                 <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog({ ...confirmDialog, isOpen: false }) }} className="flex-1 bg-[#ff5757] text-white rounded-xl py-3 font-bold hover:bg-red-600 transition-colors shadow-lg">
                   {t.yes}
                 </button>
               )}
            </div>
          </div>
        </Modal>

        <DeleteAccountModal 
  isOpen={isDeleteModalOpen} 
  onClose={() => setIsDeleteModalOpen(false)} 
  session={session} 
  myProfile={myProfile} 
  colors={colors} 
  t={t} 
/>
      </div>
    </>
  )
}

function SettingsManager({ activeMenu, setActiveMenu, session, myProfile, setMyProfile, themeName, setThemeName, language, setLanguage, colors, openConfirm, t, points, setPoints, taskData, setTaskData, setIsDeleteModalOpen }) {
  
  const [isUploadingWP, setIsUploadingWP] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    if (activeMenu === 'settings-support') {
      const fetchRev = async () => {
         const { data } = await supabase.from('app_reviews').select('*').order('created_at', { ascending: false }).limit(20);
         if (data && data.length > 0) {
            const uids = [...new Set(data.map(d => d.user_id))];
            const { data: profs } = await supabase.from('profiles').select('id, username, avatar_url').in('id', uids);
            const merged = data.map(r => ({ ...r, profile: profs?.find(p => p.id === r.user_id) }));
            setReviewsList(merged);
         }
      }
      fetchRev();
    }
  }, [activeMenu]);

  if (activeMenu === 'settings') {
    return (
      <div className={`p-4 md:p-6 min-h-full animate-in slide-in-from-right-4 bg-transparent`}>
         <div className="flex items-center gap-3 mb-6">
           <button onClick={() => setActiveMenu('chat')} className={`p-2.5 rounded-xl border ${colors.border} ${colors.panel} ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
           <h2 className="text-xl font-bold tracking-tight">{t.settings}</h2>
         </div>

         <div className={`p-5 rounded-[2rem] flex items-center gap-5 ${colors.panel} shadow-md border ${colors.border} mb-6 cursor-pointer ${colors.hoverBg} transition-all`} onClick={() => setActiveMenu('settings-profile')}>
            <Avatar url={myProfile.avatar_url} name={myProfile.username} size="w-16 h-16" className="shadow-lg border-2 border-white/10" />
            <div className="flex-1">
               <h3 className="text-lg font-bold">{myProfile.username}</h3>
               <p className={`text-sm ${colors.textMuted} line-clamp-1 mt-0.5`}>{myProfile.bio || 'Available'}</p>
            </div>
            <Icons.ArrowLeft className="rotate-180 text-gray-400" />
         </div>

         <div className={`${colors.panel} rounded-[2rem] shadow-sm border ${colors.border} overflow-hidden`}>
            <SettingsListItem icon={<Icons.Lock />} title={t.account} desc={t.delAcc} onClick={() => setActiveMenu('settings-account')} colors={colors} />
            <SettingsListItem icon={<Icons.Palette />} title={t.theme} desc={t.wp} onClick={() => setActiveMenu('settings-theme')} colors={colors} />
            <SettingsListItem icon={<Icons.Star />} title={t.support} desc={t.review} onClick={() => setActiveMenu('settings-support')} colors={colors} borderBottom={false} />
         </div>

         <div className="mt-8 p-5 rounded-[1.5rem] bg-gray-900/5 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center backdrop-blur-md">
            <p className="text-xs font-medium opacity-80 leading-relaxed uppercase tracking-wider">{t.infoDev}</p>
         </div>
      </div>
    )
  }

  if (activeMenu === 'settings-profile') {
     return <ProfileEditor session={session} myProfile={myProfile} setMyProfile={setMyProfile} setActiveMenu={setActiveMenu} colors={colors} t={t} taskData={taskData} setTaskData={setTaskData} />
  }

  if (activeMenu === 'settings-account') {
     return (
       <div className={`p-4 md:p-6 min-h-full animate-in slide-in-from-right-4 bg-transparent`}>
         <div className="flex items-center gap-3 mb-8">
           <button onClick={() => setActiveMenu('settings')} className={`p-2.5 rounded-xl border ${colors.border} ${colors.panel} ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
           <h2 className="text-xl font-bold">{t.account}</h2>
         </div>
         <button onClick={() => openConfirm(t.logout, 'Keluar dari perangkat ini?', () => supabase.auth.signOut())} className={`w-full text-left p-5 rounded-[1.5rem] ${colors.panel} border ${colors.border} shadow-sm mb-4 font-bold ${colors.hoverBg} transition flex items-center gap-3`}>
           <Icons.ArrowLeft className="rotate-180 text-gray-400" /> {t.logout}
         </button>
         <div className={`p-5 rounded-[1.5rem] border ${colors.border} ${colors.panel}`}>
           <p className={`text-xs font-bold uppercase tracking-wider ${colors.danger.split(' ')[0]} mb-3`}>Zona Berbahaya</p>
           <button onClick={() => setIsDeleteModalOpen(true)} className={`w-full text-center p-4 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold hover:bg-red-200 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/30 transition`}>{t.delAcc}</button>
         </div>
       </div>
     )
  }

  if (activeMenu === 'settings-theme') {
     const handleUploadWallpaper = async (e) => {
    // 1. Cek Poin dari Database
    if ((myProfile.points || 0) < 50) {
        alert(t.notEnoughPts);
        return;
    }

    const file = e.target.files[0]; 
    if (!file) return;
    
    setIsUploadingWP(true);
    
    // 2. Upload file ke Supabase Storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${session.user.id}/wallpaper_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
    
    if (!error) {
       const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
       
       // 3. Kurangi Poin
       const newPoints = (myProfile.points || 0) - 50;
       
       // 4. Update Wallpaper & Poin bersamaan di Supabase
       const { error: updateError } = await supabase
         .from('profiles')
         .update({ 
            chat_wallpaper: data.publicUrl,
            points: newPoints 
         })
         .eq('id', session.user.id);
       
       if (!updateError) {
           // 5. Update UI
           setMyProfile({...myProfile, chat_wallpaper: data.publicUrl, points: newPoints});
           alert('Wallpaper berhasil diupdate dan tersimpan permanen!');
       }
    } else {
       alert('Gagal mengunggah gambar.');
    }
    setIsUploadingWP(false);
}

     return (
       <div className={`p-4 md:p-6 min-h-full animate-in slide-in-from-right-4 bg-transparent`}>
         <div className="flex items-center gap-3 mb-8">
           <button onClick={() => setActiveMenu('settings')} className={`p-2.5 rounded-xl border ${colors.border} ${colors.panel} ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
           <h2 className="text-xl font-bold">{t.theme}</h2>
         </div>
         <div className="space-y-5 pb-10">
            <div className={`p-5 rounded-[1.5rem] shadow-sm border ${colors.border} ${colors.panel}`}>
               <label className={`block text-xs font-bold uppercase tracking-wider ${colors.textMuted} mb-3`}>Tema Aplikasi</label>
               <select value={themeName} onChange={(e) => setThemeName(e.target.value)} className={`w-full p-4 rounded-xl ${colors.inputBg} border ${colors.border} outline-none text-sm font-medium focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] transition-all`}>
                  <option value="light">Mode Terang (Light Glass)</option>
                  <option value="dark">Mode Gelap (Spatial Dark)</option>
               </select>
            </div>
            
            <div className={`p-5 rounded-[1.5rem] shadow-sm border ${colors.border} ${colors.panel}`}>
               <div className="flex justify-between items-center mb-3">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${colors.textMuted}`}>{t.wp}</label>
                  <span className={`text-[10px] font-bold ${colors.primary} px-2 py-1 rounded-md`}>-50 Poin</span>
               </div>
               <div className="relative">
                  <input type="file" onChange={handleUploadWallpaper} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploadingWP} />
                  <button className={`w-full p-4 rounded-xl ${colors.inputBg} border ${colors.border} text-sm font-bold transition flex items-center justify-center gap-2 hover:border-[#78C951]`}>
                    {isUploadingWP ? 'Mengunggah...' : <><Icons.Plus /> {t.buyWp}</>}
                  </button>
               </div>
               {myProfile.chat_wallpaper && myProfile.chat_wallpaper.startsWith('http') && (
                 <div className="mt-4 rounded-xl overflow-hidden h-32 border border-white/10 shadow-inner">
                    <img src={myProfile.chat_wallpaper} className="w-full h-full object-cover" />
                 </div>
               )}
            </div>

            <div className={`p-5 rounded-[1.5rem] shadow-sm border ${colors.border} ${colors.panel}`}>
               <label className={`block text-xs font-bold uppercase tracking-wider ${colors.textMuted} mb-3`}>{t.lang}</label>
               <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`w-full p-4 rounded-xl ${colors.inputBg} border ${colors.border} outline-none text-sm font-medium focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] transition-all`}>
                  <option value="id">Indonesia (ID)</option>
                  <option value="en">English (EN)</option>
               </select>
            </div>
         </div>
       </div>
     )
  }

  if (activeMenu === 'settings-support') {
     const handleSubmitReview = async () => {
        if(rating === 0) return alert('Pilih bintang terlebih dahulu!');
        setIsSubmitting(true);
        const { error } = await supabase.from('app_reviews').insert([{ user_id: session.user.id, rating, comment }]);
        setIsSubmitting(false);
        if(!error) { alert("Terima kasih!"); setActiveMenu('settings'); } 
        else { alert("Gagal. Pastikan tabel app_reviews ada di DB."); }
     }

     return (
       <div className={`p-4 md:p-6 min-h-full flex flex-col items-center animate-in slide-in-from-right-4 bg-transparent`}>
         <div className="w-full flex items-center gap-3 mb-6">
           <button onClick={() => setActiveMenu('settings')} className={`p-2.5 rounded-xl border ${colors.border} ${colors.panel} ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
           <h2 className="text-xl font-bold tracking-tight">{t.support}</h2>
         </div>

         <form className={`w-full ${colors.panel} p-6 rounded-[2rem] shadow-sm border ${colors.border} mb-6`}>
            <p className="font-bold text-center mb-5 opacity-90">{t.review}</p>
            <div className="flex gap-2 mb-6 justify-center">
               {[1, 2, 3, 4, 5].map((star) => (
                 <button type="button" key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="text-yellow-400 focus:outline-none transition-transform hover:scale-110 drop-shadow-sm">
                   {(hoverRating || rating) >= star ? <Icons.StarSolid className="w-8 h-8" /> : <Icons.Star className="w-8 h-8" />}
                 </button>
               ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t.reviewDesc} rows="3" className={`w-full p-4 rounded-xl ${colors.inputBg} border ${colors.border} outline-none focus:ring-1 focus:ring-[#78C951] focus:border-[#78C951] mb-5 resize-none text-sm transition-all`}></textarea>
            <button type="button" onClick={handleSubmitReview} disabled={isSubmitting} className={`${colors.primary} w-full py-4 rounded-xl font-extrabold shadow-lg`}>{isSubmitting ? '...' : t.send}</button>
         </form>

         <div className="w-full space-y-4 pb-10">
            <h3 className={`font-bold text-xs ${colors.textMuted} uppercase tracking-wider mb-2 ml-1`}>Ulasan Terbaru</h3>
            {reviewsList.map(r => (
               <div key={r.id} className={`${colors.panel} p-5 rounded-2xl border ${colors.border}`}>
                  <div className="flex items-center gap-3 mb-3">
                     <Avatar url={r.profile?.avatar_url} name={r.profile?.username} size="w-10 h-10" />
                     <div>
                        <p className="font-bold text-sm">{r.profile?.username || 'Anonim'}</p>
                        <div className="flex text-yellow-400 w-3 h-3 mt-0.5">
                           {[...Array(5)].map((_, i) => i < r.rating ? <Icons.StarSolid key={i} /> : <Icons.Star key={i} />)}
                        </div>
                     </div>
                  </div>
                  {r.comment && <p className={`text-sm ${colors.textMuted} leading-relaxed`}>{r.comment}</p>}
               </div>
            ))}
         </div>
       </div>
     )
  }

  return null;
}


function ProfileEditor({ session, myProfile, setMyProfile, setActiveMenu, colors, t, taskData, setTaskData }) {
  const [newUsername, setNewUsername] = useState(myProfile.username)
  const [newBio, setNewBio] = useState(myProfile.bio || '')
  
  // State untuk Ganti Password
  const [newPassword, setNewPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  const [isSaving, setIsSaving] = useState(false); 
  const [isUploading, setIsUploading] = useState(false); 
  const fileInputRef = useRef(null)

  const handleUpdateProfile = async () => {
    if (!newUsername.trim()) return
    setIsSaving(true)
    const { error } = await supabase.from('profiles').update({ username: newUsername, bio: newBio }).eq('id', session.user.id)
    if (!error) setMyProfile({ ...myProfile, username: newUsername, bio: newBio })
    setIsSaving(false)
    setActiveMenu('settings')
  }

  // Fungsi Ganti Password
  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) return alert("Password minimal 6 karakter!");
    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdatingPassword(false);
    
    if (error) {
      alert("Gagal memperbarui password: " + error.message);
    } else {
      alert("Password berhasil diperbarui!");
      setNewPassword('');
    }
  }

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0]; if (!file) return; setIsUploading(true)
    const fileExt = file.name.split('.').pop(); 
    const filePath = `${session.user.id}/avatar_${Date.now()}.${fileExt}` 
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', session.user.id)
      setMyProfile(prev => ({ ...prev, avatar_url: data.publicUrl }))
    }
    setIsUploading(false)
  }

  const copyIDForTask = () => {
    const idToCopy = myProfile.chat_id || myProfile.id;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(idToCopy).then(() => alert('ID Tersalin: ' + idToCopy)).catch(() => fallbackCopy(idToCopy));
    } else { fallbackCopy(idToCopy); }
    setTaskData(prev => ({ ...prev, shareCount: Math.min(prev.shareCount + 1, 5) }));
  };

  const fallbackCopy = (text) => {
    const textArea = document.createElement("textarea"); textArea.value = text; document.body.appendChild(textArea); textArea.select();
    try { document.execCommand('copy'); alert('ID Tersalin: ' + text); } catch (err) { alert('Gagal menyalin ID.'); }
    document.body.removeChild(textArea);
  };

  return (
     <div className={`p-4 md:p-6 min-h-full animate-in slide-in-from-right-4 bg-transparent pb-24`}>
       <div className="flex items-center gap-3 mb-8">
         <button onClick={() => setActiveMenu('settings')} className={`p-2.5 rounded-xl border ${colors.border} ${colors.panel} ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
         <h2 className="text-xl font-bold">{t.profile}</h2>
       </div>

       <div className="flex flex-col items-center mb-8">
         <div className="relative group cursor-pointer mb-5" onClick={() => fileInputRef.current.click()}>
           <Avatar url={myProfile.avatar_url} name={myProfile.username} size="w-32 h-32" className={`shadow-2xl border-4 border-white/10 ${isUploading ? 'animate-pulse scale-95 opacity-80' : ''}`} />
           {isUploading && (
             <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm z-10 transition-all">
                <div className="w-10 h-10 border-4 border-[#78C951] border-t-transparent rounded-full animate-spin"></div>
             </div>
           )}
           <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-xs font-bold text-white tracking-widest uppercase">Ubah Visual</span>
           </div>
           <input type="file" ref={fileInputRef} onChange={handleUploadAvatar} accept="image/*" className="hidden" />
         </div>
         <button onClick={copyIDForTask} className={`px-5 py-2 rounded-full text-xs font-bold ${colors.primary} flex items-center gap-2 hover:scale-105 transition-transform shadow-lg`}>
             <Icons.Copy className="w-3.5 h-3.5" /> Share ID (Task)
         </button>
       </div>

       <div className="space-y-4">
         
         {/* KOLOM READ-ONLY (ID & EMAIL) DENGAN GAYA BARU */}
         <div className={`p-6 rounded-[1.5rem] shadow-sm border ${colors.border} ${colors.panel}`}>
            <div className="flex justify-between items-center mb-2">
               <label className={`block text-xs font-bold ${colors.textMuted} uppercase tracking-wider`}>Unique ID</label>
               <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">Tidak bisa diganti</span>
            </div>
            <input type="text" readOnly value={myProfile.chat_id} className={`w-full border-b ${colors.border} py-2 bg-transparent outline-none text-lg md:text-xl font-black ${colors.text} cursor-not-allowed opacity-70`} />
         </div>

         <div className={`p-6 rounded-[1.5rem] shadow-sm border ${colors.border} ${colors.panel}`}>
            <div className="flex justify-between items-center mb-2">
               <label className={`block text-xs font-bold ${colors.textMuted} uppercase tracking-wider`}>Alamat Email</label>
               <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20">Tidak bisa diganti</span>
            </div>
            <input type="text" readOnly value={myProfile.email || session.user.email} className={`w-full border-b ${colors.border} py-2 bg-transparent outline-none text-base md:text-lg font-bold ${colors.text} cursor-not-allowed opacity-70`} />
         </div>

         {/* KOLOM EDITABLE (USERNAME & BIO) */}
         <div className={`p-6 rounded-[1.5rem] shadow-sm border ${colors.border} ${colors.panel}`}>
            <label className={`block text-xs font-bold ${colors.textMuted} uppercase tracking-wider mb-2`}>Nama Pengguna</label>
            <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className={`w-full border-b ${colors.border} py-2 bg-transparent outline-none text-lg font-bold focus:border-[#78C951] transition-colors`} />
         </div>

         <div className={`p-6 rounded-[1.5rem] shadow-sm border ${colors.border} ${colors.panel}`}>
            <label className={`block text-xs font-bold ${colors.textMuted} uppercase tracking-wider mb-2`}>Bio / Status</label>
            <input type="text" maxLength={150} value={newBio} onChange={(e) => setNewBio(e.target.value)} placeholder="Available" className={`w-full border-b ${colors.border} py-2 bg-transparent outline-none text-lg font-medium focus:border-[#78C951] transition-colors`} />
         </div>

         {/* KOLOM GANTI PASSWORD */}
         <div className={`p-6 rounded-[1.5rem] shadow-sm border ${colors.border} ${colors.panel}`}>
            <label className={`block text-xs font-bold ${colors.textMuted} uppercase tracking-wider mb-2`}>Ganti Password Baru</label>
            <div className="flex gap-3">
               <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" className={`w-full border-b ${colors.border} py-2 bg-transparent outline-none text-base font-medium focus:border-[#78C951] transition-colors`} />
               <button onClick={handleUpdatePassword} disabled={isUpdatingPassword || newPassword.length < 6} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 ${colors.primary}`}>
                 {isUpdatingPassword ? '...' : 'Update'}
               </button>
            </div>
            <p className="text-[10px] mt-2 opacity-70 italic">*(Kosongkan jika tidak ingin mengganti password)</p>
         </div>
         
         <button onClick={handleUpdateProfile} disabled={isSaving || !newUsername.trim()} className={`${colors.primary} w-full py-4 rounded-xl font-extrabold mt-6 shadow-lg disabled:opacity-50`}>
           {isSaving ? 'Menyimpan Protokol...' : t.save}
         </button>
       </div>
     </div>
  )
}

function SettingsListItem({ icon, title, desc, onClick, colors, borderBottom = true }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 p-5 cursor-pointer ${colors.hoverBg} transition-colors ${borderBottom ? `border-b ${colors.border}` : ''}`}>
       <div className={`${colors.textMuted}`}>{icon}</div>
       <div className="flex-1">
          <h4 className="font-bold text-base tracking-tight">{title}</h4>
          <p className={`text-xs ${colors.textMuted} mt-0.5`}>{desc}</p>
       </div>
       <Icons.ArrowLeft className={`rotate-180 ${colors.textMuted} w-4 h-4`} />
    </div>
  )
}

// ================= KOMPONEN RUANG OBROLAN MODERN =================
function ChatRoom({ session, myProfile, setMyProfile, colors, t, activeChat, setActiveChat, contacts, setContacts, globalMessages, setGlobalMessages, onlineUsers, blockedIds, openConfirm, localDeletedMsgs, setLocalDeletedMsgs, taskData, setTaskData, groups, setGroups }) {
  const [inputMessage, setInputMessage] = useState('')
  const [typingUserId, setTypingUserId] = useState(null)
  const [pendingMessages, setPendingMessages] = useState([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)
  const [previewMedia, setPreviewMedia] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)

  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    if (activeChat?.type === 'group') {
      const fetchMembers = async () => {
        const { data: memberData } = await supabase.from('group_members').select('user_id').eq('group_id', activeChat.contact_id);
        if (memberData) {
           const uids = memberData.map(d => d.user_id);
           const { data: profs } = await supabase.from('profiles').select('chat_id, username, avatar_url, bio').in('chat_id', uids);
           setGroupMembers(profs || []);
        }
      };
      
      fetchMembers();

      const memberChannel = supabase.channel(`group-members-${activeChat.contact_id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members', filter: `group_id=eq.${activeChat.contact_id}` }, () => {
           fetchMembers(); 
        })
        .subscribe();

      return () => supabase.removeChannel(memberChannel);
    }
  }, [activeChat?.contact_id]);

  const getRoleColor = (senderId) => {
    const colorsArr = ['#78C951', '#0C8F5B', '#4caf50', '#00bcd4', '#3f51b5', '#9c27b0', '#ff9800', '#ff7a59', '#e91e63'];
    let hash = 0;
    for (let i = 0; i < senderId.length; i++) {
       hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorsArr[Math.abs(hash) % colorsArr.length];
  };

  const handleDisbandGroup = () => {
    openConfirm(t.disbandGroup, `Yakin ingin membubarkan grup ini? Semua anggota akan dikeluarkan dan grup akan dihapus permanen.`, async () => {
      await supabase.from('messages').delete().eq('receiver_id', activeChat.contact_id);
      await supabase.from('group_members').delete().eq('group_id', activeChat.contact_id);
      await supabase.from('groups').delete().eq('id', activeChat.contact_id);
      
      if (setGroups) setGroups(prev => prev.filter(g => g.id !== activeChat.contact_id));
      setGlobalMessages(prev => prev.filter(m => m.receiver_id !== activeChat.contact_id));
      setActiveChat(null);
      showToast("Grup berhasil dibubarkan.");
    });
  };

  const handleLeaveGroup = () => {
    openConfirm(t.leaveGroup, `Yakin ingin keluar dari grup ini?`, async () => {
      await supabase.from('group_members').delete().match({ group_id: activeChat.contact_id, user_id: myProfile.chat_id });
      if (setGroups) setGroups(prev => prev.filter(g => g.id !== activeChat.contact_id));
      setGlobalMessages(prev => prev.filter(m => m.receiver_id !== activeChat.contact_id));
      setActiveChat(null);
      showToast("Anda telah keluar dari grup.");
    });
  };

  const chatContainerRef = useRef(null); 
  const [isAtBottom, setIsAtBottom] = useState(true); 
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  
  const [replyingTo, setReplyingTo] = useState(null)
  const [isReplyExpanded, setIsReplyExpanded] = useState(false);
  useEffect(() => {
     setIsReplyExpanded(false);
  }, [replyingTo]);  const [activeMsgId, setActiveMsgId] = useState(null)
  const [editingMsg, setEditingMsg] = useState(null)

  const [isStickerMakerOpen, setIsStickerMakerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [contextMsg, setContextMsg] = useState(null) 
  const [swipeId, setSwipeId] = useState(null) 
  const [swipeOffset, setSwipeOffset] = useState(0) 
  
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const pressTimer = useRef(null)
  const isSwipingRef = useRef(false)

  const lastGroupMsgTimeRef = useRef(0);

// GANTI MENJADI INI:
  const [favoriteStickers, setFavoriteStickers] = useState(myProfile?.favorite_stickers || []);
  const [showFavStickers, setShowFavStickers] = useState(false);

  const scrollToMessage = (msgId) => {
    const element = document.getElementById(`msg-${msgId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const bubble = element.querySelector('.chat-bubble-core');
      if (bubble) {
        bubble.classList.add('brightness-150', 'scale-[1.02]', 'transition-all', 'duration-300');
        setTimeout(() => {
          bubble.classList.remove('brightness-150', 'scale-[1.02]');
        }, 800);
      }
    }
  };

  const [stagedFiles, setStagedFiles] = useState([])

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000); 
  };

  const handleSendSticker = async (fileObj, type, overlayText) => {
    setIsUploading(true); 
    const fileExt = type === 'video_to_gif' ? 'gif' : 'webp';
    const fileName = `sticker_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;
    
    try {
      const { error } = await supabase.storage.from('chat_media').upload(filePath, fileObj);
      if (error) throw error;
      const { data } = supabase.storage.from('chat_media').getPublicUrl(filePath);
      
      const tempMsg = {
        id: `temp-${Date.now()}`, 
        sender_id: myProfile.chat_id, 
        receiver_id: activeChat.contact_id,
        content: '', 
        is_read: false, 
        reply_to_id: replyingTo?.id || null, 
        created_at: new Date().toISOString(), 
        status: 'pending',
        media_files: [{ url: data.publicUrl, type: 'sticker', name: fileName }] 
      };
      
      if (taskData && setTaskData && activeChat.contact_id) {
         setTaskData(prev => {
            if (!prev.chatProgress.includes(activeChat.contact_id) && prev.chatProgress.length < 5) {
               return { ...prev, chatProgress: [...prev.chatProgress, activeChat.contact_id] };
            }
            return prev;
         });
      }

      setPendingMessages(prev => [...prev, tempMsg]); 
      setReplyingTo(null);
    } catch (error) {
      alert("Gagal mengirim stiker: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const forceDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl; a.download = filename || 'media';
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) { window.open(url, '_blank'); }
  }

  const handleDeleteForMe = (msgId) => { setLocalDeletedMsgs(prev => [...prev, msgId]); setContextMsg(null); }

  const handleDeleteForEveryone = async (msgId) => {
    setContextMsg(null); 
    setTimeout(() => {
      openConfirm('Hapus Pesan', 'Hapus pesan ini untuk semua orang?', async () => {
        await supabase.from('messages').update({ is_deleted: true, content: '' }).eq('id', msgId);
      });
    }, 300);
  }

  const handlePressStart = (e, msg) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    touchStartX.current = clientX; touchStartY.current = clientY; isSwipingRef.current = false;
    pressTimer.current = setTimeout(() => { setContextMsg(msg); isSwipingRef.current = true }, 600) 
  }

  const handlePressMove = (e, msg, isMe) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const deltaX = clientX - touchStartX.current
    const deltaY = clientY - touchStartY.current
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) clearTimeout(pressTimer.current)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      isSwipingRef.current = true
      let allowedOffset = 0
      if (isMe && deltaX < 0) allowedOffset = Math.max(deltaX, -80) 
      if (!isMe && deltaX > 0) allowedOffset = Math.min(deltaX, 80) 
      if (allowedOffset !== 0) { setSwipeId(msg.id); setSwipeOffset(allowedOffset) }
    }
  }

  const handlePressEnd = (msg) => {
    clearTimeout(pressTimer.current)
    if (swipeId === msg.id) {
      if (Math.abs(swipeOffset) > 50) setReplyingTo(msg)
      setSwipeId(null); setSwipeOffset(0)
    }
  }

  const mediaInputRef = useRef(null); const channelRef = useRef(null); const messagesEndRef = useRef(null); const typingTimeoutRef = useRef(null)

  const clearedAtTime = new Date(activeChat.cleared_at || '1970-01-01').getTime();
  
  const filteredMessages = globalMessages.filter(msg => {
    if (blockedIds.includes(msg.sender_id)) return false;
    if (localDeletedMsgs.includes(msg.id)) return false; 
    
    const msgTime = new Date(msg.created_at).getTime();
    if (msgTime <= clearedAtTime) return false;
    
    // Konversi ke string untuk konsistensi perbandingan
    const mSender = String(msg.sender_id);
    const mReceiver = String(msg.receiver_id);
    const myId = String(myProfile.chat_id);
    const chatId = String(activeChat?.contact_id);
    
    if (activeChat?.type === 'group') {
      return mReceiver === chatId;
    } else {
      return (mSender === myId && mReceiver === chatId) || 
             (mSender === chatId && mReceiver === myId);
    }
  });

  const unreadCount = filteredMessages.filter(m => !m.is_read && m.sender_id !== myProfile.chat_id).length;
  const firstUnreadMsgId = filteredMessages.find(m => !m.is_read && m.sender_id !== myProfile.chat_id)?.id;

  const handleClearChatLocal = () => {
    openConfirm(t.clearMe, 'Semua pesan akan dihapus dari layar Anda.', async () => {
      setIsHeaderMenuOpen(false)
      const now = new Date().toISOString()
      await supabase.from('contacts').update({ cleared_at: now }).eq('contact_id', activeChat.contact_id).eq('user_id', session.user.id)
      setContacts(contacts.map(c => c.contact_id === activeChat.contact_id ? { ...c, cleared_at: now } : c))
      setActiveChat(prev => ({ ...prev, cleared_at: now }))
    })
  }

  const handleClearChatEveryone = () => {
    openConfirm(t.clearAll, 'Hapus SEMUA riwayat pesan secara permanen antara Anda dan pengguna ini?', async () => {
      setIsHeaderMenuOpen(false);
      await supabase.from('messages').delete().or(`and(sender_id.eq.${myProfile.chat_id},receiver_id.eq.${activeChat.contact_id}),and(sender_id.eq.${activeChat.contact_id},receiver_id.eq.${myProfile.chat_id})`);
      setGlobalMessages(prev => prev.filter(m => !(
        (m.sender_id === myProfile.chat_id && m.receiver_id === activeChat.contact_id) ||
        (m.sender_id === activeChat.contact_id && m.receiver_id === myProfile.chat_id)
      )));
    });
  }

  const getSenderName = (senderId) => {
    if (senderId === myProfile.chat_id) return 'Anda'
    if (activeChat && activeChat.contact_id === senderId) return activeChat.contact_username
    const contact = contacts?.find(c => c.contact_id === senderId)
    if (contact) return contact.contact_username
    return senderId
  }

  const handleCopyText = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = text; document.body.appendChild(textArea); textArea.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(textArea)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { setIsAtBottom(entry.isIntersecting); }, { root: chatContainerRef.current, rootMargin: '150px', threshold: 0 });
    const bottomTarget = messagesEndRef.current;
    if (bottomTarget) observer.observe(bottomTarget);
    return () => { if (bottomTarget) observer.unobserve(bottomTarget); };
  }, [activeChat]);

  useEffect(() => {
    if (filteredMessages.length === 0) return;
    if (isAtBottom) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages.length]);

  useEffect(() => {
    setIsHeaderMenuOpen(false); setReplyingTo(null); setEditingMsg(null); setActiveMsgId(null); setTypingUserId(null); setShowContactInfo(false);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'instant' }), 100);
  }, [activeChat]);

  useEffect(() => {
    if (pendingMessages.length > 0) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [pendingMessages.length]);

  useEffect(() => {
  if (pendingMessages.length === 0 || isProcessingQueue) return;
  
  const processNextMessage = async () => {
    setIsProcessingQueue(true);
    const msgToProcess = pendingMessages[0];

    // 🔴 SAFETY CHECK: Jika sender_id tidak ada, hapus dari antrean dan log errornya
    if (!msgToProcess.sender_id) {
      console.error("Gagal mengirim! sender_id kosong pada pesan ini:", msgToProcess);
      setPendingMessages(prev => prev.slice(1)); // Buang pesan rusak agar antrean jalan terus
      setIsProcessingQueue(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 800)); 
    
    const payload = { 
      sender_id: msgToProcess.sender_id, 
      receiver_id: msgToProcess.receiver_id, 
      content: msgToProcess.content, 
      is_read: false, 
      reply_to_id: msgToProcess.reply_to_id, 
      media_files: msgToProcess.media_files 
    };

    await supabase.from('messages').insert([payload]);
    setPendingMessages(prev => prev.slice(1));
    setIsProcessingQueue(false);
  };
  
  processNextMessage();
}, [pendingMessages, isProcessingQueue]);

  useEffect(() => {
    if (!activeChat) return;
    
    // Bedakan nama room untuk personal dan grup
    const roomName = activeChat.type === 'group' 
      ? `typing-room-${activeChat.contact_id}` 
      : `typing-room-${[myProfile.chat_id, activeChat.contact_id].sort().join('-')}`;
      
    const channel = supabase.channel(roomName).on('broadcast', { event: 'typing' }, ({ payload }) => { 
      if (payload.sender_id !== myProfile.chat_id) {
         // Simpan ID user yang sedang mengetik, bukan cuma true/false
         setTypingUserId(payload.status ? payload.sender_id : null);
      } 
    }).subscribe()
    
    channelRef.current = channel; 
    return () => { supabase.removeChannel(channel) }
  }, [activeChat, myProfile.chat_id])

  // Pastikan saat pindah chat, indikator typing di-reset
  useEffect(() => {
    setIsHeaderMenuOpen(false); setReplyingTo(null); setEditingMsg(null); setActiveMsgId(null); setTypingUserId(null); setShowContactInfo(false);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'instant' }), 100);
  }, [activeChat]);

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
    if (isUploading) return; 

    if (!inputMessage.trim() && stagedFiles.length === 0) return;

    if (activeChat.type === 'group') {
      const now = Date.now();
      if (now - lastGroupMsgTimeRef.current < 2000) {
        showToast("Tunggu 2 detik untuk menghindari spam grup.");
        return;
      }
      lastGroupMsgTimeRef.current = now;
    }

    if (editingMsg) {
      setIsUploading(true);
      await supabase.from('messages').update({ content: inputMessage, is_edited: true }).eq('id', editingMsg.id);
      setEditingMsg(null); setInputMessage(''); setIsUploading(false);
      return;
    }

    setIsUploading(true);
    let uploadedFiles = [];

    if (stagedFiles.length > 0) {
      for (const sf of stagedFiles) {
        const fileExt = sf.name.split('.').pop(); 
        const filePath = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error } = await supabase.storage.from('chat_media').upload(filePath, sf.file);
        if (!error) { 
          const { data } = supabase.storage.from('chat_media').getPublicUrl(filePath); 
          uploadedFiles.push({ url: data.publicUrl, type: sf.type, name: sf.name });
        }
      }
    }

    // FIX 1: Generate Date secara manual
    const nowIso = new Date().toISOString();
    const tempId = `temp-${Date.now()}`;

    const payload = { 
      sender_id: String(myProfile.chat_id), // UUID sudah tidak dipakai di sini
      receiver_id: String(activeChat.contact_id), 
      content: inputMessage.trim(),
      is_read: false, 
      reply_to_id: replyingTo?.id || null, 
      media_files: uploadedFiles.length > 0 ? uploadedFiles : null,
      created_at: nowIso 
    };

    if (taskData && setTaskData && activeChat.contact_id) {
       setTaskData(prev => {
          // Jika ID teman belum ada di list dan belum mencapai 5 teman
          if (!prev.chatProgress.includes(activeChat.contact_id) && prev.chatProgress.length < 5) {
             return { ...prev, chatProgress: [...prev.chatProgress, activeChat.contact_id] };
          }
          return prev;
       });
    }

    // Optimistic UI Update
    setGlobalMessages(prev => [...prev, { ...payload, id: tempId }]); 
    
    // Insert Database
    const { error } = await supabase.from('messages').insert([payload]);
    
    if (error) {
       console.error("Supabase Error:", error);
       showToast("Gagal mengirim pesan.");
       setGlobalMessages(prev => prev.filter(m => m.id !== tempId)); // Hapus temp jika gagal
    } else {
       // FIX 2: Hapus data temp jika berhasil, karena Listener Realtime akan mengambil alih render data asli dari server
       setGlobalMessages(prev => prev.filter(m => m.id !== tempId));
    }

    setInputMessage(''); setStagedFiles([]); setReplyingTo(null); setIsUploading(false);
}

  const handleSendMedia = (e) => {
    const files = Array.from(e.target.files); 
    if (files.length === 0) return; 
    const newStaged = files.map(file => {
      let fileType = 'document'; 
      if (file.type.startsWith('image/')) fileType = 'image'; else if (file.type.startsWith('video/')) fileType = 'video';
      return { file, type: fileType, name: file.name, previewUrl: URL.createObjectURL(file) }
    });
    setStagedFiles(prev => [...prev, ...newStaged]);
    e.target.value = '';
  }

  useEffect(() => {
    // Hapus blokir untuk grup
    if (!activeChat || !isAtBottom) return; 
    
    const unreadMsgs = globalMessages.filter(m => {
      if (m.is_read || m.sender_id === myProfile.chat_id) return false;
      return activeChat.type === 'group' 
        ? m.receiver_id === activeChat.contact_id 
        : (m.sender_id === activeChat.contact_id && m.receiver_id === myProfile.chat_id);
    });

    if (unreadMsgs.length > 0) {
      setGlobalMessages(prev => prev.map(m => unreadMsgs.find(u => u.id === m.id) ? { ...m, is_read: true } : m));
      supabase.from('messages').update({ is_read: true }).in('id', unreadMsgs.map(m => m.id)).then();
      
      // HAPUS SEMUA NOTIFIKASI DI HP KARENA PESAN SUDAH DIBACA
      PushNotifications.removeAllDeliveredNotifications();
    }
  }, [activeChat, globalMessages, myProfile.chat_id, setGlobalMessages, isAtBottom])
  const getWallpaperStyle = () => {
    // Wallpaper sekarang diambil dari database user, bukan localStorage
    if (myProfile.chat_wallpaper && myProfile.chat_wallpaper.startsWith('http')) {
      return { 
        backgroundImage: `url(${myProfile.chat_wallpaper})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        opacity: 0.2 // Menggunakan opacity agar chat tetap terbaca
      }
    }
    return {}
  }

  return (
    <div className="flex w-full h-full overflow-hidden relative bg-transparent">
      <div className={`flex-1 flex flex-col h-full relative min-w-0 ${showContactInfo ? 'hidden md:flex' : 'flex'}`}>
        
        {/* MENU KONTEKS (BLUR SPATIAL) */}
        {contextMsg && (
          <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setContextMsg(null)}>
            <div className={`max-w-[85%] md:max-w-md p-3 rounded-[1.5rem] shadow-2xl mb-6 relative z-10 ${contextMsg.sender_id === myProfile.chat_id ? colors.bubbleMe : colors.bubbleThem} ${contextMsg.sender_id === myProfile.chat_id ? 'rounded-tr-sm' : 'rounded-tl-sm'}`} onClick={e => e.stopPropagation()}>
               {contextMsg.reply_to_id && globalMessages.find(m => m.id === contextMsg.reply_to_id) && (
                 <div className="p-3 mb-3 rounded-xl bg-black/10 dark:bg-black/30 border-l-4 border-current flex flex-col w-full min-w-0">
                    <p className="font-bold mb-1 text-[11px] opacity-90 uppercase tracking-widest">{getSenderName(globalMessages.find(m => m.id === contextMsg.reply_to_id).sender_id)}</p>
                    <p className="text-xs opacity-80 line-clamp-3">{globalMessages.find(m => m.id === contextMsg.reply_to_id).content || 'Media File'}</p>
                 </div>
               )}
               {contextMsg.media_files && contextMsg.media_files.length > 0 && (
                 <div className={`grid gap-2 ${contextMsg.media_files.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} mb-3`}>
                   {contextMsg.media_files.map((file, idx) => (
                     <div key={idx} className={`relative overflow-hidden rounded-xl h-32 flex items-center justify-center ${file.type === 'sticker' ? 'bg-transparent border-none' : 'border border-white/10 bg-black/20'}`}>
                       {file.type === 'image' && <img src={file.url} className="object-cover w-full h-full" alt="Preview" />}
                       {file.type === 'video' && <video src={file.url} className="object-cover w-full h-full" />}
                       
                       {file.type === 'sticker' && <img src={file.url} className="object-contain w-28 h-28 drop-shadow-xl" alt="Sticker Preview" />}
                       
                       {file.type === 'document' && <div className="flex flex-col items-center justify-center h-full text-[10px] opacity-70 p-2"><Icons.File className="w-8 h-8 mb-2" /> <span className="truncate w-full mt-1">{file.name}</span></div>}
                     </div>
                   ))}
                 </div>
               )}
               <p className="text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap px-2 font-medium">{contextMsg.content}</p>
            </div>

            <div className={`rounded-[1.5rem] shadow-2xl w-[280px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 zoom-in-95 border ${colors.border} ${colors.panel}`} onClick={e => e.stopPropagation()}>
               
               {contextMsg.media_files?.[0]?.type === 'sticker' ? (
  <>
    {/* Logika Pengecekan Favorit */}
    {(() => {
       const stickerUrl = contextMsg.media_files[0].url;
       const isFavorited = favoriteStickers.includes(stickerUrl);
       
       return (
         <button onClick={async () => { 
           // 1. Siapkan data stiker baru
           const newFavs = !isFavorited 
              ? [stickerUrl, ...favoriteStickers] 
              : favoriteStickers.filter(u => u !== stickerUrl);
           
           // 2. Update UI secara instan
           setFavoriteStickers(newFavs);
           if (setMyProfile) {
              setMyProfile(prev => ({ ...prev, favorite_stickers: newFavs }));
           }
           setContextMsg(null); 
           
           // 3. Simpan permanen ke Supabase
           const { error } = await supabase
              .from('profiles')
              .update({ favorite_stickers: newFavs })
              .eq('id', session.user.id);
              
           if (error) {
              alert("Database Error: " + error.message);
           } else {
              showToast(!isFavorited ? "Stiker berhasil ditambahkan ke Favorit! ⭐" : "Stiker dihapus dari Favorit.");
           }
         }} className={`px-5 py-4 font-bold text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>
           {isFavorited ? 'Hapus dari Favorit' : 'Tambah ke Favorit'} 
           {isFavorited ? <Icons.StarSolid className="text-yellow-400 drop-shadow-md w-5 h-5" /> : <Icons.Star className="w-5 h-5" />}
         </button>
       );
    })()}

    <button onClick={() => { setIsStickerMakerOpen(true); setContextMsg(null); }} className={`px-5 py-4 font-bold text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>
      Buat stiker anda sendiri <Icons.Palette className="w-5 h-5" />
    </button>
  </>
) : (
                 <>
                   {contextMsg.media_files && contextMsg.media_files.length > 0 && (
                      <>
                        {contextMsg.media_files.some(f => f.type === 'image' || f.type === 'video') && (
                          <button onClick={() => { setPreviewMedia(contextMsg.media_files.find(f => f.type === 'image' || f.type === 'video')); setContextMsg(null); }} className={`px-5 py-4 font-bold text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.viewMedia}</button>
                        )}
                        <button onClick={() => { contextMsg.media_files.forEach(f => forceDownload(f.url, f.name)); setContextMsg(null); }} className={`px-5 py-4 font-bold text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.saveMedia}</button>
                      </>
                   )}
                   {contextMsg.content && (
                     <button onClick={() => { handleCopyText(contextMsg.content); setContextMsg(null); }} className={`px-5 py-4 font-bold text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.copy} <Icons.Copy /></button>
                   )}
                   {contextMsg.sender_id === myProfile.chat_id && (
                     <button onClick={() => { setEditingMsg(contextMsg); setInputMessage(contextMsg.content); setContextMsg(null); }} className={`px-5 py-4 font-bold text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.edit} <Icons.Edit /></button>
                   )}
                 </>
               )}

               <button onClick={() => { setReplyingTo(contextMsg); setContextMsg(null); }} className={`px-5 py-4 font-bold text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.reply} <Icons.Reply /></button>
               <button onClick={() => handleDeleteForMe(contextMsg.id)} className={`px-5 py-4 font-bold text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.delMe} <Icons.Trash /></button>
               
               {contextMsg.sender_id === myProfile.chat_id && (
                  <button onClick={() => handleDeleteForEveryone(contextMsg.id)} className={`px-5 py-4 font-bold text-red-500 text-left hover:bg-red-50 dark:hover:bg-red-900/10 flex justify-between items-center transition-colors text-sm`}>{t.delAll} <Icons.Trash /></button>
               )}
            </div>
          </div>
        )}

        {/* HEADER CHAT ROOM SPATIAL */}
        <div className={`h-[76px] md:h-[86px] flex items-center justify-between px-4 md:px-6 border-b ${colors.border} ${colors.panel} shrink-0 z-20 backdrop-blur-xl transition-colors duration-500`}>
          <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer" onClick={() => setShowContactInfo(true)}>
            <button onClick={(e) => { e.stopPropagation(); setActiveChat(null) }} className={`md:hidden p-2 rounded-xl border ${colors.border} ${colors.hoverBg} transition-colors`}><Icons.ArrowLeft /></button>
            <Avatar url={activeChat.avatar_url} name={activeChat.contact_username} size="w-12 h-12" className="border-2 border-white/10 shadow-sm" />
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black truncate tracking-tight">{activeChat.contact_username}</h2>
              <p className={`text-xs font-bold mt-0.5 truncate uppercase tracking-widest ${typingUserId || onlineUsers.includes(activeChat.contact_id) ? 'text-[#0C8F5B] dark:text-[#78C951]' : colors.textMuted}`}>
  {activeChat.type === 'group' 
    ? (typingUserId ? `${getSenderName(typingUserId)} sedang mengetik...` : `${groupMembers.length} Anggota`)
    : (typingUserId ? t.typing : (onlineUsers.includes(activeChat.contact_id) ? t.online : t.offline))
  }
</p>
            </div>
          </div>
          <div className="flex items-center shrink-0">
            <div className="relative z-[9999]">
              <button onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)} className={`p-3 rounded-xl border ${colors.border} ${colors.hoverBg} transition-all ${colors.textMuted}`}><Icons.MoreVertical /></button>
              {isHeaderMenuOpen && (
                <div className={`absolute right-0 mt-3 w-56 ${colors.panel} border ${colors.border} rounded-[1.5rem] shadow-2xl z-50 overflow-hidden`}>
                  <button onClick={handleClearChatLocal} className={`w-full text-left px-5 py-4 text-sm font-bold ${colors.hoverBg} transition-colors`}>{t.clearMe}</button>
                  <button onClick={handleClearChatEveryone} className={`w-full text-left px-5 py-4 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}>{t.clearAll}</button>
                  <div className={`h-px w-full ${colors.border}`}></div>
                  <button onClick={() => { setIsHeaderMenuOpen(false); setShowContactInfo(true); }} className={`w-full text-left px-5 py-4 text-sm font-bold ${colors.hoverBg} transition-colors`}>{t.contactInfo}</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col relative min-h-0 bg-transparent">
          <div className="absolute inset-0 z-0 pointer-events-none" style={{...getWallpaperStyle(), mixBlendMode: 'overlay'}}></div>
          
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-3 px-4 md:px-8 pt-6 pb-6 z-10 relative scrollbar-hide" onClick={() => { setIsHeaderMenuOpen(false); setActiveMsgId(null); }}>
            
            <div className="flex justify-center mb-8">
              <div className={`text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-full ${colors.warningBg} ${colors.warningText} shadow-md flex items-center gap-2 max-w-[90%] text-center border border-current/20`}>
                <Icons.Lock className="w-3.5 h-3.5" /> {t.encrypted}
              </div>
            </div>

            {filteredMessages.map((msg, idx) => {
              const isMe = msg.sender_id === myProfile.chat_id;
              const dateLabel = formatDateBadge(msg.created_at)
              const prevMsg = idx > 0 ? filteredMessages[idx - 1] : null
              const showDateBadge = !prevMsg || formatDateBadge(prevMsg.created_at) !== dateLabel
              const timeString = new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
              const repliedMsg = msg.reply_to_id ? globalMessages.find(m => m.id === msg.reply_to_id) : null
              const showUnreadDivider = msg.id === firstUnreadMsgId;

              if (msg.is_deleted) {
                return (
                  <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} my-2`}>
                    <div className="px-4 py-2 rounded-full bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5 text-gray-500 dark:text-gray-400 italic text-xs shadow-sm font-medium">
                      🚫 {t.msgDeleted}
                    </div>
                  </div>
                )
              }

              return (
                <Fragment key={msg.id}>
                  {showUnreadDivider && (
                    <div className="flex justify-center my-6">
                      <span className={`${colors.primary} text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-white/20 uppercase tracking-widest`}>{t.newMsgLabel}</span>
                    </div>
                  )}
                  {showDateBadge && (
                    <div className="flex justify-center my-6">
                      <span className={`text-[10px] font-bold px-4 py-1.5 rounded-full ${colors.dateBadge} shadow-sm uppercase tracking-widest`}>{dateLabel}</span>
                    </div>
                  )}

                  <div id={`msg-${msg.id}`} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} relative py-1`}>
                    <div 
                      className={`flex items-end max-w-[85%] md:max-w-[70%] z-10 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      onClick={() => showToast(t.clickBubbleNotice)}
                      onDoubleClick={(e) => { e.stopPropagation(); setContextMsg(globalMessages.find(m => m.id === msg.id) || msg); }}
                      onTouchStart={(e) => handlePressStart(e, msg)} 
                      onTouchMove={(e) => handlePressMove(e, msg, isMe)} 
                      onTouchEnd={() => handlePressEnd(msg)}
                    >
                      {(() => {
                        const isSticker = msg.media_files?.[0]?.type === 'sticker';
                        
                        return (
                          <div className={`chat-bubble-core relative flex flex-col shadow-lg cursor-pointer transition-all duration-300 backdrop-blur-md
                            ${isSticker 
                               ? 'p-0 bg-transparent shadow-none border-none' 
                               : `p-3.5 px-5 text-[15px] font-medium rounded-[1.5rem] ${isMe ? 'rounded-tr-sm ' + colors.bubbleMe : 'rounded-tl-sm ' + colors.bubbleThem}`
                            }`}
                          >
                            
                            {repliedMsg && (
                              <div 
                                onClick={(e) => { e.stopPropagation(); scrollToMessage(repliedMsg.id); }}
                                className={`p-3 mb-3 rounded-xl text-[13px] relative overflow-hidden backdrop-blur-xl shadow-inner border cursor-pointer hover:opacity-80 transition-opacity ${isMe ? colors.bubbleReplyMe : colors.bubbleReplyThem}`}
                              >
                                <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
                                  <Icons.Reply className="w-4 h-4" />
                                  <span className="font-extrabold text-[10px] uppercase tracking-widest">{getSenderName(repliedMsg.sender_id)}</span>
                                </div>
                                <div className="opacity-80 pl-3 border-l-[3px] border-current ml-1 flex items-center font-medium">
                                   {repliedMsg.media_files?.[0]?.type === 'sticker' ? (
                                     <img src={repliedMsg.media_files[0].url} className="h-12 w-auto object-contain drop-shadow-md" alt="Stiker" />
                                   ) : repliedMsg.media_files?.[0]?.type === 'image' ? (
                                     <span className="flex items-center gap-2 italic"><Icons.Palette className="w-3.5 h-3.5" /> Foto Media</span>
                                   ) : (
                                     <span className="line-clamp-2">{repliedMsg.content || 'Media File'}</span>
                                   )}
                                </div>
                              </div>
                            )}

                            {activeChat.type === 'group' && !isMe && !isSticker && (
                              <span className="text-[11px] font-black mb-1.5 block tracking-wider uppercase" style={{ color: getRoleColor(msg.sender_id) }}>
                                 {getSenderName(msg.sender_id)}
                                 {activeChat.admin_id === msg.sender_id && <span className="ml-2 px-2 py-0.5 bg-black/10 dark:bg-white/10 rounded-md text-[9px] uppercase tracking-widest text-current border border-current/20">Admin</span>}
                              </span>
                            )}

                            {msg.media_files && msg.media_files.length > 0 && (
                              <div className={`grid gap-1.5 ${msg.media_files.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} ${isSticker ? '' : 'mt-1 mb-2'}`}>
                                {msg.media_files.map((file, idx) => {
                                  if (file.type === 'document') {
                                    return (
                                      <button key={idx} onClick={(e) => { e.stopPropagation(); forceDownload(file.url, file.name); }} className="flex items-center gap-3 p-3 rounded-xl bg-black/10 dark:bg-black/40 border border-white/10 w-full text-left hover:bg-black/20 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-[#78C951] text-[#0A140F] flex items-center justify-center shrink-0 shadow-md"><Icons.File /></div>
                                        <span className="truncate text-sm font-bold">{file.name}</span>
                                      </button>
                                    )
                                  }
                                  if (file.type === 'sticker') {
  // Tambahkan mb-4 (margin-bottom) agar ada ruang untuk teks waktu di bawahnya
  return <img key={idx} src={file.url} className="object-contain w-36 h-36 md:w-48 md:h-48 drop-shadow-2xl mb-4" alt="Stiker" />
}
                                  return (
                                    <div key={idx} className="relative rounded-xl overflow-hidden border border-white/10 bg-black/20 shadow-inner">
                                      {file.type === 'image' && (
                                        <>
                                          <img src={file.url} className="object-cover w-full h-48" />
                                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                             <span className="bg-black/60 text-white px-4 py-1.5 rounded-full text-[10px] font-black backdrop-blur-md shadow-lg uppercase tracking-widest border border-white/20">FOTO</span>
                                          </div>
                                        </>
                                      )}
                                      {file.type === 'video' && (
                                        <>
                                          <video src={file.url} className="object-cover w-full h-48" />
                                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                             <span className="bg-black/60 text-white px-4 py-1.5 rounded-full text-[10px] font-black backdrop-blur-md shadow-lg uppercase tracking-widest border border-white/20">VIDEO</span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}

                            {!isSticker && msg.content && (
                               <p className="break-words whitespace-pre-wrap leading-relaxed tracking-wide">{msg.content}</p>
                            )}

                            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest self-end shrink-0 pt-2 ml-4 
  ${isSticker 
      ? 'bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full absolute -bottom-3 right-0 border border-white/10 z-10' 
      : 'opacity-60 float-right -mb-1'}`}
>
                              {msg.is_edited && <span className="italic mr-1">edited</span>}
                              <span>{timeString}</span>
                              {isMe && <span className={isSticker ? 'text-[#78C951]' : 'text-current'}>{msg.is_read ? <Icons.DoubleCheck className="w-4 h-4" /> : <Icons.Check className="w-4 h-4" />}</span>}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </Fragment>
              )
            })}

            {pendingMessages.map((msg) => (
              <div key={msg.id} className="flex w-full justify-end py-1 opacity-50 grayscale transition-all duration-300">
                <div className={`flex items-end max-w-[85%] md:max-w-[70%] flex-row-reverse`}>
                  <div className={`relative flex flex-col p-3.5 px-5 text-[15px] font-medium shadow-lg rounded-[1.5rem] rounded-tr-sm ${colors.bubbleMe}`}>
                    {msg.reply_to_id && (
                      <div className="p-3 mb-2 rounded-xl bg-black/10 border-l-[3px] border-current">
                         <p className="text-[10px] font-bold uppercase tracking-widest">{t.replying}</p>
                      </div>
                    )}
                    <p className="leading-relaxed break-words whitespace-pre-wrap tracking-wide">{msg.content}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold self-end pt-2 -mb-1 ml-4"><Icons.Clock className="w-3.5 h-3.5" /></div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-6" />
          </div>

          {!isAtBottom && unreadCount > 0 && (
            <button onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })} className={`absolute bottom-6 right-6 ${colors.primary} w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 border border-white/20`}>
              <Icons.ArrowLeft className="-rotate-90 w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-[#0A140F] shadow-sm">{unreadCount}</span>
            </button>
          )}
        </div>

        {/* INPUT AREA MODERN SPATIAL */}
        <div className={`p-3 md:p-5 flex flex-col ${colors.panel} border-t ${colors.border} shrink-0 z-20 backdrop-blur-2xl`}>
          {editingMsg && (
            <div className="flex justify-between items-start bg-black/10 dark:bg-white/5 rounded-2xl p-3 mx-2 mb-3 border-l-4 border-[#0C8F5B] dark:border-[#78C951]">
              <div className="flex-1 min-w-0 pr-2">
                <p className={`text-[10px] font-black uppercase tracking-widest text-[#0C8F5B] dark:text-[#78C951] mb-1`}>{t.edit}</p>
                {/* Tambahkan break-all dan line-clamp-2 agar rapi */}
                <p className="text-sm font-medium opacity-80 line-clamp-2 break-words">{editingMsg.content}</p>
              </div>
              <button onClick={() => { setEditingMsg(null); setInputMessage(''); }} className="p-1 opacity-50 hover:opacity-100 transition-opacity shrink-0"><Icons.Plus className="rotate-45 w-5 h-5" /></button>
            </div>
          )}
          
          {replyingTo && (
            <div className="flex justify-between items-start bg-black/10 dark:bg-white/5 rounded-2xl p-3 mx-2 mb-3 border-l-4 border-[#0C8F5B] dark:border-[#78C951]">
              <div className="flex-1 min-w-0 pr-2">
                <p className={`text-[10px] font-black uppercase tracking-widest text-[#0C8F5B] dark:text-[#78C951] mb-1`}>
                  {t.reply} {getSenderName(replyingTo.sender_id)}
                </p>
                
                <div className="text-sm font-medium opacity-80">
                   {/* Logika line-clamp untuk memotong teks & break-words untuk kata panjang tanpa spasi */}
                   <p className={`${!isReplyExpanded ? 'line-clamp-2' : ''} break-words whitespace-pre-wrap`}>
                     {replyingTo.content || 'Media File'}
                   </p>
                   
                   {/* Munculkan tombol jika panjang karakter lebih dari 80 */}
                   {replyingTo.content && replyingTo.content.length > 80 && (
                     <button 
                       type="button"
                       onClick={() => setIsReplyExpanded(!isReplyExpanded)}
                       className="text-[10px] font-bold text-[#0C8F5B] dark:text-[#78C951] mt-1 hover:underline cursor-pointer"
                     >
                       {isReplyExpanded ? 'Sembunyikan' : 'Baca selengkapnya...'}
                     </button>
                   )}
                </div>
              </div>
              
              <button onClick={() => setReplyingTo(null)} className="p-1 opacity-50 hover:opacity-100 transition-opacity shrink-0">
                <Icons.Plus className="rotate-45 w-5 h-5" />
              </button>
            </div>
          )}
          {stagedFiles.length > 0 && (
            <div className="flex gap-3 overflow-x-auto p-2 mx-2 mb-3 scrollbar-hide">
               {stagedFiles.map((sf, idx) => (
                  <div key={idx} className="relative w-20 h-20 shrink-0 rounded-2xl bg-black/20 overflow-hidden shadow-inner border border-white/10">
                     {sf.type === 'image' ? <img src={sf.previewUrl} className="w-full h-full object-cover" /> : sf.type === 'video' ? <video src={sf.previewUrl} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-[10px] font-bold"><Icons.File className="w-6 h-6 mb-1" /></div>}
                     <button type="button" onClick={() => setStagedFiles(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md text-white rounded-full p-1.5 shadow-md"><Icons.Plus className="w-3 h-3 rotate-45" /></button>
                  </div>
               ))}
            </div>
          )}
          {showFavStickers && (
  <div className="flex gap-3 overflow-x-auto p-3 mx-2 mb-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-white/10 scrollbar-hide">
    {favoriteStickers.length === 0 ? (
       <p className="text-xs text-gray-500 font-bold p-2 w-full text-center">Belum ada stiker favorit. Tahan stiker teman lalu simpan!</p>
    ) : (
       favoriteStickers.map((url, idx) => (
         <div key={idx} className="relative group shrink-0">
           {/* Mengirim stiker saat diklik */}
           <img 
             src={url} 
             onClick={async () => {
                const tempId = `temp-${Date.now()}`;
                const payload = { sender_id: String(myProfile.chat_id), receiver_id: String(activeChat.contact_id), content: '', is_read: false, reply_to_id: replyingTo?.id || null, media_files: [{ url, type: 'sticker', name: 'fav_sticker.webp' }], created_at: new Date().toISOString() };
                setGlobalMessages(prev => [...prev, { ...payload, id: tempId }]); 
                setShowFavStickers(false);
                setReplyingTo(null);
                
                const { error } = await supabase.from('messages').insert([payload]);
                if (error) { showToast("Gagal mengirim stiker."); }
                setGlobalMessages(prev => prev.filter(m => m.id !== tempId));
             }} 
             className="w-16 h-16 object-contain cursor-pointer hover:scale-110 transition-transform drop-shadow-md" alt="Fav" 
           />
           {/* Tombol Hapus dari Favorit */}
           <button onClick={async (e) => {
   e.stopPropagation();
   try {
     const newFavs = favoriteStickers.filter(u => u !== url);
     
     // Update UI Instan
     setFavoriteStickers(newFavs);
     if (setMyProfile) {
        setMyProfile(prev => ({ ...prev, favorite_stickers: newFavs }));
     }
     
     // Hapus dari DB
     const { data, error } = await supabase
        .from('profiles')
        .update({ favorite_stickers: newFavs })
        .eq('id', myProfile.id)
        .select();
        
     if (error) {
        alert("Gagal menghapus dari database: " + error.message);
        setFavoriteStickers(favoriteStickers);
     } else if (!data || data.length === 0) {
        alert("Gagal menghapus! ID Profil tidak ditemukan.");
     }
   } catch (err) {
     alert("Error Sistem: " + err.message);
   }
}} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity cursor-pointer">
  <Icons.Plus className="w-3 h-3 rotate-45" />
</button>
         </div>
       ))
    )}
  </div>
)}

          <form onSubmit={handleSendMessage} className="flex gap-2 items-end px-1">
            <input type="file" multiple ref={mediaInputRef} onChange={handleSendMedia} className="hidden" />
            
            {/* KOTAK INPUT TERPADU (Semua Ikon di dalam satu gelembung) */}
            <div className={`flex-1 ${colors.inputBg} rounded-[1.5rem] min-h-[50px] md:min-h-[56px] flex items-center shadow-inner border ${colors.border} transition-all py-1 px-1.5 md:px-2 focus-within:border-[#0C8F5B] dark:focus-within:border-[#78C951] focus-within:ring-1 focus-within:ring-[#0C8F5B] dark:focus-within:ring-[#78C951]`}>
              
              {/* Tombol Pembuat Stiker (Kiri) */}
              <button 
                type="button" 
                onClick={() => setIsStickerMakerOpen(true)} 
                className={`p-2 rounded-full ${colors.textMuted} hover:bg-black/5 dark:hover:bg-white/5 hover:text-current transition-all shrink-0`}
              >
                <Icons.Sticker className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Tombol Laci Favorit (Kiri) */}
              <button 
                type="button" 
                onClick={() => setShowFavStickers(!showFavStickers)} 
                className={`p-2 rounded-full ${showFavStickers ? 'text-yellow-500' : colors.textMuted} hover:bg-black/5 dark:hover:bg-white/5 transition-all shrink-0`}
              >
                <Icons.Star className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Area Ketik Pesan */}
              <textarea 
                rows={1} value={inputMessage} onChange={handleTyping} 
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                placeholder={isUploading ? 'Menyiapkan Transmisi...' : t.typeMsg} 
                className={`w-full bg-transparent px-2 py-2.5 text-[14px] md:text-[15px] font-medium outline-none resize-none max-h-[120px] overflow-y-auto ${colors.text} placeholder-gray-400 dark:placeholder-[#3D5A4C]`} 
              />
              
              {/* Tombol Kirim Dokumen/File (Kanan Dalam) */}
              <button 
                type="button" 
                disabled={isUploading} 
                onClick={() => mediaInputRef.current.click()} 
                className={`p-2 rounded-full ${colors.textMuted} hover:bg-black/5 dark:hover:bg-white/5 hover:text-current transition-all shrink-0`}
              >
                <Icons.Attach className="w-5 h-5 md:w-6 md:h-6 rotate-[-45deg]" />
              </button>
            </div>
            
            {/* TOMBOL KIRIM PESAN (Bulat di luar) */}
            <button 
              type="submit" 
              disabled={(!inputMessage.trim() && stagedFiles.length === 0) || isUploading} 
              className={`w-[50px] h-[50px] md:w-[56px] md:h-[56px] flex items-center justify-center rounded-[1.5rem] ${colors.primary} shrink-0 shadow-lg transition-all ${((!inputMessage.trim() && stagedFiles.length === 0) || isUploading) ? 'opacity-50 grayscale scale-95' : 'hover:scale-105 active:scale-95'}`}
            >
              {isUploading 
                 ? <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div> 
                 : <Icons.Send className="w-5 h-5 md:w-6 md:h-6 ml-1" />
              }
            </button>
          </form>
        </div>

        {previewMedia && (
          <div className="fixed inset-0 z-[400] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setPreviewMedia(null)}>
            <button onClick={() => setPreviewMedia(null)} className="absolute top-6 right-6 p-3 text-white bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md transition-all z-50 shadow-lg border border-white/20">
              <Icons.Plus className="rotate-45 w-6 h-6" />
            </button>
            {previewMedia.type === 'image' && <img src={previewMedia.url} onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-[90vw] object-contain rounded-[2rem] shadow-2xl border border-white/10" alt="Preview" />}
            {previewMedia.type === 'video' && <video src={previewMedia.url} controls autoPlay onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-[90vw] object-contain rounded-[2rem] shadow-2xl border border-white/10" />}
          </div>
        )}

        {toastMessage && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full shadow-2xl border border-white/20 dark:border-gray-900/20 z-[9999] animate-in fade-in slide-in-from-top-4 backdrop-blur-md">
            {toastMessage}
          </div>
        )}

        <StickerMaker 
          isOpen={isStickerMakerOpen} 
          onClose={() => setIsStickerMakerOpen(false)} 
          colors={colors}
          onSendSticker={handleSendSticker}
        />
        
      </div>

      {/* SIDEBAR INFO KONTAK (Tampil penuh di Mobile, Sidebar di Desktop) */}
      {showContactInfo && (
        <div className={`w-full md:w-[380px] h-full flex flex-col ${colors.panel} border-l ${colors.border} z-30 animate-in slide-in-from-right absolute md:relative top-0 right-0 backdrop-blur-3xl transition-colors duration-500`}>
           <div className={`h-[76px] md:h-[86px] flex items-center gap-4 px-6 border-b ${colors.border} shrink-0 bg-transparent`}>
              <button onClick={() => setShowContactInfo(false)} className={`p-3 rounded-xl border ${colors.border} ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
              <h2 className="font-bold text-lg tracking-tight">{activeChat.type === 'group' ? t.groupInfo : t.contactInfo}</h2>
           </div>
           
           <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide">
             
             {activeChat.type === 'group' ? (
               <div className="flex flex-col items-center p-8 border-b border-gray-200 dark:border-[#313d45]">
                  <div className="relative group mb-6">
                    <div className={`w-36 h-36 rounded-full bg-gradient-to-br from-[#0C8F5B] to-[#096642] dark:from-[#78C951] dark:to-[#0C8F5B] flex items-center justify-center text-[#0A140F] font-black text-5xl shadow-2xl border-[6px] border-white/10 dark:border-[#0A140F] overflow-hidden`}>
                       {activeChat.avatar_url ? <img src={activeChat.avatar_url} className="w-full h-full object-cover" /> : activeChat.contact_username.charAt(0).toUpperCase()}
                    </div>
                    {activeChat.admin_id === myProfile.chat_id && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-[6px] border-transparent" onClick={() => document.getElementById('groupPPInput').click()}>
                          <span className="text-[10px] font-black text-white text-center px-2 uppercase tracking-widest">{t.changeGroupPP}</span>
                        </div>
                        <input type="file" id="groupPPInput" accept="image/*" className="hidden" onChange={async (e) => { 
  const file = e.target.files[0]; if (!file) return;
  const fileExt = file.name.split('.').pop();
  const filePath = `groups/${activeChat.contact_id}_${Date.now()}.${fileExt}`;
  
  // Tambahkan UI Loading jika diperlukan (opsional)
  const { error } = await supabase.storage.from('avatars').upload(filePath, file);
  
  if (!error) {
    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    
    // 1. Update ke Database
    await supabase.from('groups').update({ avatar_url: data.publicUrl }).eq('id', activeChat.contact_id);
    
    // 2. Update state ruang chat yang sedang terbuka
    setActiveChat({ ...activeChat, avatar_url: data.publicUrl });
    
    // 3. Update state global list grup agar sidebar ikut berubah seketika
    if (setGroups) {
       setGroups(prevGroups => prevGroups.map(g => g.id === activeChat.contact_id ? { ...g, avatar_url: data.publicUrl } : g));
    }
  } else {
    alert("Gagal mengunggah foto grup!");
  }
}} />
                      </>
                    )}
                  </div>

                  <h2 className="text-2xl font-black mb-1.5 text-center tracking-tight">{activeChat.contact_username}</h2>
                  <p className={`text-xs font-bold uppercase tracking-widest ${colors.textMuted} mb-6 text-center`}>ID Grup: {activeChat.contact_id}</p>
                  
                  <button onClick={() => {
                    handleCopyText(activeChat.contact_id);
                    showToast(t.idCopied);
                  }} className={`px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-3 mb-8 shadow-sm w-full max-w-[220px] transition-all ${colors.inputBg} border ${colors.border} hover:border-[#78C951]`}>
                    <Icons.Copy className="w-4 h-4" /> {t.copyGroupId}
                  </button>
                  
                  {activeChat.admin_id === myProfile.chat_id && (
                    <button onClick={async () => { 
  try {
    const newFavs = !isFavorited 
       ? [stickerUrl, ...favoriteStickers] 
       : favoriteStickers.filter(u => u !== stickerUrl);
    
    // 1. Update UI secara Instan
    setFavoriteStickers(newFavs);
    if (setMyProfile) {
       setMyProfile(prev => ({ ...prev, favorite_stickers: newFavs }));
    }
    setContextMsg(null); 
    
    // 2. Simpan ke DB (Gunakan myProfile.id dan .select() untuk memaksa balasan dari server)
    const { data, error } = await supabase
       .from('profiles')
       .update({ favorite_stickers: newFavs })
       .eq('id', myProfile.id)
       .select();
       
    // 3. Sistem Deteksi Error Akurat
    if (error) {
       alert("Error Database: " + error.message);
       // Kembalikan UI jika gagal
       setFavoriteStickers(favoriteStickers); 
    } else if (!data || data.length === 0) {
       alert("Gagal Menyimpan! ID Profil tidak cocok di database.");
       setFavoriteStickers(favoriteStickers);
    } else {
       showToast(!isFavorited ? "Stiker berhasil ditambahkan ke Favorit! ⭐" : "Stiker dihapus dari Favorit.");
    }
  } catch (err) {
    alert("Error Sistem React: " + err.message);
  }
}} className={`px-5 py-4 font-bold text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>
  {isFavorited ? 'Hapus dari Favorit' : 'Tambah ke Favorit'} 
  {isFavorited ? <Icons.StarSolid className="text-yellow-400 drop-shadow-md w-5 h-5" /> : <Icons.Star className="w-5 h-5" />}
</button>
                  )}

                  {activeChat.admin_id === myProfile.chat_id ? (
                    <button onClick={handleDisbandGroup} className={`w-full p-5 rounded-[1.5rem] flex items-center justify-between font-bold text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all shadow-sm`}>
                      <span className="tracking-wide">{t.disbandGroup}</span>
                      <Icons.Trash className="w-6 h-6" />
                    </button>
                  ) : (
                    <button onClick={handleLeaveGroup} className={`w-full p-5 rounded-[1.5rem] flex items-center justify-between font-bold text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all shadow-sm`}>
                      <span className="tracking-wide">{t.leaveGroup}</span>
                      <Icons.ArrowLeft className="w-6 h-6 rotate-180" />
                    </button>
                  )}

                  <div className="mt-10 w-full text-left">
                    <h3 className="font-bold text-[10px] mb-4 px-2 text-gray-500 uppercase tracking-widest">Anggota ({groupMembers.length})</h3>
                    <div className="space-y-2">
                      {groupMembers.map(member => (
                         <div key={member.chat_id} className={`flex items-center gap-4 p-4 rounded-[1.5rem] ${colors.inputBg} border ${colors.border} hover:border-[#0C8F5B] dark:hover:border-[#78C951] transition-all shadow-sm`}>
                            <Avatar url={member.avatar_url} name={member.username} size="w-12 h-12" className="shadow-sm" />
                            <div className="flex-1 min-w-0">
                               <p className="font-bold text-base truncate tracking-tight">{member.username}</p>
                               <p className={`text-[11px] font-medium mt-0.5 ${colors.textMuted} truncate`}>{member.bio || 'Available'}</p>
                            </div>
                            {activeChat.admin_id === member.chat_id && (
                               <span className={`text-[9px] ${colors.primary} font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm`}>Admin</span>
                            )}
                         </div>
                      ))}
                    </div>
                  </div>
               </div>
             ) : (
               <>
                 <div className="flex flex-col items-center p-8 md:p-12 border-b border-gray-200 dark:border-white/10">
                    <Avatar url={activeChat.avatar_url} name={activeChat.contact_username} size="w-36 h-36" className="mb-6 shadow-2xl border-[6px] border-gray-100 dark:border-[#0A140F]" />
                    <h2 className="text-3xl font-black mb-1.5 tracking-tight text-center">{activeChat.contact_username}</h2>
                    <p className={`text-xs font-bold uppercase tracking-widest ${colors.textMuted} mb-6 text-center`}>ID: {activeChat.contact_id}</p>
                    
                    <div className={`w-full max-w-[280px] overflow-hidden text-center relative group p-4 rounded-2xl border ${colors.border} ${colors.inputBg} shadow-inner`}>
                       <style>{`
                         @keyframes marquee-with-pause {
                           0%, 15% { transform: translateX(0); }
                           45%, 65% { transform: translateX(calc(-100% + 240px)); }
                           85%, 100% { transform: translateX(0); }
                         }
                         .animate-marquee-custom {
                           display: inline-block;
                           white-space: nowrap;
                           animation: marquee-with-pause 10s ease-in-out infinite;
                         }
                       `}</style>
                       <div className={`text-[15px] font-medium ${colors.text} ${(activeChat.bio?.length > 30) ? 'animate-marquee-custom' : ''}`}>
                         {activeChat.bio || 'Available'}
                       </div>
                    </div>
                 </div>
                 
                 <div className={`p-6 space-y-4`}>
                    <button onClick={() => alert("Fitur Telepon belum tersedia!")} className={`w-full p-5 rounded-[1.5rem] flex items-center justify-between font-bold ${colors.hoverBg} border ${colors.border} transition-colors shadow-sm`}>
                      <span className="tracking-wide">Hubungi</span>
                      <div className={`text-[#0C8F5B] dark:text-[#78C951] bg-[#0C8F5B]/10 dark:bg-[#78C951]/10 p-2.5 rounded-xl`}><Icons.Chat className="w-5 h-5" /></div>
                    </button>
                    
                    <button onClick={() => openConfirm("Hapus Kontak", `Yakin ingin menghapus ${activeChat.contact_username}? Data obrolan akan hilang permanen.`, async () => {
                       await supabase.from('contacts').delete().eq('contact_id', activeChat.contact_id).eq('user_id', session.user.id);
                       await supabase.from('messages').delete().or(`and(sender_id.eq.${myProfile.chat_id},receiver_id.eq.${activeChat.contact_id}),and(sender_id.eq.${activeChat.contact_id},receiver_id.eq.${myProfile.chat_id})`);
                       setContacts(prev => prev.filter(c => c.contact_id !== activeChat.contact_id));
                       setActiveChat(null);
                    })} className={`w-full p-5 rounded-[1.5rem] flex items-center justify-between font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 border ${colors.border} transition-colors shadow-sm`}>
                      <span className="tracking-wide">Hapus Kontak</span>
                      <div className="bg-red-500/10 p-2.5 rounded-xl"><Icons.Trash className="w-5 h-5 text-red-500" /></div>
                    </button>
                 </div>
               </>
             )}
             
           </div>
        </div>
      )}
    </div>
  )
}
