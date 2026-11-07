import { Link } from '@tanstack/react-router'
import type { Project } from '~/content'

/** Ties the condensation's result to the machine-checked theorem behind it. */
export function ProofNote({ project }: { project: Project }) {
  return (
    <aside aria-label="Formal proof" className="mx-auto max-w-7xl px-4 pb-24 sm:pb-32">
      <div data-reveal className="grid items-center gap-5 rounded-[28px] bg-ink p-6 text-paper sm:p-9 md:grid-cols-[1fr_auto] md:gap-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Formally verified in Lean 4</p>
          <p className="mt-3 max-w-2xl font-serif text-2xl leading-snug sm:text-3xl">{project.caseStudy.proof!.note}</p>
        </div>
        <Link to="/work/reductxn/proof" className="group inline-flex w-fit items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink">
          Read the proof
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </aside>
  )
}
