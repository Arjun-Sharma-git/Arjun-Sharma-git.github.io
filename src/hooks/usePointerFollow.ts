import type { RefObject } from 'react'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

/** Moves `selector` (inside scope) toward the pointer, up to `range` px from centre. */
export function usePointerFollow(scope: RefObject<HTMLElement | null>, selector: string, range = 60) {
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const xTo = gsap.quickTo(selector, 'x', { duration: 0.6, ease: 'power3' })
        const yTo = gsap.quickTo(selector, 'y', { duration: 0.6, ease: 'power3' })
        const onMove = (e: PointerEvent) => {
          xTo((e.clientX / innerWidth - 0.5) * range)
          yTo((e.clientY / innerHeight - 0.5) * range)
        }
        addEventListener('pointermove', onMove)
        return () => removeEventListener('pointermove', onMove)
      })
    },
    { scope },
  )
}
