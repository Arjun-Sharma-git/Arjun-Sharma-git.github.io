import type { RefObject } from 'react'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

/** One-off intro: headline words rise, supporting copy and the orb fade in. */
export function useHeroAnimation(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .fromTo('.hero-word > span', { yPercent: 110, autoAlpha: 1 }, { yPercent: 0, duration: 1.2, stagger: 0.06 })
          .from('[data-hero-fade]', { autoAlpha: 0, y: 20, duration: 1, stagger: 0.1 }, '-=0.8')
          .from('.eye', { scale: 0.6, autoAlpha: 0, duration: 1.6 }, 0.2)
      })
    },
    { scope },
  )
}
