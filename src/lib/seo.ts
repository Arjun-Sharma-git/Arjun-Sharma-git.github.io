import { OG_IMAGE, SITE_URL, THEME_COLOR } from '~/config/site'
import { topSkills, type Profile } from '~/content'

export function buildSeo(profile: Profile) {
  const title = `${profile.name} | ${profile.role}`
  const description = `${profile.name} is a ${profile.role.toLowerCase()} in ${profile.location}, building real-time computer vision with Python, PyTorch and OpenCV and web products with React, Next.js and Node.js.`
  const image = `${SITE_URL}${OG_IMAGE.path}`

  const meta = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: topSkills.join(', ') },
    { name: 'author', content: profile.name },
    { name: 'theme-color', content: THEME_COLOR },
    { name: 'robots', content: 'index, follow, max-image-preview:large' },
    { property: 'og:type', content: 'profile' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: SITE_URL },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: String(OG_IMAGE.width) },
    { property: 'og:image:height', content: String(OG_IMAGE.height) },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Noida', addressCountry: 'IN' },
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: topSkills,
  }

  return { meta, canonical: SITE_URL, personJsonLd }
}
