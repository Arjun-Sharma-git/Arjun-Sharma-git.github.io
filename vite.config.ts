import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { SITE_URL } from './src/config/site.ts'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true },
      sitemap: { enabled: true, host: SITE_URL },
      pages: [{ path: '/', sitemap: { priority: 1, changefreq: 'monthly' } }],
    }),
    viteReact(),
  ],
})
