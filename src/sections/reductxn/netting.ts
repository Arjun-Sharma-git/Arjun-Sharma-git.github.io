// A small TypeScript port of Reductxn's NettingEngine (ADR-0003), run on a sample group so the page animates a
// real result: the fewest payments is n - k, where k is the most disjoint zero-sum subgroups.
// Self-check: node --experimental-strip-types src/sections/reductxn/netting.check.ts

export type Debt = { from: number; to: number; amount: number }
export type Payment = Debt

export const members = ['Aarav', 'Mei', 'Sofia', 'Yuki', 'Ivan', 'Priya', 'Noor', 'Leo']

export const debts: Debt[] = [
  { from: 3, to: 7, amount: 230 },
  { from: 1, to: 7, amount: 240 },
  { from: 2, to: 7, amount: 240 },
  { from: 4, to: 2, amount: 220 },
  { from: 0, to: 2, amount: 150 },
  { from: 3, to: 6, amount: 310 },
  { from: 1, to: 2, amount: 260 },
  { from: 2, to: 5, amount: 170 },
  { from: 6, to: 0, amount: 190 },
  { from: 0, to: 3, amount: 190 },
  { from: 3, to: 1, amount: 110 },
  { from: 7, to: 5, amount: 130 },
  { from: 5, to: 4, amount: 660 },
  { from: 2, to: 3, amount: 20 },
  { from: 7, to: 6, amount: 380 },
  { from: 0, to: 1, amount: 150 },
  { from: 5, to: 1, amount: 80 },
  { from: 3, to: 4, amount: 10 },
  { from: 6, to: 1, amount: 260 },
  { from: 6, to: 5, amount: 320 },
]

export function balancesOf(list: Debt[], size: number): number[] {
  const balances = new Array<number>(size).fill(0)
  for (const d of list) {
    balances[d.from] -= d.amount
    balances[d.to] += d.amount
  }
  return balances
}

/** Largest partition into zero-sum subgroups, by dynamic programming over subsets. Returns member indexes. */
export function zeroSumGroups(balances: number[]): number[][] {
  const parties = balances.flatMap((b, i) => (b === 0 ? [] : [i]))
  const n = parties.length
  const size = 1 << n
  const sum = new Array<number>(size).fill(0)
  const best = new Array<number>(size).fill(0)
  for (let mask = 1; mask < size; mask++) {
    const low = 31 - Math.clz32(mask & -mask)
    sum[mask] = sum[mask & (mask - 1)] + balances[parties[low]]
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) best[mask] = Math.max(best[mask], best[mask ^ (1 << i)])
    }
    if (sum[mask] === 0) best[mask] += 1
  }

  // Walk back down: a mask whose count rose at this step closes a subgroup.
  const groups: number[][] = []
  let rest = size - 1
  while (rest) {
    let group = rest
    for (let sub = (rest - 1) & rest; sub; sub = (sub - 1) & rest) {
      if (sum[sub] === 0 && best[rest ^ sub] === best[rest] - 1 && popcount(sub) < popcount(group)) group = sub
    }
    groups.push(parties.filter((_, i) => group & (1 << i)))
    rest ^= group
  }
  return groups
}

const popcount = (x: number) => {
  let count = 0
  for (; x; x &= x - 1) count++
  return count
}

/** Any greedy pairing settles an irreducible zero-sum group of s members in exactly s - 1 payments. */
export function settleGroup(group: number[], balances: number[]): Payment[] {
  const left = new Map(group.map((m) => [m, balances[m]]))
  const payments: Payment[] = []
  for (;;) {
    const open = [...left].filter(([, b]) => b !== 0)
    if (!open.length) return payments
    const [debtor, owes] = open.reduce((a, b) => (b[1] < a[1] ? b : a))
    const [creditor, owed] = open.reduce((a, b) => (b[1] > a[1] ? b : a))
    const amount = Math.min(-owes, owed)
    payments.push({ from: debtor, to: creditor, amount })
    left.set(debtor, owes + amount)
    left.set(creditor, owed - amount)
  }
}

export const balances = balancesOf(debts, members.length)
export const groups = zeroSumGroups(balances)
export const payments = groups.flatMap((g) => settleGroup(g, balances))
