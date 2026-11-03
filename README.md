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

- Edit text in `src/content/*`.

## Adding a project

Create one file in `src/content/projects/`, e.g. `my-app.ts`. It is picked up automatically, no other file to touch:

```ts
import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 6,                       // position in the Work section
  name: 'My App',
  kind: 'Full-stack app',
  description: 'One or two sentences on what it does and why it matters.',
  tags: ['React', 'Node.js'],
  repo: githubRepo('my-app'),     // or any URL
  live: 'https://my-app.vercel.app', // optional
  // pipeline: ['Step', 'Step'],  // optional flow chips
  // featured: true,              // optional dark, wide card
} satisfies Project
```

## Resume

Drop your PDF at `public/resume.pdf` and rebuild. "Resume" links appear in the nav, hero and contact
section and it's served at `/resume.pdf`. Without the file, no resume links are rendered.

## Deploy to GitHub Pages

The site is set up as a GitHub Pages *user site* at `https://arjun-sharma-git.github.io`:

1. Create a GitHub repo named exactly `Arjun-Sharma-git.github.io`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Add it as a remote and push `main`; `.github/workflows/deploy.yml` builds and publishes `dist/client`.

Using a different repo name serves the site under `/<repo>/`, which needs a base path; using a custom domain
means updating `src/config/site.ts` and `public/robots.txt` (and adding `public/CNAME`).
- Social card: edit `scripts/og.html`, regenerate with the command in its header comment.
- `dist/client` can be deployed to any static host.
