import { useRef } from 'react'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'
import { navLinks, sectionIds } from '~/config/navigation'
import { profile } from '~/content'
import { ExternalLink } from '~/components/ui'

export function Nav() {
  const ref = useRef<HTMLElement>(null)
  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      gsap.from(ref.current, { y: -40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 })
    })
  })

  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <nav
        ref={ref}
        aria-label="Primary"
        className="flex items-center gap-1 rounded-full border border-line/80 bg-paper/80 p-1.5 text-sm shadow-[0_8px_30px_rgb(27_24_20/0.08)] backdrop-blur-md"
      >
        <a href={`#${sectionIds.top}`} className="flex items-center gap-2 rounded-full px-3 py-1.5 font-medium">
          <span aria-hidden className="grid size-6 place-items-center rounded-full bg-ink font-serif text-sm text-paper">
            {profile.firstName[0]}
          </span>
          <span className="hidden sm:inline">{profile.firstName}</span>
        </a>
        {navLinks.map(({ label, href }) => (
          <a key={href} href={href} className="hidden rounded-full px-3 py-1.5 text-muted transition-colors hover:text-ink md:inline">
            {label}
          </a>
        ))}
        {profile.links.resume && (
          <ExternalLink href={profile.links.resume} className="rounded-full px-3 py-1.5 text-muted transition-colors hover:text-ink">
            Resume
          </ExternalLink>
        )}
        <a href={`mailto:${profile.email}`} className="rounded-full bg-ink px-4 py-1.5 font-medium text-paper transition-transform hover:scale-[1.03]">
          Hire me
        </a>
      </nav>
    </header>
  )
}
