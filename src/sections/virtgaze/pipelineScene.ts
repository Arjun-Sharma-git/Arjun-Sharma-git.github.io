import { type Frame, clamp, lerp } from '~/lib/canvas'
import { buildFaceMesh, EYES } from './faceMesh'
import { oneEuro } from './oneEuro'

const LIGHT = '226,190,134'
const PAPER = '251,248,242'

/** One scene for all eight stages: `stage` runs 0..8 and each stage adds its layer on top of the last. */
export function createPipelineScene() {
  const mesh = buildFaceMesh()
  const fx = oneEuro(0.9, 0.02)
  const fy = oneEuro(0.9, 0.02)
  const raw: [number, number][] = []
  const smooth: [number, number][] = []
  let seed = 5
  const noise = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32 - 0.5) * 2

  return function draw({ ctx: c, w, h, t, dt, still }: Frame, stage: number) {
    const on = (i: number) => clamp(stage - i)
    const narrow = w < 560
    const scale = Math.min(h * 0.4, w * (narrow ? 0.3 : 0.335))
    const cx = w * (narrow ? 0.31 : 0.38)
    const cy = h * (narrow ? 0.52 : 0.56)

    const yaw = Math.sin(t * 0.55) * 0.34 * (0.25 + 0.75 * on(3)) + (still ? -0.28 : 0)
    const pitch = Math.sin(t * 0.41) * 0.1 + (still ? 0.05 : 0)
    const cosY = Math.cos(yaw), sinY = Math.sin(yaw), cosP = Math.cos(pitch), sinP = Math.sin(pitch)
    const project = (x: number, y: number, z: number) => {
      const rx = x * cosY + z * sinY
      const rz = -x * sinY + z * cosY
      const ry = y * cosP - rz * sinP
      const dz = y * sinP + rz * cosP
      const k = 1 + dz * 0.16
      return [cx + rx * scale * k, cy + ry * scale * k] as const
    }
    const screen = projectScreen(w, h, narrow)

    // 1 Capture: viewfinder and scanline.
    const box = { x: cx - scale * 1.08, y: cy - scale * 1.2, w: scale * 2.16, h: scale * 2.4 }
    c.strokeStyle = `rgba(${LIGHT},0.8)`
    c.lineWidth = 1
    const arm = 16
    c.beginPath()
    for (const [px, py, sx, sy] of [[box.x, box.y, 1, 1], [box.x + box.w, box.y, -1, 1], [box.x, box.y + box.h, 1, -1], [box.x + box.w, box.y + box.h, -1, -1]]) {
      c.moveTo(px + sx * arm, py)
      c.lineTo(px, py)
      c.lineTo(px, py + sy * arm)
    }
    c.stroke()
    if (stage < 2.5 && !still) {
      const scan = box.y + ((t * 0.32) % 1) * box.h
      c.fillStyle = `rgba(${LIGHT},0.25)`
      c.fillRect(box.x, scan, box.w, 1)
    }

    // Face points: a soft silhouette at first, sharpening once a face has been found.
    c.fillStyle = `rgba(${PAPER},${lerp(0.16, 0.55, on(1))})`
    for (const p of mesh.points) {
      const [x, y] = project(p.x, p.y, p.z)
      c.fillRect(x - 0.7, y - 0.7, 1.4, 1.4)
    }

    // 2 Detect: bounding box around the face.
    if (on(1) > 0) {
      const inset = scale * 0.2
      c.strokeStyle = `rgba(${LIGHT},${0.8 * on(1)})`
      c.setLineDash([5, 4])
      c.strokeRect(box.x + inset, box.y + inset * 0.7, box.w - inset * 2, box.h - inset * 1.4)
      c.setLineDash([])
      c.font = '10px ui-monospace, Menlo, monospace'
      c.fillStyle = `rgba(${LIGHT},${on(1)})`
      c.textAlign = 'left'
      c.fillText('face 0.98', box.x + inset, box.y + inset * 0.7 - 6)
    }

    // 3 Mesh: triangles sweep down the face.
    const shown = Math.floor(mesh.triangles.length * on(2))
    if (shown) {
      const wire = new Path2D()
      for (let i = 0; i < shown; i++) {
        const [a, b, d] = mesh.triangles[i]
        const A = mesh.points[a], B = mesh.points[b], D = mesh.points[d]
        const pa = project(A.x, A.y, A.z), pb = project(B.x, B.y, B.z), pd = project(D.x, D.y, D.z)
        // Flat shading from the surface normal, lit from the upper left, so the head reads as a solid.
        const ux = B.x - A.x, uy = B.y - A.y, uz = B.z - A.z
        const vx = D.x - A.x, vy = D.y - A.y, vz = D.z - A.z
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
        const size = Math.hypot(nx, ny, nz) || 1
        const facing = nz < 0 ? -1 : 1
        const rx = (nx * cosY + nz * sinY) * facing
        const light = clamp(((-rx * 0.5 - ny * facing * 0.55) / size + Math.abs(nz) / size * 0.62))
        c.fillStyle = `rgba(${LIGHT},${0.02 + light * light * 0.3})`
        c.beginPath()
        c.moveTo(pa[0], pa[1])
        c.lineTo(pb[0], pb[1])
        c.lineTo(pd[0], pd[1])
        c.fill()
        wire.moveTo(pa[0], pa[1])
        wire.lineTo(pb[0], pb[1])
        wire.lineTo(pd[0], pd[1])
        wire.closePath()
      }
      c.strokeStyle = `rgba(${LIGHT},0.34)`
      c.lineWidth = 0.5
      c.stroke(wire)
    }
    const eyes = EYES.map((e, i) => project(e.x, e.y, mesh.eyeDepth[i]))
    if (on(2) > 0.7) {
      c.strokeStyle = `rgba(${PAPER},0.95)`
      c.lineWidth = 1
      for (const [x, y] of eyes) {
        c.beginPath()
        c.arc(x, y, scale * 0.05, 0, 6.283)
        c.stroke()
      }
    }

    // 4 Head pose: axes out of the bridge of the nose.
    const origin = project(0, -0.02, 0.72)
    if (on(3) > 0) {
      const axes: [number, number, number, string, string][] = [
        [0.5, 0, 0, '#e06c4f', 'x'],
        [0, 0.5, 0, '#7fb48a', 'y'],
        [0, 0, 0.62, '#7fa8dc', 'z'],
      ]
      c.lineWidth = 1.6
      c.font = '10px ui-monospace, Menlo, monospace'
      for (const [ax, ay, az, colour, name] of axes) {
        const [x, y] = project(ax * on(3), -0.02 + ay * on(3), 0.72 + az * on(3))
        c.strokeStyle = colour
        c.fillStyle = colour
        c.beginPath()
        c.moveTo(origin[0], origin[1])
        c.lineTo(x, y)
        c.stroke()
        c.fillText(name, x + 4, y + 3)
      }
    }

    // A point moving around the screen: what the person is looking at.
    const goal = {
      x: screen.x + screen.w * (0.5 + 0.34 * Math.sin(t * 0.7 + 1) * (still ? 0 : 1)) + (still ? screen.w * 0.18 : 0),
      y: screen.y + screen.h * (0.5 + 0.3 * Math.sin(t * 1.13) * (still ? 0 : 1)) - (still ? screen.h * 0.12 : 0),
    }

    if (on(4) > 0) {
      c.strokeStyle = `rgba(${LIGHT},${0.8 * on(4)})`
      c.lineWidth = 1.1
      c.strokeRect(screen.x, screen.y, screen.w, screen.h)
      c.fillStyle = `rgba(${PAPER},0.03)`
      c.fillRect(screen.x, screen.y, screen.w, screen.h)
      c.setLineDash([6, 5])
      c.lineDashOffset = still ? 0 : -t * 36
      c.strokeStyle = `rgba(${LIGHT},0.9)`
      for (const [x, y] of eyes) {
        c.beginPath()
        c.moveTo(x, y)
        c.lineTo(lerp(x, goal.x, on(4)), lerp(y, goal.y, on(4)))
        c.stroke()
      }
      c.setLineDash([])
    }

    // 6 Personal MLP: small network on the ray's path.
    if (on(5) > 0) {
      const layers = [3, 5, 5, 2]
      const nx = narrow ? w * 0.8 : w * 0.84
      const span = Math.min(w * 0.17, 120)
      const nodes = layers.map((count, l) =>
        Array.from({ length: count }, (_, i) => [nx + (l / 3 - 0.5) * span, h * (narrow ? 0.76 : 0.62) + (i - (count - 1) / 2) * Math.min(h * 0.05, 20)] as const),
      )
      c.lineWidth = 0.5
      c.strokeStyle = `rgba(${LIGHT},${0.4 * on(5)})`
      c.beginPath()
      for (let l = 0; l < 3; l++) for (const a of nodes[l]) for (const b of nodes[l + 1]) {
        c.moveTo(a[0], a[1])
        c.lineTo(b[0], b[1])
      }
      c.stroke()
      nodes.flat().forEach(([x, y], i) => {
        const pulse = still ? 0.8 : 0.45 + 0.55 * Math.max(Math.sin(t * 3 - i * 0.5), 0)
        c.fillStyle = `rgba(${LIGHT},${pulse * on(5)})`
        c.beginPath()
        c.arc(x, y, 2.6, 0, 6.283)
        c.fill()
      })
    }

    // 7 Filter: raw estimates scatter, the One Euro trail stays calm.
    const jitter = Math.min(screen.w, screen.h) * 0.05
    const sample: [number, number] = [goal.x + noise() * jitter, goal.y + noise() * jitter]
    const step = Math.max(dt, 1 / 60)
    const filtered: [number, number] = [fx(sample[0], step), fy(sample[1], step)]
    if (!still) {
      raw.push(sample)
      smooth.push(filtered)
      if (raw.length > 46) {
        raw.shift()
        smooth.shift()
      }
    }
    if (on(6) > 0) {
      c.fillStyle = `rgba(224,108,79,${0.75 * on(6)})`
      for (const [x, y] of raw) c.fillRect(x - 1, y - 1, 2, 2)
      c.strokeStyle = `rgba(${PAPER},${on(6)})`
      c.lineWidth = 1.5
      c.beginPath()
      smooth.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)))
      c.stroke()
    }

    // 8 Screen coordinates: the cursor, finally.
    if (on(7) > 0) {
      const [x, y] = still ? [goal.x, goal.y] : filtered
      c.fillStyle = `rgba(${PAPER},${on(7)})`
      c.strokeStyle = 'rgba(16,14,11,0.9)'
      c.lineWidth = 1
      c.beginPath()
      c.moveTo(x, y)
      c.lineTo(x, y + 17)
      c.lineTo(x + 4.4, y + 13)
      c.lineTo(x + 7.6, y + 19.5)
      c.lineTo(x + 10.2, y + 18.4)
      c.lineTo(x + 7, y + 12)
      c.lineTo(x + 12.4, y + 12)
      c.closePath()
      c.fill()
      c.stroke()
    }
  }
}

function projectScreen(w: number, h: number, narrow: boolean) {
  const width = narrow ? w * 0.34 : w * 0.3
  return { x: w - width - w * 0.04, y: h * 0.07, w: width, h: width * 0.64 }
}
