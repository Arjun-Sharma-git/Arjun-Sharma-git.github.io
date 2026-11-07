import type { Project } from '~/content'
import { eyebrow, heading } from '../case-study/shared'

// The screens are 390 x 844 phone captures.
const WIDTH = 560
const HEIGHT = 1212

function Phone({ slug, image, alt, sizes }: { slug: string; image: string; alt: string; sizes: string }) {
  return (
    <div className="overflow-hidden rounded-[26px] border-[5px] border-ink bg-ink shadow-[0_24px_50px_rgb(27_24_20/0.16)]">
      <img
        src={`/work/${slug}/${image}-${WIDTH}.webp`}
        srcSet={`/work/${slug}/${image}-280.webp 280w, /work/${slug}/${image}-${WIDTH}.webp ${WIDTH}w`}
        sizes={sizes}
        width={WIDTH}
        height={HEIGHT}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-[20px]"
      />
    </div>
  )
}

/** One row of phones on desktop, stepping down like entries on a page; a swipeable rail on smaller screens. */
export function Walkthrough({ project }: { project: Project }) {
  const walkthrough = project.caseStudy.walkthrough!
  const { languages } = walkthrough
  return (
    <section aria-labelledby="walkthrough" className="mx-auto max-w-[100rem] pb-24 sm:pb-32">
      <div data-reveal className="mx-auto max-w-7xl px-4">
        <p className={`${eyebrow} text-gold-deep`}>How it works</p>
        <h2 id="walkthrough" className={`${heading} mt-4`}>
          {walkthrough.title} <em className="text-gold">{walkthrough.accent}</em>
        </h2>
        <p className="mt-5 max-w-2xl leading-relaxed text-muted">{walkthrough.intro}</p>
      </div>

      <ol
        tabIndex={0}
        aria-label="App walkthrough"
        className="mt-12 flex snap-x snap-mandatory scroll-pl-4 gap-5 overflow-x-auto px-4 pb-4 focus-visible:outline-2 focus-visible:outline-gold lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-8 lg:pb-0"
      >
        {walkthrough.steps.map((step, i) => (
          <li key={step.image} data-reveal className="w-[68vw] max-w-[17rem] shrink-0 snap-start lg:w-auto lg:max-w-none" style={{ marginTop: `calc(var(--step, 0) * ${i})` }}>
            <Phone slug={project.slug} image={step.image} alt={step.alt} sizes="(min-width: 1024px) 15vw, 68vw" />
            <p className="mt-5 font-mono text-xs tracking-widest text-gold-deep">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-1 font-serif text-2xl leading-tight">{step.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
      <p className="mx-auto mt-6 max-w-7xl px-4 text-xs text-muted">{walkthrough.note}</p>

      {languages && (
        <div data-reveal className="mx-auto mt-16 max-w-7xl px-4">
          <div className="grid items-center gap-8 rounded-[28px] border border-line bg-paper p-6 sm:p-10 md:grid-cols-[1fr_1.1fr] md:gap-12">
            <div>
              <h3 className="font-serif text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] tracking-tight">
                {languages.title} <em className="text-gold">{languages.accent}</em>
              </h3>
              <p className="mt-4 leading-relaxed text-muted">{languages.detail}</p>
            </div>
            <ul className="grid grid-cols-2 gap-4 sm:gap-6">
              {languages.screens.map((s) => (
                <li key={s.image}>
                  <Phone slug={project.slug} image={s.image} alt={s.alt} sizes="(min-width: 768px) 22vw, 42vw" />
                  <p lang={s.lang} className="mt-3 text-center text-sm text-muted">
                    {s.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
