import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 4,
  name: 'Stock Prediction',
  kind: 'ML · Team project',
  description: 'A website and Python server that predicts stock prices, built with a team of four.',
  tags: ['Python', 'ML', 'JavaScript', 'EJS'],
  repo: githubRepo('Stock-Prediction'),
} satisfies Project
