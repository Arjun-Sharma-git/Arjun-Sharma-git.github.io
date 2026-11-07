// Self-check for repo filtering. Run: node --experimental-strip-types src/services/github.check.ts
import assert from 'node:assert/strict'
import { type Repo, selectShowcaseRepos } from './github.ts'

const repo = (name: string, description: string | null, fork = false) => ({ name, description, fork }) as Repo
const picked = selectShowcaseRepos(
  [repo('me', 'profile'), repo('good', 'Does things'), repo('blank', null), repo('spaces', '  '), repo('filled', null), repo('forked', 'x', true), repo('Starter', 'demo')],
  { user: 'me', hidden: ['starter'], descriptions: { filled: 'From content', good: 'Ignored' } },
).map((r) => `${r.name}: ${r.description}`)
assert.deepEqual(picked, ['good: Does things', 'filled: From content'])

const pinned = selectShowcaseRepos([repo('a', 'A'), repo('b', 'B'), repo('c', 'C')], { user: 'me', pinned: ['C'] }).map((r) => r.name)
assert.deepEqual(pinned, ['c', 'a', 'b'])
console.log('github.check: ok')
