import type { Repo } from '~/services/github'
import { ExternalLink } from '~/components/ui'

const dateFmt = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <ExternalLink
      href={repo.html_url}
      className="group flex h-full flex-col rounded-3xl border border-line bg-paper p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(27_24_20/0.08)]"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="truncate font-medium">{repo.name}</span>
        <span aria-hidden className="text-gold transition-transform group-hover:translate-x-1">
          ↗
        </span>
      </span>
      <span className="mt-2 line-clamp-2 text-sm text-muted">{repo.description ?? 'No description yet.'}</span>
      <span className="mt-auto flex items-center gap-3 pt-5 text-xs text-muted">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full bg-gold" />
            {repo.language}
          </span>
        )}
        <span>Updated {dateFmt.format(new Date(repo.pushed_at))}</span>
      </span>
    </ExternalLink>
  )
}
