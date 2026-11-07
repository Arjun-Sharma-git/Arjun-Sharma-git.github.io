import type { Project } from '~/content'
import { eyebrow, heading } from '../case-study/shared'

// The screens are 390 x 844 phone captures.
const WIDTH = 560
const HEIGHT = 1212

/** One row of phones on desktop, stepping down like entries on a page; a swipeable rail on smaller screens. */
export function Walkthrough({ project }: { project: Project }) {
  const walkthrough = project.caseStudy.walkthrough!
  return (
    <section aria-labelledby="walkthrough" className="mx-auto max-w-7xl pb-24 sm:pb-32">
      <div data-reveal className="max-w-2xl px-4">
        <p className={`${eyebrow} text-gold-deep`}>How it works</p>
        <h2 id="walkthrough" className={`${heading} mt-4`}>
          {walkthrough.title} <em className="text-gold">{walkthrough.accent}</em>
        </h2>
        <p className="mt-5 leading-relaxed text-muted">{walkthrough.intro}</p>
      </div>

      <ol
        tabIndex={0}
        aria-label="App walkthrough"
        className="mt-12 flex snap-x snap-mandatory scroll-pl-4 gap-5 overflow-x-auto px-4 pb-4 focus-visible:outline-2 focus-visible:outline-gold lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
      >
        {walkthrough.steps.map((step, i) => (
          <li key={step.image} data-reveal className="w-[68vw] max-w-[17rem] shrink-0 snap-start lg:w-auto lg:max-w-none" style={{ marginTop: `calc(var(--step, 0) * ${i})` }}>
            <div className="overflow-hidden rounded-[26px] border-[5px] border-ink bg-ink shadow-[0_24px_50px_rgb(27_24_20/0.16)]">
              <img
                src={`/work/${project.slug}/${step.image}-${WIDTH}.webp`}
                srcSet={`/work/${project.slug}/${step.image}-280.webp 280w, /work/${project.slug}/${step.image}-${WIDTH}.webp ${WIDTH}w`}
                sizes="(min-width: 1024px) 18vw, 68vw"
                width={WIDTH}
                height={HEIGHT}
                alt={step.alt}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full rounded-[20px]"
              />
            </div>
            <p className="mt-5 font-mono text-xs tracking-widest text-gold-deep">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-1 font-serif text-2xl leading-tight sm:text-[1.65rem]">{step.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 px-4 text-xs text-muted">{walkthrough.note}</p>
    </section>
  )
}
