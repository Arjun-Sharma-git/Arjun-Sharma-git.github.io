import { type ReactNode, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import type { Project } from '~/content'
import { useScrollReveal } from '~/hooks/useScrollReveal'
import source from '../../../proofs/settle-up/SettleUp/Basic.lean?raw'
import { HeroLine, eyebrow, heading, useIntro } from '../case-study/shared'

const KEYWORDS =
  'theorem|lemma|def|structure|where|variable|namespace|end|open|import|omit|in|noncomputable|by|fun|have|let|obtain|intro|rintro|refine|exact|rw|rwa|simp|simpa|induction|with|match|show|calc|subst|by_cases|rcases|omega|linarith'
const TOKENS = new RegExp(`(/-[\\s\\S]*?-/|--.*$)|\\b(${KEYWORDS})\\b`, 'gm')

/** Enough highlighting to read Lean: comments and keywords. The text itself is the checked file, unchanged. */
function highlight(code: string) {
  const out: ReactNode[] = []
  let at = 0
  for (const m of code.matchAll(TOKENS)) {
    out.push(code.slice(at, m.index))
    out.push(
      <span key={m.index} className={m[1] ? 'text-paper/45' : 'text-[#e2be86]'}>
        {m[0]}
      </span>,
    )
    at = m.index + m[0].length
  }
  out.push(code.slice(at))
  return out
}

export function ProofPage({ project }: { project: Project }) {
  const proof = project.caseStudy.proof!
  const scope = useRef<HTMLElement>(null)
  useScrollReveal(scope)
  useIntro(scope)

  return (
    <article ref={scope}>
      <div className="px-3 pt-3 sm:px-4 sm:pt-4">
        <header className="ledger-paper rounded-[28px] bg-paper px-5 pb-10 pt-28 sm:px-10 sm:pb-14 sm:pt-32">
          <div className="mx-auto max-w-4xl">
            <Link data-hero-fade to="/work/reductxn" className="inline-block text-sm text-muted transition-colors hover:text-ink">
              <span aria-hidden>← </span>Reductxn
            </Link>
            <p data-hero-fade className={`${eyebrow} mt-7 text-gold-deep`}>
              Formally verified in Lean 4
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.7rem,7vw,5.5rem)] leading-[0.98] tracking-tight">
              <HeroLine text={proof.title} />
              <HeroLine text={proof.accent} accent />
            </h1>
            <p data-hero-fade className="mt-6 max-w-2xl leading-relaxed text-muted sm:text-lg">
              {proof.theorem}
            </p>
            <dl data-hero-fade className="mt-10 grid gap-x-6 gap-y-5 border-t border-line pt-6 sm:grid-cols-2">
              {proof.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="mt-1 break-words font-mono text-sm">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>
      </div>

      <section aria-labelledby="argument" className="mx-auto max-w-4xl px-4 py-24 sm:py-28">
        <div data-reveal>
          <p className={`${eyebrow} text-gold-deep`}>The argument</p>
          <h2 id="argument" className={`${heading} mt-4`}>
            Two halves, <em className="text-gold">one number.</em>
          </h2>
        </div>
        <ol className="mt-10 border-t border-ink">
          {proof.steps.map((s, i) => (
            <li key={s.name} data-reveal className="grid gap-2 border-b border-line py-6 md:grid-cols-[3rem_1fr] md:gap-6">
              <span className="font-mono text-sm text-gold-deep">{i + 1}</span>
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl">{s.name}</h3>
                <p className="mt-2 leading-relaxed text-muted">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="limits" className="mx-auto max-w-4xl px-4 pb-24">
        <div data-reveal className="rounded-[28px] border border-line bg-paper p-6 sm:p-10">
          <h2 id="limits" className="font-serif text-3xl sm:text-4xl">
            What this doesn’t prove
          </h2>
          <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-muted">
            {proof.limits.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="source" className="px-3 pb-24 sm:px-4">
        <div className="mx-auto max-w-6xl">
          <h2 id="source" className={`${eyebrow} px-1 text-gold-deep`}>
            The proof, as Lean checked it
          </h2>
          <pre tabIndex={0} aria-label="Lean source" className="mt-4 max-h-[80svh] overflow-auto rounded-[20px] bg-ink p-5 font-mono text-xs leading-relaxed text-paper/90 sm:p-8 sm:text-[0.8rem]">
            <code>{highlight(source)}</code>
          </pre>
        </div>
      </section>
    </article>
  )
}
