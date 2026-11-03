import type { SkillGroup } from '~/content'

type Props = { groups: SkillGroup[]; active: number; onSelect: (index: number) => void }

export function SkillTabs({ groups, active, onSelect }: Props) {
  return (
    <div role="tablist" aria-label="Skill areas" className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-paper p-1">
      {groups.map((g, i) => (
        <button
          key={g.id}
          type="button"
          role="tab"
          id={`tab-${g.id}`}
          aria-selected={i === active}
          aria-controls={`panel-${g.id}`}
          onClick={() => onSelect(i)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${i === active ? 'bg-ink text-paper' : 'text-muted hover:text-ink'}`}
        >
          {g.title}
        </button>
      ))}
    </div>
  )
}
