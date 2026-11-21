import { useEffect, useRef } from 'react'
import { useCanvas } from '~/lib/canvas'
import { type EyeState, createEye } from './iris'

/** Full-bleed eye that follows the pointer and casts a gaze ray to it. Purely decorative. */
export function IrisCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const state = useRef<EyeState>({ pointer: null })
  const clock = useRef(0)
  const draw = useRef<ReturnType<typeof createEye> | null>(null)

  useCanvas(canvas, (frame) => {
    draw.current ??= createEye()
    clock.current = frame.t
    draw.current(frame, state.current)
  })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const box = canvas.current?.getBoundingClientRect()
      if (box) state.current.pointer = { x: e.clientX - box.left, y: e.clientY - box.top, at: clock.current }
    }
    addEventListener('pointermove', onMove, { passive: true })
    return () => removeEventListener('pointermove', onMove)
  }, [])

  return <canvas ref={canvas} aria-hidden className="absolute inset-x-0 top-0 h-[50svh] w-full lg:inset-0 lg:h-full" />
}
