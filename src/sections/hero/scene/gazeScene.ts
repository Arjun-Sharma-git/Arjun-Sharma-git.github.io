import * as THREE from 'three'
import { brainPoints, handPoints } from './shapes'

type Options = { points: number }

export type GazeScene = {
  /** 0 = resting eye, 1 = camera has flown through the opened iris. Driven by scroll. */
  setProgress: (p: number) => void
  dispose: () => void
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

const vertex = /* glsl */ `
  uniform float uSize;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform vec3 uMorph; // weights of eye, hand, brain; they sum to 1
  uniform float uScatter; // peaks mid-morph so points burst outward and settle into the next shape
  attribute float aScale;
  attribute vec3 aHand;
  attribute vec3 aBrain;
  attribute vec4 aBend; // knuckle y, knuckle z, phase, bend amount (0 palm .. 1 fingertip)
  varying float vAlpha;
  void main() {
    // Fingers curl toward the viewer around their knuckles, one after another.
    vec3 h = aHand;
    float ang = aBend.w * 0.95 * (0.5 + 0.5 * sin(uTime * 2.0 - aBend.z));
    vec2 d = h.yz - aBend.xy;
    h.yz = aBend.xy + vec2(d.x * cos(ang) - d.y * sin(ang), d.x * sin(ang) + d.y * cos(ang));
    vec3 p = position * uMorph.x + h * uMorph.y + aBrain * uMorph.z;
    p += normalize(position + vec3(0.0001)) * uScatter * 0.35 * aScale;
    p *= 1.0 + 0.015 * sin(uTime * 1.5 + p.y * 6.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(uSize * aScale * uPixelRatio / -mv.z, 48.0 * uPixelRatio);
    // Points on the far side of the sphere fade out, giving depth on a light background.
    // Points that fly past the camera during the scroll zoom fade out instead of filling the screen.
    vAlpha = smoothstep(-7.4, -4.9, mv.z) * (1.0 - smoothstep(-1.4, -0.3, mv.z));
  }
`

const fragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.1, d) * vAlpha * uOpacity);
  }
