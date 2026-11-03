import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 5,
  name: 'React Movie App',
  kind: 'Frontend',
  description: 'A responsive movie discovery app in React that consumes a public movie API.',
  tags: ['React', 'REST', 'CSS'],
  repo: githubRepo('ReactMovieApp'),
  live: 'https://react-movie-app-ebon-gamma.vercel.app',
} satisfies Project
