import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-vendor': ['jspdf'],
          'ui-vendor': ['lucide-react', 'canvas-confetti'],
        },
      },
    },
  },
});