`

function pointsMaterial(color: string, size: number, opacity: number) {
  return new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uSize: { value: size },
      uOpacity: { value: opacity },
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uMorph: { value: new THREE.Vector3(1, 0, 0) },
      uScatter: { value: 0 },
    },
  })
}

/** Even points over a unit sphere (Fibonacci lattice). */
function spherePoints(count: number) {
  const pos = new Float32Array(count * 3)
  const scale = new Float32Array(count)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    pos.set([Math.cos(i * golden) * r, y, Math.sin(i * golden) * r], i * 3)
    scale[i] = 0.6 + Math.random() * 0.8
  }
  return { pos, scale }
}

/** Radial iris fibres on the front of the sphere, between pupil and limbus. */
function irisPoints(count: number) {
  const pos = new Float32Array(count * 3)
  const scale = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2
    const r = 0.2 + Math.pow(Math.random(), 0.7) * 0.32
    pos.set([Math.cos(a) * r, Math.sin(a) * r, Math.sqrt(1 - r * r) + 0.01], i * 3)
    scale[i] = 0.5 + Math.random() * 0.9
  }
  return { pos, scale }
}

function pointCloud({ pos, scale }: { pos: Float32Array; scale: Float32Array }, material: THREE.ShaderMaterial) {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
  const count = scale.length
  const hand = handPoints(count)
  geo.setAttribute('aHand', new THREE.BufferAttribute(hand.pos, 3))
  geo.setAttribute('aBend', new THREE.BufferAttribute(hand.bend, 4))
  geo.setAttribute('aBrain', new THREE.BufferAttribute(brainPoints(count), 3))
  return new THREE.Points(geo, material)
}

// Morph cycle: hold each shape, then flow into the next (eye → hand → brain → eye).
const HOLD = 3.6
const MORPH = 1.8

/** Weights of [eye, hand, brain] at time t, plus how far mid-morph we are (0..1, peaking halfway). */
function cycle(t: number): { w: [number, number, number]; scatter: number } {
  const seg = HOLD + MORPH
  const from = Math.floor(t / seg) % 3
  const local = t % seg
  const m = smoothstep(HOLD, seg, local)
  const w: [number, number, number] = [0, 0, 0]
  w[from] += 1 - m
  w[(from + 1) % 3] += m
  return { w, scatter: Math.sin(Math.PI * m) }
}

/**
 * A point cloud that looks toward the pointer and cycles eye → hand → brain while resting,
 * and returns to the eye and zooms through its iris as `progress` goes 0 → 1.
 */
export function createGazeScene(canvas: HTMLCanvasElement, { points }: Options): GazeScene {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' })
  const pixelRatio = Math.min(devicePixelRatio, 2)
  renderer.setPixelRatio(pixelRatio)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.z = 6

  const eye = new THREE.Group()
  scene.add(eye)

  // Kept faint so the headline in front stays readable.
  const SHELL_OPACITY = 0.32
  const IRIS_OPACITY = 0.5
  const shellMat = pointsMaterial('#a27a45', 15, SHELL_OPACITY)
  const irisMat = pointsMaterial('#a27a45', 17, IRIS_OPACITY)
  const shell = pointCloud(spherePoints(points), shellMat)
  const iris = pointCloud(irisPoints(Math.round(points / 4)), irisMat)
  const pupilGeo = new THREE.CircleGeometry(0.19, 48)
  const pupilMat = new THREE.MeshBasicMaterial({ color: '#7d5a2c', transparent: true, opacity: 0.16 })
  const pupil = new THREE.Mesh(pupilGeo, pupilMat)
  pupil.position.z = 0.985
  eye.add(shell, iris, pupil)
  for (const m of [shellMat, irisMat]) m.uniforms.uPixelRatio.value = pixelRatio

  // Pointer in [-1, 1]; touch devices without a pointer get an idle sway instead.
  const target = { x: 0, y: 0 }
  let lastMove = -Infinity
  const onMove = (e: PointerEvent) => {
    target.x = (e.clientX / innerWidth) * 2 - 1
    target.y = (e.clientY / innerHeight) * 2 - 1
    lastMove = performance.now()
  }
  addEventListener('pointermove', onMove, { passive: true })

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // Keep the eye roughly 70% of the shorter side.
    const fit = Math.min(1, camera.aspect) * 1.35
    eye.scale.setScalar(fit)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // Only render while the canvas is on screen.
  let visible = true
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
  io.observe(canvas)

  let progress = 0
  const start = performance.now()
  let raf = 0
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick)
    if (!visible) return
    const t = (now - start) / 1000
    const idle = now - lastMove > 2500
    // Shape cycle, starting after the intro; scrolling pulls it back to the eye for the fly-through.
    const { w, scatter } = cycle(Math.max(t - 2, 0))
    const toEye = smoothstep(0, 0.12, progress)
    const morph = [w[0] + (1 - w[0]) * toEye, w[1] * (1 - toEye), w[2] * (1 - toEye)] as const
    const handW = morph[1]
    const tx = idle ? Math.sin(t * 0.4) * 0.35 : target.x
    const ty = idle ? Math.sin(t * 0.27) * 0.2 : target.y
    // As the zoom starts the eye stops following the pointer and looks straight at the viewer.
    const look = 1 - smoothstep(0, 0.35, progress)
    // The hand turns its palm further toward the pointer than the eye does.
    const turn = 1 + 0.6 * handW
    eye.rotation.y += (tx * 0.6 * turn * look - eye.rotation.y) * 0.08
    eye.rotation.x += (ty * 0.45 * turn * look - eye.rotation.x) * 0.08
    for (const m of [shellMat, irisMat]) {
      m.uniforms.uMorph.value.set(...morph)
      m.uniforms.uScatter.value = scatter * (1 - toEye)
    }
    iris.rotation.z = (t * 0.05 + progress * 1.5) * morph[0]
    // Intro: ease the eye in over ~1.6s.
    const intro = 1 - Math.pow(1 - Math.min(t / 1.6, 1), 3)
    eye.scale.setScalar(Math.min(1, camera.aspect) * 1.35 * (0.6 + 0.4 * intro))

    // Scroll: dolly the camera into the eye while the iris opens outward and the pupil dilates.
    camera.position.z = 6 - 4.4 * smoothstep(0, 1, progress)
    iris.scale.setScalar(1 + 2.5 * smoothstep(0.2, 1, progress))
    pupil.scale.setScalar((1 + 0.08 * Math.sin(t * 0.8)) * (1 + 5 * smoothstep(0.1, 0.9, progress)))
    pupilMat.opacity = 0.16 * (1 - smoothstep(0.15, 0.55, progress)) * smoothstep(0.6, 1, morph[0])
    const shellFade = 1 - smoothstep(0.55, 0.95, progress)
    const irisFade = 1 - smoothstep(0.7, 1, progress)
    // The brain spreads the same points over more surface, so it gets bigger, stronger dots.
    const dense = 1 + 0.9 * morph[2]
    shellMat.uniforms.uOpacity.value = SHELL_OPACITY * intro * shellFade * dense
    irisMat.uniforms.uOpacity.value = IRIS_OPACITY * intro * irisFade * dense
    shellMat.uniforms.uSize.value = 15 * (1 + 0.3 * morph[2])
    irisMat.uniforms.uSize.value = 17 * (1 + 0.3 * morph[2])
    for (const m of [shellMat, irisMat]) m.uniforms.uTime.value = t
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(tick)

  const dispose = () => {
    cancelAnimationFrame(raf)
    removeEventListener('pointermove', onMove)
    ro.disconnect()
    io.disconnect()
    for (const o of [shell, iris]) o.geometry.dispose()
    pupilGeo.dispose()
    shellMat.dispose()
    irisMat.dispose()
    pupilMat.dispose()
    renderer.dispose()
  }

  return {
    setProgress: (p) => {
      progress = Math.min(Math.max(p, 0), 1)
    },
    dispose,
  }
}
