import { useRef } from 'react'
import { gsap, motionOk, useGSAP } from '../lib/gsap'
import { profile } from '../data/profile'

const lines = [
  ['I', 'build', 'software', 'that'],
  ['sees,', 'ships', 'and', 'scales.'],
]

export function Hero() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(motionOk, () => {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .fromTo('.hero-word > span', { yPercent: 110, autoAlpha: 1 }, { yPercent: 0, duration: 1.2, stagger: 0.06 })
          .from('[data-hero-fade]', { autoAlpha: 0, y: 20, duration: 1, stagger: 0.1 }, '-=0.8')
          .from('.eye', { scale: 0.6, autoAlpha: 0, duration: 1.6 }, 0.2)

        // The "eye" tracks the cursor: a nod to my gaze-tracking work.
        const xTo = gsap.quickTo('.pupil', 'x', { duration: 0.6, ease: 'power3' })
        const yTo = gsap.quickTo('.pupil', 'y', { duration: 0.6, ease: 'power3' })
        const onMove = (e: PointerEvent) => {
          xTo((e.clientX / innerWidth - 0.5) * 60)
          yTo((e.clientY / innerHeight - 0.5) * 60)
        }
        addEventListener('pointermove', onMove)

        gsap.to('.hero-card', {
          scale: 0.94,
          borderRadius: 48,
          ease: 'none',
          scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: true },
        })
        return () => removeEventListener('pointermove', onMove)
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="top" className="px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="hero-card grid-bg relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden rounded-[28px] bg-gradient-to-b from-[#efe4d1] to-paper px-5 pb-16 pt-32 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgb(162_122_69/0.22),transparent_70%)]" />
        <div aria-hidden className="eye pointer-events-none absolute left-1/2 top-1/2 -z-0 grid size-[min(90vw,620px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/20">
          <div className="grid size-2/3 place-items-center rounded-full border border-gold/25">
            <div className="pupil size-1/4 rounded-full bg-[radial-gradient(circle,rgb(162_122_69/0.35),rgb(162_122_69/0.05)_70%)]" />
          </div>
        </div>

        <p data-hero-fade className="relative mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted backdrop-blur">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
          </span>
          Open to work · {profile.location}
        </p>

        <h1 className="relative font-serif text-[clamp(2.9rem,9vw,7.5rem)] leading-[0.95] tracking-tight">
          <span className="sr-only">{profile.name}, {profile.role}. </span>
          {lines.map((line, i) => (
            <span key={i} aria-hidden className={`block ${i === 1 ? 'italic text-gold' : ''}`}>
              {line.map((w) => (
                <span key={w} className="hero-word inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span className="inline-block">{w}&nbsp;</span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p data-hero-fade className="relative mt-8 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg">
          I'm <strong className="font-semibold text-ink">{profile.name}</strong>, a {profile.role.toLowerCase()}. {profile.summary.split('. ')[0]}.
        </p>

        <div data-hero-fade className="relative mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#work" className="group inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-5 pr-2 text-sm font-medium text-paper">
            See selected work
            <span className="grid size-7 place-items-center rounded-full bg-paper/15 transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a href={profile.github} target="_blank" rel="noopener" className="rounded-full border border-line bg-paper/70 px-5 py-2 text-sm font-medium backdrop-blur transition-colors hover:border-ink">
            GitHub profile
          </a>
        </div>
      </div>
    </section>
  )
}
