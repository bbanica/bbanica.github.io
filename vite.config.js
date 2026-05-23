import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        'oklahoma-navigate': resolve(__dirname, 'oklahoma-navigate/index.html'),
        arcturus: resolve(__dirname, 'arcturus/index.html'),
        'direct-deposit': resolve(__dirname, 'direct-deposit/index.html'),
      },
    },
  },
});
