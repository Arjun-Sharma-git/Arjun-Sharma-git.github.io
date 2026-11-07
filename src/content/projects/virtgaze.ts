import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 1,
  slug: 'virtgaze',
  name: 'VirtGaze',
  kind: 'Computer vision · Hands-free interaction',
  description:
    'A real-time 3D gaze estimation system that turns a standard webcam into a hands-free cursor. Designed for sub-3° error after calibration and under 20 ms end to end, with 25-point calibration and CI on every push.',
  pipeline: ['Camera', 'Face mesh + iris', 'Head pose', '3D gaze', 'Personal MLP', 'Filter', 'Cursor'],
  tags: ['Python', 'PyTorch', 'OpenCV', 'MediaPipe', 'ONNX Runtime', 'ROCm', 'CI'],
  repo: githubRepo('VirtGaze'),
  featured: true,
  caseStudy: {
    seoTitle: 'Real-time 3D gaze tracking from a webcam',
    seoDescription:
      'How VirtGaze turns a standard webcam into a hands-free cursor: a threaded Python pipeline with MediaPipe, solvePnP head pose, a personalised MLP and adaptive filtering.',
    title: 'A plain webcam,',
    accent: 'steered by your eyes.',
    lede: 'VirtGaze estimates where you are looking in 3D and moves the desktop cursor there, using nothing but a standard webcam and a short calibration.',
    facts: [
      { value: '<3°', label: 'Angular error target after calibration' },
      { value: '<20 ms', label: 'End-to-end latency target' },
      { value: '25', label: 'Calibration points in a full session' },
      { value: '~14K', label: 'Parameters in the personal MLP' },
    ],
    problem: {
      title: 'A webcam sees a head,',
      accent: 'not a gaze.',
      body: [
        'Gaze is a tiny signal riding on a large one. The iris moves a few pixels while the head moves freely, the lighting changes, and every face and camera is different. A cursor also has to feel immediate, so accuracy cannot be bought with lag.',
        'That rules out a single end-to-end model. VirtGaze splits the job: geometry handles what physics already explains, a small model learns what is personal to you, and a filter keeps the result steady without making it sluggish.',
      ],
    },
    approach: {
      title: 'Eight stages,',
      accent: 'one thread each.',
      intro: 'Every stage runs on its own thread, joined by bounded queues, so a slow frame is dropped rather than queued up as latency.',
      stages: [
        { name: 'Capture', detail: 'Webcam or video input, with optional lens undistortion from a chessboard calibration.' },
        { name: 'Detect and track', detail: 'Full face detection every few frames, with tracking in between to save time.' },
        { name: 'Face mesh and iris', detail: 'MediaPipe landmarks with iris refinement give the eye geometry.' },
        { name: 'Head pose', detail: 'solvePnP against a canonical face model recovers rotation and position.' },
        { name: '3D gaze', detail: 'Gaze rays are built per eye in the head frame, then rotated into the camera frame.' },
        { name: 'Personal MLP', detail: 'A small per-user network maps gaze features to the screen, through PyTorch, ONNX Runtime or TensorRT.' },
        { name: 'Temporal filter', detail: 'An unscented Kalman filter and One Euro filter, tuned by fixation, saccade and blink state.' },
        { name: 'Screen coordinates', detail: 'A per-user bias map removes location-dependent error before the cursor moves.' },
      ],
    },
    demo: {
      title: 'Same eye,',
      accent: 'calmer cursor.',
      intro: 'Raw gaze estimates jitter even when the eye holds still. A One Euro filter smooths heavily at low speed and lets go at high speed, so fixations stay steady and jumps stay fast. Move your pointer across the panel.',
      note: 'A real One Euro filter running in your browser on synthetic noise, as an illustration. VirtGaze pairs it with an unscented Kalman filter.',
    },
    stack: [
      { label: 'Vision', items: ['Python', 'OpenCV', 'MediaPipe', 'NumPy', 'SciPy'] },
      { label: 'Model', items: ['PyTorch', 'ONNX Runtime', 'TensorRT'] },
      { label: 'Hardware', items: ['CPU', 'CUDA', 'ROCm'] },
      { label: 'Quality', items: ['pytest', 'ruff', 'black', 'mypy', 'pre-commit', 'GitHub Actions'] },
    ],
    decisions: [
      {
        title: 'Two coordinate frames, on purpose',
        body: 'Model features stay in the head frame, which makes the learned mapping invariant to head pose. The geometric fallback uses camera-frame angles. Mixing them silently breaks calibration, so the split is documented and tested.',
      },
      {
        title: 'Backpressure over buffering',
        body: 'Bounded queues between threads give natural backpressure. Under load the pipeline sheds old frames, because a stale gaze point is worth less than a missing one.',
      },
      {
        title: 'Smoothing that follows the eye',
        body: 'Filter noise scales with gaze state: heavier during fixation and blinks, lighter during saccades. The cursor rests steadily and still moves quickly when you look away.',
      },
      {
        title: 'No cursor beats a wrong cursor',
        body: 'Without a usable personal model the system can fall back to geometry, or be set to hold still. A plausible but uncalibrated point is the failure this option exists to prevent.',
      },
      {
        title: 'Calibration that keeps learning',
        body: 'A full 25-point session trains the model, a 5-point pass refreshes it, and implicit mode treats deliberate clicks as labelled samples and fine-tunes in the background.',
      },
      {
        title: 'Targets are stated as targets',
        body: 'The accuracy and latency figures are design targets. Benchmark scripts ship with the repo so anyone can measure them on their own camera, lighting and hardware.',
      },
    ],
  },
} satisfies Project
