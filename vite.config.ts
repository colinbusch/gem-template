import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  // GitHub Pages serves from /gem-template/ — use '/' for local dev
  base: process.env.GITHUB_ACTIONS ? '/gem-template/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
