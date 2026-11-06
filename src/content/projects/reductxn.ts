import type { Project } from '../types'

export default {
  order: 2,
  slug: 'reductxn',
  name: 'Reductxn',
  kind: 'Fintech · Settlement engine',
  description:
    'A non-custodial group ledger. Members record what they owe, and each cycle nets the group down to at most N-1 transfers, which also minimises per-transfer CBDC tax.',
  pipeline: ['Obligations', 'Net positions', 'Netting', 'Quorum', 'Rail', 'Ledger'],
  tags: ['Java 25', 'Spring Boot', 'PostgreSQL', 'jOOQ', 'React', 'TanStack'],
  repoNote: 'Private repository',
  caseStudy: {
    seoTitle: 'Group settlement ledger in Java and Spring Boot',
    seoDescription:
      'How Reductxn nets a group’s debts down to at most N-1 transfers: a non-custodial, append-only ledger in Java 25 and Spring Boot with a pure domain core and enforced architecture rules.',
    title: 'Everyone owes everyone.',
    accent: 'Settle in N-1.',
    lede: 'Reductxn is a non-custodial group ledger. Members record what they owe and nothing moves until cycle end, when the group’s debts are netted down to the fewest transfers that settle everyone.',
    facts: [
      { value: 'N-1', label: 'Most transfers needed to settle N members' },
      { value: '57', label: 'Architecture decision records' },
      { value: '28', label: 'ArchUnit rules that can fail the build' },
      { value: '84', label: 'Test classes across the backend' },
    ],
    problem: {
      title: 'Every transfer',
      accent: 'costs something.',
      body: [
        'In a group that settles pairwise, obligations grow as O(N²). When a digital currency rail charges tax on each transfer, every one of those payments has a price, even when most of them cancel each other out.',
        'Reductxn records intent rather than money. It is not a wallet or a bank: it never holds funds or private keys. It computes the settlement and produces instructions for a licensed rail to carry out. Its two headline answers are who pays whom, and how much tax that saved.',
      ],
    },
    approach: {
      title: 'From promises',
      accent: 'to a closed book.',
      intro: 'A settlement cycle moves through a pure domain core and two Spring Boot deployables: an API and a settlement worker. Payment rails sit behind a port, and development runs against a mock rail.',
      stages: [
        { name: 'Record', detail: 'Members log obligations through an idempotent API. No money moves.' },
        { name: 'Net', detail: 'Each member’s position is computed separately for each currency.' },
        { name: 'Match', detail: 'A greedy pass pairs the largest debtor with the largest creditor, needing at most N-1 transfers.' },
        { name: 'Compare', detail: 'The netted plan is priced against settling directly, and the cheaper plan wins.' },
        { name: 'Agree', detail: 'A run needs a majority of members, and every net debtor must confirm personally.' },
        { name: 'Execute', detail: 'Instructions go out through a PaymentRail port guarded by a circuit breaker.' },
        { name: 'Book', detail: 'Settled movements land in the append-only ledger as double entries.' },
      ],
    },
    stack: [
      { label: 'Backend', items: ['Java 25', 'Spring Boot 4.1', 'Gradle multi-project'] },
      { label: 'Data', items: ['PostgreSQL 16', 'jOOQ', 'Flyway', 'PgBouncer'] },
      { label: 'Frontend', items: ['React 19', 'Vite', 'TanStack Router & Query', 'Zod', 'GSAP'] },
      { label: 'Quality', items: ['ArchUnit', 'jqwik', 'Testcontainers', 'Playwright', 'axe-core', 'Vitest', 'OpenAPI 3.1'] },
    ],
    decisions: [
      {
        title: 'Netting must never raise the bill',
        body: 'Property tests disproved an early assumption. With 3 obligations across 5 members, greedy netting produced 4 transfers where paying directly needed 3. The engine now compares both plans and returns the cheaper one.',
      },
      {
        title: 'Money is never a float',
        body: 'Amounts are integer minor units plus a currency, and FX rates are scaled integers. Rounding errors in money are silent and cumulative, so floating point has no place in valuation.',
      },
      {
        title: 'An append-only, hash-chained ledger',
        body: 'Journal entries are never edited. Corrections are compensating entries, balances are projections, and each entry carries the previous entry’s hash, so tampering is detectable.',
      },
      {
        title: 'A domain core an auditor can run',
        body: 'The ledger and netting libraries have no Spring, JDBC or HTTP in them, so a settlement can be reproduced standalone. ArchUnit rules hold that boundary by failing the build.',
      },
      {
        title: 'Tax law is configuration',
        body: 'Each tax rule is a record, not a branch in the code. A deployment must also name its jurisdiction, with no default, because a missing rule would look exactly like low tax.',
      },
      {
        title: 'Test against the real database',
        body: 'Integration tests run on real Postgres through Testcontainers rather than H2, which could accept SQL that production would treat differently and prove the wrong thing.',
      },
    ],
  },
} satisfies Project
