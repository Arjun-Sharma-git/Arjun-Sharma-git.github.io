import { createFileRoute } from '@tanstack/react-router'
import { reposQuery } from '../data/repos'
import { Nav } from '../components/Nav'
import { Hero } from '../components/Hero'
import { Stats } from '../components/Stats'
import { Skills } from '../components/Skills'
import { Work } from '../components/Work'
import { Repos } from '../components/Repos'
import { Contact } from '../components/Contact'

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(reposQuery),
  component: Home,
})

function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Stats />
        <Skills />
        <Work />
        <Repos />
        <Contact />
      </main>
    </>
  )
}
