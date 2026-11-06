import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 1,
  name: 'VirtGaze',
  kind: 'Computer vision · Hands-free interaction',
  description:
    'A real-time 3D gaze estimation system that turns a standard webcam into a hands-free cursor. Designed for sub-3° error after calibration and under 20 ms end to end, with 25-point calibration and CI on every push.',
  pipeline: ['Camera', 'Face mesh + iris', 'Head pose', '3D gaze', 'Personal MLP', 'Filter', 'Cursor'],
  tags: ['Python', 'PyTorch', 'OpenCV', 'MediaPipe', 'ONNX Runtime', 'ROCm', 'CI'],
  repo: githubRepo('VirtGaze'),
  featured: true,
} satisfies Project
