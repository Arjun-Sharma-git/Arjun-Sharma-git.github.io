import { useRef } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { sectionIds } from '~/config/navigation'
import { profile } from '~/content'
import { showcaseReposQuery } from '~/queries/repos'
import { ExternalLink, SectionHeading } from '~/components/ui'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import { RepoCard } from './RepoCard'

export function Repos() {
  const scope = useRef<HTMLElement>(null)
  const { data: repos } = useSuspenseQuery(showcaseReposQuery)
  useScrollReveal(scope)

  return (
    <section ref={scope} id={sectionIds.repos} className="px-4 py-24 sm:py-32">
      <SectionHeading eyebrow="Open source" title="My" accent="repos." />

      {repos.length > 0 ? (
        <ul className="mx-auto mt-14 flex max-w-6xl flex-wrap justify-center gap-4">
          {repos.map((r) => (
            <li key={r.name} data-reveal className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]">
              <RepoCard repo={r} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center text-muted">
          See all repositories on{' '}
          <ExternalLink className="underline decoration-gold underline-offset-4" href={profile.links.github}>
            GitHub
          </ExternalLink>
          .
        </p>
      )}
    </section>
  )
}
