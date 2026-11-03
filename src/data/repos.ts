import { queryOptions } from '@tanstack/react-query'
import { profile } from './profile'

export type Repo = {
  name: string
  description: string | null
  language: string | null
  html_url: string
  homepage: string | null
  pushed_at: string
  fork: boolean
}

export const reposQuery = queryOptions({
  queryKey: ['github-repos', profile.githubUser],
  queryFn: async (): Promise<Repo[]> => {
    const res = await fetch(`https://api.github.com/users/${profile.githubUser}/repos?per_page=100&sort=pushed`)
    // shortcut: unauthenticated GitHub API (60 req/h per IP); returning [] keeps the build and page working when rate-limited
    if (!res.ok) return []
    const repos: Repo[] = await res.json()
    return repos.filter((r) => !r.fork && r.name !== profile.githubUser).slice(0, 9)
  },
})
