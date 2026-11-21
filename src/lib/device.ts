/** True when the device can comfortably run a WebGL scene: motion allowed, no data saver, more than one core, WebGL2. */
export function canRender3D(): boolean {
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return false
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } }
  if (nav.connection?.saveData) return false
  // iOS browsers (Safari, Brave, Chrome: all WebKit) report at most 2 cores to limit fingerprinting,
  // and Brave randomises the count, so only a genuine single-core device is treated as too weak.
  if ((nav.hardwareConcurrency ?? 4) < 2) return false
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}
