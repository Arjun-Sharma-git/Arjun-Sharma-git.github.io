import type { SkillGroup } from './types'

// Ordered by evidence: language bytes across my repos, Reductxn included (Java leads), then frameworks found in
// each repo's manifests. Only what the code actually uses is listed.
export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: 'Backend',
    headline: 'APIs that are boring in the best way.',
    body: 'Java and Spring Boot for Reductxn: one service of twelve enforced modules on PostgreSQL, with an append-only ledger, an outbox, and an exact settle-up engine. At ZenDot, a Node.js and Express platform for live drone telemetry over MQTT and WebSockets, with Redis for queueing.',
    skills: ['Java', 'Spring Boot', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'REST APIs', 'WebSockets', 'MQTT'],
  },
  {
    id: 'vision',
    title: 'AI & Vision',
    headline: 'Perception that runs on a webcam, not a datacenter.',
    body: 'Most of my Python lives in VirtGaze: real-time 3D gaze estimation with face mesh and iris landmarks, solvePnP head pose, a personalised MLP served through ONNX Runtime, and Kalman filtering, on threaded pipelines with bounded queues.',
    skills: ['Python', 'PyTorch', 'OpenCV', 'MediaPipe', 'ONNX Runtime', 'NumPy'],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    headline: 'Interfaces that feel fast because they are.',
    body: 'Five React apps live on Vercel, including a Next.js 15 App Router product with Sanity and NextAuth. Reductxn’s client is an offline-first React 19 app with a service worker, web push and four languages. This site is TanStack Start, GSAP and three.js, prerendered to static HTML.',
    skills: ['TypeScript', 'JavaScript', 'React', 'Next.js', 'TanStack', 'Tailwind CSS', 'GSAP', 'three.js'],
  },
  {
    id: 'craft',
    title: 'Engineering',
    headline: 'Measure first, then optimise.',
    body: 'Tests that run against real services, CI on every push, containers from laptop to cluster, and latency and accuracy benchmarks before any optimisation.',
    skills: ['Git', 'GitHub Actions', 'GitLab CI', 'Docker', 'Kubernetes', 'Linux', 'pytest', 'Playwright'],
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
