import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative, so the same build works at /Victoria/ or /victoria-battersea/: routes live in the hash.
  base: './',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          return /framer-motion|motion-dom|motion-utils/.test(id) ? 'motion' : 'vendor'
        },
      },
    },
  },
})
