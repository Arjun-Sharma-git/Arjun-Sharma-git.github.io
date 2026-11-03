import { useRef } from 'react'
import { gsap, motionOk, useGSAP } from '../lib/gsap'
import { stats } from '../data/profile'

export function Stats() {
  const scope = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(motionOk, () => {
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          const end = Number(el.dataset.count)
          const counter = { v: end > 1000 ? end - 40 : 0 }
          gsap.to(counter, {
            v: end,
            duration: 1.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
            onUpdate: () => (el.textContent = String(Math.round(counter.v))),
          })
        })
      })
    },
    { scope },
  )

  return (
    <section ref={scope} aria-label="Highlights" className="mx-auto grid max-w-6xl gap-px overflow-hidden px-4 py-20 sm:grid-cols-3 sm:py-28">
      {stats.map((s) => (
        <div key={s.label} className="border-line px-6 py-6 text-center sm:border-l sm:first:border-l-0">
          <p className="font-serif text-6xl tracking-tight sm:text-7xl">
            {s.prefix}
            <span data-count={s.value}>{s.value}</span>
            {s.suffix}
          </p>
          <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-muted">{s.label}</p>
        </div>
      ))}
    </section>
  )
}
