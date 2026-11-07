import { profile, projects, type Project } from '~/content'
import { buildProjectSeo } from './seo'

export const getProject = (slug: Project['slug']) => projects.find((p) => p.slug === slug)!

/** Route `head` for a case study page. */
export function projectHead(slug: Project['slug']) {
  const seo = buildProjectSeo(getProject(slug), profile)
  return {
    meta: seo.meta,
    links: [{ rel: 'canonical', href: seo.canonical }],
    scripts: [seo.workJsonLd, seo.breadcrumbJsonLd].map((data) => ({ type: 'application/ld+json', children: JSON.stringify(data) })),
  }
}
