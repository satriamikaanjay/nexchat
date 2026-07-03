import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Tambahkan baris di bawah ini
    allowedHosts: ['pound-overview-boozy.ngrok-free.dev']
  }
})