export default function Services({ data, locale = 'mn' }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section id="services" className="py-24 md:py-32 bg-[var(--foreground)]/[0.02] border-b border-[var(--hairline)]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6 reveal">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] flex items-center gap-3">
              <span className="h-px w-6 bg-[var(--accent)]" />
              {L('Цуглуулга', 'Offerings')}
            </div>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="mt-3 text-3xl md:text-5xl tracking-[-0.025em] font-medium"
            >
              {L('Үйлчилгээ', 'Services')}
            </h2>
          </div>
          <div className="text-xs text-[var(--muted)] tabular-nums font-mono">
            {pad(data.length)} {L('ширхэг', 'items')}
          </div>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--hairline)] border border-[var(--hairline)] rounded-2xl overflow-hidden">
          {data.map((s, i) => (
            <article
              key={i}
              className={`group relative p-8 bg-[var(--background)] flex flex-col transition-all duration-500 hover:bg-[var(--foreground)]/[0.02] reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}
            >
              <div
                className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: `linear-gradient(90deg, transparent, var(--accent), transparent)` }}
              />
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-xs tabular-nums text-[var(--muted)]">
                  {pad(i + 1)}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] group-hover:scale-150 transition-transform" />
              </div>
              <h3 className="mt-6 text-lg md:text-xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--muted)]">
                {s.description}
              </p>
              <span className="mt-auto pt-6 text-[11px] uppercase tracking-[0.22em] text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity">
                {L('Дэлгэрэнгүй', 'Learn more')}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
