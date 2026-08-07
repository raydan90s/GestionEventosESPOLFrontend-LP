import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['.ngrok-free.dev'],
  },
  resolve: {
    alias: {
      '@context':    fileURLToPath(new URL('./src/context',    import.meta.url)),
      '@services':   fileURLToPath(new URL('./src/services',   import.meta.url)),
      '@assets':     fileURLToPath(new URL('./src/assets',     import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@hooks':      fileURLToPath(new URL('./src/hooks',      import.meta.url)),
      '@pages':      fileURLToPath(new URL('./src/pages',      import.meta.url)),
      '@utils':      fileURLToPath(new URL('./src/utils',      import.meta.url)),
      '@constants':  fileURLToPath(new URL('./src/constants',  import.meta.url)),
      '@config':     fileURLToPath(new URL('./src/config',     import.meta.url)),
      '@style':      fileURLToPath(new URL('./src/style',      import.meta.url)),
      '@':           fileURLToPath(new URL('./src',            import.meta.url)),
    },
  },
})
