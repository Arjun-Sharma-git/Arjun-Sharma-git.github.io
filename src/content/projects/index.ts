import type { Project } from '../types'

// Every file in this folder default-exports one project; add a file to add a project.
const modules = import.meta.glob<{ default: Project }>(['./*.ts', '!./index.ts'], { eager: true })

export const projects = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.order - b.order)
