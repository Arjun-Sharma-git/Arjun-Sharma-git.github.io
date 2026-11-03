import { Link } from '@tanstack/react-router'

export function NotFound() {
  return (
    <main id="main" className="grid min-h-svh place-items-center px-4 text-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold-deep">404</p>
        <h1 className="mt-4 font-serif text-[clamp(2.6rem,8vw,5.5rem)] leading-[1] tracking-tight">
          Nothing to see <em className="text-gold">here.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-muted">This page doesn't exist, or it moved.</p>
        <Link to="/" className="mt-10 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper">
          Back home
        </Link>
      </div>
    </main>
  )
}
