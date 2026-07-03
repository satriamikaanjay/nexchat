import React, { useState } from 'react';
import { supabase } from './supabaseClient';

// FIX 1: Tambahkan 'myProfile' ke dalam props
export default function DeleteAccountModal({ isOpen, onClose, session, myProfile, colors, t }) {
  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // FIX 2: Blok kode 'await' yang nyasar di sini sudah dihapus

  if (!isOpen) return null;

  const handleDeleteAccount = async () => {
    if (!password) {
      setErrorMsg('Password tidak boleh kosong.');
      return;
    }

    setIsDeleting(true);
    setErrorMsg('');

    try {
      // 1. Verifikasi Password terlebih dahulu dengan mencoba Sign In ulang
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: password,
      });

      if (signInError) {
        throw new Error('Password yang Anda masukkan salah.');
      }

      // === 2. PROSES SAPU JAGAT ===
      const chatId = myProfile.chat_id;
      
      await supabase.from('contacts').delete().eq('contact_id', chatId);
      await supabase.from('messages').delete().or(`sender_id.eq.${chatId},receiver_id.eq.${chatId}`);
      await supabase.from('group_members').delete().eq('user_id', chatId);
      await supabase.from('profiles').delete().eq('chat_id', chatId);
      // ===============================================

      // 3. Jika password benar dan data bersih, panggil fungsi backend untuk menghapus akun permanen
      const { error: rpcError } = await supabase.rpc('delete_user_account');
      
      if (rpcError) {
        throw new Error('Gagal menghapus data dari database. Pastikan RPC tersedia.');
      }

      // 4. Logout dan tendang user
      alert('Akun berhasil dihapus secara permanen.');
      await supabase.auth.signOut();
      
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`${colors.panel} border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6`}>
        <h3 className="font-bold text-xl text-red-500 mb-2">Konfirmasi Hapus Akun</h3>
        <p className={`text-sm ${colors.textMuted} mb-6`}>
          Tindakan ini <span className="font-bold">tidak dapat dibatalkan</span>. Semua data obrolan, kontak, dan profil Anda akan musnah. Masukkan password Anda untuk melanjutkan.
        </p>
        
        {errorMsg && (
          <div className="p-3 mb-4 text-xs font-bold bg-red-100 text-red-600 rounded-xl border border-red-200">
            {errorMsg}
          </div>
        )}

        <input 
          type="password" 
          placeholder="Masukkan Password Anda" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full p-4 rounded-xl ${colors.inputBg} border ${colors.border} outline-none focus:ring-2 focus:ring-red-500 transition-all mb-6`} 
        />

        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            disabled={isDeleting}
            className={`flex-1 p-3 rounded-xl ${colors.inputBg} border ${colors.border} font-bold transition-colors hover:bg-gray-100 dark:hover:bg-gray-800`}
          >
            Batal
          </button>
          <button 
            onClick={handleDeleteAccount} 
            disabled={isDeleting || !password}
            className="flex-1 p-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {isDeleting ? 'Memproses...' : 'Hapus Selamanya'}
          </button>
        </div>
      </div>
    </div>
  );
}