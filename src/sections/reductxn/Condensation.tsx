import { useRef, useState } from 'react'
import type { Project } from '~/content'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'
import { useScrollSteps } from '~/hooks/useScrollSteps'
import { eyebrow, heading, stepClass } from '../case-study/shared'
import { balances, debts, groups, members, payments } from './netting'

const SIZE = 640
const CENTRE = SIZE / 2
const RING = 248

const ringPos = members.map((_, i) => {
  const a = (i / members.length) * Math.PI * 2 - Math.PI / 2
  return { x: CENTRE + Math.cos(a) * RING, y: CENTRE + Math.sin(a) * RING }
})

// Each zero-sum group gets its own clearing; the plan is drawn there once the circle breaks up.
const clearings = [
  { x: 176, y: 186 },
  { x: 466, y: 200 },
  { x: 320, y: 470 },
]
const groupOf = new Map(groups.flatMap((g, gi) => g.map((m) => [m, gi] as const)))
const finalPos = members.map((_, m) => {
  const gi = groupOf.get(m)!
  const group = groups[gi]
  const c = clearings[gi]
  const a = (group.indexOf(m) / group.length) * Math.PI * 2 + (group.length === 2 ? 0 : -Math.PI / 2)
  const r = group.length === 2 ? 92 : 118
  return { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r }
})

const radius = (m: number) => 18 + Math.sqrt(Math.abs(balances[m])) * 0.8
// Payments arrive from above, so people low in a clearing carry their name underneath.
const labelBelow = (m: number) => finalPos[m].y > clearings[groupOf.get(m)!].y
// Aarav sits right under Leo's name once the groups form, so Aarav's goes beside the disc.
const labelAt = (m: number) =>
  m === 0
    ? ({ x: radius(m) + 8, y: 6, textAnchor: 'start' } as const)
    : ({ y: labelBelow(m) ? radius(m) + 22 : -radius(m) - 9, textAnchor: 'middle' } as const)
const signed = (n: number) => `${n > 0 ? '+' : '−'}${Math.abs(n)}`

function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2 + (CENTRE - (a.x + b.x) / 2) * 0.32
  const my = (a.y + b.y) / 2 + (CENTRE - (a.y + b.y) / 2) * 0.32
  return `M${a.x} ${a.y}Q${mx} ${my} ${b.x} ${b.y}`
}

function arrow(from: number, to: number) {
  const a = finalPos[from]
  const b = finalPos[to]
  const d = Math.hypot(b.x - a.x, b.y - a.y)
  const ux = (b.x - a.x) / d
  const uy = (b.y - a.y) / d
  return {
    x1: a.x + ux * (radius(from) + 3),
    y1: a.y + uy * (radius(from) + 3),
    x2: b.x - ux * (radius(to) + 9),
    y2: b.y - uy * (radius(to) + 9),
  }
}

const readouts = [
  { value: debts.length, label: 'debts between 8 people' },
  { value: members.length, label: 'net balances, summing to zero' },
  { value: groups.length, label: 'zero-sum groups found' },
  { value: payments.length, label: 'payments settle everyone' },
]

