import { queryOptions } from '@tanstack/react-query'
import { profile } from '~/content'
import { fetchUserRepos, selectShowcaseRepos } from '~/services/github'

export const showcaseReposQuery = queryOptions({
  queryKey: ['github', 'repos', profile.githubUser],
  queryFn: () => fetchUserRepos(profile.githubUser),
  select: (repos) => selectShowcaseRepos(repos, profile.githubUser),
})
