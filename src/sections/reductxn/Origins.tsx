import { useRef } from 'react'
import type { Project } from '~/content'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'
import { eyebrow, heading } from '../case-study/shared'

const seats = Array.from({ length: 7 }, (_, i) => {
  const a = Math.PI + (i / 6) * Math.PI
  return { x: 300 + Math.cos(a) * 230, y: 250 + Math.sin(a) * 200, debtor: i === 1 || i === 4 }
})
// Everyone else answers first, so the majority arrives before the people who owe money have agreed.
const order = [0, 2, 3, 5, 1, 4]

/** How a v1 run reached quorum. Labelled as v1 throughout: v2 has no quorum, and people mark payments done. */
function Quorum() {
  const svg = useRef<SVGSVGElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: svg.current, start: 'top 80%', end: 'bottom 35%', scrub: 0.5 },
        })
        gsap.set('.seat-yes', { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' })
        gsap.set('.quorum-bar', { scaleX: 0, transformOrigin: '0 50%' })
        gsap.set('.quorum-pass', { autoAlpha: 0 })
        order.forEach((seat, i) => {
          tl.to(`[data-seat="${seat}"] .seat-yes`, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(3)' }, i * 0.5)
          tl.to('.quorum-bar', { scaleX: (i + 1) / seats.length, duration: 0.4 }, i * 0.5)
        })
        tl.to('.quorum-wait', { autoAlpha: 0, duration: 0.2 }, order.length * 0.5)
        tl.to('.quorum-pass', { autoAlpha: 1, duration: 0.2 }, order.length * 0.5)
      })
    },
    { scope: svg },
  )

  return (
    <svg ref={svg} viewBox="0 0 600 340" aria-hidden className="block w-full">
      {seats.map((s, i) => (
        <g key={i} data-seat={i} transform={`translate(${s.x} ${s.y})`}>
          {s.debtor && <circle r={27} fill="none" stroke="#a27a45" strokeDasharray="3 4" />}
          <circle r={20} fill="#fbf8f2" stroke="#e2d9c8" strokeWidth={1.5} />
          {i !== 6 && (
            <g className="seat-yes">
              <circle r={20} fill={s.debtor ? '#a27a45' : '#1b1814'} />
              <path d="M-7 0l5 5 9-10" fill="none" stroke="#fbf8f2" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </g>
      ))}
      <rect x={120} y={276} width={360} height={6} rx={3} fill="#e2d9c8" />
      <rect className="quorum-bar" x={120} y={276} width={360} height={6} rx={3} fill="#1b1814" />
      <line x1={120 + (360 * 4) / 7} x2={120 + (360 * 4) / 7} y1={268} y2={290} stroke="#a27a45" strokeWidth={2} />
      <text x={120 + (360 * 4) / 7} y={306} textAnchor="middle" fontSize={12} fill="#665e53">
        majority
      </text>
      <text className="quorum-wait" x={300} y={190} textAnchor="middle" fontSize={30} fontFamily="'Instrument Serif', serif" fill="#1b1814">
        Waiting for debtors
      </text>
      <text className="quorum-pass" x={300} y={190} textAnchor="middle" fontSize={30} fontFamily="'Instrument Serif', serif" fontStyle="italic" fill="#a27a45">
        Quorum reached
      </text>
    </svg>
  )
}

export function Origins({ project }: { project: Project }) {
  const history = project.caseStudy.history!
  return (
    <section aria-labelledby="origins" className="mx-auto max-w-6xl px-4 pb-24 sm:pb-32">
      <div data-reveal className="max-w-2xl">
        <p className={`${eyebrow} text-gold-deep`}>From v1 to v2</p>
        <h2 id="origins" className={`${heading} mt-4`}>
          {history.title} <em className="text-gold">{history.accent}</em>
        </h2>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <figure data-reveal className="rounded-[28px] border border-line bg-paper p-5 sm:p-8">
          <Quorum />
          <figcaption className="mt-3 text-sm leading-relaxed text-muted">{history.quorum}</figcaption>
        </figure>
        <div data-reveal className="space-y-5 self-center leading-relaxed text-muted sm:text-lg">
          {history.body.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
