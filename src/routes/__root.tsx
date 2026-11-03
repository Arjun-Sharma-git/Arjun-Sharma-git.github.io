import type { ReactNode } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { profile } from '~/content'
import { buildSeo } from '~/lib/seo'
import css from '~/styles/global.css?url'

const seo = buildSeo(profile)
const fonts = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, ...seo.meta],
    links: [
      { rel: 'canonical', href: seo.canonical },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: fonts },
      { rel: 'stylesheet', href: css },
    ],
    scripts: [
      // Hides animated elements only when JS runs, so no-JS crawlers and users see everything.
      { children: "document.documentElement.classList.add('js')" },
      { type: 'application/ld+json', children: JSON.stringify(seo.personJsonLd) },
    ],
  }),
  component: RootLayout,
})

function RootLayout() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
