import { useRef } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { gsap, motionOk, revealOnScroll, useGSAP } from '../lib/gsap'
import { reposQuery } from '../data/repos'
import { profile } from '../data/profile'
import { SectionHeading } from './Section'

const dateFmt = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })

export function Repos() {
  const scope = useRef<HTMLElement>(null)
  const { data: repos } = useSuspenseQuery(reposQuery)
  useGSAP(() => gsap.matchMedia().add(motionOk, () => revealOnScroll(scope.current!)), { scope })

  return (
    <section ref={scope} id="repos" className="px-4 py-24 sm:py-32">
      <SectionHeading eyebrow="Open source" title="Fresh from" accent="my GitHub.">
        Pulled live from the GitHub API with TanStack Query, prerendered for speed.
      </SectionHeading>

      <ul className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repos.map((r) => (
          <li key={r.name} data-reveal>
            <a
              href={r.html_url}
              target="_blank"
              rel="noopener"
              className="group flex h-full flex-col rounded-3xl border border-line bg-paper p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(27_24_20/0.08)]"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="truncate font-medium">{r.name}</span>
                <span aria-hidden className="text-gold transition-transform group-hover:translate-x-1">↗</span>
              </span>
              <span className="mt-2 line-clamp-2 text-sm text-muted">{r.description ?? 'No description yet.'}</span>
              <span className="mt-auto flex items-center gap-3 pt-5 text-xs text-muted">
                {r.language && (
                  <span className="flex items-center gap-1.5">
                    <span aria-hidden className="size-2 rounded-full bg-gold" />
                    {r.language}
                  </span>
                )}
                <span>Updated {dateFmt.format(new Date(r.pushed_at))}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      {repos.length === 0 && (
        <p className="mt-10 text-center text-muted">
          See all repositories on{' '}
          <a className="underline decoration-gold underline-offset-4" href={profile.github}>
            GitHub
          </a>
          .
        </p>
      )}
    </section>
  )
}
