import type { RefObject } from 'react'
import { DESKTOP, MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

/** Desktop only: pins `pin` and scrolls `track` sideways as the page scrolls; also pulses the pipeline steps. */
export function useHorizontalScroll(scope: RefObject<HTMLElement | null>, pin: RefObject<HTMLElement | null>, track: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.matchMedia().add(`${DESKTOP} and ${MOTION_OK}`, () => {
        const el = track.current!
        const distance = () => el.scrollWidth - innerWidth + 64
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: pin.current, start: 'center center', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        })
        gsap.to('.pipe-step', { backgroundColor: '#1b1814', color: '#fbf8f2', stagger: 0.25, repeat: -1, repeatDelay: 0.8, yoyo: true, duration: 0.25 })
      })
    },
    { scope },
  )
}
