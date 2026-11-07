import { useRef, useState } from 'react'
import type { Project } from '~/content'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'
import { useScrollSteps } from '~/hooks/useScrollSteps'
import { eyebrow, heading, stepClass } from '../case-study/shared'

const R = 150

/** The stages as one loop: the ring closes as the list scrolls, and it only closes at zero. */
export function CycleRing({ project }: { project: Project }) {
  const { approach } = project.caseStudy
  const stages = approach.stages
  const svg = useRef<SVGSVGElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const arc = useRef<gsap.QuickToFunc | null>(null)
  const [step, setStep] = useState(stages.length - 1)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.set('.cycle-arc', { strokeDashoffset: 1 })
        arc.current = gsap.quickTo('.cycle-arc', 'strokeDashoffset', { duration: 0.3, ease: 'power2.out' })
        return () => {
          arc.current = null
        }
      })
    },
    { scope: svg },
  )
  useScrollSteps(list, { onProgress: (p) => arc.current?.(1 - p), onStep: setStep })

  const closed = step === stages.length - 1

  return (
    <section aria-labelledby="approach" className="px-3 sm:px-4">
      <div className="rounded-[28px] bg-ink px-5 py-20 text-paper sm:px-10 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="max-w-2xl">
            <p className={`${eyebrow} text-gold`}>The approach</p>
            <h2 id="approach" className={`${heading} mt-4`}>
              {approach.title} <em className="text-gold">{approach.accent}</em>
            </h2>
            <p className="mt-5 leading-relaxed text-paper/70">{approach.intro}</p>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="sticky top-20 z-10 h-fit bg-ink pb-4 lg:top-28">
              <svg ref={svg} viewBox="-50 0 500 400" aria-hidden className="mx-auto block max-h-[36svh] w-full lg:max-h-[calc(100svh-10rem)]">
                <circle cx={200} cy={200} r={R} fill="none" stroke="rgb(251 248 242 / 0.12)" strokeWidth={2} />
                <circle
                  className="cycle-arc"
                  cx={200}
                  cy={200}
                  r={R}
                  fill="none"
                  stroke="#a27a45"
                  strokeWidth={3}
                  pathLength={1}
                  strokeDasharray="1 1"
                  strokeLinecap="round"
                  transform="rotate(-90 200 200)"
                />
                {stages.map((s, i) => {
                  const a = (i / stages.length) * Math.PI * 2 - Math.PI / 2
                  const reached = i <= step
                  return (
                    <g key={s.name} transform={`translate(${200 + Math.cos(a) * R} ${200 + Math.sin(a) * R})`}>
                      <circle r={reached ? 8 : 5} fill={reached ? '#a27a45' : '#1b1814'} stroke="#a27a45" strokeWidth={1.5} className="transition-all duration-300" />
                      <text
                        x={Math.cos(a) * 20}
                        y={Math.sin(a) * 20 + 4}
                        textAnchor={Math.abs(Math.cos(a)) < 0.2 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end'}
                        fontSize={12}
                        fill={reached ? '#fbf8f2' : 'rgb(251 248 242 / 0.4)'}
                      >
                        {s.name}
                      </text>
                    </g>
                  )
                })}
                <text x={200} y={closed ? 196 : 204} textAnchor="middle" fontSize={closed ? 44 : 30} fill="#fbf8f2" fontFamily="'Instrument Serif', serif">
                  {closed ? 'Σ = 0' : stages[step].name}
                </text>
                {closed && (
                  <text x={200} y={224} textAnchor="middle" fontSize={12} fill="rgb(251 248 242 / 0.6)">
                    the group is settled
                  </text>
                )}
              </svg>
            </div>
            <ol ref={list} data-reveal className="space-y-[24svh] pb-[16svh] pt-2 lg:space-y-[30svh] lg:pb-[28svh] lg:pt-[10svh]">
              {stages.map((s, i) => (
                <li key={s.name} data-step className={stepClass}>
                  <p className="font-mono text-xs tracking-widest text-gold">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-2 font-serif text-3xl sm:text-4xl">{s.name}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-paper/70">{s.detail}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
