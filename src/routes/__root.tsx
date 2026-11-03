import type { ReactNode } from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from '@tanstack/react-router'
import { profile } from '../data/profile'
import { SITE_URL } from '../site'
import css from '../styles.css?url'

const title = `${profile.name} | ${profile.role}`
const description = `${profile.name} is a ${profile.role.toLowerCase()} in ${profile.location}, building real-time computer vision in Python and full-stack products with React, TypeScript and Node.js.`

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  url: SITE_URL,
  email: `mailto:${profile.email}`,
  address: { '@type': 'PostalAddress', addressLocality: 'Noida', addressCountry: 'IN' },
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ['Computer Vision', 'Python', 'PyTorch', 'OpenCV', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Next.js', 'GSAP'],
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title },
      { name: 'description', content: description },
      { name: 'author', content: profile.name },
      { name: 'theme-color', content: '#f5efe4' },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:type', content: 'profile' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:image', content: `${SITE_URL}/og.png` },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: `${SITE_URL}/og.png` },
    ],
    links: [
      { rel: 'canonical', href: SITE_URL },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap' },
      { rel: 'stylesheet', href: css },
    ],
    scripts: [
      // Hides animated elements only when JS runs, so no-JS crawlers and users see everything.
      { children: "document.documentElement.classList.add('js')" },
      { type: 'application/ld+json', children: JSON.stringify(personLd) },
    ],
  }),
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
})

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
