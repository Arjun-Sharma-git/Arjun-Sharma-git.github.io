import type { SkillGroup } from '~/content'

type Props = { groups: SkillGroup[]; active: number; onSelect: (index: number) => void }

export function SkillTabs({ groups, active, onSelect }: Props) {
  return (
    <div role="tablist" aria-label="Skill areas" className="mx-auto grid w-full max-w-sm grid-cols-2 gap-1 rounded-3xl border border-line bg-paper p-1 sm:flex sm:w-fit sm:max-w-full sm:rounded-full">
      {groups.map((g, i) => (
        <button
          key={g.id}
          type="button"
          role="tab"
          id={`tab-${g.id}`}
          aria-selected={i === active}
          aria-controls={`panel-${g.id}`}
          onClick={() => onSelect(i)}
          className={`shrink-0 rounded-full px-4 py-2 text-center text-sm font-medium transition-colors ${i === active ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
        >
          {g.title}
        </button>
      ))}
    </div>
  )
}
