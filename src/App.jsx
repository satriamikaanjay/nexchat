import { useState, useEffect, useRef, Fragment } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'

// ================= IKON SVG MINIMALIS =================
const Icons = {
  Chat: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
  User: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Settings: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  Search: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>,
  More: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>,
  ArrowLeft: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>,
  Plus: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>,
  Group: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  Send: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>,
  Attach: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
  Reply: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 11l8-8v5c7 0 10 3.5 10 10-2-3-5-4-10-4v5l-8-8z"></path></svg>,
  Download: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path></svg>,
  File: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>,
  Check: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  DoubleCheck: () => <svg width="18" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="18 6 7 17 2 12"></polyline><polyline points="22 6 12 16 11 15"></polyline></svg>,
  Lock: () => <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Phone: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  Video: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>,
  Copy: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>,
  Trash: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>,
  Share: () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>,
  Edit: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
}

const Avatar = ({ url, name, size = 'w-10 h-10', className = '' }) => (
  url ? (
    <img src={url} alt={name} className={`${size} rounded-full object-cover shrink-0 ${className}`} />
  ) : (
    <div className={`${size} rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white shrink-0 ${className}`}>
      {name?.charAt(0).toUpperCase() || '?'}
    </div>
  )
)

const Modal = ({ isOpen, onClose, title, children, colors }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`${colors.panel} border ${colors.border} rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col`}>
        <div className={`p-5 border-b ${colors.border} flex justify-between items-center`}>
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="opacity-50 hover:opacity-100 transition p-1"><Icons.Plus className="rotate-45" /></button>
        </div>
        <div className="p-5 flex-1">{children}</div>
      </div>
    </div>
  )
}

// ================= TEMA KONTRAS TINGGI =================
const dict = {
  id: { chat: 'Pesan', info: 'Sistem', settings: 'Pengaturan', profile: 'Profil', deleteAcc: 'Hapus Entitas', typeMsg: 'Kirim pesan...', noChat: 'Tidak ada percakapan.', theme: 'Tema Tampilan', light: 'Mode Terang', dark: 'Mode Gelap', save: 'Simpan Perubahan' },
}

const getTheme = (name) => {
  if (name === 'light') {
    return { 
      base: 'bg-zinc-50', panel: 'bg-white', border: 'border-zinc-200', text: 'text-zinc-900', textMuted: 'text-zinc-500', 
      primary: 'bg-zinc-900 text-white hover:bg-zinc-800', 
      bubbleMe: 'bg-zinc-900 text-white', bubbleThem: 'bg-white border border-zinc-200 shadow-sm text-zinc-900', 
      navIcon: 'text-zinc-500 hover:text-zinc-900' 
    }
  }
  return { 
    base: 'bg-[#09090b]', panel: 'bg-[#18181b]', border: 'border-white/10', text: 'text-zinc-100', textMuted: 'text-zinc-400', 
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500', 
    bubbleMe: 'bg-indigo-600 text-white', bubbleThem: 'bg-[#27272a] text-zinc-100', 
    navIcon: 'text-zinc-400 hover:text-zinc-100' 
  }
}

const formatDateBadge = (dateString) => {
  const date = new Date(dateString); const today = new Date(); const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return 'Hari Ini'
  if (date.toDateString() === yesterday.toDateString()) return 'Kemarin'
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

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#09090b] text-indigo-500 font-medium tracking-widest text-sm">MEMUAT SISTEM...</div>
  if (!session || !myProfile) return <Auth onLoginSuccess={(user) => fetchMyProfile(user.id)} />

  return <MainApp session={session} myProfile={myProfile} setMyProfile={setMyProfile} />
}

