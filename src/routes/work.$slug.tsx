import { createFileRoute, notFound } from '@tanstack/react-router'
import { profile, projects } from '~/content'
import { buildProjectSeo } from '~/lib/seo'
import { Nav, SkipLink } from '~/components/layout'
import { CaseStudy, Contact } from '~/sections'

export const Route = createFileRoute('/work/$slug')({
  loader: ({ params }) => {
    if (!projects.some((p) => p.slug === params.slug)) throw notFound()
  },
  head: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug)
    if (!project) return {}
    const seo = buildProjectSeo(project, profile)
    return {
      meta: seo.meta,
      links: [{ rel: 'canonical', href: seo.canonical }],
      scripts: [seo.workJsonLd, seo.breadcrumbJsonLd].map((data) => ({ type: 'application/ld+json', children: JSON.stringify(data) })),
    }
  },
  component: CaseStudyPage,
})

function CaseStudyPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)!

  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main">
        {/* Keyed so moving between case studies replays the intro and rebuilds the scroll triggers. */}
        <CaseStudy key={slug} project={project} />
        <Contact />
      </main>
    </>
  )
}
