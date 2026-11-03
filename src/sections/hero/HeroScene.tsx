import { useEffect, useRef, useState } from 'react'
import { canRender3D } from '~/lib/device'

/**
 * WebGL eye behind the hero text. three.js is code-split and only downloaded on capable devices;
 * `onReady` lets the hero hide its 2D fallback once the scene is drawing.
 */
export function HeroScene({ onReady }: { onReady: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!canRender3D()) return
    let dispose: (() => void) | undefined
    let cancelled = false
    import('./scene/gazeScene')
      .then(({ createGazeScene }) => {
        if (cancelled || !ref.current) return
        dispose = createGazeScene(ref.current, { points: innerWidth < 768 ? 1800 : 4200 })
        setReady(true)
        onReady()
      })
      .catch(() => {}) // fallback orb stays visible
    return () => {
      cancelled = true
      dispose?.()
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
