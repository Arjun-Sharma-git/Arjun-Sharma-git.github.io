import { profile } from '~/content'

export function Footer() {
  return (
    <footer className="relative mt-8 flex flex-col items-center justify-between gap-2 border-t border-paper/10 pt-4 text-xs sm:mt-12 text-paper/50 sm:flex-row">
      <span>
        © {new Date().getFullYear()} {profile.name}
      </span>
      <span>{profile.tagline}</span>
    </footer>
  )
}
