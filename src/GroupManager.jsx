import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; // Sesuaikan path jika berbeda

// Helper Icon Lokal (Jika di file terpisah dan tidak bisa akses Icons dari App.jsx)
const SearchIcon = (props) => <svg {...props} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>;
const PlusIcon = (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>;

export default function GroupManager({ session, myProfile, colors, activeChat, setActiveChat, groups, t, setGroups, globalMessages }) {
  
  // State untuk Search Terpadu
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // State untuk Modal Buat Grup
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Efek Pencarian Global (Berdasarkan Nama ATAU ID)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) { 
        setSearchResults([]); 
        return; 
      }
      
      setIsSearching(true);
      
      // Query Supabase: Cari yang ID-nya sama persis ATAU namanya mirip
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .or(`id.eq.${searchQuery},name.ilike.%${searchQuery}%`)
        .limit(15);

      if (!error && data) {
        setSearchResults(data);
      }
      setIsSearching(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    setIsCreating(true);

    const groupId = `grp_${Date.now()}`;
    const { data, error } = await supabase.from('groups').insert([{
      id: groupId,
      name: newGroupName,
      admin_id: myProfile.chat_id
    }]).select().single();

    if (!error && data) {
      await supabase.from('group_members').insert([{
        group_id: groupId,
        user_id: myProfile.chat_id
      }]);
      setGroups(prev => [data, ...prev]);
      setNewGroupName('');
      setIsCreateModalOpen(false); // Tutup modal setelah sukses
    } else {
      alert("Gagal membuat grup.");
    }
    setIsCreating(false);
  };

  const handleJoinGroup = async (groupToJoin, e) => {
    e.stopPropagation(); // Mencegah klik tembus ke container
    const { error } = await supabase.from('group_members').insert([{
      group_id: groupToJoin.id,
      user_id: myProfile.chat_id
    }]);

    if (!error) {
      setGroups(prev => [groupToJoin, ...prev]);
      setSearchQuery(''); // Reset pencarian setelah gabung
      alert(`Berhasil bergabung ke grup ${groupToJoin.name}!`);
    } else {
      alert("Gagal bergabung. Pastikan Anda belum ada di dalam grup ini.");
    }
  };

  // Data yang akan di-render: Hasil pencarian JIKA sedang mencari, jika tidak tampilkan grup saya
  const displayGroups = searchQuery.trim() ? searchResults : groups;

  return (
    <div className="flex flex-col min-h-full relative bg-transparent">
      
      {/* 1. Search Bar (Nempel di atas) */}
      <div className={`p-4 border-b ${colors.border} shrink-0 bg-transparent sticky top-0 z-10 backdrop-blur-xl`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${colors.inputBg} border ${colors.border} transition-all focus-within:border-[#0C8F5B] dark:focus-within:border-[#78C951] focus-within:ring-1 focus-within:ring-[#0C8F5B] dark:focus-within:ring-[#78C951]`}>
          <SearchIcon className={`${colors.textMuted} w-4 h-4`} />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder={t.searchId || "Cari ID atau Nama Grup..."} 
            className={`bg-transparent border-none outline-none w-full text-sm font-medium ${colors.text} placeholder-gray-400 dark:placeholder-[#3D5A4C]`} 
          />
        </div>
      </div>

      {/* 2. Daftar Grup / Hasil Pencarian */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 pb-28 scrollbar-hide">
        {isSearching ? (
          <p className={`text-center text-sm ${colors.textMuted} mt-4`}>Mencari...</p>
        ) : displayGroups.length === 0 ? (
          <p className={`text-center text-sm ${colors.textMuted} mt-4`}>
            {searchQuery.trim() ? 'Grup tidak ditemukan.' : 'Anda belum bergabung ke grup manapun.'}
          </p>
        ) : (
          displayGroups.map(grp => {
            // Cek apakah user sudah join grup ini
            const isJoined = groups.some(g => g.id === grp.id);
            
            // Hitung Unread Count (hanya jika sudah join)
            const unreadCount = (isJoined && globalMessages) ? globalMessages.filter(m => 
              m.receiver_id === grp.id && 
              m.sender_id !== myProfile.chat_id && 
              !m.is_read
            ).length : 0;

            return (
              <div 
                key={grp.id} 
                onClick={() => isJoined ? setActiveChat({ contact_id: grp.id, contact_username: grp.name, type: 'group', ...grp }) : null}
                className={`p-3 rounded-2xl flex items-center gap-4 transition-all ${isJoined ? 'cursor-pointer ' + colors.hoverBg : 'cursor-default'} ${activeChat?.contact_id === grp.id ? colors.inputBg + ' border border-[#78C951]/30' : 'border border-transparent'}`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg overflow-hidden border border-gray-200 shrink-0">
                  {grp.avatar_url ? <img src={grp.avatar_url} className="w-full h-full object-cover" /> : (grp.name || '?').charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`text-base truncate ${unreadCount > 0 ? 'font-black ${colors.text}' : 'font-bold'}`}>
                      {grp.name}
                      {/* LABEL BARU (Jika belum join) */}
                      {!isJoined && (
                        <span className="ml-2 px-2 py-0.5 bg-[#0C8F5B] text-white dark:bg-[#78C951] dark:text-[#0A140F] text-[9px] uppercase tracking-widest font-black rounded-full shadow-sm">
                          Baru
                        </span>
                      )}
                    </h3>
                    
                    {/* Badge Angka Pesan Baru (Jika sudah join) */}
                    {unreadCount > 0 && (
                      <div className={`bg-[#0C8F5B] dark:bg-[#78C951] text-white dark:text-[#0A140F] text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm`}>
                        {unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-xs truncate ${unreadCount > 0 ? 'text-[#0C8F5B] dark:text-[#78C951] font-bold' : colors.textMuted}`}>
                    {!isJoined 
                      ? `ID: ${grp.id}` 
                      : (unreadCount > 0 ? (t.newMsgLabel || 'Pesan Baru') : `Admin: ${grp.admin_id === myProfile.chat_id ? 'Anda' : grp.admin_id}`)}
                  </p>
                </div>

                {/* Tombol Gabung Jika Belum Join */}
                {!isJoined && (
                  <button 
                    onClick={(e) => handleJoinGroup(grp, e)} 
                    className={`px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all ${colors.primary} hover:scale-105 active:scale-95`}
                  >
                    {t.join || 'Gabung'}
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* 3. Floating Action Button (Buat Grup) di Kiri Bawah */}
      <div className={`absolute bottom-[90px] right-6 md:bottom-24 z-50`}>
        <button 
          onClick={() => setIsCreateModalOpen(true)} 
          className={`${colors.primary} w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl active:scale-95 transition-all border border-white/20`} 
          title="Buat Grup Baru"
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      </div>

      {/* 4. Modal Buat Grup Baru */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setIsCreateModalOpen(false)}>
          <div className={`${colors.panel} border ${colors.border} rounded-[2rem] w-full max-w-sm shadow-2xl p-6 transform transition-transform`} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black tracking-tight mb-4">Buat Grup Baru</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider ${colors.textMuted} mb-2`}>Nama Grup</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  placeholder="Ketik nama grup..."
                  value={newGroupName} 
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className={`w-full p-4 rounded-xl ${colors.inputBg} border ${colors.border} outline-none text-sm font-medium focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] transition-all`} 
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className={`flex-1 py-3 rounded-xl font-bold border ${colors.border} ${colors.hoverBg} transition-colors`}>
                  Batal
                </button>
                <button type="submit" disabled={isCreating || !newGroupName.trim()} className={`flex-1 py-3 rounded-xl font-black shadow-lg transition-all disabled:opacity-50 ${colors.primary}`}>
                  {isCreating ? '...' : 'Buat Grup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}