import type { Stat } from './types'

// From the GitHub API, 6 Nov 2026. Stars are left out on purpose: the total is 0.
export const stats: Stat[] = [
  { value: 16, label: 'Non-fork public repositories on GitHub since 2020' },
  { value: 7, label: 'Languages across them, led by Python and JavaScript' },
  { value: 9, label: 'Sites live on Vercel right now' },
]
