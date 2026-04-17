export default function Process({ data, locale = 'mn' }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] flex items-center gap-3">
            <span className="h-px w-6 bg-[var(--accent)]" />
            {L('Үйл явц', 'Process')}
          </div>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className="mt-3 text-3xl md:text-5xl tracking-[-0.025em] leading-[1.04] font-medium"
          >
            {L('Хэрхэн ажилладаг вэ?', 'How we work')}
          </h2>
        </div>

        <ol className="mt-14 grid md:grid-cols-4 gap-6 relative">
          {data.slice(0, 4).map((p, i) => (
            <li
              key={i}
              className={`relative group reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-10 w-10 rounded-full border border-[var(--hairline)] grid place-items-center text-sm font-semibold tabular-nums transition-all group-hover:bg-[var(--accent)] group-hover:text-[var(--background)] group-hover:border-[var(--accent)]"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {i < Math.min(data.length, 4) - 1 && (
                  <span className="flex-1 h-px bg-[var(--hairline)]" />
                )}
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {p.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
