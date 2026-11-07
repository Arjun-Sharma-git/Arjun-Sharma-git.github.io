import type { RefObject } from 'react'
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '~/lib/gsap'

type Options = { onProgress?: (progress: number) => void; onStep?: (index: number) => void }

/**
 * Scroll-driven steps: `[data-step]` children of `list` light up in turn as the list passes through the viewport.
 * `onProgress` gets 0..1. With reduced motion nothing is dimmed and neither callback fires, so pages render their final state.
 */
export function useScrollSteps(list: RefObject<HTMLElement | null>, { onProgress, onStep }: Options) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const steps = gsap.utils.toArray<HTMLElement>('[data-step]', list.current)
        let current = -1
        const update = (progress: number) => {
          onProgress?.(progress)
          const index = Math.min(Math.floor(progress * steps.length), steps.length - 1)
          if (index === current) return
          current = index
          steps.forEach((el, i) => (el.dataset.active = String(i === index)))
          onStep?.(index)
        }
        const trigger = ScrollTrigger.create({
          trigger: list.current,
          start: 'top 62%',
          end: 'bottom bottom', // The list's bottom padding keeps a sticky panel on screen until the very end.
          onUpdate: (self) => update(self.progress),
          onRefresh: (self) => update(self.progress),
        })
        return () => {
          trigger.kill()
          steps.forEach((el) => delete el.dataset.active)
        }
      })
    },
    { scope: list },
  )
}
