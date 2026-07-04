import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// Import Supabase client jika Anda butuh query tambahan
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // 1. Tangkap payload webhook dari database Supabase
    const payload = await req.json()
    
    // 'record' berisi baris data pesan baru yang baru saja di-insert ke database
    const pesanBaru = payload.record 

    // --- (OPSIONAL) Jika tabel pesan tidak memiliki nama pengirim, 
    // Anda harus query ke tabel profil/users menggunakan sender_id ---
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Contoh mengambil nama pengirim dari tabel 'profiles'
    const { data: profilPengirim } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', pesanBaru.sender_id) // Sesuaikan dengan kolom sender_id Anda
      .single()

    const namaPengirim = profilPengirim?.username || 'Pengguna Tidak Dikenal'
    // ---------------------------------------------------------------

    // 2. Ambil token FCM penerima (asumsi Anda query ini dari database juga)
    // const fcmTokenPenerima = ... (kode Anda yang sudah ada untuk ambil token)

    // 3. SUSUN PAYLOAD FCM SECARA DINAMIS
    const fcmPayload = {
      message: {
        token: fcmTokenPenerima, // Masukkan token FCM tujuan
        notification: {
          // Gunakan variabel dinamis, bukan teks statis/hardcode!
          title: namaPengirim, 
          body: pesanBaru.text || 'Mengirim gambar/stiker' // Sesuaikan dengan kolom isi pesan Anda
        },
        data: {
          // Masukkan chat_id ke dalam data agar bisa ditangkap oleh frontend Capacitor
          chat_id: String(pesanBaru.chat_id), // Pastikan menjadi string
          action: "open_chat"
        }
      }
    };

    // 4. Kirim ke API FCM (Gunakan kode fetch ke FCM Anda yang sudah berjalan sukses sebelumnya)
    // const response = await fetch(`https://fcm.googleapis.com/v1/projects/...`, { ... })

    return new Response(JSON.stringify({ success: true, message: "Notif dikirim" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})