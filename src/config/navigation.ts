export const sectionIds = {
  top: 'top',
  skills: 'skills',
  work: 'work',
  repos: 'repos',
  contact: 'contact',
} as const

// Root-relative so the same links work from case study pages.
export const navLinks = [
  { label: 'Skills', href: `/#${sectionIds.skills}` },
  { label: 'Work', href: `/#${sectionIds.work}` },
  { label: 'Repos', href: `/#${sectionIds.repos}` },
  { label: 'Contact', href: `/#${sectionIds.contact}` },
]
