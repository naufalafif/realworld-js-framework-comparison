import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  server: { port: 5206, strictPort: true },
  preview: { port: 5206, strictPort: true },
})
