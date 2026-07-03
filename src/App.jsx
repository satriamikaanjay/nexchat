import { useState, useEffect, useRef, Fragment } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import { Capacitor } from '@capacitor/core';
import myIcon from '../public/favicon.svg';
import StickerMaker from './StickerMaker';
import DeleteAccountModal from './DeleteAccountModal';
import GroupManager from './GroupManager';

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
  Edit: (props) => <svg {...props} width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
}

const Avatar = ({ url, name, size = 'w-10 h-10', className = '' }) => (
  url ? (
    <img src={url} alt={name} className={`${size} rounded-full object-cover shrink-0 border border-gray-200 bg-white transition-all duration-500 ease-out hover:scale-105 ${className}`} />
  ) : (
    <div className={`${size} rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shrink-0 shadow-sm text-sm md:text-base ${className}`}>
      {name?.charAt(0).toUpperCase() || '?'}
    </div>
  )
)

const Modal = ({ isOpen, onClose, title, children, colors }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`${colors.panel} border ${colors.border} rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transform transition-transform`}>
        <div className={`p-4 border-b ${colors.border} flex justify-between items-center ${colors.base}`}>
          <h3 className={`font-bold text-lg ${colors.text}`}>{title}</h3>
          <button onClick={onClose} className={`p-1.5 rounded-full ${colors.hoverBg} transition-colors`}><Icons.Plus className="rotate-45 w-5 h-5" /></button>
        </div>
        <div className={`p-5 flex-1 ${colors.panel} ${colors.text}`}>{children}</div>
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

// ================= TEMA UI MODERN (DENGAN KONTRAST TINGGI) =================
const getTheme = (name) => {
  if (name === 'light') {
    return { 
      base: 'bg-[#f0f2f5]', 
      panel: 'bg-white', 
      border: 'border-gray-200', 
      text: 'text-gray-900', 
      textMuted: 'text-gray-500', 
      primary: 'bg-[#00a884] text-white hover:bg-[#008f6f]', 
      bubbleMe: 'bg-[#dcf8c6] text-gray-900 shadow-sm', 
      bubbleThem: 'bg-white text-gray-900 shadow-sm border border-gray-100', 
      inputBg: 'bg-white',
      hoverBg: 'hover:bg-gray-100',
      danger: 'text-red-500 hover:bg-red-50',
      bubbleReplyMe: 'bg-white/40 border-white/60 text-gray-900',
      bubbleReplyThem: 'bg-black/5 border-black/10 text-gray-900',
      warningBg: 'bg-yellow-100/90',
      warningText: 'text-yellow-800',
      dateBadge: 'bg-white text-gray-600 border border-gray-200',
    }
  }
  return { 
    base: 'bg-[#111b21]', 
    panel: 'bg-[#202c33]', 
    border: 'border-[#313d45]', 
    text: 'text-[#e9edef]', 
    textMuted: 'text-[#8696a0]', 
    primary: 'bg-[#00a884] text-white hover:bg-[#008f6f]', 
    bubbleMe: 'bg-[#005c4b] text-[#e9edef] shadow-sm', 
    bubbleThem: 'bg-[#202c33] text-[#e9edef] shadow-sm border border-[#313d45]', 
    inputBg: 'bg-[#2a3942]',
    hoverBg: 'hover:bg-[#2a3942]',
    danger: 'text-red-400 hover:bg-[#3b2a2a]',
    bubbleReplyMe: 'bg-black/20 border-black/40 text-[#e9edef]',
    bubbleReplyThem: 'bg-white/5 border-white/10 text-[#e9edef]',
    warningBg: 'bg-yellow-900/60',
    warningText: 'text-yellow-400',
    dateBadge: 'bg-[#202c33] text-[#8696a0] border border-[#313d45]',
  }
}



// ================= CUSTOM MODAL COMPONENT =================
const CustomModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#222e35] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-scale-up">
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
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    if (data) setMyProfile(data)
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); if (session) fetchMyProfile(session.user.id); else setLoading(false) })
    supabase.auth.onAuthStateChange((_event, session) => { setSession(session); if (session) fetchMyProfile(session.user.id) })
  }, [])

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-bold tracking-widest text-xl animate-pulse">Memuat...</div>
  if (!session || !myProfile) return <Auth onLoginSuccess={(user) => fetchMyProfile(user.id)} />

  return <MainApp session={session} myProfile={myProfile} setMyProfile={setMyProfile} />
}

