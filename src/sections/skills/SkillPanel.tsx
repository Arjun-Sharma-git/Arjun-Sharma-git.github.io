import { useRef } from 'react'
import type { SkillGroup } from '~/content'
import { Chip } from '~/components/ui'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'

export function SkillPanel({ group }: { group: SkillGroup }) {
  const ref = useRef<HTMLDivElement>(null)

  // Re-runs on every tab change so the new content animates in.
  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from(ref.current!.children, { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.06, ease: 'power2.out' })
        gsap.from('li', { autoAlpha: 0, scale: 0.85, duration: 0.5, stagger: 0.03, ease: 'back.out(2)', delay: 0.15 })
      })
    },
    { scope: ref, dependencies: [group.id] },
  )

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={`panel-${group.id}`}
      aria-labelledby={`tab-${group.id}`}
      className="mt-8 grid gap-8 rounded-[28px] border border-line bg-paper p-6 sm:p-10 md:grid-cols-[1.1fr_1fr]"
    >
      <div>
        <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{group.headline}</h3>
        <p className="mt-4 leading-relaxed text-muted">{group.body}</p>
      </div>
      <ul className="flex flex-wrap content-start gap-2">
        {group.skills.map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </ul>
    </div>
  )
}
