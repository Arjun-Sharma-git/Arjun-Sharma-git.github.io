import type { SkillGroup } from './types'

// Ordered by evidence: language bytes across my repos, Reductxn included (Java leads), then frameworks found in
// each repo's manifests. Only what the code actually uses is listed: Kafka, Redis and Spring Batch were in
// Reductxn v1's plans but never wired up, and v2 dropped them.
export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: 'Backend',
    headline: 'APIs that are boring in the best way.',
    body: 'Java and Spring Boot for Reductxn: one service of twelve enforced modules on PostgreSQL, with an append-only ledger, an outbox, and an exact settle-up engine. Before that, REST services in Node.js with Express and MongoDB, with JWT auth and media uploads to Cloudinary.',
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'jOOQ', 'Flyway', 'OpenAPI', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT & bcrypt auth', 'Multer & Cloudinary uploads'],
  },
  {
    id: 'vision',
    title: 'AI & Vision',
    headline: 'Perception that runs on a webcam, not a datacenter.',
    body: 'Most of my Python lives in VirtGaze: real-time 3D gaze estimation with face mesh and iris landmarks, solvePnP head pose, a personalised MLP served through ONNX Runtime, and Kalman filtering, on threaded pipelines with bounded queues.',
    skills: ['Python', 'PyTorch', 'OpenCV', 'MediaPipe', 'ONNX Runtime', 'TensorRT', 'ROCm & CUDA', 'NumPy / SciPy', 'solvePnP head pose', 'UKF & One Euro filters', 'Calibration & benchmarking'],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    headline: 'Interfaces that feel fast because they are.',
    body: 'Five React apps live on Vercel, including a Next.js 15 App Router product with Sanity and NextAuth. Reductxn’s client is an offline-first React 19 app with a service worker, web push and four languages. This site is TanStack Start, GSAP and three.js, prerendered to static HTML.',
    skills: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'TanStack Router & Query', 'GSAP', 'three.js', 'Tailwind CSS', 'Vite', 'Service workers & PWA', 'i18n', 'Material UI', 'Formik', 'Sanity CMS', 'NextAuth'],
  },
  {
    id: 'craft',
    title: 'Engineering',
    headline: 'Measure first, then optimise.',
    body: 'Architecture rules that fail the build, property-based tests, integration tests on a real database, CI on every push, latency and accuracy benchmarks, and decision records that explain the why.',
    skills: ['Git & GitHub Actions', 'ArchUnit', 'jqwik property tests', 'Testcontainers', 'Docker', 'Kubernetes', 'GitLab CI', 'pytest', 'Playwright', 'Vitest', 'ruff, black & mypy', 'Makefile workflows', 'Sentry', 'Vercel', 'Linux', 'Technical writing'],
  },
]

/** Headline skills for search metadata (meta keywords and JSON-LD knowsAbout), strongest first. */
export const topSkills = [
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'Computer Vision',
  'Python',
  'PyTorch',
  'OpenCV',
  'MediaPipe',
  'Gaze Estimation',
  'TypeScript',
  'React',
  'Next.js',
  'Node.js',
  'MongoDB',
  'GSAP',
]
