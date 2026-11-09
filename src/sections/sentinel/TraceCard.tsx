import { useRef } from 'react'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

/** The step summaries the app reported for one real question: Bob (finance) asking about Q3 revenue. */
const RESULTS: Record<string, string> = {
  Gate: 'injection 0.00 · export 0.08',
  Access: '3 folders readable',
  Search: '8 passages, 4 documents',
  Recheck: '0 removed',
  Answer: 'qwen3.5:9b · 8 sources',
  Verify: '1/1 claims supported',
  Audit: 'recorded',
}

/**
 * The app's live decision trace, as a card. In the hero it plays on a loop; in the pipeline section
 * `active` is driven by scroll. With reduced motion every step shows as done.
 */
export function TraceCard({ steps, active, autoplay = false }: { steps: string[]; active?: number; autoplay?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (!autoplay) return
      gsap.matchMedia().add(MOTION_OK, () => {
        const rows = gsap.utils.toArray<HTMLElement>('[data-row]')
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.2, scrollTrigger: { trigger: ref.current, toggleActions: 'play pause resume pause' } })
        tl.set(rows, { '--done': 0, autoAlpha: 0.35 })
        rows.forEach((row) => {
          tl.to(row, { autoAlpha: 1, duration: 0.25 }).to(row, { '--done': 1, duration: 0.2 }, '+=0.25')
        })
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="rounded-[24px] bg-ink p-5 text-paper shadow-[0_30px_80px_-40px_rgba(27,24,20,0.6)] sm:p-6" aria-hidden>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">Live decision trace</p>
      <p className="mt-1 font-serif text-2xl">
        How it <em className="text-gold">decided</em>
      </p>
      <ol className="mt-4 space-y-2.5">
        {steps.map((name, i) => {
          const state = active === undefined ? 'done' : i < active ? 'done' : i === active ? 'now' : 'next'
          return (
            <li
              key={name}
              data-row
              style={{ '--done': state === 'next' ? 0 : 1 } as React.CSSProperties}
              className={`flex items-center gap-3 transition-opacity duration-300 ${state === 'next' ? 'opacity-35' : ''}`}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full border text-[11px] transition-colors duration-300 ${
                  state === 'now' ? 'border-gold text-gold' : 'border-paper/25 text-paper/80'
                }`}
              >
                <span className="[opacity:var(--done)]">✓</span>
              </span>
              <span className="font-mono text-[11px] text-gold/80">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-sm font-medium">{name}</span>
              <span className="ml-auto hidden text-right font-mono text-[10.5px] text-paper/55 sm:block">{RESULTS[name]}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