function MainApp({ session, myProfile, setMyProfile }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [themeName, setThemeName] = useState(localStorage.getItem('app_theme') || 'light')
  const [language, setLanguage] = useState(localStorage.getItem('app_lang') || 'id')
  
  const [activeMenu, setActiveMenu] = useState('chat') 
  const [activeChat, setActiveChat] = useState(null) 
  
  const [globalMessages, setGlobalMessages] = useState([])
  const [contacts, setContacts] = useState([])
  const [groups, setGroups] = useState([])

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
    const saved = localStorage.getItem(`tasks_${session.user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === todayDate) return parsed;
    }
    return initialTaskState;
  });

  const [points, setPoints] = useState(() => parseInt(localStorage.getItem(`points_${session.user.id}`) || '0'));

  useEffect(() => {
    localStorage.setItem(`tasks_${session.user.id}`, JSON.stringify(taskData));
    localStorage.setItem(`points_${session.user.id}`, points.toString());
  }, [taskData, points, session.user.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaskData(prev => {
        if (prev.onlineMinutes < 5) return { ...prev, onlineMinutes: prev.onlineMinutes + 1 };
        return prev;
      });
    }, 60000); 
    return () => clearInterval(interval);
  }, []);

  const claimTask = (taskKey) => {
    setTaskData(prev => ({ ...prev, [taskKey]: true }));
    setPoints(prev => prev + 5);
  };
  // ========================================================
  
  const [confirmDialog, setConfirmDialog] = useState({ 
    isOpen: false, title: '', message: '', onConfirm: null, isAlertOnly: false 
  })

  const [inAppNotif, setInAppNotif] = useState(null);
  const prevMessagesLength = useRef(globalMessages.length);

  useEffect(() => {
    // Mengecek apakah ada pesan baru yang masuk ke globalMessages
    if (globalMessages.length > prevMessagesLength.current) {
      const latestMsg = globalMessages[globalMessages.length - 1];
      const isGroup = latestMsg.receiver_id?.startsWith('grp_');
      const chatContextId = isGroup ? latestMsg.receiver_id : latestMsg.sender_id;

      // Jangan munculkan notif jika: 
      // 1. Pesan dikirim oleh diri sendiri
      // 2. Kita sedang membuka obrolan dengan pengirim tersebut
      if (latestMsg.sender_id !== myProfile.chat_id && activeChat?.contact_id !== chatContextId) {
        
        let titleText = isGroup ? 'Pesan Grup Baru' : 'Pesan Baru';
        let senderName = latestMsg.sender_id;

        // Ambil data nama untuk UI Notif
        if (isGroup) {
           const g = groups.find(x => x.id === latestMsg.receiver_id);
           if (g) titleText = `Grup: ${g.name}`;
           const c = contacts.find(x => x.contact_id === latestMsg.sender_id);
           senderName = c ? c.contact_username : latestMsg.sender_id;
        } else {
           const c = contacts.find(x => x.contact_id === latestMsg.sender_id);
           if (c) titleText = c.contact_username;
        }

        const notifData = {
          id: latestMsg.id,
          contact_id: chatContextId, // ID obrolan yang akan dibuka saat diklik
          isGroup: isGroup,
          title: titleText,
          senderName: senderName,
          content: latestMsg.content || 'Mengirim media/stiker',
        };

        setInAppNotif(notifData);

        // Auto hilang dalam 5 detik
        setTimeout(() => {
           setInAppNotif(prev => (prev?.id === latestMsg.id ? null : prev));
        }, 5000);
      }
    }
    prevMessagesLength.current = globalMessages.length;
  }, [globalMessages, activeChat, groups, contacts, myProfile.chat_id]);
  
  const openConfirm = (title, message, onConfirm, isAlertOnly = false) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm, isAlertOnly })
  }

  const colors = getTheme(themeName)
  const t = dict[language]

  const handleSwitchChat = (chat) => {
    setActiveChat(chat);
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
      const { data } = await supabase.from('profiles').select('*').or(`chat_id.eq.${searchInput},username.ilike.%${searchInput}%`).neq('chat_id', myProfile.chat_id).limit(10)
      if (data) { setSearchResults(data) }
      setIsSearching(false)
    }, 500) 
    return () => clearTimeout(timer)
  }, [searchInput, myProfile.chat_id])

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!homeSearch.trim()) { setHomeSearchResults([]); return }
      setIsHomeSearching(true)
      const { data } = await supabase.from('profiles').select('*').or(`chat_id.eq.${homeSearch},username.ilike.%${homeSearch}%`).neq('chat_id', myProfile.chat_id).limit(15)
      if (data) setHomeSearchResults(data)
      setIsHomeSearching(false)
    }, 500) 
    return () => clearTimeout(timer)
  }, [homeSearch, myProfile.chat_id])

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
    const channel = supabase.channel('global-chat-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        if (blockedIds.includes(msg.sender_id)) return;
        setHiddenIds(prev => prev.includes(msg.sender_id) ? prev.filter(id => id !== msg.sender_id) : prev);
        setGlobalMessages((prev) => [...prev, msg]);
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
    const existingContact = contacts.find(c => c.contact_id === friendProfile.chat_id)
    if (existingContact) {
      setActiveChat({ ...existingContact, type: 'personal' })
    } else {
      const { data } = await supabase.from('contacts').insert([{ user_id: session.user.id, contact_id: friendProfile.chat_id, contact_username: friendProfile.username, cleared_at: '1970-01-01' }]).select().single()
      if (data) { 
        const newContact = { ...data, avatar_url: friendProfile.avatar_url };
        setContacts([newContact, ...contacts]); 
        setActiveChat({ ...newContact, type: 'personal' })
      } else {
        setActiveChat({ contact_id: friendProfile.chat_id, contact_username: friendProfile.username, avatar_url: friendProfile.avatar_url, type: 'personal', cleared_at: '1970-01-01' })
      }
    }
    setIsAddContactOpen(false); setSearchInput(''); setSearchResults([]); setHomeSearch(''); setActiveMenu('chat')
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
    const { data } = await supabase.from('profiles').select('*').or(`chat_id.eq.${searchInput},username.ilike.%${searchInput}%`).neq('chat_id', myProfile.chat_id).limit(10)
    if (data) { setSearchResults(data) }
    setIsSearching(false)
  }

  {inAppNotif && (
          <div 
            onClick={() => {
               // Logika berpindah ke obrolan saat notif diklik
               if (inAppNotif.isGroup) {
                  const g = groups.find(x => x.id === inAppNotif.contact_id);
                  if (g) setActiveChat({ contact_id: g.id, contact_username: g.name, type: 'group', ...g });
               } else {
                  const c = contacts.find(x => x.contact_id === inAppNotif.contact_id);
                  if (c) {
                    setActiveChat({ ...c, type: 'personal' });
                  } else {
                    setActiveChat({ contact_id: inAppNotif.contact_id, contact_username: inAppNotif.title, type: 'personal' });
                  }
               }
               setActiveMenu('chat');
               setInAppNotif(null); // Sembunyikan notif setelah diklik
            }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-white dark:bg-[#202c33] border border-gray-200 dark:border-[#313d45] shadow-2xl rounded-2xl p-4 w-[90%] max-w-sm cursor-pointer animate-in slide-in-from-top-10 fade-in duration-300 hover:scale-105 transition-transform"
          >
            <div className="flex items-start gap-3">
               <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Icons.Chat />
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate text-gray-900 dark:text-white">{inAppNotif.title}</h4>
                  {inAppNotif.isGroup && (
                    <p className="text-[10px] font-bold text-[#00a884] mb-0.5 truncate">{inAppNotif.senderName}</p>
                  )}
                  <p className="text-xs text-gray-500 truncate">{inAppNotif.content}</p>
               </div>
               <button 
                 onClick={(e) => { e.stopPropagation(); setInAppNotif(null); }} 
                 className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
               >
                  <Icons.Plus className="w-5 h-5 rotate-45" />
               </button>
            </div>
          </div>
        )}

        

  return (
    <>
      <div translate="no" className={`flex fixed inset-0 w-full font-sans overflow-hidden ${colors.base} ${colors.text} transition-colors duration-300`}>
        
        {/* SIDEBAR MODERN */}
        <div className={`flex flex-col h-full w-full md:w-[400px] border-r ${colors.border} ${colors.panel} ${activeChat ? 'hidden md:flex' : 'flex'} shadow-xl z-10 relative transition-all`}>
          
          {isMainPage && (
            <div className={`flex items-center justify-between p-4 border-b ${colors.border} h-[70px] shrink-0 ${colors.panel} z-50`}>
                <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setActiveMenu('settings')}>
                    <Avatar url={myProfile.avatar_url} name={myProfile.username} size="w-10 h-10" />
                    <div>
                      <h1 className="font-bold text-lg leading-tight tracking-tight">NexChat</h1>
                      <p className="text-[10px] font-bold text-[#00a884]">{points} {t.points}</p>
                    </div>
                </div>
                
                <div className="relative">
                    <button onClick={(e) => { e.stopPropagation(); setIsHeaderMenuOpen(!isHeaderMenuOpen); }} className={`p-2 rounded-full ${colors.hoverBg} transition-all ${colors.textMuted}`}><Icons.MoreVertical /></button>
                    {isHeaderMenuOpen && (
                      <div className={`absolute right-0 mt-2 w-48 ${colors.panel} border ${colors.border} rounded-2xl shadow-xl z-[9999] overflow-hidden transform origin-top-right transition-all`}>
                        <button onClick={() => { setActiveMenu('about'); setIsHeaderMenuOpen(false); }} className={`w-full text-left px-5 py-3 text-sm font-medium ${colors.hoverBg} transition-colors flex items-center gap-3 border-b ${colors.border}`}>
                          <Icons.Info /> {t.about}
                        </button>
                        <button onClick={() => { setActiveMenu('settings'); setIsHeaderMenuOpen(false); }} className={`w-full text-left px-5 py-3 text-sm font-medium ${colors.hoverBg} transition-colors flex items-center gap-3`}>
                          <Icons.Settings /> {t.settings}
                        </button>
                      </div>
                    )}
                </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto relative scrollbar-hide" onClick={() => setIsHeaderMenuOpen(false)}>
            {activeMenu === 'chat' && (
               <div className="flex flex-col min-h-full">
                  <div className={`p-3 border-b ${colors.border} shrink-0`}>
                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl ${colors.inputBg} transition-all ring-1 ring-transparent focus-within:ring-[#00a884]`}>
                      <Icons.Search className="text-gray-400 w-4 h-4" />
                      <input type="text" value={homeSearch} onChange={(e) => setHomeSearch(e.target.value)} placeholder={t.search} className={`bg-transparent border-none outline-none w-full text-sm font-medium ${colors.text} placeholder-gray-400`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 p-2 space-y-1 pb-24">
                    {homeSearch.trim() ? (
                      <div className="space-y-1">
                        {isHomeSearching ? (
                          <p className="text-center text-sm text-gray-500 mt-4">Mencari...</p>
                        ) : homeSearchResults.length === 0 ? (
                          <p className="text-center text-sm text-gray-500 mt-4">{t.notFound}</p>
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
                                    {isNew && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">{t.new}</span>}
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
                                    {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                                  </div>
                                  <div className={`flex-1 min-w-0 pb-1`}>
                                    <div className="flex justify-between items-center mb-1">
                                       <h3 className={`text-base truncate ${unreadCount > 0 ? 'font-bold' : 'font-medium'}`}>{c.contact_id}</h3>
                                       {unreadCount > 0 && <div className="bg-[#00a884] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{unreadCount}</div>}
                                    </div>
                                    <p className={`text-sm truncate ${unreadCount > 0 ? 'text-[#00a884] font-medium' : colors.textMuted}`}>{unreadCount > 0 ? t.newMsgLabel : t.whoIsThis}</p>
                                  </div>
                                </div>

                                {/* TOMBOL SIMPAN & HAPUS */}
                                <div className="flex gap-2 mt-1">
                                  <button onClick={() => startChatWithUser({ chat_id: c.contact_id, username: c.contact_username, avatar_url: c.avatar_url })} className="flex-1 py-1.5 bg-[#00a884] text-white text-xs font-bold rounded-lg hover:bg-[#008f6f] transition-all shadow-sm">Simpan</button>
                                  <button onClick={() => handleDeleteUnknown(c.contact_id)} className="flex-1 py-1.5 bg-red-100 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200 transition-all shadow-sm">Hapus</button>
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
                              <div key={c.id} onClick={() => handleSwitchChat({...c, type: 'personal'})} className={`p-3 rounded-2xl cursor-pointer flex items-center gap-4 transition-colors group ${activeChat?.contact_id === c.contact_id ? colors.inputBg : colors.hoverBg}`}>
                                <div className="relative">
                                  <Avatar url={c.avatar_url} name={c.contact_username} size="w-12 h-12" />
                                  {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>}
                                </div>
                                <div className={`flex-1 min-w-0 border-b ${colors.border} pb-2`}>
                                  <div className="flex justify-between items-center mb-1">
                                     <h3 className={`text-base truncate ${unreadCount > 0 ? 'font-bold' : 'font-medium'}`}>{c.contact_username}</h3>
                                     <div className="flex gap-2 items-center">
                                        {unreadCount > 0 && <div className="bg-[#00a884] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{unreadCount}</div>}
                                     </div>
                                  </div>
                                  <p className={`text-sm truncate ${unreadCount > 0 ? 'text-[#00a884] font-medium' : colors.textMuted}`}>{unreadCount > 0 ? t.newMsgLabel : `ID: ${c.contact_id}`}</p>
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
                  setActiveChat={setActiveChat} 
                  groups={groups}
                  t={t} 
                  
                  setGroups={setGroups} 
               />
            )}
            
            {activeMenu === 'tasks' && (
               <div className={`p-4 md:p-6 min-h-full animate-in slide-in-from-right-4 ${colors.base}`}>
                  <div className="bg-[#00a884] rounded-3xl p-6 text-white shadow-lg mb-6 flex items-center justify-between">
                     <div>
                        <p className="text-sm opacity-80 mb-1">Total {t.points}</p>
                        <h2 className="text-4xl font-bold">{points}</h2>
                     </div>
                     <Icons.StarSolid className="w-16 h-16 opacity-20" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-4">{t.tasks} Harian</h3>
                  
                  <div className="space-y-4 pb-10">
                    <div className={`p-5 rounded-2xl border ${colors.border} ${colors.panel} shadow-sm flex items-center justify-between gap-4`}>
                       <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">{t.taskChat}</h4>
                          <p className="text-xs text-gray-500 mb-2">Progress: {taskData.chatProgress.length}/5</p>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-[#00a884]" style={{ width: `${Math.min((taskData.chatProgress.length/5)*100, 100)}%` }}></div></div>
                       </div>
                       <button onClick={() => claimTask('claimedChat')} disabled={taskData.chatProgress.length < 5 || taskData.claimedChat} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${taskData.claimedChat ? 'bg-gray-200 text-gray-500' : taskData.chatProgress.length >= 5 ? 'bg-[#00a884] text-white hover:scale-105' : 'bg-gray-100 text-gray-400'}`}>
                         {taskData.claimedChat ? t.claimed : t.claim}
                       </button>
                    </div>

                    <div className={`p-5 rounded-2xl border ${colors.border} ${colors.panel} shadow-sm flex items-center justify-between gap-4`}>
                       <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">{t.taskOnline}</h4>
                          <p className="text-xs text-gray-500 mb-2">Progress: {taskData.onlineMinutes}/5 mnt</p>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-[#00a884]" style={{ width: `${Math.min((taskData.onlineMinutes/5)*100, 100)}%` }}></div></div>
                       </div>
                       <button onClick={() => claimTask('claimedOnline')} disabled={taskData.onlineMinutes < 5 || taskData.claimedOnline} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${taskData.claimedOnline ? 'bg-gray-200 text-gray-500' : taskData.onlineMinutes >= 5 ? 'bg-[#00a884] text-white hover:scale-105' : 'bg-gray-100 text-gray-400'}`}>
                         {taskData.claimedOnline ? t.claimed : t.claim}
                       </button>
                    </div>

                    <div className={`p-5 rounded-2xl border ${colors.border} ${colors.panel} shadow-sm flex items-center justify-between gap-4`}>
                       <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">{t.taskShare}</h4>
                          <p className="text-xs text-gray-500 mb-2">Progress: {taskData.shareCount}/5</p>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-[#00a884]" style={{ width: `${Math.min((taskData.shareCount/5)*100, 100)}%` }}></div></div>
                       </div>
                       <button onClick={() => claimTask('claimedShare')} disabled={taskData.shareCount < 5 || taskData.claimedShare} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${taskData.claimedShare ? 'bg-gray-200 text-gray-500' : taskData.shareCount >= 5 ? 'bg-[#00a884] text-white hover:scale-105' : 'bg-gray-100 text-gray-400'}`}>
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
                 points={points} setPoints={setPoints} 
                 taskData={taskData} setTaskData={setTaskData}
                 
                 // 2. PASTIKAN BARIS INI ADA AGAR TOMBOL BISA BERFUNGSI
                 setIsDeleteModalOpen={setIsDeleteModalOpen} 
              />
            )}

            {activeMenu === 'about' && (
               <div className={`p-6 ${colors.base} min-h-full animate-in slide-in-from-right-4`}>
                   <div className="flex items-center gap-3 mb-8">
                     <button onClick={() => setActiveMenu('chat')} className={`p-2 ${colors.panel} rounded-full shadow-sm ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
                     <h2 className="text-xl font-bold">{t.about}</h2>
                   </div>
                   <div className="flex flex-col items-center mt-2 mb-8">
                     <img src={myIcon} alt="Icon" className="w-24 h-24 mb-4 drop-shadow-md" />
                     <h2 className="text-2xl font-bold tracking-tight">NexChat Modern</h2>
                     <p className="font-medium text-sm text-[#00a884] bg-green-50 px-3 py-1 rounded-full mt-2">Versi 2.0 (Beta)</p>
                   </div>
               </div>
            )}
          </div>

          {isMainPage && (
            <div className={`flex items-center justify-around px-2 border-t ${colors.border} ${colors.panel} h-[60px] shrink-0 z-20 pb-safe`}>
                <button onClick={() => setActiveMenu('chat')} className={`flex flex-col items-center justify-center w-20 h-full transition-all ${activeMenu === 'chat' ? 'text-[#00a884]' : colors.textMuted}`}>
                    <Icons.Chat />
                    <span className="text-[10px] font-medium mt-1">{t.chats}</span>
                </button>
                <button onClick={() => setActiveMenu('groups')} className={`flex flex-col items-center justify-center w-20 h-full transition-all ${activeMenu === 'groups' ? 'text-[#00a884]' : colors.textMuted}`}>
                    <Icons.Users />
                    <span className="text-[10px] font-medium mt-1">{t.groups}</span>
                </button>
                <button onClick={() => setActiveMenu('tasks')} className={`flex flex-col items-center justify-center w-20 h-full transition-all ${activeMenu === 'tasks' ? 'text-[#00a884]' : colors.textMuted}`}>
                    <Icons.Target />
                    <span className="text-[10px] font-medium mt-1">{t.tasks}</span>
                </button>
            </div>
          )}
        </div>

        <Modal isOpen={isAddContactOpen} onClose={() => {setIsAddContactOpen(false); setSearchResults([]); setSearchInput('');}} title={t.searchFind} colors={colors}>
          <form onSubmit={handleSearchContact} className="space-y-4">
            <div className="flex gap-2">
              <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Ketik ID atau Username..." className={`flex-1 p-3 rounded-xl ${colors.inputBg} border ${colors.border} focus:outline-none focus:ring-2 focus:ring-[#00a884] transition-all text-sm`} />
              <button type="submit" disabled={isSearching} className={`px-4 bg-[#00a884] hover:bg-[#008f6f] text-white rounded-xl transition-colors`}>
                 {isSearching ? '...' : <Icons.Search />}
              </button>
            </div>
          </form>
          <div className="mt-4 space-y-2 max-h-[40vh] overflow-y-auto pr-1 scrollbar-hide">
             {searchResults.length === 0 && searchInput && !isSearching && (
                <p className={`text-center text-sm ${colors.textMuted} mt-4`}>{t.notFound}</p>
             )}
             {searchResults.map(user => (
               <div key={user.chat_id} className={`flex items-center justify-between p-3 rounded-xl border ${colors.border} ${colors.hoverBg} cursor-pointer transition-colors`} onClick={() => startChatWithUser(user)}>
                 <div className="flex items-center gap-3 overflow-hidden">
                   <Avatar url={user.avatar_url} name={user.username} size="w-10 h-10" />
                   <div className="min-w-0">
                     <p className="font-bold text-sm truncate">{user.username}</p>
                     <p className={`text-[10px] ${colors.textMuted} truncate`}>{user.chat_id}</p>
                   </div>
                 </div>
                 <Icons.Chat className="text-[#00a884]" />
               </div>
             ))}
          </div>
        </Modal>

        {activeMenu === 'chat' && (
          <div className={`absolute bottom-[80px] right-5 md:bottom-24 md:right-[calc(100%-380px)] z-50 ${activeChat ? 'hidden md:block' : 'block'}`}>
              <button onClick={() => setIsAddContactOpen(true)} className={`${colors.primary} w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95`} title="Tambah Teman">
                <Icons.Plus />
              </button>
          </div>
        )}

        <div className={`flex-1 h-full flex flex-col relative ${!activeChat ? 'hidden md:flex' : 'flex'} ${themeName==='dark'? 'bg-[#0b141a]' : 'bg-[#efeae2]'}`}>
          {!activeChat ? (
             <div className={`flex-1 flex flex-col items-center justify-center z-10 relative`}>
                <div className={`w-24 h-24 mb-6 rounded-full ${colors.panel} shadow-sm flex items-center justify-center text-[#00a884]`}><Icons.Chat /></div>
                <h2 className={`text-xl font-medium ${colors.textMuted}`}>Pilih kontak untuk mulai mengobrol</h2>
             </div>
          ) : (
            <ChatRoom 
              key={activeChat.id || activeChat.contact_id} session={session} myProfile={myProfile} colors={colors} t={t}
              activeChat={activeChat} setActiveChat={setActiveChat} contacts={contacts} setContacts={setContacts} 
              globalMessages={globalMessages} setGlobalMessages={setGlobalMessages} onlineUsers={onlineUsers}
              blockedIds={blockedIds} openConfirm={openConfirm} localDeletedMsgs={localDeletedMsgs} setLocalDeletedMsgs={setLocalDeletedMsgs}
              taskData={taskData} setTaskData={setTaskData} 
              
              /* ---> TAMBAHKAN DUA BARIS INI <--- */
              groups={groups} 
              setGroups={setGroups} 
            />
          )}
        </div>

        <Modal isOpen={confirmDialog.isOpen} onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} title={confirmDialog.title} colors={colors}>
          <div className="text-center">
            <p className="text-sm font-medium mb-8">{confirmDialog.message}</p>
            <div className="flex gap-3">
               <button onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })} className={`flex-1 ${colors.inputBg} ${colors.hoverBg} rounded-xl py-3 font-bold transition-colors border ${colors.border}`}>
                 {t.cancel}
               </button>
               {!confirmDialog.isAlertOnly && (
                 <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog({ ...confirmDialog, isOpen: false }) }} className="flex-1 bg-[#ff5757] text-white rounded-xl py-3 font-bold hover:bg-red-600 transition-colors">
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
          colors={colors} 
          t={t} 
        />
      </div>
    </>
  )
}

function SettingsManager({ activeMenu, setActiveMenu, session, myProfile, setMyProfile, themeName, setThemeName, language, setLanguage, colors, openConfirm, t, points, setPoints, taskData, setTaskData, setIsDeleteModalOpen }) {
  
  // 1. PASTIKAN SEMUA HOOKS BERADA DI PALING ATAS
  const [isUploadingWP, setIsUploadingWP] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);

  // Catatan: const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  // SUDAH DIHAPUS DARI SINI. Pastikan state itu ada di komponen `MainApp`.

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

  // 2. BLOK KONDISI RENDER

  if (activeMenu === 'settings') {
    return (
      <div className={`p-4 md:p-6 min-h-full animate-in slide-in-from-right-4 ${colors.base}`}>
         <div className="flex items-center gap-3 mb-6">
           <button onClick={() => setActiveMenu('chat')} className={`p-2 rounded-full ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
           <h2 className="text-xl font-bold">{t.settings}</h2>
         </div>

         <div className={`p-4 rounded-2xl flex items-center gap-4 ${colors.panel} shadow-sm border ${colors.border} mb-6 cursor-pointer ${colors.hoverBg} transition-all`} onClick={() => setActiveMenu('settings-profile')}>
            <Avatar url={myProfile.avatar_url} name={myProfile.username} size="w-16 h-16" />
            <div className="flex-1">
               <h3 className="text-lg font-bold">{myProfile.username}</h3>
               <p className={`text-sm ${colors.textMuted} line-clamp-1`}>{myProfile.bio || 'Available'}</p>
            </div>
            <Icons.ArrowLeft className="rotate-180 text-gray-400" />
         </div>

         <div className={`${colors.panel} rounded-2xl shadow-sm border ${colors.border} overflow-hidden`}>
            <SettingsListItem icon={<Icons.Lock />} title={t.account} desc={t.delAcc} onClick={() => setActiveMenu('settings-account')} colors={colors} />
            <SettingsListItem icon={<Icons.Palette />} title={t.theme} desc={t.wp} onClick={() => setActiveMenu('settings-theme')} colors={colors} />
            <SettingsListItem icon={<Icons.Star />} title={t.support} desc={t.review} onClick={() => setActiveMenu('settings-support')} colors={colors} borderBottom={false} />
         </div>

         <div className="mt-8 p-5 rounded-2xl bg-green-50 border border-green-100 text-center">
            <p className="text-xs text-green-700 leading-relaxed">{t.infoDev}</p>
         </div>
      </div>
    )
  }

  if (activeMenu === 'settings-profile') {
     return <ProfileEditor session={session} myProfile={myProfile} setMyProfile={setMyProfile} setActiveMenu={setActiveMenu} colors={colors} t={t} taskData={taskData} setTaskData={setTaskData} />
  }

  if (activeMenu === 'settings-account') {
     return (
       <div className={`p-4 md:p-6 min-h-full animate-in slide-in-from-right-4 ${colors.base}`}>
         <div className="flex items-center gap-3 mb-8">
           <button onClick={() => setActiveMenu('settings')} className={`p-2 rounded-full ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
           <h2 className="text-xl font-bold">{t.account}</h2>
         </div>
         <button onClick={() => openConfirm(t.logout, 'Keluar dari perangkat ini?', () => supabase.auth.signOut())} className={`w-full text-left p-4 rounded-2xl ${colors.panel} border ${colors.border} shadow-sm mb-4 font-bold ${colors.hoverBg} transition flex items-center gap-3`}>
           <Icons.ArrowLeft className="rotate-180 text-gray-400" /> {t.logout}
         </button>
         <div className={`p-4 rounded-2xl border ${colors.border} ${colors.panel}`}>
           <p className={`text-sm font-bold ${colors.danger.split(' ')[0]} mb-2`}>Zona Berbahaya</p>
           {/* Menggunakan setIsDeleteModalOpen yang dioper dari MainApp */}
           <button onClick={() => setIsDeleteModalOpen(true)} className={`w-full text-center p-3 rounded-xl bg-red-100 text-red-600 font-bold hover:bg-red-200 transition`}>{t.delAcc}</button>
         </div>
       </div>
     )
  }

  if (activeMenu === 'settings-theme') {
     const handleUploadWallpaper = async (e) => {
        if (points < 50) {
            alert(t.notEnoughPts);
            return;
        }

        const file = e.target.files[0]; if (!file) return;
        setIsUploadingWP(true);
        const fileExt = file.name.split('.').pop();
        const filePath = `${session.user.id}/wallpaper_${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
        
        if (!error) {
           const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
           await supabase.from('profiles').update({ chat_wallpaper: data.publicUrl }).eq('id', session.user.id);
           setMyProfile({...myProfile, chat_wallpaper: data.publicUrl});
           setPoints(points - 50); 
           alert(t.save);
        }
        setIsUploadingWP(false);
     }

     return (
       <div className={`p-4 md:p-6 min-h-full animate-in slide-in-from-right-4 ${colors.base}`}>
         <div className="flex items-center gap-3 mb-8">
           <button onClick={() => setActiveMenu('settings')} className={`p-2 rounded-full ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
           <h2 className="text-xl font-bold">{t.theme}</h2>
         </div>
         <div className="space-y-5 pb-10">
            <div className={`p-5 rounded-2xl shadow-sm border ${colors.border} ${colors.panel}`}>
               <label className="block text-sm font-bold mb-3">Tema Aplikasi</label>
               <select value={themeName} onChange={(e) => setThemeName(e.target.value)} className={`w-full p-3 rounded-xl ${colors.inputBg} border ${colors.border} outline-none text-sm font-medium`}>
                  <option value="light">Mode Terang (Light)</option>
                  <option value="dark">Mode Gelap (Dark)</option>
               </select>
            </div>
            
            <div className={`p-5 rounded-2xl shadow-sm border ${colors.border} ${colors.panel}`}>
               <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-bold">{t.wp}</label>
                  <span className="text-xs font-bold text-[#00a884] bg-green-50 px-2 py-1 rounded-full">-50 Poin</span>
               </div>
               <div className="relative">
                  <input type="file" onChange={handleUploadWallpaper} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploadingWP} />
                  <button className={`w-full p-3 rounded-xl ${colors.inputBg} border ${colors.border} text-sm font-medium transition flex items-center justify-center gap-2`}>
                    {isUploadingWP ? 'Mengunggah...' : <><Icons.Plus /> {t.buyWp}</>}
                  </button>
               </div>
               {myProfile.chat_wallpaper && myProfile.chat_wallpaper.startsWith('http') && (
                 <div className="mt-4 rounded-xl overflow-hidden h-32 border border-gray-200">
                    <img src={myProfile.chat_wallpaper} className="w-full h-full object-cover" />
                 </div>
               )}
            </div>

            <div className={`p-5 rounded-2xl shadow-sm border ${colors.border} ${colors.panel}`}>
               <label className="block text-sm font-bold mb-3">{t.lang}</label>
               <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`w-full p-3 rounded-xl ${colors.inputBg} border ${colors.border} outline-none text-sm font-medium`}>
                  <option value="id">Indonesia (ID)</option>
                  <option value="en">English (EN)</option>
               </select>
            </div>
         </div>
       </div>
     )
  }

  // 3. PERBAIKAN: MENAMBAHKAN BLOK IF UNTUK SETTINGS-SUPPORT YANG SEBELUMNYA HILANG
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
       <div className={`p-4 md:p-6 min-h-full flex flex-col items-center animate-in slide-in-from-right-4 ${colors.base}`}>
         <div className="w-full flex items-center gap-3 mb-6">
           <button onClick={() => setActiveMenu('settings')} className={`p-2 rounded-full ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
           <h2 className="text-xl font-bold">{t.support}</h2>
         </div>

         <form className={`w-full ${colors.panel} p-6 rounded-3xl shadow-sm border ${colors.border} mb-6`}>
            <p className="font-bold text-center mb-4">{t.review}</p>
            <div className="flex gap-2 mb-6 justify-center">
               {[1, 2, 3, 4, 5].map((star) => (
                 <button type="button" key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="text-yellow-400 focus:outline-none transition-transform hover:scale-110">
                   {(hoverRating || rating) >= star ? <Icons.StarSolid /> : <Icons.Star />}
                 </button>
               ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder={t.reviewDesc} rows="3" className={`w-full p-4 rounded-xl ${colors.inputBg} border ${colors.border} outline-none focus:ring-2 focus:ring-[#00a884] mb-4 resize-none text-sm`}></textarea>
            <button type="button" onClick={handleSubmitReview} disabled={isSubmitting} className={`${colors.primary} w-full py-3 font-bold`}>{isSubmitting ? '...' : t.send}</button>
         </form>

         <div className="w-full space-y-4 pb-10">
            <h3 className="font-bold text-sm text-gray-500 uppercase">Ulasan Terbaru</h3>
            {reviewsList.map(r => (
               <div key={r.id} className={`${colors.panel} p-4 rounded-2xl border ${colors.border}`}>
                  <div className="flex items-center gap-3 mb-2">
                     <Avatar url={r.profile?.avatar_url} name={r.profile?.username} size="w-8 h-8" />
                     <div>
                        <p className="font-bold text-sm">{r.profile?.username || 'Anonim'}</p>
                        <div className="flex text-yellow-400 w-3 h-3">
                           {[...Array(5)].map((_, i) => i < r.rating ? <Icons.StarSolid key={i} /> : <Icons.Star key={i} />)}
                        </div>
                     </div>
                  </div>
                  {r.comment && <p className={`text-sm ${colors.textMuted}`}>{r.comment}</p>}
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
      navigator.clipboard.writeText(myProfile.chat_id);
      alert('ID Tersalin: ' + myProfile.chat_id);
      setTaskData(prev => ({
          ...prev, 
          shareCount: Math.min(prev.shareCount + 1, 5)
      }));
  }

  return (
     <div className={`p-4 md:p-6 min-h-full animate-in slide-in-from-right-4 ${colors.base}`}>
       <div className="flex items-center gap-3 mb-8">
         <button onClick={() => setActiveMenu('settings')} className={`p-2 rounded-full ${colors.hoverBg} transition-all`}><Icons.ArrowLeft /></button>
         <h2 className="text-xl font-bold">{t.profile}</h2>
       </div>

       <div className="flex flex-col items-center mb-8">
         <div className="relative group cursor-pointer mb-3" onClick={() => fileInputRef.current.click()}>
           <Avatar url={myProfile.avatar_url} name={myProfile.username} size="w-28 h-28" className={`shadow-md ${isUploading ? 'animate-pulse scale-95 opacity-80' : ''}`} />
           {isUploading && (
             <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 z-10 transition-all">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
             </div>
           )}
           <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-xs font-bold text-white">Ganti Foto</span>
           </div>
           <input type="file" ref={fileInputRef} onChange={handleUploadAvatar} accept="image/*" className="hidden" />
         </div>
         <button onClick={copyIDForTask} className={`px-4 py-1.5 rounded-full text-xs font-bold bg-[#00a884] text-white flex items-center gap-2 hover:scale-105 transition-transform shadow-sm`}>
             <Icons.Copy className="w-3.5 h-3.5" /> Share ID (Task)
         </button>
       </div>

       <div className="space-y-5">
         <div className={`p-5 rounded-2xl shadow-sm border ${colors.border} ${colors.panel}`}>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Nama Pengguna</label>
            <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="w-full border-b border-gray-400 py-2 bg-transparent outline-none text-base font-medium focus:border-[#00a884] transition-colors" />
         </div>

         <div className={`p-5 rounded-2xl shadow-sm border ${colors.border} ${colors.panel}`}>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Bio / Status</label>
            <input type="text" maxLength={150} value={newBio} onChange={(e) => setNewBio(e.target.value)} placeholder="Available" className="w-full border-b border-gray-400 py-2 bg-transparent outline-none text-base font-medium focus:border-[#00a884] transition-colors" />
            <div className={`text-[10px] text-right mt-1.5 font-medium ${newBio.length >= 150 ? 'text-red-500' : 'text-gray-400'}`}>
               {newBio.length}/150
            </div>
         </div>
         
         <button onClick={handleUpdateProfile} disabled={isSaving || !newUsername.trim()} className={`${colors.primary} w-full py-3.5 font-bold mt-4 disabled:opacity-50`}>
           {isSaving ? '...' : t.save}
         </button>
       </div>
     </div>
  )
}

function SettingsListItem({ icon, title, desc, onClick, colors, borderBottom = true }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 p-4 cursor-pointer ${colors.hoverBg} transition-colors ${borderBottom ? `border-b ${colors.border}` : ''}`}>
       <div className="text-gray-400">{icon}</div>
       <div className="flex-1">
          <h4 className="font-bold text-base">{title}</h4>
          <p className={`text-xs ${colors.textMuted}`}>{desc}</p>
       </div>
       <Icons.ArrowLeft className="rotate-180 text-gray-400 w-4 h-4" />
    </div>
  )
}

// ================= KOMPONEN RUANG OBROLAN MODERN =================
// Tambahkan groups, setGroups di dalam kurung kurawal parameter
function ChatRoom({ session, myProfile, colors, t, activeChat, setActiveChat, contacts, setContacts, globalMessages, setGlobalMessages, onlineUsers, blockedIds, openConfirm, localDeletedMsgs, setLocalDeletedMsgs, taskData, setTaskData, groups, setGroups }) {
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [pendingMessages, setPendingMessages] = useState([])
  const [isProcessingQueue, setIsProcessingQueue] = useState(false)
  const [previewMedia, setPreviewMedia] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)

  const [groupMembers, setGroupMembers] = useState([]);

  // Fetch anggota grup jika membuka grup
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

      // Memantau perubahan (Insert/Delete) di tabel group_members khusus untuk grup ini
      const memberChannel = supabase.channel(`group-members-${activeChat.contact_id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members', filter: `group_id=eq.${activeChat.contact_id}` }, () => {
           fetchMembers(); // Refresh data anggota seketika ada perubahan
        })
        .subscribe();

      return () => supabase.removeChannel(memberChannel);
    }
  }, [activeChat?.contact_id]);

  const getRoleColor = (senderId) => {
    const colorsArr = ['#ff7a59', '#00bfa5', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#00bcd4', '#4caf50', '#ff9800', '#795548'];
    let hash = 0;
    for (let i = 0; i < senderId.length; i++) {
       hash = senderId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colorsArr[Math.abs(hash) % colorsArr.length];
  };

  const handleDisbandGroup = () => {
    openConfirm(t.disbandGroup, `Yakin ingin membubarkan grup ini? Semua anggota akan dikeluarkan dan grup akan dihapus permanen.`, async () => {
      // 1. Hapus data secara permanen dari database
      await supabase.from('messages').delete().eq('receiver_id', activeChat.contact_id);
      await supabase.from('group_members').delete().eq('group_id', activeChat.contact_id);
      await supabase.from('groups').delete().eq('id', activeChat.contact_id);
      
      // 2. Hapus grup dari antarmuka Tab "Grup" seketika
      if (setGroups) {
         setGroups(prev => prev.filter(g => g.id !== activeChat.contact_id));
      }

      // 3. Bersihkan layar chat seketika
      setGlobalMessages(prev => prev.filter(m => m.receiver_id !== activeChat.contact_id));
      setActiveChat(null);
      showToast("Grup berhasil dibubarkan.");
    });
  };

  // --- FUNGSI KELUAR GRUP (ANGGOTA BIASA) ---
  const handleLeaveGroup = () => {
    openConfirm(t.leaveGroup, `Yakin ingin keluar dari grup ini?`, async () => {
      // 1. Hapus keanggotaan diri sendiri dari tabel group_members di Database.
      // (Ini secara otomatis memicu Real-Time listener di layar anggota lain untuk menghilangkan nama Anda!)
      await supabase.from('group_members').delete().match({ group_id: activeChat.contact_id, user_id: myProfile.chat_id });
      
      // 2. Hapus grup dari antarmuka Tab "Grup" Anda seketika
      if (setGroups) {
         setGroups(prev => prev.filter(g => g.id !== activeChat.contact_id));
      }

      // 3. Bersihkan layar chat dari layar Anda
      setGlobalMessages(prev => prev.filter(m => m.receiver_id !== activeChat.contact_id));
      setActiveChat(null);
      showToast("Anda telah keluar dari grup.");
    });
  };

  const chatContainerRef = useRef(null); 
  const [isAtBottom, setIsAtBottom] = useState(true); 
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  
  const [replyingTo, setReplyingTo] = useState(null)
  const [activeMsgId, setActiveMsgId] = useState(null)
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

  const scrollToMessage = (msgId) => {
    const element = document.getElementById(`msg-${msgId}`);
    if (element) {
      // Scroll perlahan ke pesan
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Tambahkan efek flash / highlight sementara
      const bubble = element.querySelector('.chat-bubble-core');
      if (bubble) {
        bubble.classList.add('brightness-75', 'scale-[1.02]', 'transition-all', 'duration-300');
        setTimeout(() => {
          bubble.classList.remove('brightness-75', 'scale-[1.02]');
        }, 800);
      }
    }
  };

  const [stagedFiles, setStagedFiles] = useState([])

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000); // Hilang dalam 2 detik
  };

  const handleSendSticker = async (fileObj, type, overlayText) => {
    setIsUploading(true); // Menggunakan state isUploading yang sudah ada agar input terkunci
    
    // Tentukan ekstensi: png untuk gambar biasa/canvas, gif untuk konversi video
    const fileExt = type === 'video_to_gif' ? 'gif' : 'webp';
    const fileName = `sticker_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${session.user.id}/${fileName}`;
    
    try {
      // 1. Upload fileObj ke bucket 'chat_media' di Supabase
      const { error } = await supabase.storage.from('chat_media').upload(filePath, fileObj);
      
      if (error) throw error;
      
      // 2. Ambil URL Publik
      const { data } = supabase.storage.from('chat_media').getPublicUrl(filePath);
      
      // 3. Buat objek pesan sementara (temp message)
      const tempMsg = {
        id: `temp-${Date.now()}`, 
        sender_id: myProfile.chat_id, 
        receiver_id: activeChat.contact_id,
        content: '', // Konten teks kosongkan, karena overlayText sudah dicetak (di-draw) ke dalam gambar stiker
        is_read: false, 
        reply_to_id: replyingTo?.id || null, // Dukung fitur reply jika ada
        created_at: new Date().toISOString(), 
        status: 'pending',
        media_files: [{ url: data.publicUrl, type: 'sticker', name: fileName }] // Tetap pakai 'image' agar di-render sebagai <img>
      };
      
      // 4. Update progress task harian (jika ada)
      if (taskData && setTaskData && activeChat.contact_id) {
         setTaskData(prev => {
            if (!prev.chatProgress.includes(activeChat.contact_id) && prev.chatProgress.length < 5) {
               return { ...prev, chatProgress: [...prev.chatProgress, activeChat.contact_id] };
            }
            return prev;
         });
      }

      // 5. Masukkan ke antrean pesan
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
    // 1. Cek Blokir dan Hapus Lokal
    if (blockedIds.includes(msg.sender_id)) return false;
    if (localDeletedMsgs.includes(msg.id)) return false; 
    
    // 2. Cek waktu clear chat
    const msgTime = new Date(msg.created_at).getTime();
    if (msgTime <= clearedAtTime) return false;
    
    // 3. LOGIKA FILTER BARU (GRUP VS PERSONAL)
    if (activeChat?.type === 'group') {
      // Jika ini obrolan grup, tangkap SEMUA pesan yang masuk ke ID Grup tersebut
      return msg.receiver_id === activeChat.contact_id;
    } else {
      // Jika ini obrolan personal (1 lawan 1)
      return (msg.sender_id === myProfile.chat_id && msg.receiver_id === activeChat?.contact_id) || 
             (msg.sender_id === activeChat?.contact_id && msg.receiver_id === myProfile.chat_id);
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
    setIsHeaderMenuOpen(false); setReplyingTo(null); setEditingMsg(null); setActiveMsgId(null); setIsTyping(false); setShowContactInfo(false);
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
      await new Promise(resolve => setTimeout(resolve, 800)); 
      const payload = { sender_id: msgToProcess.sender_id, receiver_id: msgToProcess.receiver_id, content: msgToProcess.content, is_read: false, reply_to_id: msgToProcess.reply_to_id, media_files: msgToProcess.media_files };
      await supabase.from('messages').insert([payload]);
      setPendingMessages(prev => prev.slice(1));
      setIsProcessingQueue(false);
    };
    processNextMessage();
  }, [pendingMessages, isProcessingQueue]);

  useEffect(() => {
    if (!activeChat) return;
    const roomName = `typing-room-${[myProfile.chat_id, activeChat.contact_id].sort().join('-')}`;
    const channel = supabase.channel(roomName).on('broadcast', { event: 'typing' }, ({ payload }) => { if (payload.sender_id !== myProfile.chat_id) setIsTyping(payload.status) }).subscribe()
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
    if (isUploading) return; 

    if (!inputMessage.trim() && stagedFiles.length === 0) return;

    if (activeChat.type === 'group') {
      const now = Date.now();
      if (now - lastGroupMsgTimeRef.current < 2000) {
        showToast("Tunggu 2 detik sebelum mengirim pesan lagi (Anti-Spam).");
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

    const tempMsg = {
      id: `temp-${Date.now()}`, 
      sender_id: myProfile.chat_id, 
      receiver_id: activeChat.contact_id,
      content: inputMessage.trim() || '',
      is_read: false, 
      reply_to_id: replyingTo?.id || null, 
      created_at: new Date().toISOString(), 
      status: 'pending',
      media_files: uploadedFiles.length > 0 ? uploadedFiles : null 
    };
    
    // UPDATE TASK PROGRESS: Chat teman
    if (taskData && setTaskData && activeChat.contact_id) {
       setTaskData(prev => {
          if (!prev.chatProgress.includes(activeChat.contact_id) && prev.chatProgress.length < 5) {
             return { ...prev, chatProgress: [...prev.chatProgress, activeChat.contact_id] };
          }
          return prev;
       });
    }

    setPendingMessages(prev => [...prev, tempMsg]); 
    setInputMessage(''); setStagedFiles([]); setReplyingTo(null); setIsUploading(false);
    channelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { sender_id: myProfile.chat_id, status: false } });
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
    if (!activeChat || activeChat.type === 'group' || !isAtBottom) return; 
    const unreadMsgs = globalMessages.filter(m => m.sender_id === activeChat.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read)
    if (unreadMsgs.length > 0) {
      setGlobalMessages(prev => prev.map(m => (m.sender_id === activeChat.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read) ? { ...m, is_read: true } : m));
      supabase.from('messages').update({ is_read: true }).in('id', unreadMsgs.map(m => m.id)).then()
    }
  }, [activeChat, globalMessages, myProfile.chat_id, setGlobalMessages, isAtBottom]) 

  const getWallpaperStyle = () => {
    if (myProfile.chat_wallpaper && myProfile.chat_wallpaper.startsWith('http')) {
      return { backgroundImage: `url(${myProfile.chat_wallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }
    }
    return { backgroundImage: `url(https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg)`, backgroundSize: '400px', opacity: 0.4 }
  }

  return (
    <div className="flex w-full h-full overflow-hidden relative">
      <div className={`flex-1 flex flex-col h-full relative min-w-0 ${showContactInfo ? 'hidden md:flex' : 'flex'}`}>
        
        {/* MENU KONTEKS (BLUR) */}
        {contextMsg && (
          <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setContextMsg(null)}>
            <div className={`max-w-[85%] p-2.5 rounded-2xl shadow-lg mb-6 relative z-10 ${contextMsg.sender_id === myProfile.chat_id ? colors.bubbleMe : colors.bubbleThem} ${contextMsg.sender_id === myProfile.chat_id ? 'rounded-tr-[4px]' : 'rounded-tl-[4px]'}`} onClick={e => e.stopPropagation()}>
               {contextMsg.reply_to_id && globalMessages.find(m => m.id === contextMsg.reply_to_id) && (
                 <div className="p-2 mb-2 rounded-xl bg-black/5 border-l-4 border-[#00a884] flex flex-col w-full min-w-0">
                    <p className="font-bold mb-0.5 text-[#00a884] text-[11px]">{getSenderName(globalMessages.find(m => m.id === contextMsg.reply_to_id).sender_id)}</p>
                    <p className="text-xs opacity-70 line-clamp-3">{globalMessages.find(m => m.id === contextMsg.reply_to_id).content || 'Media'}</p>
                 </div>
               )}
               {contextMsg.media_files && contextMsg.media_files.length > 0 && (
                 <div className={`grid gap-1 ${contextMsg.media_files.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} mb-2`}>
                   {contextMsg.media_files.map((file, idx) => (
                     <div key={idx} className={`relative overflow-hidden rounded-xl h-24 flex items-center justify-center ${file.type === 'sticker' ? 'bg-transparent border-none' : 'border border-gray-200 dark:border-gray-600 bg-gray-100'}`}>
                       {file.type === 'image' && <img src={file.url} className="object-cover w-full h-full" alt="Preview" />}
                       {file.type === 'video' && <video src={file.url} className="object-cover w-full h-full" />}
                       
                       {/* PREVIEW KHUSUS STIKER */}
                       {file.type === 'sticker' && <img src={file.url} className="object-contain w-24 h-24 drop-shadow-md" alt="Sticker Preview" />}
                       
                       {file.type === 'document' && <div className="flex flex-col items-center justify-center h-full text-[10px] text-gray-500 p-2"><Icons.File /> <span className="truncate w-full mt-1">{file.name}</span></div>}
                     </div>
                   ))}
                 </div>
               )}
               <p className="text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap px-1">{contextMsg.content}</p>
            </div>

            <div className={`rounded-2xl shadow-xl w-[280px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 zoom-in-95 border ${colors.border} ${colors.panel}`} onClick={e => e.stopPropagation()}>
               
               {/* --- DETEKSI APAKAH INI STIKER --- */}
               {contextMsg.media_files?.[0]?.type === 'sticker' ? (
                 <>
                   <button onClick={() => { alert('Stiker berhasil ditambahkan ke Favorit!'); setContextMsg(null); }} className={`px-5 py-3.5 font-medium text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>
                     Tambah ke Favorit <Icons.Star />
                   </button>
                   <button onClick={() => { setIsStickerMakerOpen(true); setContextMsg(null); }} className={`px-5 py-3.5 font-medium text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>
                     Buat stiker anda sendiri <Icons.Palette />
                   </button>
                 </>
               ) : (
                 <>
                   {/* TOMBOL MEDIA BIASA */}
                   {contextMsg.media_files && contextMsg.media_files.length > 0 && (
                      <>
                        {contextMsg.media_files.some(f => f.type === 'image' || f.type === 'video') && (
                          <button onClick={() => { setPreviewMedia(contextMsg.media_files.find(f => f.type === 'image' || f.type === 'video')); setContextMsg(null); }} className={`px-5 py-3.5 font-medium text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.viewMedia}</button>
                        )}
                        <button onClick={() => { contextMsg.media_files.forEach(f => forceDownload(f.url, f.name)); setContextMsg(null); }} className={`px-5 py-3.5 font-medium text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.saveMedia}</button>
                      </>
                   )}
                   {contextMsg.content && (
                     <button onClick={() => { handleCopyText(contextMsg.content); setContextMsg(null); }} className={`px-5 py-3.5 font-medium text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.copy} <Icons.Copy /></button>
                   )}
                   {contextMsg.sender_id === myProfile.chat_id && (
                     <button onClick={() => { setEditingMsg(contextMsg); setInputMessage(contextMsg.content); setContextMsg(null); }} className={`px-5 py-3.5 font-medium text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.edit} <Icons.Edit /></button>
                   )}
                 </>
               )}

               {/* TOMBOL UMUM UNTUK KEDUANYA (Balas & Hapus) */}
               <button onClick={() => { setReplyingTo(contextMsg); setContextMsg(null); }} className={`px-5 py-3.5 font-medium text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.reply} <Icons.Reply /></button>
               <button onClick={() => handleDeleteForMe(contextMsg.id)} className={`px-5 py-3.5 font-medium text-left ${colors.hoverBg} flex justify-between items-center transition-colors text-sm border-b ${colors.border}`}>{t.delMe} <Icons.Trash /></button>
               
               {contextMsg.sender_id === myProfile.chat_id && (
                  <button onClick={() => handleDeleteForEveryone(contextMsg.id)} className={`px-5 py-3.5 font-medium text-red-500 text-left hover:bg-red-50 dark:hover:bg-red-900/10 flex justify-between items-center transition-colors text-sm`}>{t.delAll} <Icons.Trash /></button>
               )}
            </div>
          </div>
        )}

        {/* HEADER CHAT ROOM */}
        <div className={`h-[70px] md:h-[76px] flex items-center justify-between px-3 md:px-4 border-b ${colors.border} ${colors.panel} shrink-0 z-20`}>
          <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => setShowContactInfo(true)}>
            <button onClick={(e) => { e.stopPropagation(); setActiveChat(null) }} className={`md:hidden p-2 rounded-full ${colors.hoverBg} transition-colors`}><Icons.ArrowLeft /></button>
            <Avatar url={activeChat.avatar_url} name={activeChat.contact_username} size="w-10 h-10" />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold truncate tracking-tight">{activeChat.contact_username}</h2>
              <p className={`text-xs font-medium mt-0.5 truncate ${isTyping || onlineUsers.includes(activeChat.contact_id) ? 'text-[#00a884]' : colors.textMuted}`}>
                {activeChat.type === 'group' 
                  ? `${groupMembers.length} Anggota` // Tampilkan jumlah anggota untuk grup
                  : (isTyping ? t.typing : (onlineUsers.includes(activeChat.contact_id) ? t.online : t.offline))
                }
              </p>
            </div>
          </div>
          <div className="flex items-center shrink-0">
            <div className="relative z-[9999]">
              <button onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)} className={`p-2 rounded-full ${colors.hoverBg} transition-all ${colors.textMuted}`}><Icons.MoreVertical /></button>
              {isHeaderMenuOpen && (
                <div className={`absolute right-0 mt-2 w-56 ${colors.panel} border ${colors.border} rounded-xl shadow-xl z-50 overflow-hidden`}>
                  <button onClick={handleClearChatLocal} className={`w-full text-left px-5 py-3 text-sm font-medium ${colors.hoverBg} transition-colors`}>{t.clearMe}</button>
                  <button onClick={handleClearChatEveryone} className={`w-full text-left px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors`}>{t.clearAll}</button>
                  <div className={`h-px w-full bg-gray-200 dark:bg-gray-700`}></div>
                  <button onClick={() => { setIsHeaderMenuOpen(false); setShowContactInfo(true); }} className={`w-full text-left px-5 py-3 text-sm font-medium ${colors.hoverBg} transition-colors`}>{t.contactInfo}</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col relative min-h-0 bg-transparent">
          <div className="absolute inset-0 z-0 pointer-events-none" style={{...getWallpaperStyle(), mixBlendMode: 'overlay'}}></div>
          
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-2 px-3 md:px-6 pt-4 pb-4 z-10 relative" onClick={() => { setIsHeaderMenuOpen(false); setActiveMsgId(null); }}>
            
            <div className="flex justify-center mb-6">
              <div className={`text-[11px] font-medium px-4 py-1.5 rounded-xl ${colors.warningBg} ${colors.warningText} shadow-sm flex items-center gap-2 max-w-[90%] text-center`}>
                <Icons.Lock /> {t.encrypted}
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
                  <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} my-1`}>
                    <div className="px-3 py-1.5 rounded-full bg-black/10 border border-gray-400/20 text-gray-500 italic text-xs shadow-sm">
                      圻 {t.msgDeleted}
                    </div>
                  </div>
                )
              }

              return (
                <Fragment key={msg.id}>
                  {showUnreadDivider && (
                    <div className="flex justify-center my-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">{t.newMsgLabel}</span>
                    </div>
                  )}
                  {showDateBadge && (
                    <div className="flex justify-center my-4">
                      <span className={`text-[11px] font-medium px-3 py-1 rounded-full ${colors.dateBadge} shadow-sm`}>{dateLabel}</span>
                    </div>
                  )}

                  <div id={`msg-${msg.id}`} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} relative py-0.5`}>
                    <div 
                      className={`flex items-end max-w-[85%] md:max-w-[70%] z-10 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      onClick={() => showToast(t.clickBubbleNotice)}
                      onDoubleClick={(e) => { e.stopPropagation(); setContextMsg(globalMessages.find(m => m.id === msg.id) || msg); }}
                      onTouchStart={(e) => handlePressStart(e, msg)} 
                      onTouchMove={(e) => handlePressMove(e, msg, isMe)} 
                      onTouchEnd={() => handlePressEnd(msg)}
                    >
                      {/* CEK JIKA PESAN ADALAH STIKER */}
                      {(() => {
                        const isSticker = msg.media_files?.[0]?.type === 'sticker';
                        
                        return (
                          <div className={`chat-bubble-core relative flex flex-col shadow-sm cursor-pointer transition-all duration-300
                            ${isSticker 
                               ? 'p-0 bg-transparent shadow-none' 
                               : `p-2.5 px-3.5 text-[15px] rounded-2xl ${isMe ? 'rounded-tr-[4px] ' + colors.bubbleMe : 'rounded-tl-[4px] ' + colors.bubbleThem}`
                            }`}
                          >
                            
                            {/* KOTAK BALASAN (REPLY BOX) */}
                            {repliedMsg && (
                              <div 
                                onClick={(e) => { e.stopPropagation(); scrollToMessage(repliedMsg.id); }}
                                className={`p-2.5 mb-2 rounded-xl text-[13px] relative overflow-hidden backdrop-blur-md shadow-sm border cursor-pointer hover:opacity-80 transition-opacity ${isMe ? colors.bubbleReplyMe : colors.bubbleReplyThem} ${isSticker ? 'bg-white/80 dark:bg-black/60 shadow-md backdrop-blur-xl' : ''}`}
                              >
                                <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
                                  <Icons.Reply className="w-3.5 h-3.5" />
                                  <span className="font-bold text-[11px] uppercase tracking-wider">{getSenderName(repliedMsg.sender_id)}</span>
                                </div>
                                <div className="opacity-80 pl-3 border-l-2 border-current ml-1 flex items-center">
                                   {/* PREVIEW MEDIA PADA BALASAN */}
                                   {repliedMsg.media_files?.[0]?.type === 'sticker' ? (
                                     <img src={repliedMsg.media_files[0].url} className="h-12 w-auto object-contain drop-shadow-sm" alt="Stiker" />
                                   ) : repliedMsg.media_files?.[0]?.type === 'image' ? (
                                     <span className="flex items-center gap-2 italic"><Icons.Palette className="w-3.5 h-3.5" /> Foto Media</span>
                                   ) : (
                                     <span className="line-clamp-2">{repliedMsg.content || 'Media File'}</span>
                                   )}
                                </div>
                              </div>
                            )}

                            {activeChat.type === 'group' && !isMe && !isSticker && (
                              <span className="text-[11px] font-bold mb-1 block tracking-wide" style={{ color: getRoleColor(msg.sender_id) }}>
                                 {getSenderName(msg.sender_id)}
                                 {activeChat.admin_id === msg.sender_id && <span className="ml-1.5 px-1.5 py-0.5 bg-black/10 dark:bg-white/10 rounded-md text-[8px] uppercase tracking-wider text-current">Admin</span>}
                              </span>
                            )}

                            {/* RENDER KONTEN MEDIA & STIKER */}
                            {msg.media_files && msg.media_files.length > 0 && (
                              <div className={`grid gap-1 ${msg.media_files.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} ${isSticker ? '' : 'mt-1 mb-1'}`}>
                                {msg.media_files.map((file, idx) => {
                                  if (file.type === 'document') {
                                    return (
                                      <button key={idx} onClick={(e) => { e.stopPropagation(); forceDownload(file.url, file.name); }} className="flex items-center gap-3 p-3 rounded-lg bg-black/5 w-full text-left">
                                        <div className="w-8 h-8 rounded-full bg-[#00a884] text-white flex items-center justify-center shrink-0"><Icons.File /></div>
                                        <span className="truncate text-sm font-medium">{file.name}</span>
                                      </button>
                                    )
                                  }
                                  if (file.type === 'sticker') {
                                    return <img key={idx} src={file.url} className="object-contain w-36 h-36 md:w-44 md:h-44 drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]" alt="Stiker" />
                                  }
                                  return (
                                    <div key={idx} className="relative rounded-lg overflow-hidden border border-black/5 bg-black/10">
                                      {file.type === 'image' && (
                                        <>
                                          <img src={file.url} className="object-cover w-full h-40" />
                                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                             <span className="bg-black/50 text-white px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm shadow-sm uppercase tracking-widest border border-white/20">FOTO</span>
                                          </div>
                                        </>
                                      )}
                                      {file.type === 'video' && (
                                        <>
                                          <video src={file.url} className="object-cover w-full h-40" />
                                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                             <span className="bg-black/50 text-white px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm shadow-sm uppercase tracking-widest border border-white/20">VIDEO</span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}

                            {/* TEXT BIASA (Sembunyikan jika ini stiker) */}
                            {!isSticker && msg.content && (
                               <p className="break-words whitespace-pre-wrap leading-snug">{msg.content}</p>
                            )}

                            {/* TIMESTAMP & CENTANG */}
                            <div className={`flex items-center gap-1 text-[10px] font-medium self-end shrink-0 pt-1 -mb-1 ml-4 
                              ${isSticker 
                                  ? 'bg-black/30 backdrop-blur-md text-white px-2 py-1 rounded-full absolute bottom-1 right-1' 
                                  : 'opacity-60 float-right'}`}
                            >
                              {msg.is_edited && <span className="italic mr-1">edit</span>}
                              <span>{timeString}</span>
                              {isMe && <span className={isSticker ? 'text-white' : 'text-[#00a884]'}>{msg.is_read ? <Icons.DoubleCheck /> : <Icons.Check />}</span>}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </Fragment>
              )
            })}

            {/* AREA PESAN PENDING */}
            {pendingMessages.map((msg) => (
              <div key={msg.id} className="flex w-full justify-end py-0.5 opacity-60">
                <div className={`flex items-end max-w-[85%] md:max-w-[70%] flex-row-reverse`}>
                  <div className={`relative flex flex-col p-2 px-3 text-[15px] shadow-sm rounded-2xl rounded-tr-[4px] ${colors.bubbleMe}`}>
                    {msg.reply_to_id && (
                      <div className="p-2 mb-1.5 rounded-lg bg-black/5 border-l-4 border-[#00a884]">
                         <p className="text-xs">{t.replying}</p>
                      </div>
                    )}
                    <p className="leading-snug break-words whitespace-pre-wrap">{msg.content}</p>
                    <div className="flex items-center gap-1 text-[10px] self-end pt-1 -mb-1 ml-4"><Icons.Clock /></div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>

          {!isAtBottom && unreadCount > 0 && (
            <button onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })} className={`absolute bottom-4 right-4 ${colors.panel} text-[#00a884] w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50`}>
              <Icons.ArrowLeft className="-rotate-90" />
              <span className="absolute -top-1 -right-1 bg-[#00a884] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{unreadCount}</span>
            </button>
          )}
        </div>

        {/* INPUT AREA MODERN */}
        <div className={`p-2 md:p-3 flex flex-col ${colors.panel} shrink-0 z-20`}>
          {editingMsg && (
            <div className="flex justify-between items-center bg-black/5 rounded-xl p-3 mx-2 mb-2 border-l-4 border-[#00a884]">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#00a884] mb-1">{t.edit}</p>
                <p className="text-sm opacity-70 truncate">{editingMsg.content}</p>
              </div>
              <button onClick={() => { setEditingMsg(null); setInputMessage(''); }} className="p-2 opacity-50 hover:opacity-100"><Icons.Plus className="rotate-45" /></button>
            </div>
          )}
          {replyingTo && (
            <div className="flex justify-between items-center bg-black/5 rounded-xl p-3 mx-2 mb-2 border-l-4 border-[#00a884]">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#00a884] mb-1">{t.reply} {getSenderName(replyingTo.sender_id)}</p>
                <p className="text-sm opacity-70 truncate">{replyingTo.content || 'Media'}</p>
              </div>
              <button onClick={() => setReplyingTo(null)} className="p-2 opacity-50 hover:opacity-100"><Icons.Plus className="rotate-45" /></button>
            </div>
          )}
          {stagedFiles.length > 0 && (
            <div className="flex gap-2 overflow-x-auto p-2 mx-2 mb-2">
               {stagedFiles.map((sf, idx) => (
                  <div key={idx} className="relative w-16 h-16 shrink-0 rounded-xl bg-gray-100 overflow-hidden shadow-sm">
                     {sf.type === 'image' ? <img src={sf.previewUrl} className="w-full h-full object-cover" /> : sf.type === 'video' ? <video src={sf.previewUrl} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center justify-center h-full text-[10px] text-black"><Icons.File /></div>}
                     <button type="button" onClick={() => setStagedFiles(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><Icons.Plus className="w-3 h-3 rotate-45" /></button>
                  </div>
               ))}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2 items-end px-1">
            <input type="file" multiple ref={mediaInputRef} onChange={handleSendMedia} className="hidden" />
            
            <button 
  type="button" 
  onClick={() => setIsStickerMakerOpen(true)} 
  className={`p-3 ${colors.textMuted} hover:text-[#00a884] transition-colors shrink-0`}
>
  <Icons.Sticker />
</button>
            
            <div className={`flex-1 ${colors.inputBg} rounded-3xl min-h-[44px] flex items-center shadow-sm border border-transparent transition-all py-1 px-2`}>
              <textarea 
                rows={1} value={inputMessage} onChange={handleTyping} 
                onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                placeholder={isUploading ? 'Menyiapkan...' : t.typeMsg} 
                className={`w-full bg-transparent px-2 py-1.5 text-[15px] outline-none resize-none max-h-[120px] overflow-y-auto ${colors.text} placeholder-gray-400`} 
              />
              <button type="button" disabled={isUploading} onClick={() => mediaInputRef.current.click()} className={`p-2 ${colors.textMuted} hover:text-gray-600 transition-colors`}>
                <Icons.Attach />
              </button>
            </div>
            
            <button type="submit" disabled={(!inputMessage.trim() && stagedFiles.length === 0) || isUploading} className={`w-[44px] h-[44px] flex items-center justify-center rounded-full bg-[#00a884] text-white shrink-0 shadow-md transition-all ${((!inputMessage.trim() && stagedFiles.length === 0) || isUploading) ? 'opacity-50 scale-95' : 'hover:bg-[#008f6f] hover:scale-105'}`}>
              {isUploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Icons.Send />}
            </button>
          </form>
        </div>

        {previewMedia && (
          <div className="fixed inset-0 z-[400] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setPreviewMedia(null)}>
            <button onClick={() => setPreviewMedia(null)} className="absolute top-6 right-6 p-2 text-white hover:bg-white/20 rounded-full transition-colors z-50">
              <Icons.Plus className="rotate-45 w-8 h-8" />
            </button>
            {previewMedia.type === 'image' && <img src={previewMedia.url} onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-full object-contain" alt="Preview" />}
            {previewMedia.type === 'video' && <video src={previewMedia.url} controls autoPlay onClick={(e) => e.stopPropagation()} className="max-h-[85vh] max-w-full object-contain" />}
          </div>
        )}

        {toastMessage && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-gray-900/80 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg z-[9999] animate-in fade-in slide-in-from-top-2">
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
        <div className={`w-full md:w-[360px] h-full flex flex-col ${colors.panel} border-l ${colors.border} z-30 animate-in slide-in-from-right absolute md:relative top-0 right-0`}>
           <div className={`h-[70px] md:h-[76px] flex items-center gap-3 px-4 border-b ${colors.border} shrink-0`}>
              <button onClick={() => setShowContactInfo(false)} className={`p-2 rounded-full ${colors.hoverBg} transition-colors`}><Icons.ArrowLeft /></button>
              <h2 className="font-bold text-lg">{activeChat.type === 'group' ? t.groupInfo : t.contactInfo}</h2>
           </div>
           
           <div className="flex-1 overflow-y-auto pb-10">
             
             {/* ======================================= */}
             {/* TAMPILAN KHUSUS GRUP                    */}
             {/* ======================================= */}
             {activeChat.type === 'group' ? (
               <div className="flex flex-col items-center p-6 border-b border-gray-200 dark:border-[#313d45]">
                  <div className="relative group mb-5">
                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-4xl shadow-lg border-4 border-gray-100 dark:border-[#313d45] overflow-hidden">
                       {activeChat.avatar_url ? <img src={activeChat.avatar_url} className="w-full h-full object-cover" /> : activeChat.contact_username.charAt(0).toUpperCase()}
                    </div>
                    {activeChat.admin_id === myProfile.chat_id && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => document.getElementById('groupPPInput').click()}>
                          <span className="text-xs font-bold text-white text-center px-2">{t.changeGroupPP}</span>
                        </div>
                        <input type="file" id="groupPPInput" accept="image/*" className="hidden" onChange={async (e) => { 
                          /* logika upload gambar tetap sama */
                          const file = e.target.files[0]; if (!file) return;
                          const fileExt = file.name.split('.').pop();
                          const filePath = `groups/${activeChat.contact_id}_${Date.now()}.${fileExt}`;
                          const { error } = await supabase.storage.from('avatars').upload(filePath, file);
                          if (!error) {
                            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
                            await supabase.from('groups').update({ avatar_url: data.publicUrl }).eq('id', activeChat.contact_id);
                            setActiveChat({ ...activeChat, avatar_url: data.publicUrl });
                          }
                        }} />
                      </>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold mb-1 text-center">{activeChat.contact_username}</h2>
                  <p className={`text-sm ${colors.textMuted} mb-4 text-center`}>ID Grup: {activeChat.contact_id}</p>
                  
                  <button onClick={() => {
                    handleCopyText(activeChat.contact_id);
                    showToast(t.idCopied);
                  }} className="px-4 py-2 bg-gray-100 dark:bg-[#2a3942] rounded-full text-xs font-bold flex items-center justify-center gap-2 mb-6 shadow-sm w-full max-w-[200px]">
                    <Icons.Copy className="w-3.5 h-3.5" /> {t.copyGroupId}
                  </button>
                  
                  {/* TOMBOL ADD MEMBER (Hanya Admin) */}
                  {activeChat.admin_id === myProfile.chat_id && (
                    <button onClick={async () => {
                      const memberId = prompt(t.inputMemberId);
                      if (memberId) {
                         const { error } = await supabase.from('group_members').insert([{ group_id: activeChat.contact_id, user_id: memberId }]);
                         if (error) alert(t.failedAddMember);
                         else showToast(t.successAddMember);
                      }
                    }} className={`w-full p-4 rounded-xl flex items-center justify-between font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 transition-colors mb-3`}>
                      <span>{t.addMember}</span>
                      <Icons.Plus className="w-5 h-5" />
                    </button>
                  )}

                  {/* BUBARKAN GRUP / KELUAR GRUP */}
                  {activeChat.admin_id === myProfile.chat_id ? (
                    <button onClick={handleDisbandGroup} className={`w-full p-4 rounded-xl flex items-center justify-between font-bold text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 transition-colors`}>
                      <span>{t.disbandGroup}</span>
                      <Icons.Trash className="w-5 h-5" />
                    </button>
                  ) : (
                    <button onClick={handleLeaveGroup} className={`w-full p-4 rounded-xl flex items-center justify-between font-bold text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 transition-colors`}>
                      <span>{t.leaveGroup}</span>
                      <Icons.ArrowLeft className="w-5 h-5 rotate-180" />
                    </button>
                  )}

                  {/* DAFTAR ANGGOTA GRUP */}
                  <div className="mt-8 w-full text-left">
                    <h3 className="font-bold text-xs mb-3 px-1 text-gray-500 uppercase tracking-wider">Anggota ({groupMembers.length})</h3>
                    <div className="space-y-1">
                      {groupMembers.map(member => (
                         <div key={member.chat_id} className={`flex items-center gap-3 p-3 rounded-2xl ${colors.hoverBg} border border-transparent hover:border-gray-200 dark:hover:border-[#313d45] transition-all`}>
                            <Avatar url={member.avatar_url} name={member.username} size="w-10 h-10" />
                            <div className="flex-1 min-w-0">
                               <p className="font-bold text-sm truncate">{member.username}</p>
                               <p className="text-[10px] text-gray-500 truncate">{member.bio || 'Available'}</p>
                            </div>
                            {activeChat.admin_id === member.chat_id && (
                               <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded-full border border-blue-200">Admin</span>
                            )}
                         </div>
                      ))}
                    </div>
                  </div>
               </div>
             ) : (
               /* ======================================= */
               /* TAMPILAN KHUSUS KONTAK PERSONAL         */
               /* ======================================= */
               <>
                 <div className="flex flex-col items-center p-8 border-b border-gray-200 dark:border-[#313d45]">
                    <Avatar url={activeChat.avatar_url} name={activeChat.contact_username} size="w-32 h-32" className="mb-5 shadow-lg border-4 border-gray-100 dark:border-[#313d45]" />
                    <h2 className="text-2xl font-bold mb-1">{activeChat.contact_username}</h2>
                    <p className={`text-sm ${colors.textMuted} mb-3`}>ID: {activeChat.contact_id}</p>
                    
                    <div className="w-full max-w-[260px] overflow-hidden text-center relative group bg-gray-50 dark:bg-black/20 p-2 rounded-xl border border-gray-100 dark:border-gray-700/50">
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
                       <div className={`text-sm font-medium ${colors.text} ${(activeChat.bio?.length > 30) ? 'animate-marquee-custom' : ''}`}>
                         {activeChat.bio || 'Available'}
                       </div>
                    </div>
                 </div>
                 
                 <div className={`p-4 mt-2 space-y-2`}>
                    {/* HANYA ADA DI KONTAK PERSONAL */}
                    <button onClick={() => alert("Fitur Telepon belum tersedia!")} className={`w-full p-4 rounded-xl flex items-center justify-between font-bold ${colors.hoverBg} border ${colors.border} transition-colors`}>
                      <span>Hubungi</span>
                      <div className="text-[#00a884] bg-[#00a884]/10 p-2 rounded-full"><Icons.Chat className="w-5 h-5" /></div>
                    </button>
                    
                    <button onClick={() => openConfirm("Hapus Kontak", `Yakin ingin menghapus ${activeChat.contact_username}? Data obrolan akan hilang permanen.`, async () => {
                       await supabase.from('contacts').delete().eq('contact_id', activeChat.contact_id).eq('user_id', session.user.id);
                       await supabase.from('messages').delete().or(`and(sender_id.eq.${myProfile.chat_id},receiver_id.eq.${activeChat.contact_id}),and(sender_id.eq.${activeChat.contact_id},receiver_id.eq.${myProfile.chat_id})`);
                       setContacts(prev => prev.filter(c => c.contact_id !== activeChat.contact_id));
                       setActiveChat(null);
                    })} className={`w-full p-4 rounded-xl flex items-center justify-between font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 border ${colors.border} transition-colors`}>
                      <span>Hapus Kontak</span>
                      <Icons.Trash className="w-5 h-5" />
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