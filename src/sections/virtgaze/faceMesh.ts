export type Point = { x: number; y: number; z: number }

function rng(seed: number) {
  return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32
}

/** Half width of the face at height y (-1 crown, 1 chin). */
const halfWidth = (y: number) => 0.74 * Math.pow(Math.max(1 - Math.pow(Math.abs(y), 2.5), 0), 0.55) * (y > 0 ? 1 - 0.3 * y : 1)

function depth(x: number, y: number) {
  const dome = 0.62 * Math.sqrt(Math.max(1 - (x / 0.82) ** 2 - (y / 1.08) ** 2, 0))
  const nose = 0.3 * Math.exp(-(x * x) / 0.011 - (y - 0.16) ** 2 / 0.05)
  const sockets = -0.08 * Math.exp(-((Math.abs(x) - 0.31) ** 2) / 0.02 - (y + 0.14) ** 2 / 0.01)
  const lips = 0.05 * Math.exp(-(x * x) / 0.05 - (y - 0.55) ** 2 / 0.008)
  return dome + nose + sockets + lips
}

export const EYES = [
  { x: -0.31, y: -0.14 },
  { x: 0.31, y: -0.14 },
]

function samples() {
  const random = rng(7)
  const pts: { x: number; y: number }[] = []
  const add = (x: number, y: number) => pts.push({ x, y })

  for (let y = -0.98; y <= 0.98; y += 0.05) {
    const w = halfWidth(y)
    add(-w, y)
    add(w, y)
  }
  let row = 0
  for (let y = -0.9; y < 0.95; y += 0.115, row++) {
    const w = halfWidth(y) * 0.92
    for (let x = -w + (row % 2) * 0.055; x < w; x += 0.115) add(x + (random() - 0.5) * 0.02, y + (random() - 0.5) * 0.02)
  }
  const ellipse = (cx: number, cy: number, rx: number, ry: number, n: number) => {
    for (let i = 0; i < n; i++) add(cx + Math.cos((i / n) * 6.283) * rx, cy + Math.sin((i / n) * 6.283) * ry)
  }
  for (const e of EYES) {
    ellipse(e.x, e.y, 0.16, 0.065, 14)
    ellipse(e.x, e.y, 0.055, 0.05, 8)
    for (let i = 0; i < 7; i++) add(e.x + (i / 6 - 0.5) * 0.36, e.y - 0.13 - Math.sin((i / 6) * 3.14) * 0.03)
  }
  ellipse(0, 0.55, 0.25, 0.075, 16)
  for (let y = -0.1; y < 0.3; y += 0.07) add(0, y)
  add(-0.09, 0.3)
  add(0.09, 0.3)
  return pts
}

/** Bowyer-Watson Delaunay triangulation, run once on a few hundred points. */
function triangulate(pts: { x: number; y: number }[]) {
  const all = [...pts, { x: -10, y: -10 }, { x: 10, y: -10 }, { x: 0, y: 10 }]
  const n = pts.length
  type Tri = [number, number, number]
  let tris: Tri[] = [[n, n + 1, n + 2]]
  const inCircle = ([a, b, c]: Tri, p: { x: number; y: number }) => {
    const ax = all[a].x - p.x, ay = all[a].y - p.y
    const bx = all[b].x - p.x, by = all[b].y - p.y
    const cx = all[c].x - p.x, cy = all[c].y - p.y
    const det = (ax * ax + ay * ay) * (bx * cy - cx * by) - (bx * bx + by * by) * (ax * cy - cx * ay) + (cx * cx + cy * cy) * (ax * by - bx * ay)
    const orient = (all[b].x - all[a].x) * (all[c].y - all[a].y) - (all[b].y - all[a].y) * (all[c].x - all[a].x)
    return orient > 0 ? det > 0 : det < 0
  }
  for (let i = 0; i < n; i++) {
    const bad = tris.filter((t) => inCircle(t, all[i]))
    const edges = new Map<string, [number, number]>()
    for (const t of bad) {
      for (const [u, v] of [[t[0], t[1]], [t[1], t[2]], [t[2], t[0]]]) {
        const key = u < v ? `${u}:${v}` : `${v}:${u}`
        if (edges.has(key)) edges.delete(key)
        else edges.set(key, [u, v])
      }
    }
    tris = tris.filter((t) => !bad.includes(t))
    for (const [u, v] of edges.values()) tris.push([u, v, i])
  }
  return tris.filter((t) => t.every((v) => v < n))
}

export function buildFaceMesh() {
  const flat = samples()
  const points: Point[] = flat.map((p) => ({ ...p, z: depth(p.x, p.y) }))
  const triangles = triangulate(flat)
    .filter(([a, b, c]) => {
      const cy = (flat[a].y + flat[b].y + flat[c].y) / 3
      const cx = (flat[a].x + flat[b].x + flat[c].x) / 3
      return Math.abs(cx) < halfWidth(cy) * 1.01
    })
    .sort((p, q) => flat[p[0]].y + flat[p[1]].y + flat[p[2]].y - flat[q[0]].y - flat[q[1]].y - flat[q[2]].y)
  return { points, triangles, eyeDepth: EYES.map((e) => depth(e.x, e.y) + 0.02) }
}
