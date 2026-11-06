import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 5,
  name: 'React Movie App',
  kind: 'Frontend',
  description: 'A personal entertainment dashboard: sign up, pick favourite genres, and get movie picks alongside live news and weather, notes and a countdown timer.',
  tags: ['React', 'React Router', 'REST', 'CSS'],
  repo: githubRepo('ReactMovieApp'),
  live: 'https://react-movie-app-ebon-gamma.vercel.app',
} satisfies Project
