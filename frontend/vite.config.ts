import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Exposes the server to your local network
    port: 5173, // Optional: Specify a port (default is 5173)
  },
})

