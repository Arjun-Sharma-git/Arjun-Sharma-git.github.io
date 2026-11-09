import type { RefObject } from 'react'
import { Link } from '@tanstack/react-router'
import { sectionIds } from '~/config/navigation'
import { projects, type Project } from '~/content'
import { ExternalLink } from '~/components/ui'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

export const eyebrow = 'text-xs font-medium uppercase tracking-[0.2em]'
// The current step gets a gold rule rather than dimming the others, so every step keeps readable contrast.
export const stepClass = 'border-l-2 border-transparent pl-5 transition-colors duration-300 data-[active=true]:border-gold'
export const heading = 'font-serif text-[clamp(2.4rem,6vw,4.5rem)] leading-[1] tracking-tight'

/** Headline words rise and `[data-hero-fade]` copy fades in on load. */
export function useIntro(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .fromTo('.hero-word > span', { yPercent: 110, autoAlpha: 1 }, { yPercent: 0, duration: 1.2, stagger: 0.06 })
          .from('[data-hero-fade]', { autoAlpha: 0, y: 20, duration: 1, stagger: 0.1 }, '-=0.8')
      })
    },
    { scope },
  )
}

export function HeroLine({ text, accent = false }: { text: string; accent?: boolean }) {
  return (
    <span className={`block ${accent ? 'italic text-gold' : ''}`}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="hero-word inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span className="inline-block">{word}&nbsp;</span>
        </span>
      ))}
    </span>
  )
}

export function BackLink({ className = '' }: { className?: string }) {
  return (
    <Link data-hero-fade to="/" hash={sectionIds.work} className={`inline-block text-sm transition-colors ${className}`}>
      <span aria-hidden>← </span>All work
    </Link>
  )
}

export function NextProject({ current, dark = false }: { current: Project; dark?: boolean }) {
  const next = projects[(projects.indexOf(current) + 1) % projects.length]
  return (
    <nav aria-label="Next project" className="mx-auto max-w-6xl px-4 pb-16">
      <Link
        data-reveal
        to={`/work/${next.slug}`}
        className={`group flex items-end justify-between gap-6 border-t pt-8 ${dark ? 'border-paper/15' : 'border-line'}`}
      >
        <span>
          <span className={`${eyebrow} block ${dark ? 'text-gold' : 'text-gold-deep'}`}>Next project</span>
          <span className="mt-3 block font-serif text-5xl tracking-tight transition-colors group-hover:text-gold sm:text-7xl">{next.name}</span>
        </span>
        <span aria-hidden className="pb-2 text-3xl text-gold transition-transform group-hover:translate-x-1 sm:text-5xl">
          →
        </span>
      </Link>
    </nav>
  )
}

/** Where to open an issue: GitHub and GitLab keep them at different paths. */
const issuesUrl = (repo: string) => (repo.includes('gitlab.com') ? `${repo}/-/issues` : `${repo}/issues`)

/** A relaxed invitation to the repo, at the end of every case study that has public source. */
export function Contribute({ project: p, dark = false }: { project: Project; dark?: boolean }) {
  if (!p.repo) return null
  const host = p.repo.includes('gitlab.com') ? 'GitLab' : 'GitHub'
  return (
    <section aria-labelledby="contribute" className="mx-auto max-w-6xl px-4 pb-20 sm:pb-24">
      <div
        data-reveal
        className={`flex flex-col gap-8 rounded-[28px] border p-7 sm:p-10 md:flex-row md:items-end md:justify-between ${
          dark ? 'border-paper/15 bg-paper/[0.04]' : 'border-line bg-cream'
        }`}
      >
        <div className="max-w-xl">
          <p className={`${eyebrow} ${dark ? 'text-gold' : 'text-gold-deep'}`}>Open source</p>
          <h2 id="contribute" className="mt-3 font-serif text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.02] tracking-tight">
            Pull up a chair, <em className="text-gold">the code’s open.</em>
          </h2>
          <p className={`mt-4 leading-relaxed ${dark ? 'text-paper/70' : 'text-muted'}`}>
            Spotted a bug, have an idea, or just curious how {p.name} works inside? Poke around, fork it, try something.
            Issues and pull requests of any size are welcome, a typo fix included. No ceremony, and no question is too small.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium">
          <ExternalLink
            href={p.repo}
            className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 transition-transform hover:scale-[1.03] ${
              dark ? 'bg-paper text-ink' : 'bg-ink text-paper'
            }`}
          >
            Contribute on {host}
            <span className="sr-only"> to {p.name}</span>
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </ExternalLink>
          <ExternalLink href={issuesUrl(p.repo)} className="underline decoration-gold underline-offset-4 hover:decoration-2">
            Open an issue<span className="sr-only"> for {p.name}</span>
          </ExternalLink>
        </div>
      </div>
    </section>
  )
}
