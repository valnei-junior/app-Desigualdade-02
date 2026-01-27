import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import electronRenderer from 'vite-plugin-electron-renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Electron plugin can spawn/kill processes during dev. Disable it by
    // setting the environment variable `DISABLE_ELECTRON=true` when running
    // `npm run dev` to isolate Vite from Electron behavior.
    ...(process.env.DISABLE_ELECTRON === 'true'
      ? []
      : [
          electron([
            {
              entry: 'electron.cjs',
            },
            {
              entry: 'preload.cjs',
              onstart(options) {
                options.reload();
              },
            },
          ]),
        ]),
    electronRenderer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
