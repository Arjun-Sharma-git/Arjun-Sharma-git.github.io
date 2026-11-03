import { useEffect, useRef, useState } from 'react'
import { canRender3D } from '~/lib/device'
import type { GazeScene } from './scene/gazeScene'

/**
 * WebGL eye behind the hero text. three.js is code-split and only downloaded on capable devices;
 * `onReady` hands the scene to the hero so scroll can drive it (and the 2D fallback can hide).
 */
export function HeroScene({ onReady }: { onReady: (scene: GazeScene | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canRender3D()) return
    let scene: GazeScene | undefined
    let cancelled = false
    import('./scene/gazeScene')
      .then(({ createGazeScene }) => {
        if (cancelled || !ref.current) return
        scene = createGazeScene(ref.current, { points: innerWidth < 768 ? 1800 : 4200 })
        setReady(true)
        onReady(scene)
      })
      .catch(() => {}) // fallback orb stays visible
    return () => {
      cancelled = true
      scene?.dispose()
      onReady(null)
    }
  }, [onReady])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 size-full transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
    />
  )
}