function MainApp({ session, myProfile, setMyProfile }) {
  const [themeName, setThemeName] = useState(localStorage.getItem('app_theme') || 'dark')
  const [activeMenu, setActiveMenu] = useState('chat')
  const [activeChat, setActiveChat] = useState(null) 
  
  const [globalMessages, setGlobalMessages] = useState([])
  const [contacts, setContacts] = useState([])
  const [groups, setGroups] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  
  const [isAddContactOpen, setIsAddContactOpen] = useState(false)
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [contactIdInput, setContactIdInput] = useState('')
  const [groupNameInput, setGroupNameInput] = useState('')

  // State untuk melacak pengguna tak dikenal & pengguna yang diblokir
  const [unknownProfiles, setUnknownProfiles] = useState({})
  const [blockedIds, setBlockedIds] = useState(() => {
    const saved = localStorage.getItem('blocked_ids')
    return saved ? JSON.parse(saved) : []
  })

  const t = dict['id']
  const colors = getTheme(themeName)

  useEffect(() => { localStorage.setItem('app_theme', themeName) }, [themeName])
  useEffect(() => { localStorage.setItem('blocked_ids', JSON.stringify(blockedIds)) }, [blockedIds])

  useEffect(() => {
    const fetchGlobalMessages = async () => {
      const { data } = await supabase.from('messages').select('*').or(`sender_id.eq.${myProfile.chat_id},receiver_id.eq.${myProfile.chat_id}`).order('created_at', { ascending: true })
      if (data) setGlobalMessages(data)
    }
    fetchGlobalMessages()
  }, [myProfile.chat_id])

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    const channel = supabase.channel('global-chat-room')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new;
        // Jangan notifikasi jika pengirim diblokir
        if (blockedIds.includes(msg.sender_id)) return;
        
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
        setContactIdInput(sharedId)
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
      const { data: myGroups } = await supabase.from('group_members').select('group_id, cleared_at, groups(id, name, avatar_url)').eq('user_id', session.user.id)
      if (myGroups) setGroups(myGroups.map(g => ({ ...g.groups, cleared_at: g.cleared_at })))
    }
    initData()
  }, [session.user.id])

  // ================= LOGIKA MENGAMBIL PROFIL UNTUK PENGGUNA TAK DIKENAL =================
  const savedContactIds = contacts.map(c => c.contact_id);
  const unknownContactIds = [...new Set(
    globalMessages
      .filter(m => m.receiver_id === myProfile.chat_id && m.sender_id !== myProfile.chat_id && !savedContactIds.includes(m.sender_id) && !blockedIds.includes(m.sender_id))
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
  }, [JSON.stringify(unknownContactIds)]) // Fetch otomatis setiap ada pesan dari ID baru

  const unknownContacts = unknownContactIds.map(id => ({
    id: `unknown-${id}`,
    contact_id: id,
    contact_username: unknownProfiles[id]?.username || id, // Fallback ke ID jika loading
    avatar_url: unknownProfiles[id]?.avatar_url || null,
    cleared_at: '1970-01-01',
  }));
  // ===============================================================================

  const handleQuickSaveContact = async (contactId, username, avatarUrl) => {
    const { data } = await supabase.from('contacts').insert([{ user_id: session.user.id, contact_id: contactId, contact_username: username, cleared_at: '1970-01-01' }]).select().single()
    if (data) { 
      setContacts([{ ...data, avatar_url: avatarUrl }, ...contacts]); 
    }
  }

  const handleBlockContact = (contactId) => {
    if (window.confirm("Yakin ingin memblokir? Semua pesan dari entitas ini akan disembunyikan.")) {
      setBlockedIds(prev => [...prev, contactId])
      if (activeChat?.contact_id === contactId) setActiveChat(null)
    }
  }

  const executeAddContact = async (e) => {
    e.preventDefault()
    if (!contactIdInput || contactIdInput === myProfile.chat_id) return
    const { data: friendProfile } = await supabase.from('profiles').select('*').eq('chat_id', contactIdInput).single()
    if (!friendProfile) return alert('ID tidak valid.')
    if (contacts.find(c => c.contact_id === contactIdInput)) return alert('Entitas sudah ada di jaringan.')
    
    const { data } = await supabase.from('contacts').insert([{ user_id: session.user.id, contact_id: friendProfile.chat_id, contact_username: friendProfile.username, cleared_at: '1970-01-01' }]).select().single()
    if (data) { setContacts([{ ...data, avatar_url: friendProfile.avatar_url }, ...contacts]); setIsAddContactOpen(false); setContactIdInput('') }
  }

  const executeCreateGroup = async (e) => {
    e.preventDefault()
    if (!groupNameInput.trim()) return
    const groupId = 'group-' + crypto.randomUUID().substring(0, 8)
    await supabase.from('groups').insert([{ id: groupId, name: groupNameInput, created_by: session.user.id }])
    await supabase.from('group_members').insert([{ group_id: groupId, user_id: session.user.id, cleared_at: '1970-01-01' }])
    setGroups([{ id: groupId, name: groupNameInput, cleared_at: '1970-01-01' }, ...groups])
    setIsCreateGroupOpen(false); setGroupNameInput('')
  }

  const handleDeleteContact = async (e, contactId) => {
    e.stopPropagation()
    if (!window.confirm("Hapus kontak ini dari daftar Anda?")) return
    const { error } = await supabase.from('contacts').delete().eq('contact_id', contactId).eq('user_id', session.user.id)
    if (!error) {
      setContacts(contacts.filter(c => c.contact_id !== contactId))
      if (activeChat?.contact_id === contactId) setActiveChat(null)
    }
  }

 return (
    <div className={`flex fixed inset-0 w-full font-sans overflow-hidden ${colors.base} ${colors.text}`}>
      
      {/* SIDEBAR DESKTOP & MOBILE NAVIGATION */}
      <div className={`flex flex-col h-full w-full md:w-[360px] lg:w-[400px] border-r ${colors.border} ${colors.panel} ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header Sidebar */}
        <div className={`flex items-center justify-between p-4 border-b ${colors.border} h-[72px] shrink-0`}>
          <div className="flex items-center gap-3">
            <Avatar url={myProfile.avatar_url} name={myProfile.username} size="w-10 h-10" />
            <h1 className="font-bold text-lg hidden sm:block">NexChat</h1>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setActiveMenu('chat')} className={`p-2 rounded-lg transition ${activeMenu === 'chat' ? colors.primary : colors.navIcon}`}><Icons.Chat /></button>
            <button onClick={() => setActiveMenu('profile')} className={`p-2 rounded-lg transition ${activeMenu === 'profile' ? colors.primary : colors.navIcon}`}><Icons.User /></button>
            <button onClick={() => setActiveMenu('settings')} className={`p-2 rounded-lg transition ${activeMenu === 'settings' ? colors.primary : colors.navIcon}`}><Icons.Settings /></button>
            <div className="relative">
              <button onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)} className={`p-2 rounded-lg transition ${colors.navIcon}`}><Icons.More /></button>
              {isHeaderMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 ${colors.panel} border ${colors.border} rounded-xl shadow-xl z-50 overflow-hidden`}>
                  <button onClick={() => supabase.auth.signOut()} className="w-full text-left px-4 py-3 text-red-500 font-medium text-sm hover:bg-black/5">Keluar Sesi</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <Modal isOpen={isAddContactOpen} onClose={() => setIsAddContactOpen(false)} title="Tambah Kontak" colors={colors}>
          <form onSubmit={executeAddContact} className="space-y-4">
            <div>
              <label className={`text-xs font-medium mb-1.5 block ${colors.textMuted}`}>ID Pengguna</label>
              <input type="text" value={contactIdInput} onChange={(e) => setContactIdInput(e.target.value)} placeholder="ID unik" className={`w-full p-3 rounded-xl bg-transparent border ${colors.border} focus:outline-none focus:border-indigo-500`} />
            </div>
            <button type="submit" className={`w-full ${colors.primary} font-medium p-3 rounded-xl transition`}>Tambahkan</button>
          </form>
        </Modal>
        <Modal isOpen={isCreateGroupOpen} onClose={() => setIsCreateGroupOpen(false)} title="Buat Grup" colors={colors}>
          <form onSubmit={executeCreateGroup} className="space-y-4">
            <div>
              <label className={`text-xs font-medium mb-1.5 block ${colors.textMuted}`}>Nama Grup</label>
              <input type="text" value={groupNameInput} onChange={(e) => setGroupNameInput(e.target.value)} placeholder="Ketik nama grup" className={`w-full p-3 rounded-xl bg-transparent border ${colors.border} focus:outline-none focus:border-indigo-500`} />
            </div>
            <button type="submit" className={`w-full ${colors.primary} font-medium p-3 rounded-xl transition`}>Inisialisasi</button>
          </form>
        </Modal>

        {/* Konten Tab Kiri */}
        <div className="flex-1 overflow-y-auto" onClick={() => setIsHeaderMenuOpen(false)}>
          {activeMenu === 'profile' && <ProfileModule session={session} myProfile={myProfile} setMyProfile={setMyProfile} t={t} colors={colors} />}
          {activeMenu === 'settings' && (
            <div className="p-6">
              <h2 className="text-xl font-bold mb-6">{t.settings}</h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium mb-2 ${colors.textMuted}`}>{t.theme}</label>
                  <select value={themeName} onChange={(e) => setThemeName(e.target.value)} className={`w-full p-3 rounded-xl bg-transparent border ${colors.border} outline-none`}>
                    <option value="dark">{t.dark}</option><option value="light">{t.light}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {activeMenu === 'chat' && (
            <div className="flex flex-col h-full relative">
              <div className={`p-4 border-b ${colors.border} flex gap-2 shrink-0`}>
                <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border ${colors.border} ${colors.textMuted}`}>
                  <Icons.Search />
                  <input type="text" placeholder="Cari percakapan..." className="bg-transparent border-none outline-none w-full text-sm text-current" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {/* 1. Render Grup */}
                {groups.map(g => {
                  const unreadCount = globalMessages.filter(m => m.group_id === g.id && m.sender_id !== myProfile.chat_id && !m.is_read && !blockedIds.includes(m.sender_id)).length;
                  return (
                    <div key={g.id} onClick={() => setActiveChat({...g, type: 'group'})} className={`p-4 border-b ${colors.border} cursor-pointer hover:bg-black/5 flex items-center gap-3 ${activeChat?.id === g.id ? 'bg-black/5' : ''}`}>
                      <Avatar url={g.avatar_url} name={g.name} size="w-12 h-12" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{g.name}</h3>
                        {unreadCount > 0 ? (
                          <p className="text-xs font-bold text-indigo-500 mt-0.5 truncate">Pesan baru belum dibaca</p>
                        ) : (
                          <p className={`text-xs truncate mt-0.5 ${colors.textMuted}`}>Grup Obrolan</p>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <div className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{unreadCount}</div>
                      )}
                    </div>
                  )
                })}
                
                {contacts.length === 0 && groups.length === 0 && unknownContacts.length === 0 ? (
                   <div className={`p-8 text-center text-sm ${colors.textMuted}`}>Belum ada percakapan.</div>
                ) : (
                  <>
                    {/* 2. Render Kontak Belum Tersimpan (DARI PESAN BARU MASUK) */}
                    {unknownContacts.map(c => {
                      const isOnline = onlineUsers.includes(c.contact_id);
                      const unreadCount = globalMessages.filter(m => m.sender_id === c.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read).length;

                      return (
                        <div key={c.id} onClick={() => setActiveChat({...c, type: 'personal'})} className={`p-4 border-b ${colors.border} cursor-pointer hover:bg-indigo-500/5 flex items-center gap-3 transition group ${activeChat?.contact_id === c.contact_id ? 'bg-indigo-500/10' : ''}`}>
                          <div className="relative">
                            <Avatar url={c.avatar_url} name={c.contact_username} size="w-12 h-12" />
                            {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#18181b] rounded-full"></span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-sm truncate ${unreadCount > 0 ? 'font-bold text-current' : 'font-medium'}`}>
                              {c.contact_id} {c.contact_username && c.contact_username !== c.contact_id ? `(${c.contact_username})` : ''}
                              {/* Label Baru hanya muncul selama pesan belum dibaca! Jika chat dibuka, unreadCount akan 0 dan label otomatis hilang */}
                              {unreadCount > 0 && <span className="text-[10px] font-bold bg-indigo-500/10 text-indigo-500 px-1.5 py-0.5 rounded ml-2 uppercase">Baru</span>}
                            </h3>
                            {unreadCount > 0 ? (
                              <p className="text-xs font-bold text-indigo-500 mt-0.5 truncate">Pesan baru belum dibaca</p>
                            ) : (
                              <p className={`text-xs truncate mt-0.5 ${colors.textMuted}`}>Belum ada di kontak</p>
                            )}
                          </div>
                        </div>
                      )
                    })}

                    {/* 3. Render Kontak Tersimpan */}
                    {contacts.map(c => {
                      const isOnline = onlineUsers.includes(c.contact_id);
                      const clearedAtTime = new Date(c.cleared_at || '1970-01-01').getTime();
                      const unreadCount = globalMessages.filter(m => {
                        const isNotCleared = new Date(m.created_at).getTime() > clearedAtTime;
                        return isNotCleared && m.sender_id === c.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read;
                      }).length;

                      return (
                        <div key={c.id} onClick={() => setActiveChat({...c, type: 'personal'})} className={`p-4 border-b ${colors.border} cursor-pointer hover:bg-black/5 flex items-center gap-3 transition group ${activeChat?.contact_id === c.contact_id ? 'bg-black/5' : ''}`}>
                          <div className="relative">
                            <Avatar url={c.avatar_url} name={c.contact_username} size="w-12 h-12" />
                            {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#18181b] rounded-full"></span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Kontak yang disimpan HANYA menampilkan Nama */}
                            <h3 className={`text-sm truncate ${unreadCount > 0 ? 'font-bold text-current' : 'font-medium'}`}>{c.contact_username}</h3>
                            {unreadCount > 0 ? (
                              <p className="text-xs font-bold text-indigo-500 mt-0.5 truncate">Pesan baru belum dibaca</p>
                            ) : (
                              <p className={`text-xs truncate mt-0.5 ${colors.textMuted}`}>ID: {c.contact_id}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                              <div className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{unreadCount}</div>
                            )}
                            <button onClick={(e) => handleDeleteContact(e, c.contact_id)} className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all ${colors.textMuted}`} title="Hapus Kontak">
                              <Icons.Trash />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
              <div className="absolute bottom-6 right-4 flex flex-col gap-3">
                <button onClick={() => setIsCreateGroupOpen(true)} className={`w-12 h-12 rounded-full ${colors.panel} border ${colors.border} shadow-lg flex items-center justify-center transition hover:scale-105`}><Icons.Group /></button>
                <button onClick={() => setIsAddContactOpen(true)} className={`w-14 h-14 rounded-full ${colors.primary} shadow-lg flex items-center justify-center transition hover:scale-105`}><Icons.Plus /></button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AREA KANAN (RUANG OBROLAN UTAMA) */}
      <div className={`flex-1 h-full flex flex-col relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {!activeChat ? (
           <div className={`flex-1 flex flex-col items-center justify-center ${colors.base}`}>
              <div className={`w-20 h-20 mb-4 rounded-full bg-black/5 flex items-center justify-center ${colors.textMuted}`}><Icons.Chat /></div>
              <p className={`font-medium ${colors.textMuted}`}>Pilih obrolan untuk mulai mengirim pesan</p>
           </div>
        ) : (
          <ChatRoom 
            key={activeChat.id || activeChat.contact_id}
            session={session} myProfile={myProfile} t={t} colors={colors} 
            activeChat={activeChat} setActiveChat={setActiveChat} 
            contacts={contacts} setContacts={setContacts} groups={groups} setGroups={setGroups} 
            globalMessages={globalMessages} setGlobalMessages={setGlobalMessages} onlineUsers={onlineUsers}
            onQuickSave={handleQuickSaveContact} onBlock={handleBlockContact} blockedIds={blockedIds}
          />
        )}
      </div>
    </div>
  )
}

function ProfileModule({ session, myProfile, setMyProfile, t, colors }) {
  const [newUsername, setNewUsername] = useState(myProfile.username)
  const [isSaving, setIsSaving] = useState(false); const [isUploading, setIsUploading] = useState(false); const fileInputRef = useRef(null)

  const handleUpdateName = async () => {
    if (!newUsername.trim() || newUsername === myProfile.username) return
    setIsSaving(true)
    const { error } = await supabase.from('profiles').update({ username: newUsername }).eq('id', session.user.id)
    if (!error) setMyProfile({ ...myProfile, username: newUsername })
    setIsSaving(false)
  }

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0]; if (!file) return; setIsUploading(true)
    const fileExt = file.name.split('.').pop(); const filePath = `${session.user.id}/avatar.${fileExt}` 
    const { error } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const urlWithCacheBuster = `${data.publicUrl}?v=${Date.now()}` 
      await supabase.from('profiles').update({ avatar_url: urlWithCacheBuster }).eq('id', session.user.id)
      setMyProfile({ ...myProfile, avatar_url: urlWithCacheBuster })
    }
    setIsUploading(false)
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col items-center mt-4">
        <div className="relative group cursor-pointer mb-4" onClick={() => fileInputRef.current.click()}>
          <Avatar url={myProfile.avatar_url} name={myProfile.username} size="w-32 h-32" className="group-hover:opacity-50 transition" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-xs font-medium text-white bg-black/50 px-3 py-1.5 rounded-full">{isUploading ? '...' : 'Ubah Foto'}</span>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleUploadAvatar} accept="image/*" className="hidden" />
        </div>
        <h2 className="text-xl font-bold">{myProfile.username}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${colors.textMuted}`}>Nama Layar</label>
          <div className="flex gap-2">
            <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className={`flex-1 p-3 rounded-xl bg-transparent border ${colors.border} outline-none focus:border-indigo-500 text-sm`} />
            <button onClick={handleUpdateName} disabled={isSaving || newUsername === myProfile.username} className={`${colors.primary} px-5 rounded-xl text-sm font-medium transition disabled:opacity-50`}>{isSaving ? '...' : t.save}</button>
          </div>
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${colors.textMuted}`}>ID Unik</label>
          <div className="flex gap-2">
            <input type="text" value={myProfile.chat_id} readOnly className={`flex-1 p-3 rounded-xl bg-black/5 border ${colors.border} font-mono outline-none text-sm`} />
            <button onClick={() => navigator.clipboard.writeText(myProfile.chat_id)} className={`bg-black/5 hover:bg-black/10 border ${colors.border} px-4 rounded-xl text-sm font-medium transition flex items-center justify-center`}><Icons.Copy /></button>
          </div>
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1.5 ${colors.textMuted}`}>Bagikan Profil</label>
          <button 
            onClick={() => {
              const link = `${window.location.origin}/?id=${myProfile.chat_id}`
              navigator.clipboard.writeText(link)
              alert('Link profil disalin! Bagikan ke teman untuk mulai mengobrol.')
            }}
            className={`w-full p-3 rounded-xl border ${colors.border} bg-black/5 hover:bg-black/10 font-medium text-sm transition flex items-center justify-center gap-2`}
          >
            <Icons.Share /> <span>Salin Link Undangan</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function ChatRoom({ session, myProfile, t, colors, activeChat, setActiveChat, contacts, setContacts, groups, setGroups, globalMessages, setGlobalMessages, onlineUsers, onQuickSave, onBlock, blockedIds }) {
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false)
  
  const [replyingTo, setReplyingTo] = useState(null)
  const [activeMsgId, setActiveMsgId] = useState(null)
  const [editingMsg, setEditingMsg] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const mediaInputRef = useRef(null); const channelRef = useRef(null); const messagesEndRef = useRef(null); const typingTimeoutRef = useRef(null)

  // LOGIKA PENGGUNA BELUM DIKENAL
  const isSavedContact = activeChat.type === 'personal' && contacts.some(c => c.contact_id === activeChat.contact_id);
  const isUnknownContact = activeChat.type === 'personal' && !isSavedContact;

  useEffect(() => { setIsHeaderMenuOpen(false); setIsContactInfoOpen(false); setReplyingTo(null); setEditingMsg(null); setActiveMsgId(null); setIsTyping(false); setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100) }, [activeChat])

  useEffect(() => {
    if (!activeChat) return;
    const roomName = activeChat.type === 'group' 
      ? `typing-room-${activeChat.id}` 
      : `typing-room-${[myProfile.chat_id, activeChat.contact_id].sort().join('-')}`;
      
    const channel = supabase.channel(roomName)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.sender_id !== myProfile.chat_id) setIsTyping(payload.status)
      }).subscribe()

    channelRef.current = channel; 
    return () => { supabase.removeChannel(channel) }
  }, [activeChat, myProfile.chat_id])

  // OPTIMISTIC UI UPDATE: Pesan otomatis dibaca. 
  // Karena pesan dibaca, label 'Baru' akan langsung menghilang secara real-time!
  useEffect(() => {
    if (!activeChat || activeChat.type === 'group') return
    const unreadMsgs = globalMessages.filter(m => m.sender_id === activeChat.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read)
    if (unreadMsgs.length > 0) {
      setGlobalMessages(prev => prev.map(m => (m.sender_id === activeChat.contact_id && m.receiver_id === myProfile.chat_id && !m.is_read) ? { ...m, is_read: true } : m));
      supabase.from('messages').update({ is_read: true }).in('id', unreadMsgs.map(m => m.id)).then()
    }
  }, [activeChat, globalMessages, myProfile.chat_id, setGlobalMessages])

  const handleClearChatLocal = async () => {
    if (!window.confirm("Sembunyikan riwayat obrolan ini dari layar Anda? (Lawan bicara tetap bisa melihatnya)")) return
    setIsHeaderMenuOpen(false)
    const now = new Date().toISOString()
    
    if (activeChat.type === 'group') {
      await supabase.from('group_members').update({ cleared_at: now }).eq('group_id', activeChat.id).eq('user_id', session.user.id)
      setGroups(groups.map(g => g.id === activeChat.id ? { ...g, cleared_at: now } : g))
      setActiveChat(prev => ({ ...prev, cleared_at: now }))
    } else {
      await supabase.from('contacts').update({ cleared_at: now }).eq('contact_id', activeChat.contact_id).eq('user_id', session.user.id)
      setContacts(contacts.map(c => c.contact_id === activeChat.contact_id ? { ...c, cleared_at: now } : c))
      setActiveChat(prev => ({ ...prev, cleared_at: now }))
    }
  }

  const handleTyping = (e) => {
    setInputMessage(e.target.value)
    if (channelRef.current && activeChat) {
      channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { sender_id: myProfile.chat_id, status: true } })
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => { channelRef.current.send({ type: 'broadcast', event: 'typing', payload: { sender_id: myProfile.chat_id, status: false } }) }, 2000)
    }
  }

 const handleSendMessage = async (e) => {
    e.preventDefault(); 
    if (!inputMessage.trim()) return;

    // JIKA SEDANG MODE EDIT
    if (editingMsg) {
      await supabase.from('messages').update({ content: inputMessage }).eq('id', editingMsg.id);
      setEditingMsg(null);
      setInputMessage('');
      return;
    }

    // JIKA MENGIRIM PESAN BARU (KODE LAMA)
    const payload = { sender_id: myProfile.chat_id, content: inputMessage, is_read: false, reply_to_id: replyingTo?.id || null }
    if (activeChat.type === 'group') payload.group_id = activeChat.id; else payload.receiver_id = activeChat.contact_id
    await supabase.from('messages').insert([payload]); setInputMessage(''); setReplyingTo(null)
    channelRef.current?.send({ type: 'broadcast', event: 'typing', payload: { sender_id: myProfile.chat_id, status: false } })
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
      if (activeChat.type === 'group') payload.group_id = activeChat.id; else payload.receiver_id = activeChat.contact_id
      await supabase.from('messages').insert([payload]); setInputMessage(''); setReplyingTo(null)
    }
    setIsUploading(false); e.target.value = ''
  }

  const clearedAtTime = new Date(activeChat.cleared_at || '1970-01-01').getTime();
  const filteredMessages = globalMessages.filter(msg => {
    if (blockedIds.includes(msg.sender_id)) return false; // Jangan tampilkan jika diblokir
    const msgTime = new Date(msg.created_at).getTime();
    if (msgTime <= clearedAtTime) return false;
    if (activeChat?.type === 'group') return msg.group_id === activeChat.id
    return (msg.sender_id === myProfile.chat_id && msg.receiver_id === activeChat?.contact_id) || (msg.sender_id === activeChat?.contact_id && msg.receiver_id === myProfile.chat_id)
  })

  let lastDateLabel = null

  return (
    <>
      <Modal isOpen={isContactInfoOpen} onClose={() => setIsContactInfoOpen(false)} title="Informasi Entitas" colors={colors}>
        <div className="flex flex-col items-center space-y-5 pb-2">
          <Avatar url={activeChat?.avatar_url} name={activeChat?.type === 'group' ? activeChat?.name : activeChat?.contact_username} size="w-24 h-24" className="shadow-sm" />
          <div className="text-center">
            <h2 className="text-xl font-bold">{activeChat?.type === 'group' ? activeChat?.name : activeChat?.contact_username}</h2>
            <p className={`text-xs font-medium mt-1 uppercase tracking-wider ${onlineUsers.includes(activeChat?.contact_id) ? 'text-indigo-500' : colors.textMuted}`}>
              {activeChat?.type === 'group' ? 'Grup Obrolan' : (onlineUsers.includes(activeChat?.contact_id) ? 'Status: Aktif' : 'Status: Nonaktif')}
            </p>
          </div>
          <div className={`w-full p-4 rounded-xl border ${colors.border} bg-black/5 flex items-center justify-between`}>
            <div>
              <p className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${colors.textMuted}`}>ID Sistem</p>
              <p className="font-mono text-sm">{activeChat?.type === 'group' ? activeChat?.id : activeChat?.contact_id}</p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(activeChat?.type === 'group' ? activeChat?.id : activeChat?.contact_id)} className={`p-2 rounded-lg bg-black/5 hover:bg-black/10 transition ${colors.textMuted} hover:text-indigo-500`}>
              <Icons.Copy />
            </button>
          </div>
        </div>
      </Modal>

      {/* Header Chat */}
      <div className={`h-[72px] flex items-center justify-between px-4 border-b ${colors.border} ${colors.panel} shrink-0`}>
        <div className="flex items-center gap-3 flex-1 min-w-0 group cursor-pointer" onClick={() => setIsContactInfoOpen(true)}>
          <button onClick={(e) => { e.stopPropagation(); setActiveChat(null) }} className="md:hidden p-2 -ml-2 text-current"><Icons.ArrowLeft /></button>
          <Avatar url={activeChat.avatar_url} name={activeChat.type === 'group' ? activeChat.name : activeChat.contact_username} size="w-10 h-10" className="group-hover:opacity-80 transition" />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold truncate group-hover:text-indigo-500 transition">{activeChat.type === 'group' ? activeChat.name : activeChat.contact_username}</h2>
            <p className={`text-xs mt-0.5 truncate transition-colors ${isTyping || onlineUsers.includes(activeChat.contact_id) ? 'text-indigo-500' : colors.textMuted}`}>
              {activeChat.type === 'group' ? 'Grup' : (isTyping ? 'mengetik...' : (onlineUsers.includes(activeChat.contact_id) ? 'online' : 'offline'))}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button className={`p-2 rounded-lg opacity-50 hover:opacity-100 transition`}><Icons.Phone /></button>
          <button className={`p-2 rounded-lg opacity-50 hover:opacity-100 transition`}><Icons.Video /></button>
          <div className="relative">
            <button onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)} className={`p-2 rounded-lg opacity-50 hover:opacity-100 transition`}><Icons.More /></button>
            {isHeaderMenuOpen && (
              <div className={`absolute right-0 mt-2 w-48 ${colors.panel} border ${colors.border} rounded-xl shadow-xl z-50 overflow-hidden`}>
                <button onClick={handleClearChatLocal} className="w-full text-left px-4 py-3 text-red-500 font-medium text-sm hover:bg-black/5">Sembunyikan Riwayat</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Area Chat */}
      <div className="flex-1 overflow-y-auto space-y-3 relative" onClick={() => { setIsHeaderMenuOpen(false); setActiveMsgId(null); }}>
        
        {/* BANNER: Simpan atau Blokir Kontak jika belum dikenal */}
        {isUnknownContact && (
           <div className={`sticky top-0 z-10 mx-4 mt-4 p-3 rounded-xl border ${colors.border} bg-indigo-500/10 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm`}>
             <p className={`text-xs font-medium`}>Nomor ini tidak ada di daftar kontak Anda.</p>
             <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={() => onQuickSave(activeChat.contact_id, activeChat.contact_username, activeChat.avatar_url)} className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-sm">Simpan Kontak</button>
                <button onClick={() => onBlock(activeChat.contact_id)} className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-red-500/50 text-red-500 bg-red-500/5 text-xs font-bold hover:bg-red-500/20 transition">Blokir</button>
             </div>
           </div>
        )}

        <div className={`p-4 space-y-3 ${isUnknownContact ? 'pt-0' : ''}`}>
          <div className="flex justify-center mb-6">
            <div className={`text-[10px] font-medium px-4 py-1.5 rounded-full border ${colors.border} ${colors.textMuted} flex items-center gap-1.5`}>
              <Icons.Lock /> <span>Enkripsi Ujung-ke-Ujung Aktif</span>
            </div>
          </div>

          {filteredMessages.map((msg, idx) => {
            const isMe = msg.sender_id === myProfile.chat_id
            const dateLabel = formatDateBadge(msg.created_at)
            const prevMsg = idx > 0 ? filteredMessages[idx - 1] : null
            const showDateBadge = !prevMsg || formatDateBadge(prevMsg.created_at) !== dateLabel
            const timeString = new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            const repliedMsg = msg.reply_to_id ? globalMessages.find(m => m.id === msg.reply_to_id) : null
            const isActive = activeMsgId === msg.id

            return (
              <Fragment key={msg.id}>
                {showDateBadge && (
                  <div className="flex justify-center my-6">
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-3 py-1 rounded-full bg-black/5 ${colors.textMuted}`}>{dateLabel}</span>
                  </div>
                )}

                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] group ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                  {activeChat.type === 'group' && !isMe && <span className={`text-[10px] font-medium ml-3 mb-1 ${colors.textMuted}`}>{msg.sender_id}</span>}
                  
                  <div className={`relative flex items-center gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Actions (Copy, Reply, Edit) */}


                    {/* Bubble Pesan */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); setActiveMsgId(isActive ? null : msg.id); }}
                      className={`p-1 shadow-sm relative flex flex-col transition-all duration-200 cursor-pointer ${isMe ? `${colors.bubbleMe} rounded-2xl rounded-tr-sm` : `${colors.bubbleThem} rounded-2xl rounded-tl-sm`} ${isActive ? 'ring-2 ring-indigo-500/50' : ''}`}
                    >
                      <div className="px-2.5 pt-2 pb-1.5 flex flex-col gap-1.5 min-w-[100px] max-w-full overflow-hidden">
  
  {repliedMsg && (
    <div className={`p-2 rounded-lg border-l-2 border-current opacity-80 text-xs overflow-hidden flex flex-col min-w-0 ${isMe ? 'bg-black/10' : 'bg-black/5'}`}>
      <p className="font-medium mb-0.5 truncate">{repliedMsg.sender_id === myProfile.chat_id ? 'Anda' : repliedMsg.sender_id}</p>
      <p className="line-clamp-2 break-words whitespace-normal">{repliedMsg.content || 'Berkas Terlampir'}</p>
    </div>
  )}

                        {msg.media_files && msg.media_files.length > 0 && (
                          <div className={`grid gap-1 ${msg.media_files.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {msg.media_files.map((file, idx) => (
                              <div key={idx} className="relative group/media overflow-hidden rounded-xl border border-black/5 bg-black/10">
                                {file.type === 'image' && <img src={file.url} alt="Media" className="object-cover w-full h-48 sm:h-56" />}
                                {file.type === 'video' && <video src={file.url} controls className="w-full h-48 sm:h-56" />}
                                {file.type === 'document' && <div className="flex items-center gap-2 p-3 text-sm"><Icons.File /> <span className="truncate max-w-[120px] font-medium">{file.name}</span></div>}
                                
                                <a href={file.url} target="_blank" rel="noreferrer" download={file.name} className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md opacity-0 group-hover/media:opacity-100 transition shadow-sm ${isMe ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-black/50 text-white hover:bg-black/70'}`} title="Download">
                                  <Icons.Download />
                                </a>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-end gap-3 justify-between mt-0.5">
                          <p className="text-[14px] break-words whitespace-pre-wrap leading-relaxed max-w-full px-1">{msg.content}</p>
                          <div className={`flex items-center gap-1 text-[10px] font-mono whitespace-nowrap float-right shrink-0 ${isMe ? 'opacity-80' : colors.textMuted}`}>
                            <span>{timeString}</span>
                            {isMe && <span>{msg.is_read ? <Icons.DoubleCheck /> : <Icons.Check />}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`transition-opacity flex items-center gap-1.5 px-2 ${isActive ? 'opacity-100' : 'opacity-0 md:group-hover:opacity-100'}`}>
  
  {/* Tombol Copy */}
  <button 
    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(msg.content); setActiveMsgId(null); }} 
    className={`p-1.5 rounded-full bg-black/5 hover:bg-black/10 ${colors.textMuted} hover:text-emerald-500 transition`} 
    title="Salin">
    <Icons.Copy />
  </button>

  {/* Tombol Reply */}
  <button 
    onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); setEditingMsg(null); setActiveMsgId(null); }} 
    className={`p-1.5 rounded-full bg-black/5 hover:bg-black/10 ${colors.textMuted} hover:text-indigo-500 transition`} 
    title="Balas">
    <Icons.Reply />
  </button>

  {/* Tombol Edit (Hanya muncul jika pesan milik sendiri) */}
  {msg.sender_id === myProfile.chat_id && (
    <button 
      onClick={(e) => { e.stopPropagation(); setEditingMsg(msg); setInputMessage(msg.content); setReplyingTo(null); setActiveMsgId(null); }} 
      className={`p-1.5 rounded-full bg-black/5 hover:bg-black/10 ${colors.textMuted} hover:text-amber-500 transition`} 
      title="Edit">
      <Icons.Edit />
    </button>
  )}
</div>
                  </div>
                </div>
              </Fragment>
            )
          })}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Area Input Chat */}
      {/* Area Input Chat */}
      <div 
        className={`p-3 flex flex-col gap-2 ${colors.panel} border-t ${colors.border} shrink-0`}
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        {editingMsg && (
          <div className="flex justify-between items-center bg-amber-500/10 rounded-xl p-2.5 mx-1 border border-amber-500/20">
            <div className="border-l-2 border-amber-500 pl-3 flex-1 overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-0.5">Mengedit Pesan</p>
              <p className={`text-xs truncate ${colors.textMuted}`}>{editingMsg.content}</p>
            </div>
            <button onClick={() => { setEditingMsg(null); setInputMessage(''); }} className={`p-2 rounded-full hover:bg-black/10 ${colors.textMuted}`}>
              <Icons.Plus className="rotate-45" />
            </button>
          </div>
        )}
        {replyingTo && (
          <div className="flex justify-between items-center bg-black/5 rounded-xl p-2.5 mx-1">
            <div className="border-l-2 border-indigo-500 pl-3 flex-1 overflow-hidden">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-0.5">Membalas {replyingTo.sender_id === myProfile.chat_id ? 'Diri Sendiri' : replyingTo.sender_id}</p>
              <p className={`text-xs truncate ${colors.textMuted}`}>{replyingTo.content || 'Berkas Terlampir'}</p>
            </div>
            <button onClick={() => setReplyingTo(null)} className={`p-2 rounded-full hover:bg-black/10 ${colors.textMuted}`}><Icons.Plus className="rotate-45" /></button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
          <input type="file" multiple ref={mediaInputRef} onChange={handleSendMedia} className="hidden" />
          <button type="button" disabled={isUploading} onClick={() => mediaInputRef.current.click()} className={`p-3 rounded-xl hover:bg-black/5 transition shrink-0 ${colors.textMuted} ${isUploading ? 'animate-pulse' : ''}`}>
            <Icons.Attach />
          </button>
          
          <div className={`flex-1 bg-black/5 rounded-2xl min-h-[44px] flex items-center border border-transparent focus-within:border-indigo-500/30 transition`}>
            <input type="text" value={inputMessage} onChange={handleTyping} placeholder={isUploading ? 'Menyiapkan berkas...' : t.typeMsg} className="w-full bg-transparent p-3 text-sm outline-none" />
          </div>
          
          <button type="submit" disabled={!inputMessage.trim() && !isUploading} className={`w-[44px] h-[44px] flex items-center justify-center rounded-2xl ${colors.primary} shrink-0 shadow-sm disabled:opacity-50 transition`}>
            <Icons.Send />
          </button>
        </form>
      </div>
    </>
  )
}
