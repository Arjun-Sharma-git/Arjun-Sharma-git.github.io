import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 2,
  name: 'StartupOutset',
  kind: 'Web product',
  description: 'A Next.js and TypeScript web platform for early-stage startups, built with the App Router and deployed on Vercel.',
  tags: ['Next.js', 'TypeScript', 'React'],
  repo: githubRepo('StartupOutset'),
  live: 'https://startup-outset.vercel.app',
} satisfies Project
