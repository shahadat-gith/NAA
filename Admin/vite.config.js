import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Only for local development
  },
  build: {
    outDir: 'dist', // Ensure output folder is correct
  },
  preview: {
    port: 4173, // Change the preview port to test before deploying
  },
});
