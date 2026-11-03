# Arjun Sharma, portfolio

TanStack Start (Router + Query) + GSAP + Tailwind v4. Prerendered to static HTML with sitemap.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in dist/client (prerendered index.html, sitemap.xml, robots.txt)
npm run preview  # serve the build
```

- Content lives in `src/data/profile.ts`; GitHub repos are fetched with TanStack Query (`src/data/repos.ts`) at build time and hydrated.
- Set your real domain in `src/site.ts` and `public/robots.txt` before deploying.
- Social card: edit `scripts/og.html`, regenerate with the command in its header comment.
- `dist/client` can be deployed to any static host.
