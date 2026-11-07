// Repos never shown in the "My repos" section: tutorials, course exercises and work in progress.
export const hiddenRepos = [
  'desktop-tutorial',
  'KanbanBackend',
  'React-tic-tac-toe',
  'ToDoApp',
  'Video-Site-Backend',
  'major-proj-1',
  'Project4',
  'MicroProject3',
  'basic-micro-project-2',
  'basic-html-css-frontEnd',
  'ReactMovieApp',
  'Stock-Prediction',
]

// Used when a repo has no description on GitHub; a GitHub description always wins. Repos with neither
// are hidden automatically.
// Repos whose main home is elsewhere: the card links here instead of GitHub.
export const repoLinks: Record<string, string> = {
  Reductxn: 'https://gitlab.com/archer_16/reductxn',
}

// Shown first, in this order.
export const pinnedRepos = ['Reductxn']

export const repoDescriptions: Record<string, string> = {
  Reductxn: 'Shared expenses on an exact, append-only ledger, with a settle-up that finds the provably fewest payments.',
  StartupOutset: 'Startup pitch directory on Next.js 15 with GitHub sign-in, Sanity CMS and Sentry.',
  KanbanProject: 'Promanage: a Kanban task platform with drag-and-drop boards, optimistic updates and a MongoDB analytics dashboard.',
}
