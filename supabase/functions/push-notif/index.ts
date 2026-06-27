import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import admin from 'npm:firebase-admin'

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(Deno.env.get('FIREBASE_KEY') || '{}');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

serve(async (req) => {
  try {
    const payload = await req.json()
    const message = payload.record

    if (!message.receiver_id) return new Response("Bukan chat personal", { status: 200 })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Cari Token FCM milik Penerima Pesan
    const { data: receiverProfile } = await supabase
      .from('profiles')
      .select('fcm_token')
      .eq('chat_id', message.receiver_id)
      .single()

    // 2. Cari Nama (Username) milik si Pengirim Pesan
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('chat_id', message.sender_id)
      .single()

    // Jika username ketemu pakai username-nya, kalau tidak pakai ID-nya
    const namaPengirim = senderProfile?.username || message.sender_id;

    if (receiverProfile?.fcm_token) {
      await admin.messaging().send({
        token: receiverProfile.fcm_token,
        notification: {
          title: namaPengirim, // <--- Sekarang menampilkan Nama!
          body: message.content || 'Mengirim berkas lampiran 📎',
        },
      })
      console.log('Notif sukses ke:', receiverProfile.fcm_token)
    }

    return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Gagal menembak notif:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})