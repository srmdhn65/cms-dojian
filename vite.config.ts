// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      host: mode === 'server' ? '202.10.42.149' : 'localhost', // Use your server IP when in server mode
      port: mode === 'server' ? 3030 : 5173                   // Use 3030 for server, default for local dev
    },
    preview: {
      host: '202.10.42.149', // IP for preview (if used)
      port: 8080             // Port for preview server
    }
  };
});
