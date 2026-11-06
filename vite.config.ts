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
      // Every page is listed below; crawling would also pick up /#section links as pages.
      // work/x.html rather than work/x/index.html, so GitHub Pages serves /work/x without redirecting to a trailing slash.
      prerender: { enabled: true, crawlLinks: false, autoSubfolderIndex: false },
      sitemap: { enabled: true, host: SITE_URL },
      pages: [
        { path: '/', sitemap: { priority: 1, changefreq: 'monthly' } },
        { path: '/work/virtgaze', sitemap: { priority: 0.8, changefreq: 'monthly' } },
        { path: '/work/reductxn', sitemap: { priority: 0.8, changefreq: 'monthly' } },
        { path: '/404', prerender: { enabled: true, outputPath: '/404.html' }, sitemap: { exclude: true } },
      ],
    }),
    viteReact(),
  ],
})
