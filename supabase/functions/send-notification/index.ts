import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Kita gunakan library yang lebih ringan untuk generate token
import { GoogleAuth } from "https://esm.sh/google-auth-library@8.7.0"

serve(async (req) => {
  try {
    const { record } = await req.json()
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    // 1. Ambil token penerima
    const { data: profile } = await supabase.from('profiles').select('fcm_token').eq('chat_id', record.receiver_id).single()

    if (profile?.fcm_token) {
      // 2. Generate Access Token dari Service Account secara otomatis
      const auth = new GoogleAuth({
        credentials: JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT')!),
        scopes: 'https://www.googleapis.com/auth/firebase.messaging'
      })
      const client = await auth.getClient()
      const accessToken = (await client.getAccessToken()).token

      // 3. Kirim notifikasi
      await fetch(`https://fcm.googleapis.com/v1/projects/${Deno.env.get('FIREBASE_PROJECT_ID')}/messages:send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            token: profile.fcm_token,
            notification: { title: "Pesan Baru", body: record.content || "Ada pesan masuk" }
          }
        }),
      })
      return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
    }
    return new Response(JSON.stringify({ message: "No token" }), { status: 404 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})