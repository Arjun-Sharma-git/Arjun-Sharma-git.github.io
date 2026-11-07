import { useRef } from 'react'
import type { Project } from '~/content'
import { useCanvas } from '~/lib/canvas'
import { useScrollSteps } from '~/hooks/useScrollSteps'
import { eyebrow, heading, stepClass } from '../case-study/shared'
import { createPipelineScene } from './pipelineScene'

/** The canvas stays stuck to the viewport while the stage list scrolls past, building one layer per stage. */
export function GazePipeline({ project }: { project: Project }) {
  const { approach } = project.caseStudy
  const canvas = useRef<HTMLCanvasElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const draw = useRef<ReturnType<typeof createPipelineScene> | null>(null)
  const stage = useRef(approach.stages.length)
  const shown = useRef(approach.stages.length)

  useCanvas(canvas, (frame) => {
    draw.current ??= createPipelineScene()
    shown.current += (stage.current - shown.current) * (frame.still ? 1 : 0.12)
    draw.current(frame, shown.current)
  })
  useScrollSteps(list, { onProgress: (p) => (stage.current = 0.6 + p * (approach.stages.length - 0.6)) })

  return (
    <section aria-labelledby="approach" className="mx-auto max-w-7xl px-4 pb-24 sm:pb-32">
      <div data-reveal className="max-w-3xl">
        <p className={`${eyebrow} text-gold`}>The approach</p>
        <h2 id="approach" className={`${heading} mt-4`}>
          {approach.title} <em className="text-gold">{approach.accent}</em>
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-paper/70">{approach.intro}</p>
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="sticky top-20 z-10 h-[44svh] rounded-[28px] border border-paper/10 bg-[#171410] lg:top-24 lg:h-[calc(100svh-8rem)]">
          <canvas ref={canvas} aria-hidden className="size-full rounded-[28px]" />
        </div>
        <ol ref={list} data-reveal className="space-y-[32svh] pb-[22svh] pt-6 lg:space-y-[38svh] lg:pb-[34svh] lg:pt-[12svh]">
          {approach.stages.map((s, i) => (
            <li key={s.name} data-step className={stepClass}>
              <p className="font-mono text-xs tracking-widest text-gold">
                {String(i + 1).padStart(2, '0')} / {String(approach.stages.length).padStart(2, '0')}
              </p>
              <h3 className="mt-2 font-serif text-3xl sm:text-4xl">{s.name}</h3>
              <p className="mt-2 max-w-md leading-relaxed text-paper/70">{s.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
