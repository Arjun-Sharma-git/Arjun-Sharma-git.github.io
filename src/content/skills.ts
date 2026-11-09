import type { SkillGroup } from './types'

// Ordered by evidence: language bytes across my repos, Reductxn included (Java leads), then frameworks found in
// each repo's manifests. Only what the code actually uses is listed.
export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: 'Backend',
    headline: 'APIs that are boring in the best way.',
    body: 'Java and Spring Boot for Reductxn: one service of twelve enforced modules on PostgreSQL, with an append-only ledger, an outbox, and an exact settle-up engine. Python and FastAPI for Sentinel Vault, with OpenFGA permissions checked before every search and an audit log of every answer. At ZenDot, a Node.js and Express platform for live drone telemetry over MQTT and WebSockets, with Redis for queueing.',
    skills: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'OpenFGA', 'REST APIs', 'WebSockets', 'MQTT'],
  },
  {
    id: 'vision',
    title: 'AI & Vision',
    headline: 'Models that run on one machine, not a datacenter.',
    body: 'VirtGaze does real-time 3D gaze estimation with face mesh and iris landmarks, solvePnP head pose, a personalised MLP served through ONNX Runtime, and Kalman filtering. Sentinel Vault is retrieval-augmented generation on one consumer GPU: hybrid search in Qdrant and Postgres, a reranker, a local LLM through Ollama, a prompt-injection gate and a separate model that fact-checks every claim, all measured against an eval set.',
    skills: ['Python', 'PyTorch', 'RAG', 'LLMs', 'Ollama', 'Qdrant', 'Evaluation', 'OpenCV', 'MediaPipe', 'ONNX Runtime', 'ROCm'],
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
  'TypeScript',
  'React',
  'Node.js',
  'Express',
  'Java',
  'Spring Boot',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'WebSockets',
  'MQTT',
  'Next.js',
  'TanStack',
  'Docker',
  'Python',
  'FastAPI',
  'RAG',
  'LLMs',
  'Computer Vision',
]
