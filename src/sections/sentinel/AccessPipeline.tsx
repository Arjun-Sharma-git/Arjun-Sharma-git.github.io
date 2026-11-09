import { useRef, useState } from 'react'
import type { Project } from '~/content'
import { useScrollSteps } from '~/hooks/useScrollSteps'
import { eyebrow, heading, stepClass } from '../case-study/shared'
import { TraceCard } from './TraceCard'

/** The trace card stays stuck to the viewport while the steps scroll past, ticking each one off. */
export function AccessPipeline({ project }: { project: Project }) {
  const { approach } = project.caseStudy
  const names = approach.stages.map((s) => s.name)
  const list = useRef<HTMLOListElement>(null)
  const [active, setActive] = useState<number | undefined>(undefined)
  useScrollSteps(list, { onStep: setActive })

  return (
    <section aria-labelledby="approach" className="mx-auto max-w-6xl px-4 pt-24 sm:pt-32">
      <div data-reveal className="max-w-3xl">
        <p className={`${eyebrow} text-gold-deep`}>The approach</p>
        <h2 id="approach" className={`${heading} mt-4`}>
          {approach.title} <em className="text-gold">{approach.accent}</em>
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-muted">{approach.intro}</p>
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="sticky top-20 z-10 self-start lg:top-28">
          <TraceCard steps={names} active={active} />
        </div>
        <ol ref={list} className="space-y-[28svh] pb-[24svh] pt-6 lg:space-y-[34svh] lg:pb-[30svh] lg:pt-[8svh]">
          {approach.stages.map((s, i) => (
            <li key={s.name} data-step className={stepClass}>
              <p className="font-mono text-xs tracking-widest text-gold-deep">
                {String(i + 1).padStart(2, '0')} / {String(approach.stages.length).padStart(2, '0')}
              </p>
              <h3 className="mt-2 font-serif text-3xl sm:text-4xl">{s.name}</h3>
              <p className="mt-2 max-w-md leading-relaxed text-muted">{s.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
