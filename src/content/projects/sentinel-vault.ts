import type { Project } from '../types'
import { githubRepo } from '../profile'

export default {
  order: 3,
  slug: 'sentinel-vault',
  name: 'Sentinel Vault',
  kind: 'AI · Permission-aware knowledge base',
  description:
    'Ask questions of a company’s documents and get cited answers, but only from the folders you may read. A local LLM on one consumer GPU, with permissions checked before the model reads anything, a prompt-injection gate, and a fact checker on every claim.',
  pipeline: ['Gate', 'Access', 'Search', 'Recheck', 'Answer', 'Verify', 'Audit'],
  tags: ['Python', 'FastAPI', 'OpenFGA', 'Qdrant', 'Ollama', 'PostgreSQL', 'React', 'ROCm'],
  repo: githubRepo('Sentinel-Vault'),
  caseStudy: {
    seoTitle: 'Permission-aware RAG on a local LLM',
    seoDescription:
      'How Sentinel Vault answers questions from company documents with citations, only from folders each person may read: OpenFGA checks before retrieval, hybrid search and reranking, a prompt-injection gate and a claim-by-claim fact checker, on one consumer GPU.',
    title: 'Ask the company anything.',
    accent: 'Hear only what you may read.',
    lede: 'Sentinel Vault answers questions from a company’s documents with a cited answer, written by a local model. Two people can ask the same question and get different answers, because each one only ever searches what they are allowed to read.',
    facts: [
      { value: '4,197', label: 'GitLab Handbook pages in the test knowledge base' },
      { value: '100%', label: 'Questions with the right document in the top 8 (39-question eval)' },
      { value: '0.96', label: 'Share of cited claims a separate fact-checking model confirmed' },
      { value: '0', label: 'Passages that can reach the model from a folder you can’t read' },
    ],
    problem: {
      title: 'A helpful model',
      accent: 'is a leaky one.',
      body: [
        'Put a language model on top of company documents and it will answer from whatever it was given. If the search step can see the payroll folder, so can anyone who asks the right question, however politely the prompt says not to tell.',
        'So permissions can’t live in the prompt, and they can’t be checked after the model has read. Sentinel Vault decides what each person may see first, searches only that, checks again on exactly the passages about to reach the model, and then checks the answer against them.',
      ],
    },
    approach: {
      title: 'Seven steps,',
      accent: 'all on the record.',
      intro: 'Every question runs the same path, and the app shows each step live as a decision trace beside the answer.',
      stages: [
        { name: 'Gate', detail: 'A classifier (Laya) scores the question for prompt injection and bulk-export attempts before anything is searched. Hindi is routed to a multilingual checkpoint with its own thresholds.' },
        { name: 'Access', detail: 'OpenFGA resolves the folders this person may read, fresh on every question. Groups, per-user grants and folder inheritance are all modelled there.' },
        { name: 'Search', detail: 'Vector search in Qdrant and keyword search in Postgres run inside those folders only, are fused, then reranked by a Qwen3 cross-encoder.' },
        { name: 'Recheck', detail: 'A second permission check runs on exactly the folders of the passages about to reach the model. Anything that fails it never leaves the server.' },
        { name: 'Answer', detail: 'Qwen 3.5 9B writes the answer on the local GPU. Passages are marked as data, not instructions, and every fact must cite one.' },
        { name: 'Verify', detail: 'Citations must point at passages that were sent, and a separate model, Bespoke-MiniCheck, judges every cited sentence and diagram box against its source.' },
        { name: 'Audit', detail: 'Who asked what, the gate’s scores, and exactly which documents were used are written to an audit log.' },
      ],
    },
    demo: {
      title: 'Same question,',
      accent: 'three people.',
      intro: 'Pick a person and ask about Q3 revenue. The folders they can read light up, search runs only inside them, and the answer follows.',
      note: 'The documents, groups and grants are the app’s real demo data. The answers shown are the ones the app gives.',
    },
    stack: [
      { label: 'Backend', items: ['Python', 'FastAPI', 'SQLAlchemy', 'PostgreSQL', 'Server-sent events'] },
      { label: 'Access', items: ['OpenFGA', 'Argon2id sessions', 'Audit log'] },
      { label: 'Retrieval', items: ['Qdrant', 'Postgres full-text', 'Qwen3 embeddings', 'Qwen3 reranker', 'Docling'] },
      { label: 'Models', items: ['Ollama', 'Qwen 3.5 9B', 'Bespoke-MiniCheck', 'Laya gate', 'ROCm on an RX 9070 XT'] },
      { label: 'Frontend', items: ['React', 'TypeScript', 'TanStack Query', 'Tailwind CSS', 'Mermaid'] },
      { label: 'Quality', items: ['pytest (169 tests)', 'Eval harness', 'ruff', 'Docker Compose'] },
    ],
    decisions: [
      {
        title: 'Permissions before the model reads, checked twice',
        body: 'The vector and keyword searches are filtered to the folders you may read, and the exact folders of the final passages are checked again before the model sees them. A document you can’t read returns 404, never 403, so the app doesn’t even confirm it exists.',
      },
      {
        title: 'Never answer from stale permissions',
        body: 'Grants are written to Postgres first and pushed to OpenFGA second. A trigger records every change, and until OpenFGA has caught up, questions are answered by the same rules in SQL. Revoking access takes effect on the next question.',
      },
      {
        title: 'The cap nobody mentioned',
        body: 'OpenFGA’s list call stops at 1,000 results without an error, so with 1,500 handbook folders, search silently skipped a third of what people could read. It now streams the full list, and a stream that breaks partway fails closed instead of returning a partial list.',
      },
      {
        title: 'A fact checker that isn’t the writer',
        body: 'A model grading its own answer shares its blind spots, so claims are judged by MiniCheck, trained only for that. It first rejected true claims: passages say “you” and never name the company. Giving it each passage’s source and section fixed that, and it still rejects invented ones.',
      },
      {
        title: 'Hindi questions are not attacks',
        body: 'The English injection classifier treated ordinary Hindi as hostile. Routing by language, thresholds fitted per checkpoint and a second look in the uncertain band brought wrongly blocked Hindi questions to 1 in 74 while blocking 28 of 30 attacks.',
      },
      {
        title: 'Measured, with the sample size',
        body: 'Every change runs against an eval: 53 questions on the demo company and 39 on the GitLab Handbook, scoring retrieval, correct answers, refusals and faithfulness. The numbers on this page come from those runs and say how many questions they cover.',
      },
    ],
  },
} satisfies Project
