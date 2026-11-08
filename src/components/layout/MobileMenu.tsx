import { useEffect, useRef, useState } from 'react'
import { navLinks } from '~/config/navigation'
import { profile } from '~/content'
import { ExternalLink } from '~/components/ui'
import { trackEvent } from '~/lib/analytics'

const itemClass = 'block rounded-2xl px-4 py-3 text-base text-ink transition-colors hover:bg-cream'

/** Section links for small screens: toggle button + dropdown panel. Closes on link click, Escape or outside click. */
export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    const onClick = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    addEventListener('keydown', onKey)
    addEventListener('pointerdown', onClick)
    return () => {
      removeEventListener('keydown', onKey)
      removeEventListener('pointerdown', onClick)
    }
  }, [open])

  return (
    <div ref={root} className="md:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="grid size-8 place-items-center rounded-full text-ink transition-colors hover:bg-cream"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
        </svg>
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute left-1/2 top-full mt-2 w-[min(calc(100vw-2rem),20rem)] -translate-x-1/2 rounded-3xl border border-line bg-paper p-2 shadow-[0_20px_40px_rgb(27_24_20/0.12)]"
      >
        <ul>
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className={itemClass} onClick={() => setOpen(false)}>
                {label}
              </a>
            </li>
          ))}
          {profile.links.resume && (
            <li>
              <ExternalLink href={profile.links.resume} className={itemClass} onClick={() => { trackEvent('resume-download', 'Resume download'); setOpen(false) }}>
                Resume
              </ExternalLink>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
