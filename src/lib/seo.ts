import { OG_IMAGE, SITE_URL, THEME_COLOR } from '~/config/site'
import { experience, topSkills, type Profile, type Project } from '~/content'

export function buildSeo(profile: Profile) {
  const title = `${profile.name} | ${profile.role}`
  const description = `${profile.name} is a ${profile.role.toLowerCase()} in ${profile.location}, building real-time platforms with React, TypeScript and Node.js, plus Java and Spring Boot systems and computer vision in Python.`
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
    image: `${SITE_URL}/arjun-480.webp`,
    worksFor: { '@type': 'Organization', name: experience[0].company },
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: 'Noida', addressCountry: 'IN' },
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: topSkills,
  }

  return { meta, canonical: SITE_URL, personJsonLd }
}

export const projectUrl = (slug: string) => `${SITE_URL}/work/${slug}`

/** Overrides the site-wide tags for one case study page; `head` merges these by name and property. */
export function buildProjectSeo(project: Project, profile: Profile) {
  const { seoTitle, seoDescription: description } = project.caseStudy
  const title = `${project.name}: ${seoTitle} | ${profile.name}`
  const url = projectUrl(project.slug)

  const meta = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: project.tags.join(', ') },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ]

  const workJsonLd = {
    '@context': 'https://schema.org',
    // Private work has no public code to point at, so it is described as a plain creative work.
    '@type': project.repo ? 'SoftwareSourceCode' : 'CreativeWork',
    name: project.name,
    headline: seoTitle,
    description,
    url,
    keywords: project.tags,
    author: { '@type': 'Person', name: profile.name, url: SITE_URL },
    ...(project.repo && { codeRepository: project.repo, programmingLanguage: project.tags[0] }),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: project.name, item: url },
    ],
  }

  return { meta, canonical: url, workJsonLd, breadcrumbJsonLd }
}
