import { useRef } from 'react'
import { sectionIds } from '~/config/navigation'
import { experience } from '~/content'
import { SectionHeading } from '~/components/ui'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'
import { duration, formatMonth } from './dates'

// Build month, so prerendered HTML and hydration agree.
const NOW = __BUILD_YM__
const roles = experience.flatMap((job) => job.roles.map((role) => ({ job, role, end: role.end ?? NOW })))

export function Experience() {
  const scope = useRef<HTMLElement>(null)
  useScrollReveal(scope)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from('[data-rail]', {
          scaleY: 0,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: { trigger: '[data-timeline]', start: 'top 75%', end: 'bottom 60%', scrub: true },
        })
      })
    },
    { scope },
  )

  return (
    <section ref={scope} id={sectionIds.experience} className="px-4 py-24 sm:py-32">
      <SectionHeading eyebrow="Experience" title="From securing systems" accent="to shipping them.">
        Security analysis at EY, then full-time software engineering at ZenDot.
      </SectionHeading>

      <ol data-timeline className="relative mx-auto mt-14 max-w-3xl">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-line" />
        <span data-rail aria-hidden="true" className="absolute top-2 bottom-2 left-[7px] w-px bg-gold" />
        {roles.map(({ job, role, end }) => (
          <li key={job.company + role.start} data-reveal className="relative pb-12 pl-10 last:pb-0">
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-0 size-[15px] rounded-full border-2 border-paper ${role.end ? 'bg-gold' : 'bg-ink ring-4 ring-gold/30'}`}
            />
            <p className="font-mono text-xs tracking-widest text-gold-deep uppercase">
              <time dateTime={role.start}>{formatMonth(role.start)}</time> –{' '}
              {role.end ? <time dateTime={role.end}>{formatMonth(role.end)}</time> : 'Present'} · {duration(role.start, end)}
            </p>
            <h3 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">{role.title}</h3>
            <p className="mt-1 text-sm text-muted">
              {job.company} · {role.type} · {job.location} · {role.mode}
            </p>
            {role.summary && <p className="mt-4 leading-relaxed text-muted">{role.summary}</p>}
            {role.highlights.map((h) => (
              <div key={h.project ?? h.points[0]} className="mt-5">
                {h.project && <h4 className="text-sm font-medium">{h.project}</h4>}
                <ul className="mt-2 space-y-1.5 text-muted">
                  {h.points.map((p) => (
                    <li key={p} className="relative pl-4 leading-relaxed before:absolute before:left-0 before:text-gold before:content-['–']">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </li>
        ))}
      </ol>
    </section>
  )
}
