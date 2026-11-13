import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The app is intentionally a single client-rendered page. Keeping the config
// minimal means there is no server runtime to maintain when deploying to any
// static host (Netlify, Vercel, Cloudflare Pages, S3, Nginx, etc.).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: false,
  },
});
