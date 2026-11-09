import { useRef, useState } from 'react'
import type { Project } from '~/content'
import { MOTION_OK, gsap, useGSAP } from '~/lib/gsap'
import { eyebrow, heading } from '../case-study/shared'

const QUESTION = 'What was Q3 2026 revenue and gross margin?'
const FOLDERS = ['general', 'engineering', 'hr', 'management', 'financials', 'financials/engineering-budget'] as const
type Folder = (typeof FOLDERS)[number]

/** The demo company's real grants and the app's real answers to QUESTION (relevance from its reranker). */
const PEOPLE: {
  id: string
  name: string
  role: string
  reads: Folder[]
  top: { doc: string; score: string }[]
  answer?: string
}[] = [
  {
    id: 'dave',
    name: 'Dave',
    role: 'Intern · everyone',
    reads: ['general'],
    top: [
      { doc: 'general/benefits-2026.md', score: '0.002' },
      { doc: 'general/employee-handbook.md', score: '0.001' },
    ],
  },
  {
    id: 'carol',
    name: 'Carol',
    role: 'Engineer · plus one grant on the engineering budget',
    reads: ['general', 'engineering', 'financials/engineering-budget'],
    top: [
      { doc: 'general/benefits-2026.md', score: '0.002' },
      { doc: 'engineering/runbooks/incident-2026-10-14.md', score: '0.001' },
    ],
  },
  {
    id: 'bob',
    name: 'Bob',
    role: 'Finance',
    reads: ['general', 'financials', 'financials/engineering-budget'],
    top: [
      { doc: 'financials/q3-2026-results.md', score: '0.9996' },
      { doc: 'financials/q2-2026-results.md', score: '0.89' },
    ],
    answer: 'Q3 2026 revenue was 48.2 million USD, and the gross margin was 72.4%.',
  },
]

export function PersonaDemo({ project }: { project: Project }) {
  const demo = project.caseStudy.demo!
  const [who, setWho] = useState(PEOPLE[0].id)
  const person = PEOPLE.find((p) => p.id === who)!
  const panel = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from('[data-swap]', { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.07, ease: 'power2.out' })
      })
    },
    { scope: panel, dependencies: [who] },
  )

  return (
    <section aria-labelledby="demo" className="mx-auto max-w-6xl px-4 pt-8 pb-24 sm:pb-32">
      <div data-reveal className="max-w-3xl">
        <p className={`${eyebrow} text-gold-deep`}>Try it</p>
        <h2 id="demo" className={`${heading} mt-4`}>
          {demo.title} <em className="text-gold">{demo.accent}</em>
        </h2>
        <p className="mt-5 max-w-xl leading-relaxed text-muted">{demo.intro}</p>
      </div>

      <div data-reveal className="mt-10 rounded-[28px] border border-line bg-paper p-5 sm:p-8">
        <div role="radiogroup" aria-label="Who is asking" className="flex flex-wrap gap-2">
          {PEOPLE.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={p.id === who}
              onClick={() => setWho(p.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                p.id === who ? 'bg-ink text-paper' : 'border border-line bg-cream hover:border-gold'
              }`}
            >
              {p.name}
              <span className={`ml-2 font-normal ${p.id === who ? 'text-paper/60' : 'text-muted'}`}>{p.role.split(' · ')[0]}</span>
            </button>
          ))}
        </div>

        <p className="mt-6 inline-block rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-paper">{QUESTION}</p>

        <div ref={panel} className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]" aria-live="polite">
          <div data-swap>
            <p className={`${eyebrow} text-muted`}>Folders {person.name} can read</p>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm">
              {FOLDERS.map((f) => {
                const open = person.reads.includes(f)
                return (
                  <li
                    key={f}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 font-mono text-[12px] ${
                      open ? 'border-gold/50 bg-cream text-ink' : 'border-line text-muted/60 line-through decoration-muted/30'
                    }`}
                  >
                    <span aria-hidden>{open ? '▸' : '·'}</span>
                    <span className="truncate" title={f}>
                      {f.startsWith('financials/') ? `↳ ${f.slice('financials/'.length)}` : f}
                    </span>
                    <span className="sr-only">{open ? '(readable)' : '(not readable, never searched)'}</span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 text-xs text-muted">{person.role}</p>
          </div>

          <div className="space-y-4">
            <div data-swap>
              <p className={`${eyebrow} text-muted`}>Best matches inside those folders</p>
              <ol className="mt-3 space-y-1.5 font-mono text-[12px]">
                {person.top.map((t) => (
                  <li key={t.doc} className="flex justify-between gap-4 border-b border-line pb-1.5">
                    <span className="truncate">{t.doc}</span>
                    <span className={Number(t.score) > 0.5 ? 'text-gold-deep' : 'text-muted'}>{t.score}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div
              data-swap
              className={`rounded-2xl p-4 text-[15px] leading-relaxed ${person.answer ? 'bg-cream' : 'border border-line text-muted'}`}
            >
              {person.answer ? (
                <>
                  {person.answer}
                  <sup className="ml-1 rounded-full bg-gold/20 px-1.5 font-mono text-[10px] text-gold-deep">1</sup>
                  <p className="mt-2 font-mono text-[11px] text-muted">1 · financials/q3-2026-results.md · claim checked</p>
                </>
              ) : (
                <>
                  I couldn’t find this in the documents you have access to.
                  <p className="mt-2 text-xs">The finance report exists. It just isn’t in any folder {person.name} can read, so it was never searched.</p>
                </>
              )}
            </div>
          </div>
        </div>
        {demo.note && <p className="mt-6 text-xs text-muted">{demo.note}</p>}
      </div>
    </section>
  )
}
