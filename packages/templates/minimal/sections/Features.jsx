export default function Features({ data, locale = 'mn' }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <section className="py-24 md:py-32 border-b border-[var(--hairline)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] flex items-center gap-3">
          <span className="h-px w-6 bg-[var(--accent)]" />
          {L('Яагаад бид', 'Why us')}
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-14">
          {data.map((f, i) => (
            <div
              key={i}
              className={`relative group reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}
            >
              <div
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-[52px] leading-none tracking-[-0.02em] text-[var(--accent)] tabular-nums font-medium"
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <div
                className="mt-5 h-px w-10 bg-[var(--accent)] transition-all group-hover:w-16"
              />
              <h3 className="mt-5 text-base md:text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
