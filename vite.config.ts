import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

const isGithub = process.env.IS_GITHUB;
const base = isGithub?.length ? '/receipt-mapping-helper/' : undefined;

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Receipt Mapping Helper',
        short_name: 'ReceiptMap',
        theme_color: '#242424',
        background_color: '#242424',
        display: 'standalone',
        icons: [
          {
            src: isGithub?.length ? '/receipt-mapping-helper/icon-192x192.svg' : '/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: isGithub?.length ? '/receipt-mapping-helper/icon-512x512.svg' : '/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
        lang: 'ja',
        start_url: './',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
})
