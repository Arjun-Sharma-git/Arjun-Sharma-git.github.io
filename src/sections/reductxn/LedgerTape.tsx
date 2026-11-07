import { debts, members } from './netting'

const money = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 })

const rows = debts.map((d, i) => ({
  seq: 1041 + i,
  from: members[d.from],
  to: members[d.to],
  amount: money.format(d.amount),
  reversal: i === 7 || i === 15,
}))

function Rows({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined}>
      {rows.map((r) => (
        <li key={r.seq} className="grid grid-cols-[3.2rem_1fr_auto] items-baseline gap-2 border-b border-line/80 py-2 font-mono text-xs sm:text-[0.8rem]">
          <span className="text-gold-deep">#{r.seq}</span>
          <span className="truncate">
            {r.from} <span className="text-muted">owes</span> {r.to}
          </span>
          <span className={`tabular-nums ${r.reversal ? 'text-[#b4432a]' : ''}`}>
            {r.reversal && '↺ '}
            {r.amount}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** An endless strip of ledger lines. The list is doubled so the CSS loop has no seam. */
export function LedgerTape() {
  return (
    <div aria-hidden data-hero-fade className="rounded-[20px] border border-line bg-paper shadow-[0_24px_60px_rgb(27_24_20/0.1)]">
      <div className="flex items-center justify-between border-b border-line px-4 py-3 font-mono text-[0.68rem] uppercase tracking-widest text-muted">
        <span>ledger.lines</span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-gold" />
          append-only
        </span>
      </div>
      <div className="tape-window h-56 overflow-hidden px-4 sm:h-80">
        <div className="tape">
          <Rows />
          <Rows hidden />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line px-4 py-3 font-mono text-xs">
        <span className="text-muted">Σ balances</span>
        <span className="tabular-nums">0.00</span>
      </div>
    </div>
  )
}
