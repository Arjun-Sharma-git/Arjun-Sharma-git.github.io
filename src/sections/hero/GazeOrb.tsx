/** Decorative concentric rings with a pupil that follows the pointer (see usePointerFollow). */
export function GazeOrb() {
  return (
    <div
      aria-hidden
      className="eye pointer-events-none absolute left-1/2 top-1/2 grid size-[min(90vw,620px)] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/20"
    >
      <div className="grid size-2/3 place-items-center rounded-full border border-gold/25">
        <div className="pupil size-1/4 rounded-full bg-[radial-gradient(circle,rgb(162_122_69/0.35),rgb(162_122_69/0.05)_70%)]" />
      </div>
    </div>
  )
}
