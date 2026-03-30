import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/trefle': {
        target: 'https://trefle.io',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/trefle/, '/api/v1'),
      },
      '/api/plantnet': {
        target: 'https://my-api.plantnet.org',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/plantnet/, ''),
      },
    },
  },
})
