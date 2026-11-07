import type { Job } from './types'

// Newest first. Dates are YYYY-MM; a role with no end is current.
export const experience: Job[] = [
  {
    company: 'ZenDot',
    location: 'Gurugram, India',
    roles: [
      {
        title: 'Software Engineer',
        type: 'Full-time',
        start: '2025-03',
        mode: 'On-site',
        highlights: [
          {
            points: [
              'Architected a full-stack UAV telemetry and ground-control platform (React, TypeScript, Node.js/Express), with real-time two-way communication over custom MQTT broker interfaces, WebSockets and REST APIs.',
              'Built a low-latency pipeline that ingests live camera and parameter data and streams video and telemetry to client dashboards with hardware-accelerated FFmpeg.',
              'Scaled reliability for concurrent multi-drone fleet operations with priority-based message ordering and a local Redis caching and queueing layer.',
            ],
          },
        ],
      },
    ],
  },
  {
    company: 'EY',
    location: 'New Delhi, India',
    roles: [
      {
        title: 'Cyber Security Senior Analyst',
        type: 'Full-time',
        start: '2023-07',
        end: '2023-09',
        mode: 'On-site',
        highlights: [
          {
            project: 'Vulnerability identification and mitigation',
            points: [
              'Identified vulnerabilities in the networks of large-scale projects.',
              'Built and rolled out strategies to mitigate the threats found.',
              'Kept security measures in place that protect project integrity.',
            ],
          },
        ],
      },
      {
        title: 'Cyber Security Senior Analyst',
        type: 'Internship',
        start: '2023-02',
        end: '2023-06',
        mode: 'Hybrid',
        highlights: [
          {
            project: 'Full-stack internal tools',
            points: [
              'Built frontend and backend for internal employee-survey tools that improved team workflow.',
            ],
          },
          {
            project: 'Dockerised SIEM',
            points: [
              'Led a proof of concept for a Dockerised Security Operations Centre built from open-source tools.',
              'Drove the adoption of Docker to simplify running SOC tooling.',
            ],
          },
        ],
      },
    ],
  },
]
