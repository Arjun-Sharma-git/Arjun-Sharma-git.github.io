/** True when the device can comfortably run a WebGL scene: motion allowed, no data saver, 4+ cores, WebGL2. */
export function canRender3D(): boolean {
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return false
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return false
  if ((nav.hardwareConcurrency ?? 4) < 4) return false
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}
