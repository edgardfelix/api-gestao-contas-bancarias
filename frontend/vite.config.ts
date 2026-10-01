import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    // Repassa as chamadas /api para o backend, sem precisar de CORS
    proxy: { '/api': 'http://localhost:3333' },
  },
});
