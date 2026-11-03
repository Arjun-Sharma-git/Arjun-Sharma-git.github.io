export function Pipeline({ steps }: { steps: string[] }) {
  return (
    <ol aria-label="Pipeline" className="mt-6 flex flex-wrap items-center gap-1.5 text-xs">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-1.5">
          <span className="pipe-step rounded-full border border-paper/25 bg-paper px-3 py-1.5 text-ink">{step}</span>
          {i < steps.length - 1 && (
            <span aria-hidden className="text-paper/40">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}
