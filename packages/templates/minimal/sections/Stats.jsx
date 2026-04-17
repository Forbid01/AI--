export default function Stats({ data, locale = 'mn' }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <section className="py-20 md:py-28 bg-[var(--primary)] text-[var(--background)] border-b border-[var(--hairline)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal text-[11px] uppercase tracking-[0.22em] opacity-60 flex items-center gap-3">
          <span className="h-px w-6 bg-[var(--accent)]" />
          {L('Тоон баримт', 'By the numbers')}
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
          {data.slice(0, 4).map((s, i) => (
            <div
              key={i}
              className={`reveal reveal-delay-${Math.min(i + 1, 4)}`}
            >
              <div
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-4xl md:text-6xl tracking-[-0.025em] font-medium tabular-nums"
              >
                {s.value}
              </div>
              <div className="mt-3 text-sm opacity-75 leading-snug">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
