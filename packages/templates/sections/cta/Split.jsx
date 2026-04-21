import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Split({ content = {}, theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);

  return (
    <section
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)] border-y border-[var(--hairline)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-3xl md:text-4xl font-black tracking-tight leading-[1.1]"
            >
              {content.title || L(locale, 'Эхлэхэд бэлэн үү?', 'Ready to start?')}
            </h2>
            {content.body && (
              <p className="mt-4 text-[var(--muted)] leading-relaxed">
                {content.body}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a
              href={business?.contactEmail ? `mailto:${business.contactEmail}` : '#contact'}
              className="inline-flex items-center gap-2 h-12 px-6 rounded-[var(--radius)] font-semibold transition-all"
              style={{ background: 'var(--accent)', color: 'var(--background)' }}
            >
              {content.ctaLabel || L(locale, 'Холбогдох', 'Contact us')}
              <span aria-hidden>→</span>
            </a>
            {business?.contactPhone && (
              <a
                href={`tel:${business.contactPhone}`}
                className="inline-flex items-center h-12 px-6 rounded-[var(--radius)] border border-[var(--hairline)] hover:border-[var(--accent)] font-semibold transition-all"
              >
                {business.contactPhone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
