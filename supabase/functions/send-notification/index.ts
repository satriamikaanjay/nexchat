import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { JWT } from 'npm:google-auth-library'

serve(async (req) => {
  try {
    const payload = await req.json()
    const record = payload.record

    if (!record.receiver_id || !record.sender_id) {
       return new Response("Data pesan tidak lengkap", { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Ambil Nama Pengirim
    const { data: senderProfile } = await supabase.from('profiles').select('username').eq('chat_id', record.sender_id).single()
    const senderName = senderProfile?.username || 'Pesan Baru'

    let tokens = [];
    let chatTitle = senderName;
    let chatType = 'personal';
    let actionChatId = record.sender_id; // Default: ID Pengirim untuk chat personal

    // 2. Cek apakah ini Grup atau Personal
    if (record.receiver_id.startsWith('grp_')) {
        chatType = 'group';
        actionChatId = record.receiver_id; // Jika grup, target buka chat adalah ID Grup

        // Ambil nama grup untuk judul notif
        const { data: groupData } = await supabase.from('groups').select('name').eq('id', record.receiver_id).single()
        if (groupData) chatTitle = `${groupData.name} (${senderName})`

        // Ambil token semua anggota grup kecuali si pengirim itu sendiri
        const { data: members } = await supabase.from('group_members').select('user_id').eq('group_id', record.receiver_id)
        if (members && members.length > 0) {
            const userIds = members.map(m => m.user_id).filter(id => id !== record.sender_id)
            const { data: profiles } = await supabase.from('profiles').select('fcm_token').in('chat_id', userIds).not('fcm_token', 'is', null)
            if (profiles) tokens = profiles.map(p => p.fcm_token)
        }
    } else {
        const { data: receiverProfile } = await supabase.from('profiles').select('fcm_token').eq('chat_id', record.receiver_id).single()
        if (receiverProfile?.fcm_token) tokens.push(receiverProfile.fcm_token)
    }

    if (tokens.length === 0) return new Response("Tidak ada penerima dengan FCM Token", { status: 200 })

    // 3. Autentikasi ke FCM
    const serviceAccountStr = Deno.env.get('FIREBASE_SERVICE_ACCOUNT')
    const serviceAccount = JSON.parse(serviceAccountStr)
    const client = new JWT({ email: serviceAccount.client_email, key: serviceAccount.private_key, scopes: ['https://www.googleapis.com/auth/firebase.messaging'] })
    const auth = await client.getAccessToken()

    // 4. Kirim Notif ke Semua Token (Multicast)
    const sendPromises = tokens.map(fcmToken => {
      const fcmPayload = {
        message: {
          token: fcmToken,
          notification: { title: chatTitle, body: record.content || '📷 Mengirim media baru' },
          android: { 
            priority: 'high', 
            notification: { sound: 'default', click_action: 'FCM_PLUGIN_ACTIVITY' } 
          },
          data: { 
            chat_id: actionChatId, // ID obrolan yang akan dibuka
            type: chatType // "group" atau "personal"
          }
        }
      }
      return fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${auth.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(fcmPayload)
      })
    })

    await Promise.all(sendPromises)
    return new Response(JSON.stringify({ success: true, sent_to: tokens.length }), { headers: { "Content-Type": "application/json" }, status: 200 })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { "Content-Type": "application/json" }, status: 500 })
  }
})