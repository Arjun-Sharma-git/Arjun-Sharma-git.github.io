import { profile } from '~/content'

export function Footer() {
  return (
    <footer className="relative mt-24 flex flex-col items-center justify-between gap-2 border-t border-paper/10 pt-6 text-xs text-paper/50 sm:flex-row">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span>{profile.tagline}</span>
    </footer>
  )
}
