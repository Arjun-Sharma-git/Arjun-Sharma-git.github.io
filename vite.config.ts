import { existsSync } from 'node:fs'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { SITE_URL } from './src/config/site.ts'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  define: { __HAS_RESUME__: JSON.stringify(existsSync('public/resume.pdf')) },
  plugins: [
    tailwindcss(),
    tanstackStart({
      // Only crawl HTML pages; static files like resume.pdf are copied as-is from public/.
      prerender: { enabled: true, crawlLinks: true, filter: ({ path }) => !/\.\w+$/.test(path) },
      sitemap: { enabled: true, host: SITE_URL },
      pages: [
        { path: '/', sitemap: { priority: 1, changefreq: 'monthly' } },
        { path: '/404', prerender: { enabled: true, outputPath: '/404.html' }, sitemap: { exclude: true } },
      ],
    }),
    viteReact(),
  ],
})
