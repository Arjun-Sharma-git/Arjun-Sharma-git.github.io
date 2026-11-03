import { useRef } from 'react'
import { sectionIds } from '~/config/navigation'
import { profile } from '~/content'
import { ExternalLink } from '~/components/ui'
import { Footer } from '~/components/layout'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

export function Contact() {
  const scope = useRef<HTMLElement>(null)
  useScrollReveal(scope)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.to('.contact-glow', { rotate: 360, duration: 30, repeat: -1, ease: 'none' })
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={sectionIds.contact} className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[28px] bg-ink px-6 py-24 text-center text-paper sm:py-32">
        <div
          aria-hidden
          className="contact-glow pointer-events-none absolute left-1/2 top-1/2 size-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgb(162_122_69/0.35),transparent_30%,rgb(162_122_69/0.2)_60%,transparent)] blur-3xl"
        />
        <div className="relative">
          <p data-reveal className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
            Contact
          </p>
          <h2 data-reveal className="mx-auto mt-4 max-w-3xl font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[1] tracking-tight">
            Let's build something <em className="text-gold">worth using.</em>
          </h2>
          <div data-reveal className="mt-10 flex flex-col items-center gap-4">
            <a href={`mailto:${profile.email}`} className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03] sm:text-base">
              {profile.email}
            </a>
            <div className="flex gap-6 text-sm text-paper/70">
              <ExternalLink href={profile.links.linkedin} className="hover:text-paper">
                LinkedIn
              </ExternalLink>
              <ExternalLink href={profile.links.github} className="hover:text-paper">
                GitHub
              </ExternalLink>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </section>
  )
}