export function Condensation({ project }: { project: Project }) {
  const demo = project.caseStudy.demo!
  const svg = useRef<SVGSVGElement>(null)
  const list = useRef<HTMLOListElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const [step, setStep] = useState(readouts.length - 1)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } })
        timeline.current = tl

        // Start: everyone on the circle, every debt drawn.
        members.forEach((_, m) => {
          gsap.set(`[data-node="${m}"]`, { x: ringPos[m].x, y: ringPos[m].y }) // x and y replace the SSR translate
          gsap.set(`[data-disc="${m}"]`, { scale: 17 / radius(m), transformOrigin: '50% 50%' })
        })
        gsap.set('.balance', { autoAlpha: 0 })
        gsap.set('.debt', { autoAlpha: 1 })
        gsap.set('.payment', { strokeDashoffset: 1, autoAlpha: 0 })
        gsap.set('.payment-label, .clearing', { autoAlpha: 0 })

        // 1 to 2: each debt is absorbed into the two people it joins, and their discs take on the net amount.
        tl.fromTo('.debt', { strokeDashoffset: 0 }, { strokeDashoffset: -1, stagger: { each: 0.03, from: 'random' }, duration: 0.5 }, 0.5)
        tl.to('.debt', { autoAlpha: 0, duration: 0.15 }, 1.15)
        members.forEach((_, m) => tl.to(`[data-disc="${m}"]`, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0.8))
        tl.to('.balance', { autoAlpha: 1, duration: 0.3 }, 1)

        // 2 to 3: the circle breaks into the zero-sum groups.
        members.forEach((_, m) => tl.to(`[data-node="${m}"]`, { x: finalPos[m].x, y: finalPos[m].y, duration: 0.8, ease: 'power2.inOut' }, 1.7))
        tl.to('.clearing', { autoAlpha: 1, duration: 0.4 }, 2.2)

        // 3 to 4: each group settles in s - 1 payments.
        tl.fromTo('.payment', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01, immediateRender: false }, 2.88)
        tl.to('.payment', { strokeDashoffset: 0, duration: 0.5, stagger: 0.1 }, 2.9)
        tl.to('.payment-label', { autoAlpha: 1, duration: 0.3, stagger: 0.1 }, 3.1)
        tl.to({}, { duration: 0.3 })

        return () => {
          timeline.current = null
          tl.kill()
        }
      })
    },
    { scope: svg },
  )

  useScrollSteps(list, {
    onProgress: (p) => timeline.current?.progress(p),
    onStep: setStep,
  })

  const readout = readouts[step]

  return (
    <section aria-labelledby="condense" className="mx-auto max-w-7xl px-4 py-24 sm:py-32">
      <div data-reveal className="max-w-3xl">
        <p className={`${eyebrow} text-gold-deep`}>Condensation</p>
        <h2 id="condense" className={`${heading} mt-4`}>
          {demo.title} <em className="text-gold">{demo.accent}</em>
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-muted">{demo.intro}</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="sticky top-20 z-10 h-fit rounded-[28px] border border-line bg-paper p-3 shadow-[0_24px_60px_rgb(27_24_20/0.08)] lg:top-24 lg:p-5">
          <div className="mx-auto max-h-[43svh] max-w-[43svh] lg:max-h-[calc(100svh-15rem)] lg:max-w-[calc(100svh-15rem)]">
            <svg ref={svg} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden className="size-full overflow-visible">
              <defs>
                <marker id="pay" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                  <path d="M0 0L10 5L0 10z" fill="#1b1814" />
                </marker>
              </defs>

              {clearings.map((c, i) => (
                <circle key={i} className="clearing" cx={c.x} cy={c.y} r={groups[i].length === 2 ? 138 : 160} fill="#f5efe4" stroke="#e2d9c8" strokeDasharray="4 6" />
              ))}

              {debts.map((d, i) => (
                <path
                  key={i}
                  className="debt"
                  d={curve(ringPos[d.from], ringPos[d.to])}
                  pathLength={1}
                  strokeDasharray="1 1"
                  fill="none"
                  stroke="#a27a45"
                  strokeOpacity={0.55}
                  strokeWidth={0.6 + d.amount / 150}
                  visibility="hidden"
                />
              ))}

              {payments.map((p, i) => (
                <line key={i} className="payment" {...arrow(p.from, p.to)} pathLength={1} strokeDasharray="1 1" stroke="#1b1814" strokeWidth={2.4} markerEnd="url(#pay)" />
              ))}
              {payments.map((p, i) => {
                const a = arrow(p.from, p.to)
                return (
                  <g key={i} className="payment-label" transform={`translate(${(a.x1 + a.x2) / 2} ${(a.y1 + a.y2) / 2})`}>
                    <rect x={-27} y={-13} width={54} height={25} rx={12.5} fill="#1b1814" />
                    <text textAnchor="middle" y={5} fontSize={15} fill="#fbf8f2" fontFamily="ui-monospace, Menlo, monospace">
                      {p.amount}
                    </text>
                  </g>
                )
              })}

              {members.map((name, m) => (
                <g key={name} data-node={m} transform={`translate(${finalPos[m].x} ${finalPos[m].y})`}>
                  <circle data-disc={m} r={radius(m)} fill={balances[m] < 0 ? '#a27a45' : '#1b1814'} />
                  <text {...labelAt(m)} fontSize={19} fill="#1b1814">
                    {name}
                  </text>
                  <text className="balance" textAnchor="middle" y={5} fontSize={15} fill="#fbf8f2" fontFamily="ui-monospace, Menlo, monospace">
                    {signed(balances[m])}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <p className="mt-2 flex items-baseline justify-center gap-3 border-t border-line pt-3 text-center lg:mt-3">
            <span className="font-serif text-4xl tabular-nums lg:text-5xl">{readout.value}</span>
            <span className="text-sm text-muted">{readout.label}</span>
          </p>
        </div>

        <ol ref={list} data-reveal className="space-y-[30svh] pb-[20svh] pt-4 lg:space-y-[42svh] lg:pb-[36svh] lg:pt-[12svh]">
          {(demo.steps ?? []).map((s, i) => (
            <li key={s.name} data-step className={stepClass}>
              <p className="font-mono text-xs tracking-widest text-gold-deep">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="mt-2 font-serif text-3xl sm:text-4xl">{s.name}</h3>
              <p className="mt-2 max-w-md leading-relaxed text-muted">{s.detail}</p>
            </li>
          ))}
        </ol>
      </div>
      {demo.note && <p className="mt-2 text-xs text-muted">{demo.note}</p>}
    </section>
  )
}
