import { createFileRoute } from '@tanstack/react-router'
import { SITE_URL } from '~/config/site'
import { showcaseReposQuery } from '~/queries/repos'
import { Nav, SkipLink } from '~/components/layout'
import { Contact, Hero, Repos, Experience, Skills, Work } from '~/sections'

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(showcaseReposQuery),
  head: () => ({ links: [{ rel: 'canonical', href: SITE_URL }] }),
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main id="main">
        <Hero />
        <Skills />
        <Experience />
        <Work />
        <Repos />
        <Contact />
      </main>
    </>
  )
}
