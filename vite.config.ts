import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        trasformazione: path.resolve(__dirname, 'trasformazione-digitale.html'),
        chisiamo: path.resolve(__dirname, 'chi-siamo.html'),
        innovaco: path.resolve(__dirname, 'innova-co.html'),
      },
    },
  },
})
