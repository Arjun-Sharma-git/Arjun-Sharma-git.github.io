import type { SkillGroup } from './types'

// Ordered by evidence on GitHub: language bytes across non-fork repos (Python 61%, JavaScript 20%,
// CSS 9%, TypeScript 8%, HTML 2%), then frameworks found in each repo's manifests.
export const skillGroups: SkillGroup[] = [
  {
    id: 'vision',
    title: 'AI & Vision',
    headline: 'Perception that runs on a webcam, not a datacenter.',
    body: 'About 60% of the code on my GitHub is Python, nearly all of it VirtGaze: real-time 3D gaze estimation with face mesh and iris landmarks, solvePnP head pose, a personalised MLP served through ONNX Runtime, and Kalman filtering, on threaded pipelines with bounded queues.',
    skills: ['Python', 'PyTorch', 'OpenCV', 'MediaPipe', 'ONNX Runtime', 'TensorRT', 'ROCm & CUDA', 'NumPy / SciPy', 'solvePnP head pose', 'UKF & One Euro filters', 'Calibration & benchmarking'],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    headline: 'Interfaces that feel fast because they are.',
    body: 'Five React apps live on Vercel, from a Next.js 15 App Router product with Sanity and NextAuth to a Vite task dashboard with Formik forms. This site is TanStack Start, GSAP and three.js, prerendered to static HTML.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'TanStack Router & Query', 'GSAP', 'three.js', 'Tailwind CSS', 'Material UI', 'Formik', 'Sanity CMS', 'NextAuth', 'Vite'],
  },
  {
    id: 'backend',
    title: 'Backend',
    headline: 'APIs that are boring in the best way.',
    body: 'REST services in Node.js with Express and MongoDB: JWT auth with hashed passwords, CRUD, analytics endpoints and Postman docs, plus media uploads to Cloudinary and Express servers that hand data off to Python analysis scripts.',
    skills: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST API design', 'JWT & bcrypt auth', 'Multer & Cloudinary uploads', 'Postman docs'],
  },
  {
    id: 'craft',
    title: 'Engineering',
    headline: 'Measure first, then optimise.',
    body: 'CI on every push across three Python versions, linting and type checks, reproducible one-command environments, latency and accuracy benchmarks, and documentation that explains the why.',
    skills: ['Git & GitHub Actions', 'pytest', 'ruff, black & mypy', 'pre-commit hooks', 'Makefile workflows', 'Latency benchmarks', 'Sentry', 'Vercel', 'Linux', 'Technical writing'],
  },
]

/** Headline skills for search metadata (meta keywords and JSON-LD knowsAbout), strongest first. */
export const topSkills = [
  'Computer Vision',
  'Python',
  'PyTorch',
  'OpenCV',
  'MediaPipe',
  'ONNX Runtime',
  'Gaze Estimation',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'Express',
  'MongoDB',
  'GSAP',
]
