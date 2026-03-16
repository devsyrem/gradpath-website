import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Proxy API requests to the Express backend during development
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Build output goes to dist/ — served by Express in production
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],
})
