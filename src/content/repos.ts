// Repos never shown in the "Fresh from my GitHub" section: tutorials, course exercises and work in progress.
export const hiddenRepos = [
  'desktop-tutorial',
  'React-tic-tac-toe',
  'ToDoApp',
  'Video-Site-Backend',
  'major-proj-1',
  'Project4',
  'MicroProject3',
  'basic-micro-project-2',
  'basic-html-css-frontEnd',
]

// Used when a repo has no description on GitHub; a GitHub description always wins. Repos with neither
// are hidden automatically.
export const repoDescriptions: Record<string, string> = {
  StartupOutset: 'Startup pitch directory on Next.js 15 with GitHub sign-in, Sanity CMS and Sentry.',
  KanbanProject: 'React frontend for a Kanban board with a dashboard, calendar and task analytics.',
  ReactMovieApp: 'Personal dashboard with genre picks, live news and weather, notes and a timer.',
  'Stock-Prediction': 'Team project: an Express site and Python script that chart and project stock trends.',
}
