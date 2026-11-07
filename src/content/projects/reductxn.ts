import type { Project } from '../types'

export default {
  order: 2,
  slug: 'reductxn',
  name: 'Reductxn',
  kind: 'Fintech · Shared expenses',
  description:
    'Shared expenses on an exact, append-only ledger. Settle-up finds the provably fewest payments that clear a group, and estimates the transfer taxes and fees they avoid.',
  pipeline: ['Expenses', 'Ledger', 'Balances', 'Zero-sum groups', 'Fewest payments'],
  tags: ['Java', 'Spring Boot', 'PostgreSQL', 'React', 'TypeScript', 'Kubernetes'],
  repo: 'https://gitlab.com/archer_16/reductxn',
  repoLabel: 'Source on GitLab',
  caseStudy: {
    seoTitle: 'Provably minimal settle-up on an append-only ledger',
    seoDescription:
      'How Reductxn finds the provably fewest payments that settle a group: an append-only ledger and exact zero-sum partitioning, in Java, Spring Boot and PostgreSQL, with an offline-first React app.',
    title: 'Everyone owes everyone.',
    accent: 'Settle in n − k.',
    lede: 'Reductxn is shared expenses for friends, ready for organisations. People record what they paid, an exact ledger keeps the books, and settle-up shows the fewest payments that clear the group.',
    facts: [
      { value: 'n − k', label: 'Fewest payments, proven exactly for up to 20 people' },
      { value: '12', label: 'Modules, each owning one Postgres schema' },
      { value: '4', label: 'Languages, in the app and in every email' },
      { value: '0', label: 'What every group’s balances always sum to' },
    ],
    problem: {
      title: 'Every payment',
      accent: 'costs something.',
      body: [
        'Paying each debt directly means more transfers than a group needs, and each transfer can carry a tax or a fee. The common trick, largest debtor pays largest creditor, is not minimal, and it cannot tell you how far from minimal it is.',
        'Reductxn treats this as what it is: a partition problem over balances. Money moves outside the app and people mark payments done, so the product’s whole job is to be exactly right about who owes whom.',
      ],
    },
    demo: {
      title: 'Many debts,',
      accent: 'condensed.',
      intro: 'Scroll to run settle-up on a sample group of eight people. The animation plays a real result, computed by a port of the engine’s exact search.',
      note: 'Sample data. Amounts are illustrative; the plan is computed, not drawn by hand.',
      steps: [
        { name: 'Everyone records', detail: 'Twenty debts between eight people. Paying each one directly would take twenty transfers.' },
        { name: 'Debts become balances', detail: 'Only each person’s net position matters. Every line collapses into one number, and the numbers sum to zero.' },
        { name: 'Find the zero-sum groups', detail: 'The fewest payments is n − k, where k is the most disjoint groups that each sum to zero. Finding k is NP-hard, so the engine solves it exactly with dynamic programming over subsets.' },
        { name: 'Pay the fewest', detail: 'Each group of s people settles in s − 1 payments. Eight people, three groups, five payments: proven fewest, not just a good guess.' },
      ],
    },
    walkthrough: {
      title: 'Now in',
      accent: 'the real app.',
      intro: 'A six-person trip with eight shared expenses, from the first typed line to the last payment.',
      note: 'Screens from Reductxn running locally, with fictional demo data.',
      steps: [
        {
          image: 'quick-add',
          name: 'Say what happened',
          detail: 'Type one line. Reductxn reads the amount, who paid and who was in, and shows you before anything is saved.',
          alt: 'Quick add box containing “Momos 840 paid by Arun except Meera”, with a preview below: ₹840, Momos, Arun paid, split between you, Arun, Riya, Kabir and Dev.',
        },
        {
          image: 'balances',
          name: 'See where you stand',
          detail: 'Every expense lands in the ledger, and each person’s balance updates. They always add up to zero.',
          alt: 'Manali trip group page. You are owed ₹15,110, and a banner says 5 payments settle the whole group instead of 14. Bars show who gets back and who owes.',
        },
        {
          image: 'flow',
          name: 'Follow the money',
          detail: 'The Flow view draws who paid for whom, and shows how tangled a group’s debts have become.',
          alt: 'Flow tab with a dark graph of curved arrows between group members, showing who paid for whom.',
        },
        {
          image: 'settle-up',
          name: 'Settle in the fewest payments',
          detail: 'Fourteen direct payments become five. The app can say “Proven fewest”, because the search is exact.',
          alt: 'Settle up screen comparing a dense graph of 14 direct payments with 5 arrows. A note reads: Proven fewest. No plan can settle this group in fewer payments.',
        },
        {
          image: 'mark-paid',
          name: 'Pay, then mark it done',
          detail: 'Money moves outside the app, by UPI, bank transfer or cash. Mark it paid, and the person paid confirms it.',
          alt: 'Payment list showing four payments still to make. Dev’s ₹6,850 payment to you is marked Paid, with an Undo link.',
        },
      ],
    },
    approach: {
      title: 'One cycle,',
      accent: 'closing at zero.',
      intro: 'Every expense takes the same path through a modular Spring Boot service, and the books balance at each step.',
      stages: [
        { name: 'Record', detail: 'An expense, IOU or payment comes in, online or queued on the device while offline. Each create carries an Idempotency-Key.' },
        { name: 'Split', detail: 'Shares use the largest-remainder method in integer minor units, so they add up to the total exactly.' },
        { name: 'Post', detail: 'It becomes ledger lines of “debtor owes creditor amount”, with a gapless sequence number per group.' },
        { name: 'Project', detail: 'Balances are projections written in the same transaction, so they always add up to zero.' },
        { name: 'Settle', detail: 'The engine finds the fewest payments, then the cheapest of those plans using sourced tax and fee rules.' },
        { name: 'Mark paid', detail: 'Money moves outside the app. People mark payments done, the ledger records them, and balances return to zero.' },
      ],
    },
    flow: {
      title: 'People hear about it',
      accent: 'after it’s safe.',
      intro: 'A mail provider being slow should never hold up a change, or lose the news of one. Emails and pushes are rows, written with the change and sent after it commits.',
      nodes: [
        { tag: 'transaction', name: 'Change commits', detail: 'The ledger lines and the activity entry land together, or not at all.' },
        { tag: 'notifications.outbox', name: 'Rows wait', detail: 'One row per email or push, in each person’s language.' },
        { tag: 'for update skip locked', name: 'Dispatcher claims', detail: 'Every instance can run it, and no row is sent twice at once.' },
        { tag: 'delivered', name: 'Sent, or retried', detail: 'No database connection is held while sending. Failures back off and try again.' },
      ],
    },
    stack: [
      { label: 'Backend', items: ['Java 21+', 'Spring Boot 4', 'Spring JDBC', 'Flyway', 'springdoc OpenAPI'] },
      { label: 'Data', items: ['PostgreSQL 16', 'S3-compatible storage'] },
      { label: 'Frontend', items: ['React 19', 'TypeScript', 'Vite', 'GSAP', 'Service worker', 'Web Push', 'tesseract.js'] },
      { label: 'Delivery', items: ['Docker', 'Kubernetes', 'nginx', 'GitLab CI', 'Prometheus metrics'] },
      { label: 'Quality', items: ['ArchUnit', 'Playwright', 'Vitest', 'Shared test fixtures'] },
    ],
    decisions: [
      {
        title: 'Provably fewest, and honest above that',
        body: 'Up to 20 people the plan is exact, and tests compare it with an independent brute force on hundreds of random groups. Larger groups use a greedy plan and say when it is not proven optimal.',
      },
      {
        title: 'The ledger cannot be rewritten',
        body: 'Database triggers refuse UPDATE, DELETE and TRUNCATE on ledger tables. Edits and undo append reversing entries, so every number can be explained.',
      },
      {
        title: 'Money is never a float',
        body: 'Amounts are integers in the currency’s minor unit, and splits use the largest-remainder method, so nobody gains or loses a cent to rounding.',
      },
      {
        title: 'Costs are sourced, or marked unknown',
        body: 'Every tax and fee rule cites a source URL and the date it was checked. A case with no rule shows as unknown, because a confident wrong number is worse than none.',
      },
      {
        title: 'Every write is safe to retry',
        body: 'Creates take an Idempotency-Key and updates need If-Match, answering 428 if it is missing and 412 if it is stale. Double taps and flaky networks can’t double-post.',
      },
      {
        title: 'Built for bad signal',
        body: 'Trips are where groups spend most and signal is worst. The app opens from what it saved, and changes wait on the device to be sent once, in order, when the connection returns.',
      },
      {
        title: 'One service, enforced modules',
        body: 'Modules call each other only through their api package and each owns one schema. ArchUnit and an SQL ownership test fail the build otherwise.',
      },
      {
        title: 'Server and web agree by test',
        body: 'Money is computed on both sides, so split maths, conversions and activity entries are pinned in shared fixtures that each side must reproduce to the cent.',
      },
    ],
  },
} satisfies Project
