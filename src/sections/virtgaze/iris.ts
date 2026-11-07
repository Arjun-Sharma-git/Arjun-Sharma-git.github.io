import { type Frame, clamp, lerp } from '~/lib/canvas'

const GOLD = '162,122,69'
const LIGHT = '226,190,134'

function rng(seed: number) {
  return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32
}

/** Painted once per size: radial fibres, collarette and limbal ring, so each frame is a single drawImage. */
function paintIris(radius: number) {
  const scale = innerWidth < 768 ? 1.5 : 2
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = Math.ceil(radius * 2 * scale)
  const c = canvas.getContext('2d')!
  c.scale(scale, scale)
  c.translate(radius, radius)
  const random = rng(16)

  const base = c.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius)
  base.addColorStop(0, '#3a2410')
  base.addColorStop(0.32, '#9a6a2c')
  base.addColorStop(0.58, '#c79a55')
  base.addColorStop(0.82, '#7c5728')
  base.addColorStop(1, '#22160a')
  c.fillStyle = base
  c.beginPath()
  c.arc(0, 0, radius, 0, Math.PI * 2)
  c.fill()

  for (let i = 0, count = innerWidth < 768 ? 800 : 1500; i < count; i++) {
    const a = random() * Math.PI * 2
    const r0 = radius * (0.26 + random() * 0.16)
    const r1 = radius * (0.6 + random() * 0.38)
    const bend = (random() - 0.5) * 0.09
    c.strokeStyle = random() > 0.45 ? `rgba(${LIGHT},${0.08 + random() * 0.26})` : `rgba(30,18,6,${0.1 + random() * 0.3})`
    c.lineWidth = 0.4 + random() * 1.1
    c.beginPath()
    c.moveTo(Math.cos(a) * r0, Math.sin(a) * r0)
    c.quadraticCurveTo(Math.cos(a + bend) * (r0 + r1) * 0.5, Math.sin(a + bend) * (r0 + r1) * 0.5, Math.cos(a) * r1, Math.sin(a) * r1)
    c.stroke()
  }

  c.strokeStyle = `rgba(${LIGHT},0.55)`
  c.lineWidth = 1
  c.beginPath()
  for (let i = 0; i <= 72; i++) {
    const a = (i / 72) * Math.PI * 2
    const r = radius * (0.42 + (i % 2 ? 0.035 : -0.012) + random() * 0.02)
    c.lineTo(Math.cos(a) * r, Math.sin(a) * r)
  }
  c.closePath()
  c.stroke()

  const limbus = c.createRadialGradient(0, 0, radius * 0.84, 0, 0, radius)
  limbus.addColorStop(0, 'rgba(10,6,2,0)')
  limbus.addColorStop(1, 'rgba(10,6,2,0.92)')
  c.fillStyle = limbus
  c.beginPath()
  c.arc(0, 0, radius, 0, Math.PI * 2)
  c.fill()
  return canvas
}

function lidPoint(u: number, open: number, W: number, H: number, upper: boolean) {
  // u in 0..1 from the inner to the outer corner; the sine gives the almond its curve.
  const x = lerp(-W, W, u)
  const curve = Math.pow(Math.sin(u * Math.PI), 0.82)
  return [x, (upper ? -H : H * 0.72) * curve * open] as const
}

export type EyeState = { pointer: { x: number; y: number; at: number } | null }

