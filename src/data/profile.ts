export const profile = {
  name: 'Arjun Sharma',
  role: 'Full-stack & Computer Vision Engineer',
  location: 'Noida, India',
  tagline: 'Developer · Solver · Optimiser',
  summary:
    'I turn webcams into input devices and ideas into shipped web products. I care about latency budgets, clean APIs and interfaces that feel effortless.',
  email: 'arjunsharma1620@gmail.com',
  github: 'https://github.com/Arjun-Sharma-git',
  githubUser: 'Arjun-Sharma-git',
  linkedin: 'https://www.linkedin.com/in/arjunsharma16/',
}

export const stats = [
  { value: 20, prefix: '<', suffix: 'ms', label: 'End-to-end latency target for my webcam gaze-tracking pipeline' },
  { value: 10, suffix: '+', label: 'Web apps shipped to production on Vercel' },
  { value: 2020, label: 'Writing and shipping code on GitHub since' },
]

export const skillGroups = [
  {
    id: 'vision',
    title: 'AI & Vision',
    headline: 'Perception that runs on a webcam, not a datacenter.',
    body: 'Real-time 3D gaze estimation: face mesh and iris landmarks, head pose with solvePnP, a personalised MLP and temporal filtering, all on threaded pipelines with bounded queues.',
    skills: ['Python', 'PyTorch', 'OpenCV', 'Face mesh & iris tracking', 'solvePnP head pose', 'NumPy / SciPy', 'ROCm GPU', 'Calibration & benchmarking'],
  },
  {
    id: 'backend',
    title: 'Backend',
    headline: 'APIs that are boring in the best way.',
    body: 'REST services in Node.js with Express and MongoDB: auth, CRUD and documented endpoints, plus Python servers that serve model predictions to the web.',
    skills: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST API design', 'Postman docs', 'Python web servers'],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    headline: 'Interfaces that feel fast because they are.',
    body: 'Typed React apps with Next.js and TanStack, responsive layouts and motion with GSAP, deployed on the edge.',
    skills: ['TypeScript', 'React', 'Next.js', 'TanStack Router & Query', 'GSAP', 'Tailwind CSS', 'Responsive design', 'Vercel'],
  },
  {
    id: 'craft',
    title: 'Engineering',
    headline: 'Measure first, then optimise.',
    body: 'CI on every push, reproducible environments, latency and accuracy benchmarks, and documentation that explains the why.',
    skills: ['Git & GitHub Actions', 'Testing', 'Profiling', 'Makefile workflows', 'Linux', 'Technical writing'],
  },
]

export const projects = [
  {
    name: 'VirtGaze',
    kind: 'Computer vision · Hands-free interaction',
    description:
      'A real-time 3D gaze estimation system that turns a standard webcam into a hands-free cursor. Designed for sub-3° error after calibration and under 20 ms end to end.',
    pipeline: ['Camera', 'Face mesh + iris', 'Head pose', '3D gaze', 'Personal MLP', 'Filter', 'Cursor'],
    tags: ['Python', 'PyTorch', 'OpenCV', 'ROCm', 'CI'],
    repo: 'https://github.com/Arjun-Sharma-git/VirtGaze',
  },
  {
    name: 'StartupOutset',
    kind: 'Web product',
    description: 'A Next.js and TypeScript web platform for early-stage startups, built with the App Router and deployed on Vercel.',
    tags: ['Next.js', 'TypeScript', 'React'],
    repo: 'https://github.com/Arjun-Sharma-git/StartupOutset',
    live: 'https://startup-outset.vercel.app',
  },
  {
    name: 'Kanban',
    kind: 'Full-stack app',
    description: 'A Kanban board with a React frontend and an Express + Mongoose REST backend, with endpoints documented in Postman.',
    tags: ['React', 'Express', 'MongoDB', 'REST'],
    repo: 'https://github.com/Arjun-Sharma-git/KanbanBackend',
    live: 'https://kanban-project-rho.vercel.app',
  },
  {
    name: 'Stock Prediction',
    kind: 'ML · Team project',
    description: 'A website and Python server that predicts stock prices, built with a team of four.',
    tags: ['Python', 'ML', 'JavaScript', 'EJS'],
    repo: 'https://github.com/Arjun-Sharma-git/Stock-Prediction',
  },
  {
    name: 'React Movie App',
    kind: 'Frontend',
    description: 'A responsive movie discovery app in React that consumes a public movie API.',
    tags: ['React', 'REST', 'CSS'],
    repo: 'https://github.com/Arjun-Sharma-git/ReactMovieApp',
    live: 'https://react-movie-app-ebon-gamma.vercel.app',
  },
]
