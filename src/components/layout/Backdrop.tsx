/** Fixed page backdrop: slow-drifting warm light and a fine paper grain. Pure CSS, no JS. */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="backdrop">
      <div className="backdrop-glow backdrop-glow-a" />
      <div className="backdrop-glow backdrop-glow-b" />
      <div className="backdrop-glow backdrop-glow-c" />
      <div className="backdrop-grain" />
    </div>
  )
}
