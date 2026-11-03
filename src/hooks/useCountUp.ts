import type { RefObject } from 'react'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

/** Counts every [data-count] element up to its value when scrolled into view. */
export function useCountUp(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-count]', scope.current).forEach((el) => {
          const end = Number(el.dataset.count)
          // Years (e.g. 2020) tick up from a nearby value instead of from zero.
          const counter = { v: end > 1000 ? end - 40 : 0 }
          gsap.to(counter, {
            v: end,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
            onUpdate: () => {
              el.textContent = String(Math.round(counter.v))
            },
          })
        })
      })
    },
    { scope },
  )
}
