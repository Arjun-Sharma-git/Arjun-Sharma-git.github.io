import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export { gsap, ScrollTrigger, useGSAP }

export const motionOk = '(prefers-reduced-motion: no-preference)'

// Fades/slides every [data-reveal] inside scope into view on scroll.
export function revealOnScroll(scope: Element) {
  gsap.utils.toArray<HTMLElement>('[data-reveal]', scope).forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } },
    )
  })
}
