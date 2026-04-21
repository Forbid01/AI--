import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function SplitText({ content = {}, theme, business }) {
  const style = themeToCssVars(theme);

  return (
    <section
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            {business?.industry && (
              <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-6">
                {business.industry}
              </span>
            )}
            <h1
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1]"
            >
              {content.title || business?.businessName}
            </h1>
          </div>

          <div className="space-y-8">
            {content.subtitle && (
              <p className="text-xl md:text-2xl text-[var(--foreground)] leading-relaxed font-light">
                {content.subtitle}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {content.ctaPrimary && (
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-[var(--radius)] font-semibold transition-all"
                  style={{ background: 'var(--accent)', color: 'var(--background)' }}
                >
                  {content.ctaPrimary}
                  <span aria-hidden>→</span>
                </a>
              )}
              {content.ctaSecondary && (
                <a
                  href="#services"
                  className="inline-flex items-center h-12 px-6 rounded-[var(--radius)] font-semibold border border-[var(--hairline)] text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all"
                >
                  {content.ctaSecondary}
                </a>
              )}
            </div>

            {(business?.contactEmail || business?.contactPhone) && (
              <dl className="pt-8 border-t border-[var(--hairline)] grid grid-cols-2 gap-4 text-sm">
                {business.contactEmail && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Email</dt>
                    <dd className="font-medium">{business.contactEmail}</dd>
                  </div>
                )}
                {business.contactPhone && (
                  <div>
                    <dt className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">Tel</dt>
                    <dd className="font-medium">{business.contactPhone}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
