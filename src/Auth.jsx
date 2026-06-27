// src/Auth.jsx
import { useState, useRef } from 'react'
import { supabase } from './supabaseClient'
import HCaptcha from '@hcaptcha/react-hcaptcha'

export default function Auth({ onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [captchaToken, setCaptchaToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Ref untuk mereset hCaptcha
  const captchaRef = useRef(null)

  // Validasi: Hanya huruf besar, kecil, dan garis bawah
  const isValidUsername = (text) => /^[a-zA-Z_]+$/.test(text)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    // 1. Cek validasi username
    if (!isValidUsername(username)) {
      return setErrorMsg('Username hanya boleh huruf dan garis bawah (_) !')
    }

    // 2. Cek Captcha untuk Login DAN Register
    if (!captchaToken) {
      return setErrorMsg('Tolong selesaikan hCaptcha terlebih dahulu!')
    }

    setLoading(true)
    const fakeEmail = `${username}@appchat.com` // Trik email bayangan

    if (isLoginView) {
      // PROSES LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email: fakeEmail,
        password: password,
      })
      
      if (error) {
        setErrorMsg('Username atau password salah!')
        resetCaptchaForm() // Reset captcha jika gagal login
      } else {
        onLoginSuccess(data.user)
      }
    } else {
      // PROSES REGISTER
      const generatedChatId = 'id-' + crypto.randomUUID().substring(0, 8) // Generate ID Acak
      
      const { data, error } = await supabase.auth.signUp({
        email: fakeEmail,
        password: password,
      })

      if (error) {
        setErrorMsg(error.message)
        resetCaptchaForm() // Reset captcha jika gagal daftar
      } else if (data.user) {
        const { error: dbError } = await supabase.from('profiles').insert([
          {
            id: data.user.id,
            username: username,
            chat_id: generatedChatId
          }
        ])
        
        if (dbError) {
          setErrorMsg('Gagal membuat profil: ' + dbError.message)
          resetCaptchaForm()
        } else {
          alert(`Akun berhasil dibuat! ID kamu adalah: ${generatedChatId}`)
          switchView() // Arahkan ke halaman login
        }
      }
    }
    setLoading(false)
  }

  // Fungsi untuk mereset token dan widget hCaptcha
  const resetCaptchaForm = () => {
    setCaptchaToken(null)
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha()
    }
  }

  // Fungsi untuk ganti halaman Login/Register
  const switchView = () => {
    setIsLoginView(!isLoginView)
    setErrorMsg('')
    resetCaptchaForm() // Reset captcha saat ganti halaman
  }

  return (
  <div className="flex items-center justify-center h-screen bg-slate-200 p-4 font-sans">
    {/* Box Utama dengan Hard Shadow */}
    <div className="bg-white p-8 rounded-[2rem] border-[4px] border-black shadow-[8px_8px_0_0_#000] w-full max-w-sm">
      <h2 className="text-3xl font-black text-center mb-6 text-black uppercase tracking-tight">
        {isLoginView ? 'MASUK' : 'DAFTAR'}
      </h2>
      
      {errorMsg && (
        <div className="bg-red-400 border-[3px] border-black text-black p-3 rounded-xl mb-4 font-bold text-sm text-center shadow-[4px_4px_0_0_#000]">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-xs font-black text-black mb-1 block uppercase">Username</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="contoh_username"
            className="w-full p-4 rounded-xl border-[3px] border-black font-bold text-base bg-gray-50 focus:outline-none focus:translate-y-[-2px] transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-black text-black mb-1 block uppercase">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full p-4 rounded-xl border-[3px] border-black font-bold text-base bg-gray-50 focus:outline-none focus:translate-y-[-2px] transition-all"
          />
        </div>

<<<<<<< HEAD
          {/* hCaptcha sekarang muncul di kedua mode */}
          <div className="flex justify-center mt-2">
            <HCaptcha
              ref={captchaRef}
              sitekey="a0fe2c76-ff82-4066-824e-ce085a3221d0" // Ganti dengan Sitekey hCaptcha kamu
              onVerify={(token) => setCaptchaToken(token)}
              theme="dark"
            />
          </div>
=======
        <div className="flex justify-center my-2 border-[3px] border-black rounded-xl p-2 bg-gray-50">
          <HCaptcha
            ref={captchaRef}
            sitekey="10000000-ffff-ffff-ffff-000000000001"
            onVerify={(token) => setCaptchaToken(token)}
            theme="light"
          />
        </div>
>>>>>>> 390626b (Update semua file ke versi terbaru)

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#38b6ff] border-[3px] border-black p-4 rounded-xl font-black text-lg text-white shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50"
        >
          {loading ? 'MEMPROSES...' : (isLoginView ? 'LOGIN' : 'DAFTAR')}
        </button>
      </form>

      <p className="text-center text-sm font-bold text-black mt-6">
        {isLoginView ? "Belum punya akun? " : "Sudah punya akun? "}
        <button 
          type="button"
          onClick={switchView}
          className="text-[#ff5c5c] hover:underline font-black uppercase"
        >
          {isLoginView ? "Daftar" : "Login"}
        </button>
      </p>
    </div>
<<<<<<< HEAD
  )
}
=======
  </div>
)
}
>>>>>>> 390626b (Update semua file ke versi terbaru)
