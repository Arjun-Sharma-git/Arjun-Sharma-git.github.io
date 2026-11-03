import type { ReactNode } from 'react'

type Props = { children: ReactNode; className?: string }

export function Chip({ children, className = 'border border-line bg-cream px-4 py-2 text-sm' }: Props) {
  return <li className={`rounded-full ${className}`}>{children}</li>
}
