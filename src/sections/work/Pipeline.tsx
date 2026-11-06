import { useRef } from 'react'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

export function Pipeline({ steps, dark = false }: { steps: string[]; dark?: boolean }) {
  const ref = useRef<HTMLOListElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.to('.pipe-step', { backgroundColor: '#1b1814', color: '#fbf8f2', stagger: 0.25, repeat: -1, repeatDelay: 0.8, yoyo: true, duration: 0.25 })
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
