import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 3,
  name: 'Kanban',
  kind: 'Full-stack app',
  description: 'A Kanban board with a React frontend and an Express + Mongoose REST backend, with endpoints documented in Postman.',
  tags: ['React', 'Express', 'MongoDB', 'REST'],
  repo: githubRepo('KanbanBackend'),
  live: 'https://kanban-project-rho.vercel.app',
} satisfies Project
