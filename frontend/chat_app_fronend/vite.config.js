import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
  esbuild: {
    jsx: 'automatic'
  },
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          stream: ['stream-chat', 'stream-chat-react', '@stream-io/video-react-sdk'],
          ui: ['zustand', 'axios']
        }
      }
    },
    // Reduce chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification without terser for now
    minify: 'esbuild'
  },
  // Optimize dev server
  server: {
    hmr: {
      overlay: false
    }
  }
})
