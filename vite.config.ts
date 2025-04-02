import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: './environment',
  plugins: [react()],
  preview: {
    host: true,
    port: 4173,
    allowedHosts: [
      'hubhunter-7l47.onrender.com',
      '.onrender.com'
    ]
  }
});
