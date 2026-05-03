import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          stream: ['stream-chat', 'stream-chat-react', '@stream-io/video-react-sdk'],
          ui: ['zustand', 'axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild'
  },
  server: {
    hmr: {
      overlay: false
    }
  }
})
