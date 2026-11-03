import { queryOptions } from '@tanstack/react-query'
import { profile } from '~/content'
import { fetchUserRepos, selectShowcaseRepos } from '~/services/github'

export const showcaseReposQuery = queryOptions({
  queryKey: ['github', 'repos', profile.githubUser],
  queryFn: () => fetchUserRepos(profile.githubUser),
  // Snapshot taken at build time; each deploy refreshes it, so the browser never refetches.
  staleTime: Infinity,
  select: (repos) => selectShowcaseRepos(repos, profile.githubUser),
})
