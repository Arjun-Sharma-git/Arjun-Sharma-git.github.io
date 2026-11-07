import { queryOptions } from '@tanstack/react-query'
import { hiddenRepos, pinnedRepos, profile, repoDescriptions, repoLinks } from '~/content'
import { fetchUserRepos, selectShowcaseRepos } from '~/services/github'

export const showcaseReposQuery = queryOptions({
  queryKey: ['github', 'repos', profile.githubUser],
  queryFn: () => fetchUserRepos(profile.githubUser),
  // Snapshot taken at build time; each deploy refreshes it, so the browser never refetches.
  staleTime: Infinity,
  select: (repos) =>
    selectShowcaseRepos(repos, { user: profile.githubUser, hidden: hiddenRepos, descriptions: repoDescriptions, pinned: pinnedRepos }).map(
      (r) => (repoLinks[r.name] ? { ...r, html_url: repoLinks[r.name] } : r),
    ),
})
