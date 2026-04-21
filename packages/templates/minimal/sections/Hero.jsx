export default function Hero({ data, asset, business, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const eyebrow = business?.industry || L('Шинэ дугаар', 'Featured');

  return (
    <section id="top" className="relative overflow-hidden border-b border-[var(--hairline)]">
      {/* Ambient background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="orb orb-a"
          style={{
            top: '-12%',
            left: '-8%',
            width: '360px',
            height: '360px',
            background: `radial-gradient(circle, ${cssColor('--accent')}, transparent 65%)`,
            opacity: 0.35,
          }}
        />
        <div
          className="orb orb-b"
          style={{
            bottom: '-20%',
            right: '-10%',
            width: '420px',
            height: '420px',
            background: `radial-gradient(circle, ${cssColor('--primary')}, transparent 65%)`,
            opacity: 0.25,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-20 md:pt-28 pb-20 md:pb-28 grid md:grid-cols-12 gap-12 items-end">
        <div className="md:col-span-7">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] reveal">
            <span className="h-px w-8 bg-[var(--foreground)]/40" />
            <span>{eyebrow}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
            <span className="tabular-nums">{String(new Date().getFullYear())}</span>
          </div>
          <h1
            style={{ fontFamily: 'var(--font-display)' }}
            className="mt-6 text-[44px] sm:text-[60px] md:text-[80px] lg:text-[96px] leading-[1.0] tracking-[-0.028em] font-medium reveal reveal-delay-1"
          >
            {data.title}
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--muted)] reveal reveal-delay-2">
            {data.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3 reveal reveal-delay-3">
            {data.ctaPrimary && (
              <a
                href="#contact"
                className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--primary)] text-[var(--background)] font-medium hover:opacity-90 transition-all shine overflow-hidden"
              >
                <span className="relative">{data.ctaPrimary}</span>
                <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="relative transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            )}
            {data.ctaSecondary && (
              <a
                href="#services"
                className="inline-flex items-center px-7 py-3.5 rounded-full border border-[var(--hairline)] font-medium hover:border-[var(--foreground)] hover:bg-[var(--foreground)]/[0.04] transition-all"
              >
                {data.ctaSecondary}
              </a>
            )}
          </div>

          {/* Trust row */}
          <div className="mt-12 flex flex-wrap items-center gap-6 text-xs text-[var(--muted)] reveal reveal-delay-4">
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="h-7 w-7 rounded-full border-2 border-[var(--background)] grid place-items-center text-[10px] font-semibold"
                  style={{
                    background: `linear-gradient(135deg, hsl(${(i * 73) % 360}, 65%, 55%), hsl(${(i * 73 + 40) % 360}, 65%, 45%))`,
                    color: '#fff',
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
              ))}
            </div>
            <span className="leading-tight">
              <span className="block text-[var(--foreground)] font-semibold">500+</span>
              {L('сэтгэл ханамжтай үйлчлүүлэгч', 'happy customers')}
            </span>
          </div>
        </div>

        <div className="md:col-span-5 reveal reveal-delay-2">
          <figure className="relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden bg-[var(--foreground)]/5 border border-[var(--hairline)] float-slow">
            {asset?.url ? (
              <>
                <img
                  src={asset.url}
                  alt={business?.businessName ?? ''}
                  className="object-cover w-full h-full ken-burns"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full grid place-items-center relative overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${cssColor('--primary')}, ${cssColor('--accent')})`,
                    opacity: 0.15,
                  }}
                />
                <span
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="relative text-[140px] leading-none opacity-25 font-medium"
                >
                  {(business?.businessName ?? 'A').slice(0, 1).toUpperCase()}
                </span>
              </div>
            )}
            <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-white/85">
              <span>{eyebrow}</span>
              <span className="tabular-nums">01 / 01</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function cssColor(v) {
  return `var(${v})`;
}
