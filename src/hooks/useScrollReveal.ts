import type { RefObject } from 'react'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

/** Fades/slides every [data-reveal] inside the scope into view as it scrolls in. */
export function useScrollReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]', scope.current).forEach((el) => {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } },
          )
        })
      })
    },
    { scope },
  )
}
