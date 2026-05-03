import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// @vitejs/plugin-react is a devDependency and is skipped by npm install
// when NODE_ENV=production (e.g. on Render). esbuild's built-in automatic
// JSX transform handles production builds correctly without the plugin.
export default defineConfig({
  plugins: [tailwindcss()],
  esbuild: {
    jsx: 'automatic'
  },
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
