import type { Project } from '~/content'
import { Chip, ExternalLink } from '~/components/ui'
import { Pipeline } from './Pipeline'

const linkClass = 'underline decoration-gold underline-offset-4 hover:decoration-2'

export function ProjectCard({ project: p }: { project: Project }) {
  const dark = p.featured
  return (
    <article
      data-reveal
      className={`flex flex-col rounded-[28px] border border-line p-7 sm:p-9 lg:h-[30rem] ${dark ? 'bg-ink text-paper lg:w-[44rem]' : 'bg-paper lg:w-[26rem]'}`}
    >
      <p className={`text-xs font-medium uppercase tracking-[0.18em] ${dark ? 'text-gold' : 'text-gold-deep'}`}>{p.kind}</p>
      <h3 className="mt-3 font-serif text-4xl sm:text-5xl">{p.name}</h3>
      <p className={`mt-4 leading-relaxed ${dark ? 'text-paper/75' : 'text-muted'}`}>{p.description}</p>
      {p.pipeline && <Pipeline steps={p.pipeline} />}

      <ul className="mt-auto flex flex-wrap gap-2 pt-6">
        {p.tags.map((t) => (
          <Chip key={t} className={`px-3 py-1 text-xs ${dark ? 'bg-paper/10' : 'bg-cream'}`}>
            {t}
          </Chip>
        ))}
      </ul>
      <div className="mt-6 flex gap-4 text-sm font-medium">
        <ExternalLink href={p.repo} className={linkClass}>
          Source<span className="sr-only"> code for {p.name}</span>
        </ExternalLink>
        {p.live && (
          <ExternalLink href={p.live} className={linkClass}>
            Live demo<span className="sr-only"> of {p.name}</span>
          </ExternalLink>
        )}
      </div>
    </article>
  )
}
