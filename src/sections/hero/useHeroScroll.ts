import type { RefObject } from 'react'
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '~/lib/gsap'
import type { GazeScene } from './scene/gazeScene'

/**
 * Scroll behaviour of the hero.
 * With the 3D eye: pin the hero for one viewport and scrub a timeline that fades the copy away
 * while the camera flies through the opening iris. Without it: the card just shrinks slightly.
 */
export function useHeroScroll(scope: RefObject<HTMLElement | null>, scene: GazeScene | null) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        if (!scene) {
          gsap.to('.hero-card', {
            scale: 0.94,
            borderRadius: 48,
            ease: 'none',
            scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: true },
          })
          return
        }

        const state = { progress: 0 }
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: scope.current,
              start: 'top top',
              end: '+=100%',
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          })
          .to(state, { progress: 1, duration: 1, onUpdate: () => scene.setProgress(state.progress) }, 0)
          .to('.hero-content', { autoAlpha: 0, y: -80, scale: 0.96, duration: 0.45, ease: 'power1.in' }, 0)
          .to('.hero-card', { borderRadius: 48, scale: 0.97, duration: 1 }, 0)

        // The pin is created after other sections' triggers (three.js loads async), so re-order and re-measure.
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
        return () => scene.setProgress(0)
      })
    },
    { scope, dependencies: [scene], revertOnUpdate: true },
  )
}
