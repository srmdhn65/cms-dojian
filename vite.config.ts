import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '202.10.42.149',  // Replace with your actual IP address
    port: 3030              // Port for the dev server
  },
  preview: {
    host: '202.10.42.149',  // Same IP for preview if desired
    port: 8080              // Port for the preview server
  }
})
