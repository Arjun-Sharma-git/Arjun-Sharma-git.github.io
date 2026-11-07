import type { RefObject } from 'react'
import { Link } from '@tanstack/react-router'
import { sectionIds } from '~/config/navigation'
import { projects, type Project } from '~/content'
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
