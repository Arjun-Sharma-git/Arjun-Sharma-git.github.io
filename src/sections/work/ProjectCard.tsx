import { Link } from '@tanstack/react-router'
import type { Project } from '~/content'
import { Chip, ExternalLink } from '~/components/ui'
import { Pipeline } from './Pipeline'

const linkClass = 'underline decoration-gold underline-offset-4 hover:decoration-2'

export function ProjectCard({ project: p }: { project: Project }) {
  const dark = p.featured
  return (
    <article data-reveal className={`flex h-full flex-col rounded-[28px] border border-line p-7 sm:p-9 ${dark ? 'bg-ink text-paper' : 'bg-paper'}`}>
      <p className={`text-xs font-medium uppercase tracking-[0.18em] ${dark ? 'text-gold' : 'text-gold-deep'}`}>{p.kind}</p>
      <h3 className="mt-3 font-serif text-4xl sm:text-5xl">
        <Link to="/work/$slug" params={{ slug: p.slug }} className="hover:text-gold">
          {p.name}
        </Link>
      </h3>
      <p className={`mt-4 leading-relaxed ${dark ? 'text-paper/75' : 'text-muted'}`}>{p.description}</p>
      {p.pipeline && <Pipeline steps={p.pipeline} dark={dark} />}

      <ul className="mt-auto flex flex-wrap gap-2 pt-6">
        {p.tags.map((t) => (
          <Chip key={t} className={`px-3 py-1 text-xs ${dark ? 'bg-paper/10' : 'bg-cream'}`}>
            {t}
          </Chip>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium">
        <Link
          to="/work/$slug"
          params={{ slug: p.slug }}
          className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 ${dark ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}
        >
          Read the case study<span className="sr-only"> for {p.name}</span>
          <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>
        {p.repo && (
          <ExternalLink href={p.repo} className={linkClass}>
            Source<span className="sr-only"> code for {p.name}</span>
          </ExternalLink>
        )}
        {p.live && (
          <ExternalLink href={p.live} className={linkClass}>
            Live demo<span className="sr-only"> of {p.name}</span>
          </ExternalLink>
        )}
        {p.repoNote && <span className={`text-xs font-normal ${dark ? 'text-paper/60' : 'text-muted'}`}>{p.repoNote}</span>}
      </div>
    </article>
  )
}
