export type Profile = {
  name: string
  firstName: string
  role: string
  location: string
  tagline: string
  summary: string
  email: string
  githubUser: string
  links: { github: string; linkedin: string; resume?: string }
}

export type Stat = { value: number; prefix?: string; suffix?: string; label: string }

export type SkillGroup = { id: string; title: string; headline: string; body: string; skills: string[] }

export type CaseStudy = {
  /** Middle of the page title: "<name>: <seoTitle> | <person>". */
  seoTitle: string
  seoDescription: string
  /** Hero headline; `accent` renders as the italic gold line. */
  title: string
  accent: string
  lede: string
  facts: { value: string; label: string }[]
  problem: { title: string; accent: string; body: string[] }
  approach: { title: string; accent: string; intro: string; stages: { name: string; detail: string }[] }
  stack: { label: string; items: string[] }[]
  decisions: { title: string; body: string }[]
}

export type Project = {
  /** Position in the Work section, lowest first. */
  order: number
  /** URL of the case study page: /work/<slug>. */
  slug: string
  name: string
  kind: string
  description: string
  tags: string[]
  /** Public source link. Leave out for private work and set `repoNote` instead. */
  repo?: string
  repoNote?: string
  live?: string
  pipeline?: string[]
  featured?: boolean
  caseStudy: CaseStudy
}
