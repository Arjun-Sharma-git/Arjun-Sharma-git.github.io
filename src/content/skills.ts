import type { SkillGroup } from './types'

export const skillGroups: SkillGroup[] = [
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
