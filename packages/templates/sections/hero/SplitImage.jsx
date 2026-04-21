import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function SplitImage({ content = {}, theme, assets, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const heroUrl = assets?.hero?.url;

  return (
    <section
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          {business?.industry && (
            <span
              className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--accent)] mb-4"
            >
              {business.industry}
            </span>
          )}
          <h1
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]"
          >
            {content.title || business?.businessName}
          </h1>
          {content.subtitle && (
            <p className="mt-5 text-lg text-[var(--muted)] leading-relaxed max-w-xl">
              {content.subtitle}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {content.ctaPrimary && (
              <a
                href="#contact"
                className="inline-flex items-center justify-center h-12 px-6 rounded-[var(--radius)] font-semibold transition-all"
                style={{ background: 'var(--accent)', color: 'var(--background)' }}
              >
                {content.ctaPrimary}
              </a>
            )}
            {content.ctaSecondary && (
              <a
                href="#services"
                className="inline-flex items-center justify-center h-12 px-6 rounded-[var(--radius)] font-semibold border border-[var(--hairline)] text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all"
              >
                {content.ctaSecondary}
              </a>
            )}
          </div>
        </div>

        <div className="order-1 md:order-2 relative">
          <div
            className="relative aspect-[4/5] rounded-[var(--radius)] overflow-hidden"
            style={{ background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, var(--background)))` }}
          >
            {heroUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={heroUrl}
                alt={business?.businessName ?? ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <span
                  style={{ fontFamily: 'var(--font-heading)' }}
                  className="text-8xl md:text-9xl font-black text-[var(--background)]/20 select-none"
                >
                  {(business?.businessName ?? '?')[0].toUpperCase()}
                </span>
              </div>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-[var(--foreground)]/10 rounded-[inherit] pointer-events-none" />
          </div>
          <div
            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-[var(--radius)] border border-[var(--hairline)] hidden md:block"
            style={{ background: 'var(--accent)', opacity: 0.15 }}
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
