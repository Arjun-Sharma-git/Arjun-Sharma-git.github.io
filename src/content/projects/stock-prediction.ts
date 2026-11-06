import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 4,
  name: 'Stock Prediction',
  kind: 'Data analysis · Team project',
  description: 'An Express site that pulls daily prices from Alpha Vantage and hands them to a Python script, which plots moving averages and projects the next move. Built with a team of four.',
  tags: ['Python', 'pandas', 'Node.js', 'Express', 'EJS'],
  repo: githubRepo('Stock-Prediction'),
} satisfies Project
