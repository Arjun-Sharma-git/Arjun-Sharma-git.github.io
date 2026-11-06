import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 3,
  name: 'Kanban',
  kind: 'Full-stack app',
  description: 'A task board with checklists and analytics: a React frontend on an Express + Mongoose REST API with JWT auth, documented in Postman.',
  tags: ['React', 'Express', 'MongoDB', 'JWT', 'REST'],
  repo: githubRepo('KanbanBackend'),
  live: 'https://kanban-project-rho.vercel.app',
} satisfies Project
