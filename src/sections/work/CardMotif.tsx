import { useRef } from 'react'
import type { Project } from '~/content'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

function IrisMotif() {
  const ref = useRef<SVGSVGElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const x = gsap.quickTo('.motif-iris', 'x', { duration: 0.25, ease: 'power3' })
        const y = gsap.quickTo('.motif-iris', 'y', { duration: 0.25, ease: 'power3' })
        const move = (e: PointerEvent) => {
          const box = ref.current!.getBoundingClientRect()
          const dx = e.clientX - (box.left + box.width / 2)
          const dy = e.clientY - (box.top + box.height / 2)
          const d = Math.hypot(dx, dy) || 1
          const reach = Math.min(d / 260, 1)
          x((dx / d) * reach * 11)
          y((dy / d) * reach * 5)
        }
        addEventListener('pointermove', move, { passive: true })
        return () => removeEventListener('pointermove', move)
      })
    },
    { scope: ref },
  )
  return (
    <svg ref={ref} viewBox="0 0 80 44" aria-hidden className="w-20 shrink-0">
      <defs>
        <clipPath id="motif-lids">
          <path d="M2 22Q40 -12 78 22Q40 50 2 22Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#motif-lids)">
        <g className="motif-iris">
          <circle cx={40} cy={22} r={14} fill="none" stroke="#a27a45" strokeWidth={5} />
          <circle cx={40} cy={22} r={6} fill="#fbf8f2" />
        </g>
      </g>
      <path d="M2 22Q40 -12 78 22Q40 50 2 22Z" fill="none" stroke="#a27a45" strokeWidth={1.2} />
    </svg>
  )
}

const dots = [
  [8, 22],
  [28, 6],
  [28, 38],
  [52, 6],
  [52, 38],
  [72, 22],
]

function CondenseMotif() {
  const ref = useRef<SVGSVGElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ repeat: -1, repeatDelay: 1.6, yoyo: true, scrollTrigger: { trigger: ref.current, toggleActions: 'play pause resume pause' } })
          .to('.motif-mesh', { autoAlpha: 0, duration: 0.8, stagger: 0.04, ease: 'power1.inOut' })
          .fromTo('.motif-pay', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, 0.5)
      })
    },
    { scope: ref },
  )
  const mesh = dots.flatMap((a, i) => dots.slice(i + 1).map((b) => [a, b] as const))
  return (
    <svg ref={ref} viewBox="0 0 80 44" aria-hidden className="w-20 shrink-0">
      {mesh.map(([a, b], i) => (
        <line key={i} className="motif-mesh" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#a27a45" strokeWidth={0.7} />
      ))}
      <path className="motif-pay" d="M8 22L72 22" pathLength={1} strokeDasharray="1 1" stroke="#1b1814" strokeWidth={2} fill="none" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3.4} fill="#1b1814" />
      ))}
    </svg>
  )
}

export function CardMotif({ slug }: { slug: Project['slug'] }) {
  return slug === 'virtgaze' ? <IrisMotif /> : <CondenseMotif />
}
