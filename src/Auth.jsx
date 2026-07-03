import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Icon Set - Ditambahkan Check dan Cross untuk indikator
const Icons = {
  ArrowLeft: (props) => <svg {...props} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"></path></svg>,
  Eye: (props) => <svg {...props} width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  EyeOff: (props) => <svg {...props} width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>,
  Refresh: (props) => <svg {...props} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 11-.57-8.38l5.67-5.67"></path></svg>,
  Check: (props) => <svg {...props} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  Cross: (props) => <svg {...props} width="20" height="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
  Spinner: (props) => (
    <svg {...props} className={`animate-spin ${props.className || ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
};

export default function Auth({ onLoginSuccess }) {
  const [view, setView] = useState('landing');
  const [isLogin, setIsLogin] = useState(true);
  
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State untuk Live Verification Username
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState(null); // 'available' | 'taken' | 'found' | 'not_found'
  
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showNotice, setShowNotice] = useState(true);

  const [captchaData, setCaptchaData] = useState([]); 
  const [captchaRealText, setCaptchaRealText] = useState(''); 
  const [captchaInput, setCaptchaInput] = useState('');

  const generateCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
    let resultText = '';
    let resultData = [];
    for (let i = 0; i < 6; i++) {
      const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      resultText += randomChar;
      resultData.push({
        char: randomChar,
        style: {
          transform: `rotate(${Math.floor(Math.random() * 40) - 20}deg) translateY(${Math.floor(Math.random() * 8) - 4}px)`,
          fontSize: `${Math.floor(Math.random() * 6) + 24}px`,
          opacity: Math.random() * 0.5 + 0.5, 
        }
      });
    }
    setCaptchaRealText(resultText);
    setCaptchaData(resultData);
    setCaptchaInput('');
  };

  useEffect(() => {
    if (view === 'form' || view === 'forgot') generateCaptcha();
  }, [view, isLogin]);

  // Efek untuk mengecek ketersediaan / keberadaan username secara realtime
  useEffect(() => {
    const checkUsername = async () => {
      if (isLogin) {
        if (!identifier || identifier.includes('@')) {
          setUsernameStatus(null);
          return;
        }
        setIsCheckingUsername(true);
        const { data } = await supabase.from('profiles').select('username').eq('username', identifier).maybeSingle();
        setUsernameStatus(data ? 'found' : 'not_found');
        setIsCheckingUsername(false);
      } else {
        if (!username) {
          setUsernameStatus(null);
          return;
        }
        setIsCheckingUsername(true);
        const { data } = await supabase.from('profiles').select('username').eq('username', username).maybeSingle();
        setUsernameStatus(data ? 'taken' : 'available');
        setIsCheckingUsername(false);
      }
    };

    // Debounce timer agar tidak query database setiap kali tombol ditekan
    const timer = setTimeout(checkUsername, 600);
    return () => clearTimeout(timer);
  }, [identifier, username, isLogin]);

  const handleShowForm = (loginMode) => {
    setIsLogin(loginMode);
    setErrorMsg('');
    setSuccessMsg('');
    setUsernameStatus(null);
    setView('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (captchaInput !== captchaRealText) {
      setErrorMsg('Kode keamanan tidak cocok.');
      generateCaptcha();
      return;
    }
    
    setView('loading');

    try {
      if (isLogin) {
        let loginEmail = identifier;
        if (!identifier.includes('@')) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', identifier)
            .maybeSingle();

          if (profileError || !profile) throw new Error('Username tidak ditemukan.');
          loginEmail = profile.email;
        }

        const result = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: password
        });
        if (result.error) throw result.error;
        
        setTimeout(() => {
          if (result.data.session) onLoginSuccess(result.data.user);
        }, 1500);

      } else {
        const result = await supabase.auth.signUp({
  email: email,
  password: password,
  options: { 
    data: { 
      username: username,
      custom_id: generateCustomID() // Generate ID unik saat daftar
    } 
  }
});
        if (result.error) throw result.error;
        
        setTimeout(() => {
          alert('Pendaftaran berhasil! Silakan login.');
          setView('landing');
        }, 1500);
      }
    } catch (error) {
      setErrorMsg(error.message);
      generateCaptcha(); 
      setView('form'); 
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (captchaInput !== captchaRealText) {
      setErrorMsg('Kode keamanan tidak cocok.');
      generateCaptcha();
      return;
    }

    setView('loading');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      
      setTimeout(() => {
        setSuccessMsg('Kode 6 digit telah dikirim ke email Anda.');
        setView('verify_otp');
      }, 1500);
    } catch (error) {
      setErrorMsg(error.message);
      generateCaptcha();
      setView('forgot');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setView('loading');

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email,
        token: otpCode,
        type: 'recovery'
      });
      if (verifyError) throw new Error('Kode OTP salah atau kedaluwarsa.');

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (updateError) throw updateError;

      setTimeout(() => {
        alert('Password berhasil diubah!');
        if (data.session) onLoginSuccess(data.user);
      }, 1500);

    } catch (error) {
      setErrorMsg(error.message);
      setView('verify_otp');
    }
  };

  const generateCustomID = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'id-'; // Prefix
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

  const AppBackground = () => (
    <div className="fixed inset-0 z-0 bg-[#050C09] overflow-hidden flex items-center justify-center pointer-events-none">
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#0C8F5B] opacity-[0.15] blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#78C951] opacity-[0.1] blur-[120px] rounded-full"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-60"></div>
      <div className="absolute font-black text-white/[0.015] text-[180vw] md:text-[80vw] leading-none select-none tracking-tighter drop-shadow-2xl">N</div>
    </div>
  );

  const Alert = ({ type, message }) => {
    if (!message) return null;
    const isError = type === 'error';
    return (
      <div className={`flex items-center gap-3 p-4 rounded-2xl mb-6 font-medium text-sm border backdrop-blur-md animate-in fade-in slide-in-from-top-2 ${isError ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-[#78C951]/10 text-[#78C951] border-[#78C951]/20'}`}>
        <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${isError ? 'bg-red-400' : 'bg-[#78C951]'}`}></div>
        <p>{message}</p>
      </div>
    );
  };

  if (view === 'loading') {
    return (
      <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-[#050C09] overflow-hidden selection:bg-[#78C951] selection:text-white">
        <AppBackground />
        <div className="relative z-10 flex flex-col items-center gap-6 p-10 bg-[#0E1A14]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 shadow-[0_0_60px_rgba(12,143,91,0.2)]">
          <Icons.Spinner className="text-[#78C951] w-12 h-12" />
          <p className="text-white font-semibold text-lg tracking-wide">Menghubungkan ke NexChat...</p>
        </div>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-[#050C09] overflow-hidden selection:bg-[#78C951] selection:text-white p-6">
        <AppBackground />
        <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center animate-in zoom-in-95 duration-700">
          <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-br from-[#78C951] to-[#0C8F5B] rounded-[2rem] blur-xl opacity-40"></div>
             <div className="relative w-full h-full bg-gradient-to-br from-[#13281E] to-[#0A1710] border border-white/10 rounded-[2rem] flex items-center justify-center shadow-2xl">
               <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#78C951] to-[#0C8F5B]">N</span>
             </div>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4 drop-shadow-lg">NexChat</h1>
          <p className="text-[#8AB5A0] text-lg font-medium mb-12">Ekosistem obrolan modern yang dirancang untuk keamanan & kecepatan.</p>
          <div className="w-full flex flex-col gap-4">
            <button onClick={() => handleShowForm(true)} className="w-full relative group h-14 bg-gradient-to-r from-[#0C8F5B] to-[#096642] text-white font-bold rounded-2xl active:scale-[0.98] transition-all overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10">Akses Console</span>
            </button>
            <button onClick={() => handleShowForm(false)} className="w-full h-14 bg-[#11241A] border border-[#1C3A29] hover:bg-[#162D20] hover:border-[#78C951]/50 text-[#78C951] font-bold rounded-2xl active:scale-[0.98] transition-all">
              Inisiasi Akun Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center bg-[#050C09] overflow-hidden selection:bg-[#78C951] selection:text-white p-4 md:p-8">
      <AppBackground />
      
      <div className="relative z-10 w-full max-w-5xl md:h-[750px] flex flex-col md:flex-row bg-[#0A140F]/80 backdrop-blur-3xl border border-white/[0.08] shadow-[0_30px_100px_-20px_rgba(12,143,91,0.3)] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden animate-in slide-in-from-bottom-12 duration-700">
        
        <div className="hidden md:flex relative w-[40%] bg-gradient-to-br from-[#0C8F5B]/10 to-transparent border-r border-white/5 p-12 flex-col justify-between overflow-hidden">
           <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#78C951]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
           <div>
             <div className="w-14 h-14 bg-gradient-to-br from-[#13281E] to-[#0A1710] border border-white/10 rounded-2xl flex items-center justify-center shadow-lg mb-6">
               <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#78C951] to-[#0C8F5B]">N</span>
             </div>
             <h2 className="text-4xl font-black text-white leading-tight tracking-tight">
               Selamat datang <br/>di <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#78C951] to-[#0C8F5B]">NexChat</span>.
             </h2>
           </div>
           <div>
             <p className="text-[#8AB5A0] font-medium leading-relaxed">
               Platform obrolan dengan enkripsi end-to-end, memastikan data dan percakapan Anda tetap eksklusif.
             </p>
             <div className="mt-8 flex items-center gap-3 text-xs font-bold tracking-widest text-[#0C8F5B] uppercase">
               <span className="w-8 h-px bg-[#0C8F5B]/50"></span> System Secure
             </div>
           </div>
        </div>

        <div className="flex-1 flex flex-col relative h-full">
          
          <div className="flex items-center px-6 py-8 md:px-12 md:pt-12 md:pb-6">
            <button 
              type="button" 
              onClick={() => setView(view === 'verify_otp' ? 'forgot' : 'landing')} 
              className="w-12 h-12 flex items-center justify-center bg-[#11241A] border border-[#1C3A29] rounded-2xl hover:bg-[#162D20] hover:border-[#78C951]/50 text-white transition-all active:scale-95"
            >
              <Icons.ArrowLeft />
            </button>
            <div className="ml-5">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {view === 'form' ? (isLogin ? 'Otorisasi' : 'Registrasi') : 
                 view === 'forgot' ? 'Pemulihan Sandi' : 'Sandi Baru'}
              </h2>
              <p className="text-sm font-medium text-[#8AB5A0] mt-1">
                 {view === 'form' ? (isLogin ? 'Verifikasi identitas Anda' : 'Buat kredensial baru') : 'Protokol keamanan'}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-10 md:px-12 scrollbar-hide">
            <div className="max-w-md w-full mx-auto md:mx-0">

              {/* NOTIFIKASI DISMISSIBLE BARU */}
              {showNotice && (
                <div className="relative flex items-start gap-3 p-4 rounded-2xl mb-6 font-medium text-sm border backdrop-blur-md bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-in fade-in slide-in-from-top-2">
                  <div className="w-2 h-2 mt-1.5 rounded-full shadow-[0_0_8px_currentColor] bg-yellow-500 shrink-0"></div>
                  <p className="pr-6">Mulai tanggal 4 Juli 2026 semua data akan dibersihkan, anda bisa membuat akun anda ulang.</p>
                  <button type="button" onClick={() => setShowNotice(false)} className="absolute right-3 top-3 text-yellow-500 hover:text-yellow-300 transition-colors">
                    <Icons.Cross className="w-5 h-5" />
                  </button>
                </div>
              )}

          
              
              <Alert type="error" message={errorMsg} />
              <Alert type="success" message={successMsg} />

              {view === 'form' && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {isLogin ? (
                    <div className="space-y-2 relative">
                      <label className="text-xs font-bold text-[#8AB5A0] uppercase tracking-wider ml-1">ID / Email Pengguna</label>
                      <div className="relative">
                        <input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Masukkan username / email" 
                          className="w-full h-14 px-5 pr-12 bg-[#101F17] border border-[#1C3526] text-white rounded-2xl focus:outline-none focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] focus:bg-[#14261C] transition-all font-medium placeholder-[#3D5A4C]" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                          {isLogin && identifier && !identifier.includes('@') && (
                            isCheckingUsername ? <Icons.Spinner className="w-5 h-5 text-[#78C951]" /> :
                            usernameStatus === 'found' ? <Icons.Check className="w-5 h-5 text-[#78C951]" /> :
                            usernameStatus === 'not_found' ? <Icons.Cross className="w-5 h-5 text-red-500" /> : null
                          )}
                        </div>
                      </div>
                      {usernameStatus === 'not_found' && !identifier.includes('@') && <p className="text-xs font-medium text-red-400 ml-1">Username tidak ditemukan dalam sistem</p>}
                      {usernameStatus === 'found' && !identifier.includes('@') && <p className="text-xs font-medium text-[#78C951] ml-1">Username ditemukan</p>}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 relative">
                        <label className="text-xs font-bold text-[#8AB5A0] uppercase tracking-wider ml-1">Username Unik</label>
                        <div className="relative">
                          <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Contoh: nex_user" 
                            className="w-full h-14 px-5 pr-12 bg-[#101F17] border border-[#1C3526] text-white rounded-2xl focus:outline-none focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] focus:bg-[#14261C] transition-all font-medium placeholder-[#3D5A4C]" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                            {!isLogin && username && (
                              isCheckingUsername ? <Icons.Spinner className="w-5 h-5 text-[#78C951]" /> :
                              usernameStatus === 'available' ? <Icons.Check className="w-5 h-5 text-[#78C951]" /> :
                              usernameStatus === 'taken' ? <Icons.Cross className="w-5 h-5 text-red-500" /> : null
                            )}
                          </div>
                        </div>
                        {usernameStatus === 'taken' && <p className="text-xs font-medium text-red-400 ml-1">Username sudah digunakan orang lain</p>}
                        {usernameStatus === 'available' && <p className="text-xs font-medium text-[#78C951] ml-1">Username tersedia!</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#8AB5A0] uppercase tracking-wider ml-1">Alamat Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" 
                          className="w-full h-14 px-5 bg-[#101F17] border border-[#1C3526] text-white rounded-2xl focus:outline-none focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] focus:bg-[#14261C] transition-all font-medium placeholder-[#3D5A4C]" />
                      </div>
                    </>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-[#8AB5A0] uppercase tracking-wider">Kata Sandi</label>
                      {isLogin && (
                        <button type="button" onClick={() => { setView('forgot'); setErrorMsg(''); setEmail(''); }} className="text-xs font-bold text-[#78C951] hover:text-white transition-colors">
                          Lupa Sandi?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" 
                        className="w-full h-14 px-5 bg-[#101F17] border border-[#1C3526] text-white rounded-2xl focus:outline-none focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] focus:bg-[#14261C] transition-all font-medium placeholder-[#3D5A4C] pr-14" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#8AB5A0] hover:text-white rounded-xl hover:bg-white/5 transition-all">
                        {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-[#8AB5A0] uppercase tracking-wider">Protokol Anti-Bot</label>
                      <button type="button" onClick={generateCaptcha} className="flex items-center gap-1.5 text-xs font-bold text-[#78C951] hover:text-white transition-colors">
                        <Icons.Refresh /> Regenerasi
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="w-full sm:w-[140px] h-14 bg-[#08100C] border border-[#1C3526] rounded-2xl flex items-center justify-center select-none shadow-inner relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMxMDFGMTciLz48cGF0aCBkPSJNMCAwTDQgNFpNOCAzTDQgNyIgIHN0cm9rZT0iIzFDMzUyNiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')] opacity-30"></div>
                        <div className="relative flex items-center justify-center gap-1.5 font-mono font-black tracking-wider text-[#78C951] w-full">
                          {captchaData.map((item, idx) => (<span key={idx} style={item.style} className="inline-block">{item.char}</span>))}
                        </div>
                      </div>
                      <input type="text" required value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Input kode" 
                        className="flex-1 w-full h-14 px-4 bg-[#101F17] border border-[#1C3526] text-[#78C951] rounded-2xl focus:outline-none focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] focus:bg-[#14261C] text-center font-bold tracking-[0.2em] transition-all placeholder-[#3D5A4C]" />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button type="submit" className="w-full relative group h-14 bg-[#78C951] text-[#0A140F] font-extrabold rounded-2xl active:scale-[0.98] transition-all overflow-hidden shadow-[0_0_20px_rgba(120,201,81,0.2)] hover:shadow-[0_0_30px_rgba(120,201,81,0.4)]">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <span className="relative z-10 text-lg">{isLogin ? 'Mulai Sesi' : 'Daftar Sistem'}</span>
                    </button>
                  </div>
                </form>
              )}

              {view === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="flex flex-col gap-5">
                  <p className="text-[#8AB5A0] mb-2 font-medium">Sistem akan mengirimkan token 6 digit ke email Anda untuk mereset kunci akses.</p>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8AB5A0] uppercase tracking-wider ml-1">Alamat Email Terdaftar</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" 
                      className="w-full h-14 px-5 bg-[#101F17] border border-[#1C3526] text-white rounded-2xl focus:outline-none focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] focus:bg-[#14261C] transition-all font-medium placeholder-[#3D5A4C]" />
                  </div>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-xs font-bold text-[#8AB5A0] uppercase tracking-wider">Protokol Anti-Bot</label>
                      <button type="button" onClick={generateCaptcha} className="flex items-center gap-1.5 text-xs font-bold text-[#78C951] hover:text-white transition-colors">
                        <Icons.Refresh /> Regenerasi
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="w-full sm:w-[140px] h-14 bg-[#08100C] border border-[#1C3526] rounded-2xl flex items-center justify-center select-none shadow-inner relative overflow-hidden shrink-0">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMxMDFGMTciLz48cGF0aCBkPSJNMCAwTDQgNFpNOCAzTDQgNyIgIHN0cm9rZT0iIzFDMzUyNiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')] opacity-30"></div>
                        <div className="relative flex items-center justify-center gap-1.5 font-mono font-black tracking-wider text-[#78C951] w-full">
                          {captchaData.map((item, idx) => (<span key={idx} style={item.style} className="inline-block">{item.char}</span>))}
                        </div>
                      </div>
                      <input type="text" required value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Input kode" 
                        className="flex-1 w-full h-14 px-4 bg-[#101F17] border border-[#1C3526] text-[#78C951] rounded-2xl focus:outline-none focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] focus:bg-[#14261C] text-center font-bold tracking-[0.2em] transition-all placeholder-[#3D5A4C]" />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button type="submit" className="w-full h-14 bg-[#78C951] text-[#0A140F] font-extrabold rounded-2xl active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(120,201,81,0.2)] hover:shadow-[0_0_30px_rgba(120,201,81,0.4)] text-lg">
                      Kirim Token Reset
                    </button>
                  </div>
                </form>
              )}

              {view === 'verify_otp' && (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                  <p className="text-[#8AB5A0] mb-2 font-medium">Input token otorisasi yang dikirimkan ke <span className="text-white">{email}</span></p>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8AB5A0] uppercase tracking-wider ml-1">Token OTP (6 Digit)</label>
                    <input type="text" maxLength={6} required value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="• • • • • •" 
                      className="w-full h-16 bg-[#08100C] border border-[#1C3526] text-[#78C951] rounded-2xl focus:outline-none focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] transition-all font-black text-3xl text-center tracking-[0.7em] placeholder-[#1C3526]" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#8AB5A0] uppercase tracking-wider ml-1">Kunci Sandi Baru</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimal 6 karakter" 
                        className="w-full h-14 px-5 bg-[#101F17] border border-[#1C3526] text-white rounded-2xl focus:outline-none focus:border-[#78C951] focus:ring-1 focus:ring-[#78C951] focus:bg-[#14261C] transition-all font-medium placeholder-[#3D5A4C] pr-14" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-[#8AB5A0] hover:text-white rounded-xl hover:bg-white/5 transition-all">
                        {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <button type="submit" className="w-full h-14 bg-[#78C951] text-[#0A140F] font-extrabold rounded-2xl active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(120,201,81,0.2)] hover:shadow-[0_0_30px_rgba(120,201,81,0.4)] text-lg">
                      Simpan & Verifikasi
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}