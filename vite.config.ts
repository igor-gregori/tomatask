import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Na Cloudflare o site fica na raiz; o GitHub Pages serve em /tomatask/ (definido no workflow).
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
})
