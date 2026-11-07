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

export type Role = {
  title: string
  type: string
  start: string // YYYY-MM
  end?: string // YYYY-MM, omitted while current
  mode: string
  summary?: string
  highlights: { project?: string; points: string[] }[]
}
export type Job = { company: string; location: string; roles: Role[] }

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
  /** Copy for the page's interactive piece. */
  demo?: { title: string; accent: string; intro: string; note?: string; steps?: { name: string; detail: string }[] }
  /** Screens from the running app; `image` is the file name in public/work/<slug>/, without its size suffix. */
  walkthrough?: { title: string; accent: string; intro: string; note: string; steps: { image: string; name: string; detail: string; alt: string }[]
    languages?: { title: string; accent: string; detail: string; screens: { image: string; label: string; lang: string; alt: string }[] }
  }
  /** A machine-checked proof of the project's central claim, shown at /work/<slug>/proof. */
  proof?: {
    seoTitle: string
    seoDescription: string
    title: string
    accent: string
    note: string
    theorem: string
    steps: { name: string; detail: string }[]
    limits: string[]
    facts: { label: string; value: string }[]
  }
  flow?: { title: string; accent: string; intro: string; nodes: { tag: string; name: string; detail: string }[] }
}

export type Project = {
  /** Position in the Work section, lowest first. */
  order: number
  /** URL of the case study page: /work/<slug>. Each slug has its own route and page layout. */
  slug: 'virtgaze' | 'reductxn'
  name: string
  kind: string
  description: string
  tags: string[]
  /** Public source link. */
  repo?: string
  /** Label for that link, when plain "Source" isn't enough. */
  repoLabel?: string
  live?: string
  pipeline?: string[]
  featured?: boolean
  caseStudy: CaseStudy
}
