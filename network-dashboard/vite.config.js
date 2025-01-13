import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // This allows access from your network, not just localhost
    cors: true, // Enable CORS
    port: 5173, // Default Vite port
  },
});