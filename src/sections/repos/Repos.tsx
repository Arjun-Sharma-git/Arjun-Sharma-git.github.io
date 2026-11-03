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
      <SectionHeading eyebrow="Open source" title="Fresh from" accent="my GitHub.">
        Pulled live from the GitHub API with TanStack Query, prerendered for speed.
      </SectionHeading>

      {repos.length > 0 ? (
        <ul className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r) => (
            <li key={r.name} data-reveal>
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
