import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import electronRenderer from 'vite-plugin-electron-renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(__dirname, '.'),
  plugins: [
    react(),
    tailwindcss(),
    ...(process.env.DISABLE_ELECTRON === 'true'
      ? []
      : [
          electron([
            {
              entry: path.resolve(__dirname, '../electron.cjs'),
            },
            {
              entry: path.resolve(__dirname, '../preload.cjs'),
              onstart(options) {
                options.reload();
              },
            },
          ]),
          electronRenderer(),
        ]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
