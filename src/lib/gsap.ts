import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

if (typeof window !== 'undefined') {
  // Mobile Safari resizes the viewport as its toolbar shows and hides; don't recalculate every trigger mid-scroll.
  ScrollTrigger.config({ ignoreMobileResize: true })
  // Web fonts change text heights after first layout, so re-measure trigger positions once they're in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
}

export { gsap, ScrollTrigger, useGSAP }

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const DESKTOP = '(min-width: 1024px)'
