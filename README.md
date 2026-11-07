# Arjun Sharma, portfolio

TanStack Start (Router + Query) + GSAP + Tailwind v4. Prerendered to static HTML with sitemap.

Uses pnpm (version pinned in `packageManager`, lockfile is `pnpm-lock.yaml`).

```bash
pnpm install
pnpm dev           # http://localhost:3000
pnpm typecheck     # tsc --noEmit
pnpm build         # static site in dist/client (prerendered index.html, sitemap.xml, robots.txt)
pnpm preview       # serve the build
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
  routes/        TanStack file routes (__root = document + head, index = home, work.* = case studies)
  styles/        global CSS and Tailwind theme tokens
```

Dependencies flow one way: `routes → sections → components/hooks → lib/queries → services/content/config`.
Import with the `~/` alias (maps to `src/`).

- Edit text in `src/content/*`.

## Projects

Work shows the two files in `src/content/projects/`. Each has a bespoke page, with its own route (`routes/work.*.tsx`)
and section folder (`sections/virtgaze`, `sections/reductxn`), so its visuals ship in their own chunk. The visuals are
canvas and SVG, and they fall back to a final still state with reduced motion.

`sections/reductxn/netting.ts` is a port of Reductxn's settle-up engine. Its self-check compares it with brute force:
`node --experimental-strip-types src/sections/reductxn/netting.check.ts`

Reductxn's walkthrough screens are in `public/work/reductxn/`: captured from the app at 390px wide with its demo seed, as WebP at 280 and 560px.

To add a project: add a content file, a slug in `types.ts`, a route, a page, and the path to `pages` in `vite.config.ts`.

## Resume

Drop your PDF at `public/resume.pdf` and rebuild. "Resume" links appear in the nav, hero and contact
section and it's served at `/resume.pdf`. Without the file, no resume links are rendered.

## Deploy to GitHub Pages

The site is set up as a GitHub Pages *user site* at `https://arjun-sharma-git.github.io`:

1. Create a GitHub repo named exactly `Arjun-Sharma-git.github.io`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Add it as a remote and push `main`; `.github/workflows/deploy.yml` builds and publishes `dist/client`.

Using a different repo name serves the site under `/<repo>/`, which needs a base path.

### Custom domain

1. Put the bare domain (e.g. `arjunsharma.dev`) on one line in `public/CNAME`.
2. Set `SITE_URL` in `src/config/site.ts` and the sitemap line in `public/robots.txt` to `https://<domain>`.
3. At your DNS provider add GitHub Pages' A/AAAA records (apex) or a CNAME to `arjun-sharma-git.github.io` (subdomain),
   then enable "Enforce HTTPS" in Settings → Pages.

## Repos section

Shows your own GitHub repos that have a description, newest first. In `src/content/repos.ts`,
`hiddenRepos` lists what to leave out and `repoDescriptions` fills in repos with no description on GitHub.

## Quality checks

`pnpm typecheck`, `node --experimental-strip-types src/services/github.check.ts`, and Lighthouse
(last run: desktop 100/100/100/100, mobile 95/100/100/100 with gzip, CLS 0).
- Social card: edit `scripts/og.html`, regenerate with the command in its header comment.
- `dist/client` can be deployed to any static host.
