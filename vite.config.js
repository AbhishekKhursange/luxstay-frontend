import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/auth':    'http://localhost:8080',
      '/room':    'http://localhost:8080',
      '/booking': 'http://localhost:8080',
      '/user':    'http://localhost:8080',
      '/upload':  'http://localhost:8080',
      '/notify':  'http://localhost:8080',

      '^/payment$': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },

      '^/hotel(/.*)?$': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    }
  }
})