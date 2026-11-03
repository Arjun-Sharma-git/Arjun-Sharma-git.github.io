import type { ReactNode } from 'react'

export function StatusBadge({ children }: { children: ReactNode }) {
  return (
    <p
      data-hero-fade
      className="relative mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-paper/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted backdrop-blur"
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-600" />
      </span>
      {children}
    </p>
  )
}
