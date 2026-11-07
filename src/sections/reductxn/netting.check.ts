// Self-check for the netting port. Run: node --experimental-strip-types src/sections/reductxn/netting.check.ts
import assert from 'node:assert/strict'
import { balances, balancesOf, debts, groups, members, payments, settleGroup, zeroSumGroups } from './netting.ts'

assert.deepEqual(balances, [-300, 100, 200, -450, 450, -120, -80, 200])
assert.equal(balances.reduce((a, b) => a + b, 0), 0)
assert.equal(groups.length, 3)
assert.equal(payments.length, members.length - groups.length)
assert.deepEqual(balancesOf(payments, members.length), balances, 'the plan must clear every balance exactly')

// Against brute force: try every plan shape on random groups and confirm n - k is the true minimum.
function brute(bal: number[]): number {
  const open = bal.filter((b) => b !== 0)
  if (!open.length) return 0
  const [first, ...rest] = open
  let best = Infinity
  for (let i = 0; i < rest.length; i++) {
    if (Math.sign(rest[i]) === Math.sign(first)) continue
    const next = [...rest]
    next[i] += first
    best = Math.min(best, 1 + brute(next))
  }
  return best
}
let seed = 7
const rand = (n: number) => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) % n
for (let run = 0; run < 300; run++) {
  const size = 2 + rand(6)
  const bal = Array.from({ length: size }, () => (rand(9) - 4) * 10)
  bal.push(0 - bal.reduce((a, b) => a + b, 0))
  const plan = zeroSumGroups(bal).flatMap((g) => settleGroup(g, bal))
  assert.equal(plan.length, brute(bal), `not minimal for ${bal}`)
  assert.deepEqual(balancesOf(plan, bal.length), bal)
}
console.log(`netting.check: ok (${debts.length} debts become ${payments.length} payments, ${groups.length} zero-sum groups)`)
