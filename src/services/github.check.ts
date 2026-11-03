// Self-check for repo filtering. Run: node --experimental-strip-types src/services/github.check.ts
import assert from 'node:assert/strict'
import { type Repo, selectShowcaseRepos } from './github.ts'

const repo = (name: string, description: string | null, fork = false) => ({ name, description, fork }) as Repo
const picked = selectShowcaseRepos(
  [repo('me', 'profile'), repo('good', 'Does things'), repo('blank', null), repo('spaces', '  '), repo('forked', 'x', true), repo('Starter', 'demo')],
  { user: 'me', hidden: ['starter'] },
).map((r) => r.name)
assert.deepEqual(picked, ['good'])
console.log('github.check: ok')
