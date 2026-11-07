import { profile, projects, type Project } from '~/content'
import { SITE_URL } from '~/config/site'
import { buildProjectSeo, projectUrl } from './seo'

export const getProject = (slug: Project['slug']) => projects.find((p) => p.slug === slug)!

/** Route `head` for a project's proof page. */
export function proofHead(slug: Project['slug']) {
  const project = getProject(slug)
  const proof = project.caseStudy.proof!
  const url = `${projectUrl(slug)}/proof`
  const title = `${proof.seoTitle} | ${profile.name}`
  return {
    meta: [
      { title },
      { name: 'description', content: proof.seoDescription },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: proof.seoDescription },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: proof.seoDescription },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: proof.seoTitle,
          description: proof.seoDescription,
          url,
          author: { '@type': 'Person', name: profile.name, url: SITE_URL },
        }),
      },
    ],
  }
}

/** Route `head` for a case study page. */
export function projectHead(slug: Project['slug']) {
  const seo = buildProjectSeo(getProject(slug), profile)
  return {
    meta: seo.meta,
    links: [{ rel: 'canonical', href: seo.canonical }],
    scripts: [seo.workJsonLd, seo.breadcrumbJsonLd].map((data) => ({ type: 'application/ld+json', children: JSON.stringify(data) })),
  }
}
