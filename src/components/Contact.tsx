import { useRef } from 'react'
import { gsap, motionOk, revealOnScroll, useGSAP } from '../lib/gsap'
import { profile } from '../data/profile'

export function Contact() {
  const scope = useRef<HTMLElement>(null)
  useGSAP(
    () =>
      gsap.matchMedia().add(motionOk, () => {
        revealOnScroll(scope.current!)
        gsap.to('.contact-glow', { rotate: 360, duration: 30, repeat: -1, ease: 'none' })
      }),
    { scope },
  )

  return (
    <section ref={scope} id="contact" className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[28px] bg-ink px-6 py-24 text-center text-paper sm:py-32">
        <div aria-hidden className="contact-glow pointer-events-none absolute left-1/2 top-1/2 size-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgb(162_122_69/0.35),transparent_30%,rgb(162_122_69/0.2)_60%,transparent)] blur-3xl" />
        <div className="relative">
          <p data-reveal className="text-xs font-medium uppercase tracking-[0.2em] text-gold">Contact</p>
          <h2 data-reveal className="mx-auto mt-4 max-w-3xl font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[1] tracking-tight">
            Let's build something <em className="text-gold">worth using.</em>
          </h2>
          <div data-reveal className="mt-10 flex flex-col items-center gap-4">
            <a href={`mailto:${profile.email}`} className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03] sm:text-base">
              {profile.email}
            </a>
            <div className="flex gap-6 text-sm text-paper/70">
              <a href={profile.linkedin} target="_blank" rel="noopener" className="hover:text-paper">LinkedIn</a>
              <a href={profile.github} target="_blank" rel="noopener" className="hover:text-paper">GitHub</a>
            </div>
          </div>
        </div>
        <footer className="relative mt-24 flex flex-col items-center justify-between gap-2 border-t border-paper/10 pt-6 text-xs text-paper/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>{profile.tagline}</span>
        </footer>
      </div>
    </section>
  )
}
