import { useRef } from 'react'
import { gsap, motionOk, revealOnScroll, useGSAP } from '../lib/gsap'
import { projects } from '../data/profile'
import { SectionHeading } from './Section'

export function Work() {
  const scope = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(motionOk, () => revealOnScroll(scope.current!))
      // Desktop: pin the section and scroll the project cards horizontally.
      mm.add(`(min-width: 1024px) and ${motionOk}`, () => {
        const el = track.current!
        const distance = () => el.scrollWidth - innerWidth + 64
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: '.work-pin', start: 'center center', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        })
        gsap.to('.pipe-step', {
          backgroundColor: '#1b1814',
          color: '#fbf8f2',
          stagger: 0.25,
          repeat: -1,
          repeatDelay: 0.8,
          yoyo: true,
          duration: 0.25,
        })
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id="work" className="overflow-hidden py-24 sm:py-32">
      <div className="px-4">
        <SectionHeading eyebrow="Selected work" title="Things I've" accent="built & shipped.">
          From a webcam gaze tracker to full-stack web apps in production.
        </SectionHeading>
      </div>

      <div className="work-pin mt-14">
        <div ref={track} className="flex flex-col gap-5 px-4 lg:w-max lg:flex-row lg:px-8">
          {projects.map((p, i) => (
            <article
              key={p.name}
              data-reveal
              className={`flex flex-col rounded-[28px] border border-line p-7 sm:p-9 lg:h-[30rem] ${i === 0 ? 'bg-ink text-paper lg:w-[44rem]' : 'bg-paper lg:w-[26rem]'}`}
            >
              <p className={`text-xs font-medium uppercase tracking-[0.18em] ${i === 0 ? 'text-gold' : 'text-gold-deep'}`}>{p.kind}</p>
              <h3 className="mt-3 font-serif text-4xl sm:text-5xl">{p.name}</h3>
              <p className={`mt-4 leading-relaxed ${i === 0 ? 'text-paper/75' : 'text-muted'}`}>{p.description}</p>

              {p.pipeline && (
                <ol aria-label="Pipeline" className="mt-6 flex flex-wrap items-center gap-1.5 text-xs">
                  {p.pipeline.map((step, j) => (
                    <li key={step} className="flex items-center gap-1.5">
                      <span className="pipe-step rounded-full border border-paper/25 bg-paper px-3 py-1.5 text-ink">{step}</span>
                      {j < p.pipeline.length - 1 && <span aria-hidden className="text-paper/40">→</span>}
                    </li>
                  ))}
                </ol>
              )}

              <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                {p.tags.map((t) => (
                  <li key={t} className={`rounded-full px-3 py-1 text-xs ${i === 0 ? 'bg-paper/10' : 'bg-cream'}`}>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-4 text-sm font-medium">
                <a href={p.repo} target="_blank" rel="noopener" className="underline decoration-gold underline-offset-4 hover:decoration-2">
                  Source<span className="sr-only"> code for {p.name}</span>
                </a>
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener" className="underline decoration-gold underline-offset-4 hover:decoration-2">
                    Live demo<span className="sr-only"> of {p.name}</span>
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
