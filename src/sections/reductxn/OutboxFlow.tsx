import type { Project } from '~/content'
import { eyebrow, heading } from '../case-study/shared'

function Link({ retry = false }: { retry?: boolean }) {
  return (
    <div aria-hidden className="flow-link relative mx-auto h-10 w-px bg-line md:mx-0 md:h-px md:w-full md:self-center">
      <span className="flow-packet absolute size-2.5 rounded-full bg-gold" />
      {retry && <span className="flow-packet flow-packet-late absolute size-2.5 rounded-full bg-[#b4432a]" />}
    </div>
  )
}

/** Commit, queue, dispatch, deliver: packets travel the same links a change takes after it is saved. */
export function OutboxFlow({ project }: { project: Project }) {
  const flow = project.caseStudy.flow!
  return (
    <section aria-labelledby="flow" className="mx-auto max-w-6xl px-4 py-24 sm:py-32">
      <div data-reveal className="max-w-2xl">
        <p className={`${eyebrow} text-gold-deep`}>After the commit</p>
        <h2 id="flow" className={`${heading} mt-4`}>
          {flow.title} <em className="text-gold">{flow.accent}</em>
        </h2>
        <p className="mt-5 leading-relaxed text-muted">{flow.intro}</p>
      </div>
      <div data-reveal className="mt-12 grid gap-0 md:grid-cols-[1fr_3rem_1fr_3rem_1fr_3rem_1fr]">
        {flow.nodes.flatMap((n, i) => [
          <div key={n.name} className="rounded-3xl border border-line bg-paper p-5">
            <p className="font-mono text-[0.68rem] uppercase tracking-widest text-gold-deep">{n.tag}</p>
            <h3 className="mt-2 font-serif text-2xl leading-tight">{n.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{n.detail}</p>
          </div>,
          ...(i < flow.nodes.length - 1 ? [<Link key={`${n.name}-link`} retry={i === flow.nodes.length - 2} />] : []),
        ])}
      </div>
    </section>
  )
}
