import type { RefObject } from 'react'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

/** Headline words rise and supporting copy fades in on load; the stage timeline draws itself as it scrolls past. */
export function useCaseAnimation(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .fromTo('.hero-word > span', { yPercent: 110, autoAlpha: 1 }, { yPercent: 0, duration: 1.2, stagger: 0.06 })
          .from('[data-hero-fade]', { autoAlpha: 0, y: 20, duration: 1, stagger: 0.1 }, '-=0.8')

        gsap.fromTo(
          '.stage-line',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.stage-list', start: 'top 75%', end: 'bottom 60%', scrub: 0.6 } },
        )
      })
    },
    { scope },
  )
}
