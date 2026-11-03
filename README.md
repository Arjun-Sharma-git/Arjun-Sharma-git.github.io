# Arjun Sharma, portfolio

TanStack Start (Router + Query) + GSAP + Tailwind v4. Prerendered to static HTML with sitemap.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run build      # static site in dist/client (prerendered index.html, sitemap.xml, robots.txt)
npm run preview    # serve the build
```

## Structure

```
src/
  config/        site URL, OG image, navigation and section ids
  content/       all copy and data (profile, stats, skills, projects) + types
  services/      external APIs (GitHub fetch + filtering), framework-agnostic
  queries/       TanStack Query options built on services
  lib/           gsap setup + motion media queries, SEO meta/JSON-LD builder
  hooks/         reusable animation hooks (scroll reveal, count-up, pointer follow)
  components/
    ui/          small presentational primitives (ExternalLink, SectionHeading, Chip)
    layout/      Nav, Footer, SkipLink
  sections/      one folder per page section; section-only components/hooks live beside it
  routes/        TanStack file routes (__root = document + head, index = page composition)
  styles/        global CSS and Tailwind theme tokens
```

Dependencies flow one way: `routes → sections → components/hooks → lib/queries → services/content/config`.
Import with the `~/` alias (maps to `src/`).

- Edit text in `src/content/*`. Set your real domain in `src/config/site.ts` and `public/robots.txt` before deploying.
- Social card: edit `scripts/og.html`, regenerate with the command in its header comment.
- `dist/client` can be deployed to any static host.
