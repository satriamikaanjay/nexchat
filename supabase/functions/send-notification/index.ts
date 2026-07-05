import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { JWT } from 'npm:google-auth-library' // Library untuk memproses Service Account Firebase otomatis

serve(async (req) => {
  try {
    const payload = await req.json()
    const record = payload.record // Data pesan baru dari tabel 'messages'

    // Abaikan jika tidak ada pengirim atau penerima
    if (!record.receiver_id || !record.sender_id) {
       return new Response("Data pesan tidak lengkap", { status: 400 })
    }

    // Abaikan notifikasi untuk grup (sementara kita fokus ke chat personal agar jalan dulu)
    if (record.receiver_id.startsWith('grp_')) {
       return new Response("Notifikasi grup di-skip", { status: 200 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Ambil Nama Pengirim untuk Judul Notifikasi
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('username')
      .eq('chat_id', record.sender_id)
      .single()
    
    const senderName = senderProfile?.username || 'Pesan Baru'

    // 2. Ambil FCM Token milik Penerima
    const { data: receiverProfile } = await supabase
      .from('profiles')
      .select('fcm_token')
      .eq('chat_id', record.receiver_id)
      .single()

    const fcmToken = receiverProfile?.fcm_token

    if (!fcmToken) {
      return new Response("Penerima tidak memiliki FCM Token (Mungkin belum login/buka apk)", { status: 200 })
    }

    // 3. Generate Access Token Firebase secara On-The-Fly menggunakan Secret Service Account
    const serviceAccountStr = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')
    if (!serviceAccountStr) throw new Error("Secret FIREBASE_SERVICE_ACCOUNT belum dipasang di Supabase!")
    
    const serviceAccount = JSON.parse(serviceAccountStr)
    const client = new JWT({
      email: serviceAccount.client_email,
      key: serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging']
    })
    const token = await client.getAccessToken()

    // 4. SUSUN PAYLOAD FCM - INI KUNCI AGAR NOTIF MUNCUL SAAT APK DITUTUP
    const fcmPayload = {
      message: {
        token: fcmToken,
        notification: {
          title: senderName,
          body: record.content || '📷 Mengirim media baru'
        },
        android: {
          priority: 'high', // MEMAKSA ANDROID MEMBANGUNKAN HP WALAUPUN LAYAR MATI
          notification: {
            sound: 'default'
          }
        },
        data: {
          chat_id: record.sender_id,
          action: "open_chat"
        }
      }
    }

    // 5. Eksekusi Pengiriman ke FCM Google
    const fcmRes = await fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fcmPayload)
    })

    const fcmData = await fcmRes.json()

    return new Response(JSON.stringify({ success: true, response: fcmData }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})