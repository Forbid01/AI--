export default function Gallery({ assets, locale = 'mn' }) {
  if (!Array.isArray(assets) || assets.length === 0) return null;
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <section className="py-24 md:py-32 border-b border-[var(--hairline)] bg-[var(--foreground)]/[0.02]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="reveal text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] flex items-center gap-3">
          <span className="h-px w-6 bg-[var(--accent)]" />
          {L('Цуглуулга', 'Gallery')}
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {assets.slice(0, 6).map((a, i) => (
            <figure
              key={a.id ?? i}
              className={`relative overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--foreground)]/5 reveal reveal-delay-${Math.min((i % 4) + 1, 4)} ${
                i === 0 ? 'col-span-2 row-span-2 aspect-square md:aspect-[4/3]' : 'aspect-square'
              }`}
            >
              <img
                src={a.url}
                alt={a.caption ?? ''}
                className="w-full h-full object-cover ken-burns transition-transform duration-700 hover:scale-[1.04]"
                loading="lazy"
                style={{ animationDelay: `${i * 1.1}s` }}
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
