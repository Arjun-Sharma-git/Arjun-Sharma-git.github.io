import { useRef } from 'react'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

export function Pipeline({ steps, dark = false }: { steps: string[]; dark?: boolean }) {
  const ref = useRef<HTMLOListElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // Fill first to last, then clear first to last too: the wave always runs forward, where a
        // yoyo would replay it backwards and look like the pipeline running in reverse.
        const steps = gsap.utils.toArray<HTMLElement>('.pipe-step')
        const rest = steps.map((el) => ({ backgroundColor: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color }))
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.6 })
          .to(steps, { backgroundColor: '#1b1814', color: '#fbf8f2', duration: 0.25, stagger: 0.25 })
          .to(steps, { backgroundColor: (i) => rest[i].backgroundColor, color: (i) => rest[i].color, duration: 0.25, stagger: 0.25 }, '+=0.8')
      })
    },
    { scope: ref },
  )

  return (
    <ol ref={ref} aria-label="Pipeline" className="mt-6 flex flex-wrap items-center gap-1.5 text-xs">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-1.5">
          <span className={`pipe-step rounded-full border px-3 py-1.5 text-ink ${dark ? 'border-paper/25 bg-paper' : 'border-line bg-cream'}`}>{step}</span>
          {i < steps.length - 1 && (
            <span aria-hidden className={dark ? 'text-paper/40' : 'text-muted/60'}>
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}
