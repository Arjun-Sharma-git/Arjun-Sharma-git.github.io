import { type RefObject, useEffect, useRef } from 'react'

export type Frame = { ctx: CanvasRenderingContext2D; w: number; h: number; t: number; dt: number; still: boolean }

/**
 * Sizes a 2D canvas to its box and runs `draw` every frame while it is on screen.
 * With reduced motion it draws one still frame (and again on resize) instead of looping.
 */
export function useCanvas(ref: RefObject<HTMLCanvasElement | null>, draw: (frame: Frame) => void) {
  const latest = useRef(draw)
  latest.current = draw

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let raf = 0
    let last = 0
    let t = 0

    const paint = (dt: number) => {
      ctx.clearRect(0, 0, w, h)
      latest.current({ ctx, w, h, t, dt, still })
    }
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000 || 0, 0.05)
      last = now
      t += dt
      paint(dt)
      raf = requestAnimationFrame(tick)
    }
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, innerWidth < 768 ? 1.5 : 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (still) paint(0)
    }
    const sizes = new ResizeObserver(resize)
    sizes.observe(canvas)
    resize()

    // Starts once the browser is idle, so drawing never competes with hydration.
    let visible = false
    let ready = false
    const run = () => {
      cancelAnimationFrame(raf)
      if (ready && visible && !still) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      run()
    })
    seen.observe(canvas)
    const begin = () => {
      ready = true
      run()
    }
    const idle = 'requestIdleCallback' in window ? requestIdleCallback(begin, { timeout: 1500 }) : setTimeout(begin, 300)

    return () => {
      if ('cancelIdleCallback' in window) cancelIdleCallback(idle as number)
      else clearTimeout(idle)
      cancelAnimationFrame(raf)
      sizes.disconnect()
      seen.disconnect()
    }
  }, [ref])
}

export const clamp = (x: number, a = 0, b = 1) => Math.min(Math.max(x, a), b)
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
