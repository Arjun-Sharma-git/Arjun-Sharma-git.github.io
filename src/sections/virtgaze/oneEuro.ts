/** One Euro filter (Casiez et al.): smooths hard when the signal is still, and lets go when it moves fast. */
export function oneEuro(minCutoff = 1.1, beta = 0.012, derivativeCutoff = 1) {
  const alpha = (cutoff: number, dt: number) => 1 / (1 + 1 / (2 * Math.PI * cutoff * dt))
  let value: number | null = null
  let speed = 0
  return (x: number, dt: number) => {
    if (value === null) return (value = x)
    const rate = (x - value) / dt
    const a = alpha(derivativeCutoff, dt)
    speed = a * rate + (1 - a) * speed
    const smooth = alpha(minCutoff + beta * Math.abs(speed), dt)
    return (value = smooth * x + (1 - smooth) * value)
  }
}
