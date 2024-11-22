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
        short_name: 'Finance App',
        description: 'A Progressive Web App built with Vite',
        theme_color: '#000000',
        background_color: '#000000',
        start_url: '/',
        display: 'standalone',
        icons: [
          {
            src: 'https://i.ibb.co/sqLhLkc/people-finance-around-the-world-logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'https://i.ibb.co/sqLhLkc/people-finance-around-the-world-logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
