import { useState } from 'react'
import { supabase } from './supabaseClient'
import { ArrowLeft, Loader2, Send, ShieldCheck, KeyRound } from 'lucide-react'

export default function ForgotPassword({ onBack }) {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: Password Baru
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Step 1: Kirim Kode OTP ke Email
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email)

    if (error) {
      setErrorMsg('Gagal mengirim email: ' + error.message)
    } else {
      setSuccessMsg('Kode verifikasi telah dikirim ke email kamu!')
      setStep(2)
    }
    setLoading(false)
  }

  // Step 2: Verifikasi Kode OTP dari Email
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'recovery'
    })

    if (error) {
      setErrorMsg('Kode tidak valid atau sudah kedaluwarsa.')
    } else {
      setSuccessMsg('Verifikasi berhasil! Silakan buat password baru.')
      setStep(3)
    }
    setLoading(false)
  }

  // Step 3: Simpan Password Baru
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (newPassword !== confirmPassword) {
      return setErrorMsg('Konfirmasi password tidak cocok!')
    }

    setLoading(true)
    
    // Sesi sudah terbuka setelah Verify OTP sukses, jadi bisa update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setErrorMsg('Gagal menyimpan password: ' + error.message)
    } else {
      setSuccessMsg('Password berhasil diubah! Mengalihkan ke halaman login...')
      setTimeout(() => onBack(), 2500)
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 font-sans text-slate-800">
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/50 w-full max-w-md">
        
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-2 transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Kembali ke Login
        </button>

        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Lupa Password</h2>
        <p className="text-slate-500 text-sm mb-6">
          {step === 1 && 'Masukkan email kamu untuk menerima kode reset password.'}
          {step === 2 && `Masukkan 6-digit kode yang dikirimkan ke ${email}`}
          {step === 3 && 'Buat password baru yang kuat dan mudah diingat.'}
        </p>

        {errorMsg && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-md mb-6 text-sm">
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded-md mb-6 text-sm">
            {successMsg}
          </div>
        )}

        {/* BENTUK FORM BERDASARKAN STEP */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Email Akun</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl font-bold shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
              Kirim Kode
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Kode OTP (6 Digit)</label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                placeholder="Masukkan kode dari email"
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-center text-xl font-mono tracking-[0.5em]"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !otp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3.5 rounded-xl font-bold shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
              Verifikasi Kode
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Password Baru</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wider">Konfirmasi Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3.5 rounded-xl font-bold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all disabled:opacity-70 flex justify-center items-center gap-2 mt-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <KeyRound size={18} />}
              Simpan Password Baru
            </button>
          </form>
        )}
      </div>
    </div>
  )
}