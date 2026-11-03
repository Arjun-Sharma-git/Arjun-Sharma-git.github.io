import * as THREE from 'three'

type Options = { points: number }

const vertex = /* glsl */ `
  uniform float uSize;
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  varying float vAlpha;
  void main() {
    vec3 p = position * (1.0 + 0.015 * sin(uTime * 1.5 + position.y * 6.0));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aScale * uPixelRatio / -mv.z;
    // Points on the far side of the sphere fade out, giving depth on a light background.
    vAlpha = smoothstep(-7.4, -4.9, mv.z);
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
  return new THREE.Points(geo, material)
}

/** A point-cloud eyeball that looks toward the pointer. Returns a dispose function. */
export function createGazeScene(canvas: HTMLCanvasElement, { points }: Options) {
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

  const start = performance.now()
  let raf = 0
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick)
    if (!visible) return
    const t = (now - start) / 1000
    const idle = now - lastMove > 2500
    const tx = idle ? Math.sin(t * 0.4) * 0.35 : target.x
    const ty = idle ? Math.sin(t * 0.27) * 0.2 : target.y
    eye.rotation.y += (tx * 0.6 - eye.rotation.y) * 0.06
    eye.rotation.x += (ty * 0.45 - eye.rotation.x) * 0.06
    iris.rotation.z = t * 0.05
    // Intro: ease the eye in over ~1.6s, and dilate the pupil gently.
    const intro = 1 - Math.pow(1 - Math.min(t / 1.6, 1), 3)
    eye.scale.setScalar(Math.min(1, camera.aspect) * 1.35 * (0.6 + 0.4 * intro))
    pupil.scale.setScalar(1 + 0.08 * Math.sin(t * 0.8))
    for (const m of [shellMat, irisMat]) {
      m.uniforms.uTime.value = t
      m.uniforms.uOpacity.value = (m === shellMat ? SHELL_OPACITY : IRIS_OPACITY) * intro
    }
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(tick)

  return () => {
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
}
