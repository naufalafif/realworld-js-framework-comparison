import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [preact(), tailwindcss()],
  server: { port: 5205, strictPort: true },
  preview: { port: 5205, strictPort: true },
})
