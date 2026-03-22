import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning threshold (single-file app is intentionally large)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split vendor code into separate chunk for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Minify with esbuild (default, fastest)
    minify: 'esbuild',
    // Enable source maps for debugging (remove in production if preferred)
    sourcemap: false,
    // Target modern browsers only (smaller output)
    target: 'es2020',
  },
  // Optimise dev server
  server: {
    hmr: true,
  },
  // Pre-bundle these for faster dev startup
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
