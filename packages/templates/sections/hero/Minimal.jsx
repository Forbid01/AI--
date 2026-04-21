import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function Minimal({ content = {}, theme, business }) {
  const style = themeToCssVars(theme);

  return (
    <section
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-40">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            {business?.industry && (
              <span className="block text-[11px] font-mono text-[var(--muted)] mb-8">
                — {business.industry}
              </span>
            )}
            <h1
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]"
            >
              {content.title || business?.businessName}
            </h1>
          </div>

          {content.subtitle && (
            <div className="md:col-span-4">
              <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed border-l border-[var(--hairline)] pl-5">
                {content.subtitle}
              </p>
            </div>
          )}
        </div>

        <div className="mt-16 flex items-center gap-6 border-t border-[var(--hairline)] pt-8">
          {content.ctaPrimary && (
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors group"
            >
              {content.ctaPrimary}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          )}
          {content.ctaSecondary && (
            <a
              href="#services"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {content.ctaSecondary}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