export function createEye() {
  let image: HTMLCanvasElement | null = null
  let imageRadius = 0
  const gaze = { x: 0, y: 0 } // Where the ray lands, smoothed.
  const idle = { x: 0, y: 0, next: 0 }
  let nextBlink = 3.5
  let blinkAt = -10
  const random = rng(4)

  return function draw({ ctx: c, w, h, t, dt, still }: Frame, state: EyeState) {
    const wide = w >= 1024
    const cx = wide ? w * 0.685 : w * 0.5
    const cy = wide ? h * 0.47 : h * 0.235
    const R = wide ? Math.min(h * 0.235, w * 0.125) : Math.min(w * 0.215, h * 0.11)
    const W = R * 2.3
    const H = R * 1.38
    if (!image || imageRadius !== R) {
      image = paintIris(R)
      imageRadius = R
    }

    // Follow the pointer; otherwise make small saccades between fixations, as a resting eye does.
    const live = state.pointer && t - state.pointer.at < 3
    if (t > idle.next) {
      idle.x = cx + (random() - 0.5) * W * 2.4
      idle.y = cy + (random() - 0.35) * H * 2.6
      idle.next = t + 0.9 + random() * 1.8
    }
    const target = still ? { x: cx - W * 0.95, y: cy + H * 1.1 } : live ? state.pointer! : idle
    const ease = still ? 1 : 1 - Math.pow(0.0009, dt)
    gaze.x = lerp(gaze.x || cx, target.x, ease)
    gaze.y = lerp(gaze.y || cy, target.y, ease)

    const dx = gaze.x - cx
    const dy = gaze.y - cy
    const dist = Math.hypot(dx, dy) || 1
    const reach = Math.min(dist / (W * 1.5), 1)
    const ox = (dx / dist) * reach * R * 0.72
    const oy = (dy / dist) * reach * R * 0.42

    if (!still && t > nextBlink) {
      blinkAt = t
      nextBlink = t + 3.6 + random() * 4
    }
    const blink = clamp(1 - Math.abs((t - blinkAt) / 0.09 - 1))
    const open = (still ? 1 : clamp(t / 1.5) ** 2) * (1 - blink * 0.94)
    const upper = (u: number) => lidPoint(u, open, W, H, true)
    const lower = (u: number) => lidPoint(u, open, W, H, false)

    c.save()
    c.translate(cx, cy)

    // Faint rings and triangulated skin around the eye: the polygon mesh a tracker actually sees.
    const glow = c.createRadialGradient(0, 0, R * 0.4, 0, 0, W * 1.5)
    glow.addColorStop(0, `rgba(${GOLD},0.2)`)
    glow.addColorStop(1, `rgba(${GOLD},0)`)
    c.fillStyle = glow
    c.fillRect(-W * 1.6, -W * 1.6, W * 3.2, W * 3.2)

    const steps = 16
    const ring = (u: number, up: boolean, k: number) => {
      const [x, y] = lidPoint(u, 1, W, H, up)
      return [x * k, y * k + (up ? -R * 0.32 : R * 0.26) * (k - 1) * 3] as const
    }
    c.lineWidth = 0.6
    c.strokeStyle = `rgba(${LIGHT},0.17)`
    c.beginPath()
    for (const up of [true, false]) {
      for (let i = 0; i <= steps; i++) {
        const u = i / steps
        const inner = up ? upper(u) : lower(u)
        const a = ring(u, up, 1.28)
        const b = ring(Math.min(u + 1 / steps, 1), up, 1.28)
        const far = ring(u, up, 1.62)
        const farB = ring(Math.min(u + 1 / steps, 1), up, 1.62)
        c.moveTo(inner[0], inner[1])
        c.lineTo(a[0], a[1])
        c.lineTo(b[0], b[1])
        c.moveTo(inner[0], inner[1])
        c.lineTo(b[0], b[1])
        c.moveTo(a[0], a[1])
        c.lineTo(far[0], far[1])
        c.lineTo(farB[0], farB[1])
        c.moveTo(a[0], a[1])
        c.lineTo(farB[0], farB[1])
      }
    }
    c.stroke()

    // The eye itself, clipped to the lids.
    const almond = new Path2D()
    for (let i = 0; i <= 40; i++) {
      const [x, y] = upper(i / 40)
      if (i) almond.lineTo(x, y)
      else almond.moveTo(x, y)
    }
    for (let i = 40; i >= 0; i--) {
      const [x, y] = lower(i / 40)
      almond.lineTo(x, y)
    }
    almond.closePath()

    c.save()
    c.clip(almond)
    const sclera = c.createRadialGradient(0, 0, R * 0.5, 0, 0, W)
    sclera.addColorStop(0, '#e9e0cf')
    sclera.addColorStop(0.7, '#a89a84')
    sclera.addColorStop(1, '#4a4134')
    c.fillStyle = sclera
    c.fillRect(-W, -H, W * 2, H * 2)

    c.drawImage(image, ox - R, oy - R, R * 2, R * 2)
    const pupil = R * (0.3 + 0.04 * Math.sin(t * 0.9) - reach * 0.03)
    c.fillStyle = '#060402'
    c.beginPath()
    c.arc(ox, oy, pupil, 0, Math.PI * 2)
    c.fill()
    c.fillStyle = 'rgba(255,250,240,0.85)'
    c.beginPath()
    c.ellipse(ox - R * 0.3, oy - R * 0.34, R * 0.11, R * 0.07, -0.5, 0, Math.PI * 2)
    c.fill()

    const shade = c.createLinearGradient(0, -H, 0, H * 0.2)
    shade.addColorStop(0, 'rgba(6,4,2,0.75)')
    shade.addColorStop(1, 'rgba(6,4,2,0)')
    c.fillStyle = shade
    c.fillRect(-W, -H, W * 2, H * 1.2)
    c.restore()

    c.strokeStyle = `rgba(${LIGHT},0.8)`
    c.lineWidth = 1.2
    c.stroke(almond)

    // Lid landmarks.
    c.fillStyle = `rgb(${LIGHT})`
    for (const up of [true, false]) {
      for (let i = 0; i <= steps; i += 2) {
        const [x, y] = up ? upper(i / steps) : lower(i / steps)
        c.fillRect(x - 1.5, y - 1.5, 3, 3)
      }
    }

    if (open > 0.45) {
      // Iris contour as a tracker fits it: a polygon, four cardinal landmarks and a centre.
      c.strokeStyle = 'rgba(251,248,242,0.75)'
      c.lineWidth = 0.9
      c.beginPath()
      for (let i = 0; i <= 12; i++) {
        const a = (i / 12) * Math.PI * 2
        c.lineTo(ox + Math.cos(a) * R * 1.02, oy + Math.sin(a) * R * 1.02)
      }
      c.stroke()
      c.fillStyle = '#fbf8f2'
      for (const [px, py] of [[R, 0], [-R, 0], [0, R], [0, -R], [0, 0]]) {
        c.beginPath()
        c.arc(ox + px * 1.02, oy + py * 1.02, 2.2, 0, Math.PI * 2)
        c.fill()
      }
    }
    c.restore()

    if (open > 0.45) {
      // The gaze ray, from pupil to where it lands.
      const sx = cx + ox
      const sy = cy + oy
      const ray = c.createLinearGradient(sx, sy, gaze.x, gaze.y)
      ray.addColorStop(0, 'rgba(226,190,134,0.95)')
      ray.addColorStop(1, 'rgba(226,190,134,0.2)')
      c.strokeStyle = ray
      c.lineWidth = 1
      c.setLineDash([7, 5])
      c.lineDashOffset = still ? 0 : -t * 42
      c.beginPath()
      c.moveTo(sx, sy)
      c.lineTo(gaze.x, gaze.y)
      c.stroke()
      c.setLineDash([])

      c.strokeStyle = `rgb(${LIGHT})`
      c.beginPath()
      c.arc(gaze.x, gaze.y, 13, 0, Math.PI * 2)
      for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        c.moveTo(gaze.x + ax * 8, gaze.y + ay * 8)
        c.lineTo(gaze.x + ax * 19, gaze.y + ay * 19)
      }
      c.stroke()

      const yaw = (dx / W) * 22
      const pitch = (-dy / H) * 14
      const label = (n: number) => `${n < 0 ? '-' : '+'}${Math.abs(n).toFixed(1).padStart(4, '0')}°`
      c.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
      c.fillStyle = `rgba(${LIGHT},0.85)`
      const right = gaze.x < w - 130
      c.textAlign = right ? 'left' : 'right'
      const lx = gaze.x + (right ? 26 : -26)
      c.fillText(`yaw   ${label(yaw)}`, lx, gaze.y - 4)
      c.fillText(`pitch ${label(pitch)}`, lx, gaze.y + 11)
    }
  }
}
