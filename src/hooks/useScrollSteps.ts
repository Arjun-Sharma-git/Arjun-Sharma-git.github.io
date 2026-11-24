import { type RefObject, useEffect } from 'react'
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '~/lib/gsap'

type Options = { onProgress?: (progress: number) => void; onStep?: (index: number) => void }

const PHONE = '(max-width: 1023px)'
/** Gap between the bottom of the pinned panel and the step that snaps under it. */
const GAP = 16

/** The sticky panel that sits beside (desktop) or above (phone) the step list. */
const panelOf = (list: HTMLElement) => list.parentElement?.querySelector<HTMLElement>(':scope > .sticky') ?? null

/**
 * Scroll-driven steps: `[data-step]` children of `list` light up in turn as the list passes through the viewport.
 * `onProgress` gets 0..1. With reduced motion nothing is dimmed and neither callback fires, so pages render their final state.
 *
 * On phones each step snaps to just below the pinned panel (CSS scroll-snap, see global.css), and the active step is
 * whichever one sits on that line, so the graphic and the text always agree.
 */
export function useScrollSteps(list: RefObject<HTMLElement | null>, { onProgress, onStep }: Options) {
  // Tell the CSS how tall the pinned panel is, so a snapped step lands just below it rather than underneath.
  useEffect(() => {
    const el = list.current
    const panel = el && panelOf(el)
    if (!el || !panel) return
    const measure = () => el.style.setProperty('--snap-offset', `${panel.offsetHeight + GAP}px`)
    const ro = new ResizeObserver(measure)
    ro.observe(panel)
    measure()
    return () => ro.disconnect()
  }, [list])

  useGSAP(
    () => {
      gsap.matchMedia().add({ motion: MOTION_OK, phone: PHONE }, (ctx) => {
        if (!ctx.conditions?.motion) return
        const phone = !!ctx.conditions.phone
        const steps = gsap.utils.toArray<HTMLElement>('[data-step]', list.current)
        const panel = list.current && panelOf(list.current)
        let current = -1
        const update = (progress: number) => {
          onProgress?.(progress)
          const index = Math.min(Math.floor(progress * steps.length), steps.length - 1)
          if (index === current) return
          current = index
          steps.forEach((el, i) => (el.dataset.active = String(i === index)))
          onStep?.(index)
        }
        // Phone: progress from where the steps sit relative to the line under the panel. A step resting on the line
        // gives exactly i / n, so the snapped step is the active one.
        const fromLayout = () => {
          const line = (panel?.offsetHeight ?? 0) + GAP
          const tops = steps.map((el) => el.getBoundingClientRect().top)
          let i = 0
          while (i < tops.length - 1 && tops[i + 1] <= line + 1) i++
          const next = tops[i + 1] ?? tops[i] + 1
          const frac = Math.min(Math.max((line - tops[i]) / (next - tops[i]), 0), 0.999)
          return Math.min((i + frac + 1e-6) / steps.length, 1)
        }
        const trigger = ScrollTrigger.create({
          trigger: list.current,
          start: phone ? 'top bottom' : 'top 62%',
          end: phone ? 'bottom top' : 'bottom bottom', // Desktop: the list's bottom padding keeps the panel on screen to the end.
          onUpdate: (self) => update(phone ? fromLayout() : self.progress),
          onRefresh: (self) => update(phone ? fromLayout() : self.progress),
        })
        // Phone: only snap while the steps are in play, never elsewhere on the page.
        const snap = phone
          ? ScrollTrigger.create({
              trigger: list.current,
              start: 'top 75%',
              end: 'bottom 25%',
              toggleClass: { targets: document.documentElement, className: 'snap-steps' },
            })
          : null
        return () => {
          trigger.kill()
          snap?.kill()
          document.documentElement.classList.remove('snap-steps')
          steps.forEach((el) => delete el.dataset.active)
        }
      })
    },
    { scope: list },
  )
}
