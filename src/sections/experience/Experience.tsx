import { useRef } from 'react'
import { sectionIds } from '~/config/navigation'
import { experience } from '~/content'
import { SectionHeading } from '~/components/ui'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'
import { duration, formatMonth, toIndex } from './dates'

// Build month, so prerendered HTML and hydration agree.
const NOW = __BUILD_YM__
const roles = experience.flatMap((job) => job.roles.map((role) => ({ job, role, end: role.end ?? NOW })))
const first = Math.min(...roles.map((r) => toIndex(r.role.start)))
const firstYear = Math.floor(first / 12)
const lastYear = Math.floor(toIndex(NOW) / 12) + 1
const span = (lastYear - firstYear) * 12
const pct = (ym: string, endOfMonth = false) => ((toIndex(ym) + (endOfMonth ? 1 : 0) - firstYear * 12) / span) * 100
const years = Array.from({ length: lastYear - firstYear + 1 }, (_, i) => firstYear + i)

export function Experience() {
  const scope = useRef<HTMLElement>(null)
  useScrollReveal(scope)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from('[data-bar]', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-chart]', start: 'top 85%' },
        })
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

      <figure data-reveal data-chart className="mx-auto mt-14 max-w-5xl rounded-[28px] border border-line bg-paper p-6 sm:p-10">
        <figcaption className="sr-only">Timeline of roles from {firstYear} to today</figcaption>
        <div className="relative" aria-hidden="true">
          <div className="space-y-4">
            {roles.map(({ job, role, end }) => (
              <div key={job.company + role.start} className="grid grid-cols-[5.5rem_1fr] items-center gap-3 sm:grid-cols-[9rem_1fr]">
                <p className="text-xs leading-tight text-muted sm:text-sm">
                  <span className="font-medium text-ink">{job.company}</span>
                  <span className="block sm:inline">
                    <span className="hidden sm:inline"> · </span>
                    {role.type}
                  </span>
                </p>
                <div className="relative h-7 rounded-full bg-cream">
                  <div
                    data-bar
                    className={`absolute inset-y-0 rounded-full ${role.end ? 'bg-gold' : 'bg-ink'}`}
                    style={{ left: `${pct(role.start)}%`, width: `${Math.max(pct(end, true) - pct(role.start), 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-3 ml-[6.25rem] h-5 sm:ml-[9.75rem]">
            {years.map((y) => (
              <span
                key={y}
                className="absolute -translate-x-1/2 font-mono text-[11px] text-muted"
                style={{ left: `${((y - firstYear) / (lastYear - firstYear)) * 100}%` }}
              >
                {y}
              </span>
            ))}
          </div>
        </div>
      </figure>

      <ol data-timeline className="relative mx-auto mt-16 max-w-3xl">
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
              <div key={h.project} className="mt-5">
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
