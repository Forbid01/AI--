import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Banner({ content = {}, theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);

  return (
    <section
      id="cta"
      style={style}
      className="text-[var(--background)] relative overflow-hidden"
    >
      <div
        className="relative"
        style={{ background: `linear-gradient(115deg, var(--primary), var(--accent))` }}
      >
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-40"
          style={{ background: 'var(--accent)' }}
          aria-hidden
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{ background: 'var(--background)' }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-xl">
            <h2
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
            >
              {content.title || L(locale, 'Өнөөдөр эхэлцгээе', 'Ready to start?')}
            </h2>
            {content.subtitle && (
              <p className="mt-4 text-base md:text-lg text-[var(--background)]/85">
                {content.subtitle}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href={business?.contactPhone ? `tel:${business.contactPhone}` : '#contact'}
              className="inline-flex items-center justify-center h-12 px-7 rounded-[var(--radius)] font-semibold shadow-lg transition-transform hover:scale-[1.03]"
              style={{ background: 'var(--background)', color: 'var(--primary)' }}
            >
              {content.ctaPrimary || L(locale, 'Холбоо барих', 'Get in touch')}
            </a>
            {content.ctaSecondary && (
              <a
                href="#services"
                className="inline-flex items-center justify-center h-12 px-6 rounded-[var(--radius)] font-semibold border border-[var(--background)]/30 text-[var(--background)] hover:bg-[var(--background)]/10 transition-colors"
              >
                {content.ctaSecondary}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
