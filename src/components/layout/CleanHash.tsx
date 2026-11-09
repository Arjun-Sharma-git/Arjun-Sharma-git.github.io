import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { sectionIds } from '~/config/navigation'

const SECTIONS = new Set<string>(Object.values(sectionIds))

function scrollToSection(id: string, smooth: boolean) {
  const el = document.getElementById(id)
  if (!el) return false
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'start' })
  return true
}

/**
 * Keeps `#work` and friends out of the address bar while section links stay real anchors (`/#work`),
 * so they still work without JS and from case-study pages.
 *
 * - On the page that has the section, a click scrolls to it and leaves the URL alone.
 * - Arriving with a section hash (another page, a shared link): scroll there, then drop the hash.
 *   History state is kept, so the router's scroll restoration still works. The skip link's #main is
 *   not a section and is left alone.
 */
export function CleanHash() {
  const href = useRouterState({ select: (s) => s.location.href })

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null
      if (!link || link.target === '_blank') return
      const url = new URL(link.href)
      const id = url.hash.slice(1)
      if (!SECTIONS.has(id) || url.origin !== location.origin || url.pathname !== location.pathname) return
      if (!scrollToSection(id, true)) return
      e.preventDefault()
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  useEffect(() => {
    const id = location.hash.slice(1)
    if (!SECTIONS.has(id)) return
    // Hydration, the router's scroll restoration and ScrollTrigger's layout pass can each move the
    // page after the first jump, so land on the section again as the page settles, then drop the hash.
    const timers = [0, 250, 700].map((ms, i, all) =>
      window.setTimeout(() => {
        if (!scrollToSection(id, false)) return
        if (i === all.length - 1) history.replaceState(history.state, '', location.pathname + location.search)
      }, ms),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [href])

  return null
}
