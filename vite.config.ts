import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // ✅ New v4 plugin
import path from "path"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ✅ Add Tailwind plugin here
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
