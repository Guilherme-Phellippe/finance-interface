import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // Ativa o PWA em modo de desenvolvimento
      },
      manifest: {
        name: 'Finance App',
        short_name: 'App',
        description: 'A Progressive Web App built with Vite',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: 'https://t3.ftcdn.net/jpg/04/93/95/60/360_F_493956028_lkyGavS5R600BEJRlKjDGeECew6nY1OQ.jpg',
            sizes: '192x192',
            type: 'image/jpg',
          },
          {
            src: 'https://t3.ftcdn.net/jpg/04/93/95/60/360_F_493956028_lkyGavS5R600BEJRlKjDGeECew6nY1OQ.jpg',
            sizes: '512x512',
            type: 'image/jpg',
          },
        ],
      },
    }),
  ],
})
