import type { Profile } from './types'

const githubUser = 'Arjun-Sharma-git'

export const profile: Profile = {
  name: 'Arjun Sharma',
  firstName: 'Arjun',
  role: 'Full-stack & Computer Vision Engineer',
  location: 'Noida, India',
  tagline: 'Developer · Solver · Optimiser',
  summary: 'I turn webcams into input devices and ideas into shipped web products.',
  email: 'arjunsharma1620@gmail.com',
  githubUser,
  links: {
    github: `https://github.com/${githubUser}`,
    linkedin: 'https://www.linkedin.com/in/arjunsharma16/',
  },
}
