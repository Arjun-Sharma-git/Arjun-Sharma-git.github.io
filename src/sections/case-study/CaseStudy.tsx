import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { sectionIds } from '~/config/navigation'
import { projects, type Project } from '~/content'
import { Chip, ExternalLink } from '~/components/ui'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import { Pipeline } from '../work/Pipeline'
import { useCaseAnimation } from './useCaseAnimation'

const eyebrow = 'text-xs font-medium uppercase tracking-[0.2em]'
const heading = 'font-serif text-[clamp(2.4rem,6vw,4.5rem)] leading-[1] tracking-tight'

function HeroLine({ text, accent = false }: { text: string; accent?: boolean }) {
  return (
    <span className={`block ${accent ? 'italic text-gold' : ''}`}>
      {text.split(' ').map((word, i) => (
        <span key={i} className="hero-word inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span className="inline-block">{word}&nbsp;</span>
        </span>
      ))}
    </span>
  )
}

function Hero({ project: p }: { project: Project }) {
  const c = p.caseStudy
  return (
    <div className="px-3 pt-3 sm:px-4 sm:pt-4">
      <header className="grid-bg rounded-[28px] bg-gradient-to-b from-[#efe4d1] to-paper px-5 pb-12 pt-28 sm:px-10 sm:pb-16 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <Link data-hero-fade to="/" hash={sectionIds.work} className="inline-block text-sm text-muted transition-colors hover:text-ink">
            <span aria-hidden>← </span>All work
          </Link>
          <p data-hero-fade className={`${eyebrow} mt-8 text-gold-deep`}>
            {p.name} · {p.kind}
          </p>
          <h1 className="mt-5 font-serif text-[clamp(2.7rem,8vw,6.5rem)] leading-[0.98] tracking-tight">
            <span className="sr-only">{p.name}: </span>
            <HeroLine text={c.title} />
            <HeroLine text={c.accent} accent />
          </h1>
          <p data-hero-fade className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg">
            {c.lede}
          </p>
          <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-3 text-sm font-medium">
            {p.repo && (
              <ExternalLink href={p.repo} className="rounded-full bg-ink px-5 py-2.5 text-paper transition-transform hover:scale-[1.03]">
                View source<span className="sr-only"> of {p.name} on GitHub</span>
              </ExternalLink>
            )}
            {p.live && (
              <ExternalLink href={p.live} className="rounded-full border border-line px-5 py-2.5">
                Live demo
              </ExternalLink>
            )}
            {p.repoNote && <span className="rounded-full border border-line bg-paper/70 px-4 py-2 text-xs text-muted">{p.repoNote}</span>}
          </div>
          <dl data-hero-fade className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 lg:grid-cols-4">
            {c.facts.map((f) => (
              <div key={f.label} className="flex flex-col-reverse justify-end gap-2">
                <dt className="max-w-[14rem] text-sm leading-snug text-muted">{f.label}</dt>
                <dd className="font-serif text-4xl tracking-tight sm:text-5xl">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>
    </div>
  )
}

function Problem({ project }: { project: Project }) {
  const { problem } = project.caseStudy
  return (
    <section aria-labelledby="problem" className="mx-auto grid max-w-6xl gap-8 px-4 py-24 sm:py-32 md:grid-cols-[1fr_1.1fr] md:gap-14">
      <div data-reveal>
        <p className={`${eyebrow} text-gold-deep`}>The problem</p>
        <h2 id="problem" className={`${heading} mt-4`}>
          {problem.title} <em className="text-gold">{problem.accent}</em>
        </h2>
      </div>
      <div data-reveal className="space-y-5 self-end leading-relaxed text-muted sm:text-lg">
        {problem.body.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
    </section>
  )
}

function Approach({ project: p }: { project: Project }) {
  const { approach } = p.caseStudy
  return (
    <section aria-labelledby="approach" className="px-3 sm:px-4">
      <div className="rounded-[28px] bg-ink px-6 py-20 text-paper sm:px-10 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className={`${eyebrow} text-gold`}>The approach</p>
            <h2 id="approach" className={`${heading} mt-4`}>
              {approach.title} <em className="text-gold">{approach.accent}</em>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-paper/75">{approach.intro}</p>
            {p.pipeline && <Pipeline steps={p.pipeline} dark />}
          </div>
          <ol className="stage-list relative space-y-9">
            <span aria-hidden className="stage-line absolute bottom-3 left-[0.95rem] top-3 w-px origin-top bg-gold/60" />
            {approach.stages.map((s, i) => (
              <li key={s.name} data-reveal className="relative pl-12">
                <span aria-hidden className="absolute left-0 top-0 grid size-8 place-items-center rounded-full border border-gold/60 bg-ink font-serif text-gold">
                  {i + 1}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl">{s.name}</h3>
                <p className="mt-1.5 leading-relaxed text-paper/70">{s.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Decisions({ project }: { project: Project }) {
  return (
    <section aria-labelledby="decisions" className="mx-auto max-w-6xl px-4 py-24 sm:py-32">
      <div data-reveal className="max-w-3xl">
        <p className={`${eyebrow} text-gold-deep`}>Key decisions</p>
        <h2 id="decisions" className={`${heading} mt-4`}>
          Where the <em className="text-gold">thinking went.</em>
        </h2>
      </div>
      <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {project.caseStudy.decisions.map((d) => (
          <li key={d.title} data-reveal className="rounded-3xl border border-line bg-paper p-6 sm:p-7">
            <h3 className="font-serif text-2xl leading-tight">{d.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{d.body}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Stack({ project }: { project: Project }) {
  return (
    <section aria-labelledby="stack" className="mx-auto max-w-6xl px-4 pb-24 sm:pb-32">
      <div data-reveal className="rounded-[28px] border border-line bg-paper p-6 sm:p-10">
        <p className={`${eyebrow} text-gold-deep`}>Stack</p>
        <h2 id="stack" className="sr-only">
          Technology stack
        </h2>
        <dl className="mt-6 divide-y divide-line">
          {project.caseStudy.stack.map((group) => (
            <div key={group.label} className="grid gap-3 py-5 first:pt-0 last:pb-0 sm:grid-cols-[9rem_1fr]">
              <dt className="font-serif text-2xl">{group.label}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Chip key={item} className="border border-line bg-cream px-3 py-1 text-sm">
                      {item}
                    </Chip>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function NextProject({ current }: { current: Project }) {
  const next = projects[(projects.indexOf(current) + 1) % projects.length]
  return (
    <nav aria-label="Next project" className="mx-auto max-w-6xl px-4 pb-16">
      <Link data-reveal to="/work/$slug" params={{ slug: next.slug }} className="group flex items-end justify-between gap-6 border-t border-line pt-8">
        <span>
          <span className={`${eyebrow} block text-gold-deep`}>Next project</span>
          <span className="mt-3 block font-serif text-5xl tracking-tight transition-colors group-hover:text-gold sm:text-7xl">{next.name}</span>
        </span>
        <span aria-hidden className="pb-2 text-3xl text-gold transition-transform group-hover:translate-x-1 sm:text-5xl">
          →
        </span>
      </Link>
    </nav>
  )
}

export function CaseStudy({ project }: { project: Project }) {
  const scope = useRef<HTMLElement>(null)
  useScrollReveal(scope)
  useCaseAnimation(scope)

  return (
    <article ref={scope}>
      <Hero project={project} />
      <Problem project={project} />
      <Approach project={project} />
      <Decisions project={project} />
      <Stack project={project} />
      <NextProject current={project} />
    </article>
  )
}
