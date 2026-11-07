/**
 * Point targets the hero cloud morphs between: a hand and a brain, built from simple solids so they stay
 * tiny (no model files). Both are roughly unit sized and centred, like the eye they morph from.
 */

type Vec = [number, number, number]
type Sampler = () => Vec
type Part = { weight: number; sample: Sampler }

const rand = (a: number, b: number) => a + Math.random() * (b - a)

/** Uniform-ish point on an ellipsoid surface. */
const ellipsoid = (c: Vec, r: Vec): Sampler => () => {
  const u = rand(-1, 1)
  const a = rand(0, Math.PI * 2)
  const s = Math.sqrt(1 - u * u)
  return [c[0] + r[0] * s * Math.cos(a), c[1] + r[1] * u, c[2] + r[2] * s * Math.sin(a)]
}

/** Point on a capsule (cylinder with rounded ends) from a to b. */
const capsule = (a: Vec, b: Vec, r: number): Sampler => {
  const s = capsuleT(a, b, r)
  return () => s()[0]
}

/** Like capsule, but also returns how far along a → b the point is (0..1). */
const capsuleT = (a: Vec, b: Vec, r: number): (() => [Vec, number]) => {
  const d: Vec = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const len = Math.hypot(...d)
  const ax: Vec = [d[0] / len, d[1] / len, d[2] / len]
  // Any two unit vectors perpendicular to the axis.
  const helper: Vec = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
  const n1 = norm(cross(ax, helper))
  const n2 = cross(ax, n1)
  return () => {
    const t = rand(-r / len, 1 + r / len)
    const over = t < 0 ? -t * len : t > 1 ? (t - 1) * len : 0
    const rr = Math.sqrt(Math.max(r * r - over * over, 0))
    const tc = Math.min(Math.max(t, 0), 1)
    const ang = rand(0, Math.PI * 2)
    const k = t < 0 ? -over : t > 1 ? over : 0
    const p = [0, 1, 2].map(
      (i) => a[i] + d[i] * tc + ax[i] * k + rr * (Math.cos(ang) * n1[i] + Math.sin(ang) * n2[i]),
    ) as Vec
    return [p, tc]
  }
}

const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (v: Vec): Vec => {
  const l = Math.hypot(...v)
  return [v[0] / l, v[1] / l, v[2] / l]
}

function build(count: number, parts: Part[], post: (p: Vec) => Vec = (p) => p) {
  const total = parts.reduce((s, p) => s + p.weight, 0)
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    let pick = Math.random() * total
    const part = parts.find((p) => (pick -= p.weight) <= 0) ?? parts[parts.length - 1]
    out.set(post(part.sample()), i * 3)
  }
  return out
}

type Finger = { a: Vec; b: Vec; r: number; weight: number; phase: number }

/**
 * An open hand, palm facing the viewer. Besides positions it returns, per point, the knuckle the point
 * bends around (y, z), the finger's phase, and how much it bends (0 on the palm, rising to 1 at the tip),
 * so the shader can flex the fingers.
 */
export function handPoints(count: number) {
  const fingers: Finger[] = [
    { a: [-0.3, 0.12, 0.02], b: [-0.4, 0.76, 0.04], r: 0.085, weight: 9, phase: 0 },
    { a: [-0.1, 0.16, 0.02], b: [-0.11, 0.88, 0.04], r: 0.09, weight: 10, phase: 0.6 },
    { a: [0.1, 0.14, 0.02], b: [0.17, 0.8, 0.04], r: 0.085, weight: 9, phase: 1.2 },
    { a: [0.3, 0.06, 0.02], b: [0.45, 0.6, 0.04], r: 0.075, weight: 7, phase: 1.8 },
  ]
  const thumb: Finger = { a: [-0.36, -0.3, 0.06], b: [-0.74, 0.1, 0.12], r: 0.1, weight: 9, phase: 2.6 }
  const palm = ellipsoid([0, -0.22, 0], [0.42, 0.42, 0.13])
  const wrist = capsule([0, -0.62, 0], [0, -0.98, 0], 0.22)
  const parts = [
    { weight: 30, sample: (): [Vec, Finger | null, number] => [palm(), null, 0] },
    { weight: 10, sample: (): [Vec, Finger | null, number] => [wrist(), null, 0] },
    ...[...fingers, thumb].map((f) => {
      const s = capsuleT(f.a, f.b, f.r)
      return { weight: f.weight, sample: (): [Vec, Finger | null, number] => { const [p, t] = s(); return [p, f, t] } }
    }),
  ]
  const total = parts.reduce((n, p) => n + p.weight, 0)
  // Nudged forward so the flat hand isn't depth-faded.
  const place = ([x, y, z]: Vec): Vec => [x * 1.05, (y + 0.04) * 1.05, z + 0.35]
  const pos = new Float32Array(count * 3)
  const bend = new Float32Array(count * 4)
  for (let i = 0; i < count; i++) {
    let pick = Math.random() * total
    const part = parts.find((p) => (pick -= p.weight) <= 0) ?? parts[parts.length - 1]
    const [p, f, t] = part.sample()
    pos.set(place(p), i * 3)
    if (f) {
      const k = place(f.a)
      bend.set([k[1], k[2], f.phase, f === thumb ? t * 0.5 : t], i * 4)
    }
  }
  return { pos, bend }
}

/** Wavy folds, a stand-in for gyri: cheap periodic noise along the surface. */
const folds = (x: number, y: number, z: number) =>
  Math.sin(9 * x + 2 * Math.sin(7 * y)) * Math.sin(8 * y + 2 * Math.sin(6 * z)) * Math.sin(7 * z + 2 * Math.sin(8 * x))

/** A brain in three-quarter side view: folded cerebrum with a midline split, cerebellum and stem. */
export function brainPoints(count: number) {
  const cerebrum = ellipsoid([0, 0.1, 0], [1, 0.7, 0.8])
  const turn = -0.45 // radians around y, to show both the profile and the split between hemispheres
  const cos = Math.cos(turn)
  const sin = Math.sin(turn)
  return build(
    count,
    [
      {
        weight: 76,
        sample: () => {
          let [x, y, z] = cerebrum()
          if (y < -0.2) y = -0.2 + (y + 0.2) * 0.5 // flatter underside
          const f = 1 + 0.11 * folds(x * 1.3, y * 1.3, z * 1.3)
          x *= f
          y *= f
          z *= f
          if (Math.abs(z) < 0.12 && y > 0) z += Math.sign(z || 1) * 0.07 // longitudinal fissure
          if (Math.abs(y - (0.32 * x - 0.08)) < 0.05 && x < 0.4) {
            x *= 0.94 // lateral fissure
            z *= 0.94
          }
          return [x, y, z]
        },
      },
      { weight: 16, sample: ellipsoid([0.6, -0.42, 0], [0.38, 0.24, 0.5]) },
      { weight: 8, sample: capsule([0.32, -0.4, 0], [0.26, -0.95, 0], 0.12) },
    ],
    ([x, y, z]) => [(x * cos + z * sin) * 0.85, (y + 0.12) * 0.85, (-x * sin + z * cos) * 0.85],
  )
}
