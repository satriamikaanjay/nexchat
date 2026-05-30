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
    <div className="flex items-center justify-center h-screen bg-slate-900 text-white font-sans">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-96 border border-slate-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-emerald-400">
          {isLoginView ? 'Masuk ke Chat' : 'Buat Akun Baru'}
        </h2>
        
        {errorMsg && <p className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm text-center">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="contoh_username"
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-emerald-500 text-sm"
            />
          </div>

          {/* hCaptcha sekarang muncul di kedua mode */}
          <div className="flex justify-center mt-2">
            <HCaptcha
              ref={captchaRef}
              sitekey="10000000-ffff-ffff-ffff-000000000001" // Ganti dengan Sitekey hCaptcha kamu
              onVerify={(token) => setCaptchaToken(token)}
              theme="dark"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 p-3 rounded-xl font-bold transition mt-2 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : (isLoginView ? 'Login' : 'Daftar')}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          {isLoginView ? "Belum punya akun? " : "Sudah punya akun? "}
          <button 
            type="button"
            onClick={switchView}
            className="text-emerald-400 hover:underline font-bold"
          >
            {isLoginView ? "Daftar di sini" : "Login di sini"}
          </button>
        </p>
      </div>
    </div>
  )
}