import { useRef } from 'react'
import type { Project } from '~/content'
import { Chip, ExternalLink } from '~/components/ui'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'
import { BackLink, HeroLine, NextProject, eyebrow, heading, useIntro } from '../case-study/shared'
import { FilterDemo } from './FilterDemo'
import { GazePipeline } from './GazePipeline'
import { IrisCanvas } from './IrisHero'

function Hero({ project: p }: { project: Project }) {
  const c = p.caseStudy
  return (
    <header className="relative flex min-h-svh flex-col justify-end overflow-hidden px-5 pb-10 pt-[46svh] sm:px-10 lg:justify-center lg:pt-28">
      <IrisCanvas />
      <div className="pointer-events-none relative mx-auto w-full max-w-7xl">
        <div className="pointer-events-auto max-w-2xl lg:max-w-[46%]">
          <BackLink className="text-paper/60 hover:text-paper" />
          <p data-hero-fade className={`${eyebrow} mt-6 text-gold`}>
            {p.name} · {p.kind}
          </p>
          <h1 className="mt-4 font-serif text-[clamp(2.7rem,6.6vw,6rem)] leading-[0.98] tracking-tight">
            <span className="sr-only">{p.name}: </span>
            <HeroLine text={c.title} />
            <HeroLine text={c.accent} accent />
          </h1>
          <p data-hero-fade className="mt-6 max-w-xl text-balance leading-relaxed text-paper/70 sm:text-lg">
            {c.lede}
          </p>
          {p.repo && (
            <div data-hero-fade className="mt-7">
              <ExternalLink href={p.repo} className="inline-block rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03]">
                {p.repoLabel ?? 'View source'}
                <span className="sr-only"> for {p.name}</span>
              </ExternalLink>
            </div>
          )}
        </div>
        <dl data-hero-fade className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-paper/15 pt-6 lg:mt-14 lg:grid-cols-4">
          {c.facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse justify-end gap-1.5">
              <dt className="max-w-[13rem] text-sm leading-snug text-paper/60">{f.label}</dt>
              <dd className="font-serif text-4xl tracking-tight sm:text-5xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  )
}

function Problem({ project }: { project: Project }) {
  const { problem } = project.caseStudy
  return (
    <section aria-labelledby="problem" className="mx-auto grid max-w-7xl gap-8 px-4 py-24 sm:py-36 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <div data-reveal>
        <p className={`${eyebrow} text-gold`}>The problem</p>
        <h2 id="problem" className="mt-4 font-serif text-[clamp(2.8rem,7.5vw,6.5rem)] leading-[0.98] tracking-tight">
          {problem.title} <em className="text-gold">{problem.accent}</em>
        </h2>
      </div>
      <div data-reveal className="space-y-5 self-end leading-relaxed text-paper/70 sm:text-lg">
        {problem.body.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
    </section>
  )
}

/** Cards sit in the dark until the pointer's light reaches them, as attention does. */
function Decisions({ project }: { project: Project }) {
  const grid = useRef<HTMLUListElement>(null)
  useGSAP(
    () => {
      gsap.matchMedia().add(`${MOTION_OK} and (hover: hover)`, () => {
        const el = grid.current!
        const x = gsap.quickTo(el, '--x', { duration: 0.35, ease: 'power3' })
        const y = gsap.quickTo(el, '--y', { duration: 0.35, ease: 'power3' })
        gsap.set(el, { '--x': -999, '--y': -999 })
        const move = (e: PointerEvent) => {
          const box = el.getBoundingClientRect()
          x(e.clientX - box.left)
          y(e.clientY - box.top)
        }
        el.addEventListener('pointermove', move)
        return () => el.removeEventListener('pointermove', move)
      })
    },
    { scope: grid },
  )

  return (
    <section aria-labelledby="decisions" className="mx-auto max-w-7xl px-4 pb-24 sm:pb-32">
      <div data-reveal className="max-w-3xl">
        <p className={`${eyebrow} text-gold`}>Key decisions</p>
        <h2 id="decisions" className={`${heading} mt-4`}>
          Where the <em className="text-gold">attention went.</em>
        </h2>
      </div>
      <ul ref={grid} className="gaze-grid relative mt-12 grid gap-px overflow-hidden rounded-[28px] bg-paper/10 md:grid-cols-2 lg:grid-cols-3">
        {project.caseStudy.decisions.map((d) => (
          <li key={d.title} data-reveal className="relative bg-[#100e0b] p-6 sm:p-8">
            <h3 className="font-serif text-2xl leading-tight">{d.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-paper/65">{d.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Stack({ project }: { project: Project }) {
  return (
    <section aria-labelledby="stack" className="mx-auto max-w-7xl px-4 pb-24 sm:pb-32">
      <h2 id="stack" className={`${eyebrow} text-gold`}>
        Stack
      </h2>
      <dl data-reveal className="mt-6 divide-y divide-paper/10 border-y border-paper/10">
        {project.caseStudy.stack.map((group) => (
          <div key={group.label} className="grid gap-3 py-5 sm:grid-cols-[10rem_1fr]">
            <dt className="font-serif text-2xl">{group.label}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item} className="border border-paper/15 px-3 py-1 text-sm text-paper/80">
                    {item}
                  </Chip>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function VirtGazePage({ project }: { project: Project }) {
  const scope = useRef<HTMLElement>(null)
  useScrollReveal(scope)
  useIntro(scope)

  return (
    <article ref={scope} className="bg-[#100e0b] text-paper">
      <Hero project={project} />
      <Problem project={project} />
      <GazePipeline project={project} />
      <FilterDemo project={project} />
      <Decisions project={project} />
      <Stack project={project} />
      <NextProject current={project} dark />
    </article>
  )
}
