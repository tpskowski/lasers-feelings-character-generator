import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019'
  },
  server: {
    port: 5173
  },
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    css: true
  }
});
