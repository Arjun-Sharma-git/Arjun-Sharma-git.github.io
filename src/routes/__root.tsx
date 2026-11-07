import { Suspense, type ReactNode } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { profile } from '~/content'
import { Backdrop, NotFound } from '~/components/layout'
import { buildSeo } from '~/lib/seo'
import css from '~/styles/global.css?url'
import serif from '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2?url'
import serifItalic from '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2?url'
import sans from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url'

const seo = buildSeo(profile)

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, ...seo.meta],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      // Preload above-the-fold fonts so the headline doesn't reflow when they swap in.
      ...[serif, serifItalic, sans].map((href) => ({ rel: 'preload', href, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' as const })),
      { rel: 'stylesheet', href: css },
    ],
    scripts: [
      // Hides animated elements only when JS runs, so no-JS crawlers and users see everything.
      { children: "document.documentElement.classList.add('js')" },
      { type: 'application/ld+json', children: JSON.stringify(seo.personJsonLd) },
    ],
  }),
  // The shell wraps every render, including not-found and error states, so <html> is always present.
  shellComponent: RootDocument,
  // 404.html is prerendered from the /404 route, whose match the server wraps in a Suspense boundary;
  // mirroring it here lets that file hydrate cleanly at any unknown URL on GitHub Pages.
  notFoundComponent: () => (
    <Suspense>
      <NotFound />
    </Suspense>
  ),
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Backdrop />
        {children}
        <Scripts />
      </body>
    </html>
  )
}
