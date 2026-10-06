import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: { include: ['exceljs'] },
  preview: mode === 'demo' ? {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      '^/(api|uploads)(/|$)': {
        target: process.env.DEMO_API_URL || 'https://localhost:7038',
        changeOrigin: true,
        // API local dùng chứng chỉ phát triển; chỉ áp dụng cho demo.
        secure: false,
      },
    },
  } : undefined,
}))
