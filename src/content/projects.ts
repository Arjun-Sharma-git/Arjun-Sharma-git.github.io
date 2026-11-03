import type { Project } from './types'
import { profile } from './profile'

const repo = (name: string) => `${profile.links.github}/${name}`

export const projects: Project[] = [
  {
    name: 'VirtGaze',
    kind: 'Computer vision · Hands-free interaction',
    description:
      'A real-time 3D gaze estimation system that turns a standard webcam into a hands-free cursor. Designed for sub-3° error after calibration and under 20 ms end to end.',
    pipeline: ['Camera', 'Face mesh + iris', 'Head pose', '3D gaze', 'Personal MLP', 'Filter', 'Cursor'],
    tags: ['Python', 'PyTorch', 'OpenCV', 'ROCm', 'CI'],
    repo: repo('VirtGaze'),
    featured: true,
  },
  {
    name: 'StartupOutset',
    kind: 'Web product',
    description: 'A Next.js and TypeScript web platform for early-stage startups, built with the App Router and deployed on Vercel.',
    tags: ['Next.js', 'TypeScript', 'React'],
    repo: repo('StartupOutset'),
    live: 'https://startup-outset.vercel.app',
  },
  {
    name: 'Kanban',
    kind: 'Full-stack app',
    description: 'A Kanban board with a React frontend and an Express + Mongoose REST backend, with endpoints documented in Postman.',
    tags: ['React', 'Express', 'MongoDB', 'REST'],
    repo: repo('KanbanBackend'),
    live: 'https://kanban-project-rho.vercel.app',
  },
  {
    name: 'Stock Prediction',
    kind: 'ML · Team project',
    description: 'A website and Python server that predicts stock prices, built with a team of four.',
    tags: ['Python', 'ML', 'JavaScript', 'EJS'],
    repo: repo('Stock-Prediction'),
  },
  {
    name: 'React Movie App',
    kind: 'Frontend',
    description: 'A responsive movie discovery app in React that consumes a public movie API.',
    tags: ['React', 'REST', 'CSS'],
    repo: repo('ReactMovieApp'),
    live: 'https://react-movie-app-ebon-gamma.vercel.app',
  },
]
