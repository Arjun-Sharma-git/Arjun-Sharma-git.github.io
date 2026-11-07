import { useEffect, useRef } from 'react'
import type { Project } from '~/content'
import { clamp, useCanvas } from '~/lib/canvas'
import { eyebrow, heading } from '../case-study/shared'
import { oneEuro } from './oneEuro'

type Trail = { x: number; y: number }[]

/** A real One Euro filter on synthetic noise: move the pointer and watch the two traces disagree. */
export function FilterDemo({ project }: { project: Project }) {
  const demo = project.caseStudy.demo!
  const canvas = useRef<HTMLCanvasElement>(null)
  const pointer = useRef<{ x: number; y: number; at: number } | null>(null)
  const clock = useRef(0)
  const sim = useRef({ fx: oneEuro(), fy: oneEuro(), raw: [] as Trail, out: [] as Trail, gx: 0, gy: 0, tx: 0, ty: 0, next: 0, seed: 9 })

  useCanvas(canvas, ({ ctx: c, w, h, t, dt, still }) => {
    clock.current = t
    const s = sim.current
    const rand = () => (s.seed = (s.seed * 1664525 + 1013904223) >>> 0) / 2 ** 32
    const gauss = () => (rand() + rand() + rand() - 1.5) * 2

    const step = (delta: number, time: number) => {
      const held = pointer.current && time - pointer.current.at < 2.5
      if (time > s.next) {
        // Fixate, then jump: the rhythm real gaze has.
        s.tx = w * (0.14 + rand() * 0.72)
        s.ty = h * (0.2 + rand() * 0.6)
        s.next = time + 0.7 + rand() * 0.9
      }
      const tx = held ? pointer.current!.x : s.tx
      const ty = held ? pointer.current!.y : s.ty
      const pull = 1 - Math.pow(0.00001, delta)
      s.gx += (tx - s.gx) * pull
      s.gy += (ty - s.gy) * pull
      const noise = Math.min(w, h) * 0.03
      const rx = s.gx + gauss() * noise
      const ry = s.gy + gauss() * noise
      s.raw.push({ x: rx, y: ry })
      s.out.push({ x: s.fx(rx, delta), y: s.fy(ry, delta) })
      if (s.raw.length > 240) {
        s.raw.shift()
        s.out.shift()
      }
    }
    if (!s.gx) {
      s.gx = w / 2
      s.gy = h / 2
    }
    // A still frame still needs a trace to show, so it simulates a few seconds up front.
    if (still) {
      if (!s.raw.length) for (let i = 0; i < 240; i++) step(1 / 60, i / 60)
    } else step(clamp(dt, 1 / 120, 1 / 30), t)

    c.strokeStyle = 'rgba(251,248,242,0.05)'
    c.lineWidth = 1
    c.beginPath()
    for (let x = 0; x < w; x += 48) {
      c.moveTo(x, 0)
      c.lineTo(x, h)
    }
    for (let y = 0; y < h; y += 48) {
      c.moveTo(0, y)
      c.lineTo(w, y)
    }
    c.stroke()

    const trace = (trail: Trail, colour: string, width: number) => {
      c.strokeStyle = colour
      c.lineWidth = width
      c.lineJoin = 'round'
      c.beginPath()
      trail.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)))
      c.stroke()
    }
    trace(s.raw, 'rgba(224,108,79,0.75)', 1)
    trace(s.out, 'rgba(251,248,242,0.95)', 2.2)
    const head = s.out.at(-1)
    if (head) {
      c.strokeStyle = 'rgb(226,190,134)'
      c.lineWidth = 1.2
      c.beginPath()
      c.arc(head.x, head.y, 11, 0, 6.283)
      c.stroke()
    }
  })

  useEffect(() => {
    const el = canvas.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const box = el.getBoundingClientRect()
      pointer.current = { x: e.clientX - box.left, y: e.clientY - box.top, at: clock.current }
    }
    el.addEventListener('pointermove', onMove, { passive: true })
    return () => el.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section aria-labelledby="filter" className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-24 sm:pb-32 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
      <div data-reveal>
        <p className={`${eyebrow} text-gold`}>Try it</p>
        <h2 id="filter" className={`${heading} mt-4`}>
          {demo.title} <em className="text-gold">{demo.accent}</em>
        </h2>
        <p className="mt-5 leading-relaxed text-paper/70">{demo.intro}</p>
        <ul aria-hidden className="mt-6 flex gap-6 text-sm text-paper/70">
          <li className="flex items-center gap-2">
            <span className="h-px w-6 bg-[#e06c4f]" />
            Raw estimate
          </li>
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-paper" />
            One Euro filtered
          </li>
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-paper/45">{demo.note}</p>
      </div>
      <div data-reveal className="overflow-hidden rounded-[28px] border border-paper/10 bg-[#171410]">
        <canvas ref={canvas} aria-hidden className="block h-[52svh] min-h-80 w-full touch-pan-y" />
      </div>
    </section>
  )
}
