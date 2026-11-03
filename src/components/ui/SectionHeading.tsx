import type { ReactNode } from 'react'

type Props = { eyebrow: string; title: string; accent: string; children?: ReactNode }

export function SectionHeading({ eyebrow, title, accent, children }: Props) {
  return (
    <div data-reveal className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-deep">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-[clamp(2.4rem,6vw,4.5rem)] leading-[1] tracking-tight">
        {title} <em className="text-gold">{accent}</em>
      </h2>
      {children && <p className="mx-auto mt-5 max-w-xl text-balance leading-relaxed text-muted">{children}</p>}
    </div>
  )
}
