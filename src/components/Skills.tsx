import { useRef, useState } from 'react'
import { gsap, motionOk, revealOnScroll, useGSAP } from '../lib/gsap'
import { skillGroups } from '../data/profile'
import { SectionHeading } from './Section'

export function Skills() {
  const scope = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const group = skillGroups[active]

  useGSAP(() => gsap.matchMedia().add(motionOk, () => revealOnScroll(scope.current!)), { scope })

  // Re-animate the panel whenever the tab changes.
  useGSAP(
    () => {
      gsap.matchMedia().add(motionOk, () => {
        gsap.from('.skill-panel > *', { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.06, ease: 'power2.out' })
        gsap.from('.skill-chip', { autoAlpha: 0, scale: 0.85, duration: 0.5, stagger: 0.03, ease: 'back.out(2)', delay: 0.15 })
      })
    },
    { scope, dependencies: [active] },
  )

  return (
    <section ref={scope} id="skills" className="px-4 py-24 sm:py-32">
      <SectionHeading eyebrow="Skills" title="Everything from pixels" accent="to production.">
        Drawn from what I've actually built on GitHub, not a list of buzzwords.
      </SectionHeading>

      <div data-reveal className="mx-auto mt-14 max-w-5xl">
        <div role="tablist" aria-label="Skill areas" className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-paper p-1">
          {skillGroups.map((g, i) => (
            <button
              key={g.id}
              role="tab"
              id={`tab-${g.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${g.id}`}
              onClick={() => setActive(i)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${i === active ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
            >
              {g.title}
            </button>
          ))}
        </div>

        <div
          role="tabpanel"
          id={`panel-${group.id}`}
          aria-labelledby={`tab-${group.id}`}
          className="skill-panel mt-8 grid gap-8 rounded-[28px] border border-line bg-paper p-6 sm:p-10 md:grid-cols-[1.1fr_1fr]"
        >
          <div>
            <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{group.headline}</h3>
            <p className="mt-4 leading-relaxed text-muted">{group.body}</p>
          </div>
          <ul className="flex flex-wrap content-start gap-2">
            {group.skills.map((s) => (
              <li key={s} className="skill-chip rounded-full border border-line bg-cream px-4 py-2 text-sm">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
