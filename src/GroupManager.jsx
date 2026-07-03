import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const SearchIcon = (props) => <svg {...props} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>;
const PlusIcon = (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg>;

// PASTIKAN PARAMETER groups DAN t SUDAH DITAMBAHKAN DI SINI
export default function GroupManager({ session, myProfile, colors, setActiveChat, groups, setGroups, t }) {
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  // Fetch daftar grup tempat user bergabung ke state GLOBAL (groups)
  

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    setIsCreating(true);

    const groupId = `grp_${Date.now()}`;
    
    // 1. Buat grup di DB
    const { error: groupError } = await supabase.from('groups').insert([{ 
      id: groupId, 
      name: newGroupName, 
      admin_id: myProfile.chat_id,
      avatar_url: null
    }]);

    if (!groupError) {
      // 2. Masukkan diri sendiri sebagai anggota
      await supabase.from('group_members').insert([{ 
        group_id: groupId, 
        user_id: myProfile.chat_id 
      }]);
      
      alert(t.groupCreated || 'Grup berhasil dibuat!');
      
      // 3. Masukkan ke state GLOBAL agar tidak error charAt(0)
      const newGroupObj = { 
        id: groupId, 
        name: newGroupName, 
        admin_id: myProfile.chat_id, 
        avatar_url: null 
      };
      
      setGroups([newGroupObj, ...groups]);
      
      // Auto buka chat grup
      setActiveChat({ 
        contact_id: groupId, 
        contact_username: newGroupName, 
        type: 'group', 
        ...newGroupObj 
      });
      
      setNewGroupName('');
    }
    setIsCreating(false);
  };

  const handleSearchGroup = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    
    const { data } = await supabase.from('groups').select('*').eq('id', searchId).single();
    if (data) setSearchResult(data);
    else alert('Grup tidak ditemukan!');
  };

  const handleJoinGroup = async (groupObj) => {
    const isJoined = groups.some(g => g.id === groupObj.id);
    if (isJoined) {
      alert('Anda sudah berada di dalam grup ini.');
      setActiveChat({ contact_id: groupObj.id, contact_username: groupObj.name, type: 'group', ...groupObj });
      return;
    }

    const { error } = await supabase.from('group_members').insert([{ 
      group_id: groupObj.id, 
      user_id: myProfile.chat_id 
    }]);

    if (!error) {
      alert('Berhasil bergabung ke grup!');
      setGroups([groupObj, ...groups]);
      setActiveChat({ contact_id: groupObj.id, contact_username: groupObj.name, type: 'group', ...groupObj });
      setSearchResult(null);
      setSearchId('');
    }
  };

  return (
    <div className={`p-4 md:p-6 min-h-full animate-in slide-in-from-right-4 ${colors.base}`}>
      <h2 className="text-xl font-bold mb-4">{t.myGroups || 'Grup Saya'}</h2>

      {/* Form Buat Grup */}
      <div className={`p-4 rounded-2xl border ${colors.border} ${colors.panel} shadow-sm mb-6`}>
        <h3 className="font-bold text-sm mb-3">{t.createGroup || 'Buat Grup Baru'}</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder={t.groupName || 'Nama Grup Baru'}
            value={newGroupName} 
            onChange={(e) => setNewGroupName(e.target.value)}
            className={`flex-1 p-3 rounded-xl ${colors.inputBg} border ${colors.border} outline-none text-sm`} 
          />
          <button 
            onClick={handleCreateGroup} 
            disabled={isCreating || !newGroupName.trim()}
            className="px-4 bg-[#00a884] text-white rounded-xl font-bold hover:bg-[#008f6f] transition-all disabled:opacity-50"
          >
            {isCreating ? '...' : <PlusIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Form Cari Grup */}
      <div className={`p-4 rounded-2xl border ${colors.border} ${colors.panel} shadow-sm mb-6`}>
        <h3 className="font-bold text-sm mb-3">{t.joinViaId || 'Gabung via ID Grup'}</h3>
        <form onSubmit={handleSearchGroup} className="flex gap-2">
          <input 
            type="text" 
            placeholder={t.pasteGroupId || 'Tempel ID Grup'}
            value={searchId} 
            onChange={(e) => setSearchId(e.target.value)}
            className={`flex-1 p-3 rounded-xl ${colors.inputBg} border ${colors.border} outline-none text-sm`} 
          />
          <button type="submit" className={`px-4 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-xl font-bold transition-all`}>
            <SearchIcon className="w-5 h-5" />
          </button>
        </form>

        {searchResult && (
          <div className={`mt-4 p-3 rounded-xl border border-[#00a884] bg-green-50/10 flex items-center justify-between`}>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{searchResult.name}</p>
              <p className="text-xs text-gray-500 truncate">{searchResult.id}</p>
            </div>
            <button onClick={() => handleJoinGroup(searchResult)} className="px-3 py-1.5 bg-[#00a884] text-white text-xs font-bold rounded-lg shadow-sm">
              {t.join || 'Gabung'}
            </button>
          </div>
        )}
      </div>

      {/* List Grup (MENGGUNAKAN STATE GLOBAL 'groups') */}
      <div className="space-y-2 pb-20">
        {groups.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">Anda belum bergabung ke grup manapun.</p>
        ) : (
          groups.map(grp => (
            <div 
              key={grp.id} 
              onClick={() => setActiveChat({ contact_id: grp.id, contact_username: grp.name, type: 'group', ...grp })}
              className={`p-3 rounded-2xl flex items-center gap-4 cursor-pointer transition-colors ${colors.hoverBg}`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg overflow-hidden border border-gray-200 shrink-0">
                {grp.avatar_url ? <img src={grp.avatar_url} className="w-full h-full object-cover" /> : (grp.name || '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0 border-b border-transparent">
                <h3 className="text-base font-bold truncate">{grp.name}</h3>
                <p className={`text-xs text-gray-500 truncate`}>Admin: {grp.admin_id === myProfile.chat_id ? 'Anda' : grp.admin_id}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}