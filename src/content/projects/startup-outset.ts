import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 2,
  name: 'StartupOutset',
  kind: 'Web product',
  description: 'A directory where founders pitch startups: GitHub sign-in with NextAuth, Markdown pitches stored in Sanity, search, and Sentry monitoring, on the Next.js 15 App Router.',
  tags: ['Next.js', 'TypeScript', 'React', 'Sanity', 'NextAuth', 'Sentry'],
  repo: githubRepo('StartupOutset'),
  live: 'https://startup-outset.vercel.app',
} satisfies Project
