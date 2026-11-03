import type { RefObject } from 'react'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'
import type { GazeScene } from './scene/gazeScene'

/**
 * Scroll behaviour of the hero. The section is a 200svh track with a sticky stage (pure CSS, so no
 * layout shift when this runs); scrubbing through it fades the copy away while the camera flies
 * through the opening iris of the 3D eye, or, without WebGL, the 2D orb zooms and fades.
 */
export function useHeroScroll(scope: RefObject<HTMLElement | null>, scene: GazeScene | null) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: scope.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
          })
          .to('.hero-content', { autoAlpha: 0, y: -80, scale: 0.96, duration: 0.45, ease: 'power1.in' }, 0)
          .to('.hero-card', { borderRadius: 48, scale: 0.97, duration: 1 }, 0)

        if (scene) {
          const state = { progress: 0 }
          tl.to(state, { progress: 1, duration: 1, onUpdate: () => scene.setProgress(state.progress) }, 0)
          return () => scene.setProgress(0)
        }
        tl.to('.eye-zoom', { scale: 3, autoAlpha: 0, duration: 1 }, 0)
      })
    },
    { scope, dependencies: [scene], revertOnUpdate: true },
  )
}
