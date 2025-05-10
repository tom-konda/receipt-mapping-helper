import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

const isGithub = process.env.IS_GITHUB;
const base = isGithub?.length ? '/receipt-mapping-helper/' : undefined;

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [svelte()],
})
