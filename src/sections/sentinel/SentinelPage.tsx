import { useRef } from 'react'
import type { Project } from '~/content'
import { Chip, ExternalLink } from '~/components/ui'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import { BackLink, Contribute, HeroLine, NextProject, eyebrow, heading, useIntro } from '../case-study/shared'
import { AccessPipeline } from './AccessPipeline'
import { PersonaDemo } from './PersonaDemo'
import { TraceCard } from './TraceCard'

function Hero({ project: p }: { project: Project }) {
  const c = p.caseStudy
  return (
    <div className="px-3 pt-3 sm:px-4 sm:pt-4">
      <header className="rounded-[28px] bg-cream px-5 pb-10 pt-28 sm:px-10 sm:pb-14 sm:pt-32">
        <div className="mx-auto grid max-w-6xl items-end gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
          <div>
            <BackLink className="text-muted hover:text-ink" />
            <p data-hero-fade className={`${eyebrow} mt-7 text-gold-deep`}>
              {p.name} · {p.kind}
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[0.98] tracking-tight">
              <span className="sr-only">{p.name}: </span>
              <HeroLine text={c.title} />
              <HeroLine text={c.accent} accent />
            </h1>
            <p data-hero-fade className="mt-6 max-w-xl text-balance leading-relaxed text-muted sm:text-lg">
              {c.lede}
            </p>
            {p.repo && (
              <div data-hero-fade className="mt-7">
                <ExternalLink href={p.repo} className="inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform hover:scale-[1.03]">
                  {p.repoLabel ?? 'View source'}
                  <span className="sr-only"> for {p.name}</span>
                </ExternalLink>
              </div>
            )}
          </div>
          <div data-hero-fade>
            <TraceCard steps={c.approach.stages.map((s) => s.name)} autoplay />
          </div>
        </div>
        <dl data-hero-fade className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-6 lg:grid-cols-4">
          {c.facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse justify-end gap-1.5">
              <dt className="max-w-[15rem] text-sm leading-snug text-muted">{f.label}</dt>
              <dd className="font-serif text-4xl tracking-tight sm:text-5xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>
    </div>
  )
}

function Problem({ project }: { project: Project }) {
  const { problem } = project.caseStudy
  return (
    <section aria-labelledby="problem" className="mx-auto grid max-w-6xl gap-8 px-4 pt-24 sm:pt-32 md:grid-cols-[1fr_1.1fr] md:gap-14">
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

/** Decisions written like the app's audit log: an id, what happened, and why. */
function Decisions({ project }: { project: Project }) {
  return (
    <section aria-labelledby="decisions" className="mx-auto max-w-6xl px-4 pb-24 sm:pb-32">
      <div data-reveal className="max-w-3xl">
        <p className={`${eyebrow} text-gold-deep`}>Key decisions</p>
        <h2 id="decisions" className={`${heading} mt-4`}>
          Each one <em className="text-gold">in the audit log.</em>
        </h2>
      </div>
      <ul className="mt-12 grid gap-4 md:grid-cols-2">
        {project.caseStudy.decisions.map((d, i) => (
          <li key={d.title} data-reveal className="rounded-[24px] border border-line bg-paper p-6 sm:p-7">
            <p className="font-mono text-[11px] tracking-wider text-gold-deep">decision.{String(i + 1).padStart(2, '0')} · recorded</p>
            <h3 className="mt-3 font-serif text-2xl leading-tight sm:text-[1.7rem]">{d.title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{d.body}</p>
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
        <h2 id="stack" className={`${eyebrow} text-gold-deep`}>
          Stack
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

export function SentinelPage({ project }: { project: Project }) {
  const scope = useRef<HTMLElement>(null)
  useScrollReveal(scope)
  useIntro(scope)

  return (
    <article ref={scope}>
      <Hero project={project} />
      <Problem project={project} />
      <AccessPipeline project={project} />
      <PersonaDemo project={project} />
      <Decisions project={project} />
      <Stack project={project} />
      <Contribute project={project} />
      <NextProject current={project} />
    </article>
  )
}
