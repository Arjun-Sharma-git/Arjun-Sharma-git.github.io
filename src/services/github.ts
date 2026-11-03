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
  const res = await fetch(`${API}/users/${user}/repos?per_page=100&sort=pushed`)
  // shortcut: unauthenticated API (60 req/h per IP); returning [] keeps the build and page working when rate-limited
  if (!res.ok) return []
  return res.json()
}

/** Own repos only, newest first, without the profile README repo. */
export function selectShowcaseRepos(repos: Repo[], user: string, limit = 9): Repo[] {
  return repos.filter((r) => !r.fork && r.name !== user).slice(0, limit)
}
