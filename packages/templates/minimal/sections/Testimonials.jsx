export default function Testimonials({ data, locale = 'mn' }) {
  if (!Array.isArray(data) || data.length === 0) return null;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <section className="py-24 md:py-32 bg-[var(--foreground)]/[0.02] border-b border-[var(--hairline)] relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="orb"
          style={{
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '500px',
            background: `radial-gradient(circle, var(--accent), transparent 70%)`,
            opacity: 0.15,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="reveal text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            {L('Үйлчлүүлэгчдийн үгс', 'In their words')}
          </div>
          <h2
            style={{ fontFamily: 'var(--font-display)' }}
            className="mt-4 text-3xl md:text-5xl font-medium tracking-[-0.025em]"
          >
            {L('Итгэлээ үлдээгсэд', 'People who trust us')}
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {data.map((t, i) => (
            <figure
              key={i}
              className={`group p-8 md:p-10 rounded-3xl border border-[var(--hairline)] bg-[var(--background)] hover:border-[var(--foreground)]/30 transition-all duration-500 reveal reveal-delay-${Math.min((i % 4) + 1, 4)}`}
            >
              <div
                className="text-[var(--accent)] text-5xl leading-none transform transition-transform group-hover:scale-110 group-hover:rotate-3"
                aria-hidden
                style={{ fontFamily: 'var(--font-display)' }}
              >
                &ldquo;
              </div>
              <blockquote
                style={{ fontFamily: 'var(--font-display)' }}
                className="mt-2 text-xl md:text-[22px] leading-[1.45] tracking-[-0.01em] font-medium"
              >
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 text-sm">
                <span
                  className="h-10 w-10 rounded-full grid place-items-center font-semibold text-sm text-white"
                  style={{
                    background: `linear-gradient(135deg, hsl(${(i * 97) % 360}, 60%, 55%), hsl(${(i * 97 + 40) % 360}, 60%, 45%))`,
                  }}
                >
                  {(t.author ?? '?').slice(0, 1)}
                </span>
                <span>
                  <span className="block font-semibold text-[15px]">{t.author}</span>
                  {t.role && <span className="text-[var(--muted)] text-[13px]">{t.role}</span>}
                </span>
                <span className="ml-auto text-[11px] font-mono text-[var(--muted)] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
