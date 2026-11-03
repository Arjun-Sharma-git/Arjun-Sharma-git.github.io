export type Profile = {
  name: string
  firstName: string
  role: string
  location: string
  tagline: string
  summary: string
  email: string
  githubUser: string
  links: { github: string; linkedin: string }
}

export type Stat = { value: number; prefix?: string; suffix?: string; label: string }

export type SkillGroup = { id: string; title: string; headline: string; body: string; skills: string[] }

export type Project = {
  name: string
  kind: string
  description: string
  tags: string[]
  repo: string
  live?: string
  pipeline?: string[]
  featured?: boolean
}
