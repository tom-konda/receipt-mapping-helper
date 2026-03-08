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
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        // maplibre-gl は動的 import のため precache 対象から除外する
        globIgnores: ['**/maplibre*'],
      },
    }),
  ],
})
