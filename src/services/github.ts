export type Repo = {
  name: string
  description: string | null
  language: string | null
  html_url: string
  homepage: string | null
  pushed_at: string
  fork: boolean
}

const API = 'https://api.github.com'

export async function fetchUserRepos(user: string): Promise<Repo[]> {
  // Token only exists in CI builds (server side); the SSR check keeps it out of the client bundle.
  const token = import.meta.env.SSR ? process.env.GITHUB_TOKEN : undefined
  const res = await fetch(`${API}/users/${user}/repos?per_page=100&sort=pushed`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  // shortcut: unauthenticated API (60 req/h per IP); returning [] keeps the build and page working when rate-limited
  if (!res.ok) return []
  return res.json()
}

type ShowcaseOptions = { user: string; hidden?: string[]; descriptions?: Record<string, string>; pinned?: string[]; limit?: number }

/** Own, described repos only (newest first); skips forks, the profile README repo and anything in `hidden`. `descriptions` fills in repos with none on GitHub; `pinned` repos come first, in that order. */
export function selectShowcaseRepos(repos: Repo[], { user, hidden = [], descriptions = {}, pinned = [], limit = 9 }: ShowcaseOptions): Repo[] {
  const order = pinned.map((n) => n.toLowerCase())
  const rank = (name: string) => {
    const i = order.indexOf(name.toLowerCase())
    return i === -1 ? order.length : i
  }
  const skip = new Set([user, ...hidden].map((n) => n.toLowerCase()))
  return repos
    .map((r) => ({ ...r, description: r.description?.trim() || descriptions[r.name] || null }))
    .filter((r) => !r.fork && r.description && !skip.has(r.name.toLowerCase()))
    .sort((a, b) => rank(a.name) - rank(b.name)) // stable, so the rest stay newest first
    .slice(0, limit)
}
