import type { Profile } from './types'

const githubUser = 'Arjun-Sharma-git'

export const profile: Profile = {
  name: 'Arjun Sharma',
  firstName: 'Arjun',
  role: 'Full-Stack Software Engineer',
  location: 'Noida, India',
  tagline: 'Developer · Solver · Optimiser',
  summary: 'a full-stack software engineer working across frontend, backend and real-time systems.',
  email: 'arjunsharma1620@gmail.com',
  githubUser,
  links: {
    github: `https://github.com/${githubUser}`,
    linkedin: 'https://www.linkedin.com/in/arjunsharma16/',
    // Only linked when public/resume.pdf exists at build time (see vite.config.ts).
    resume: __HAS_RESUME__ ? '/resume.pdf' : undefined,
  },
}

export const githubRepo = (name: string) => `${profile.links.github}/${name}`
