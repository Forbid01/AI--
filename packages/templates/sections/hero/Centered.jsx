import { themeToCssVars } from '../_primitives/SectionShell.jsx';
import { HeroVisualPlaceholder } from '../_primitives/VisualPlaceholders.jsx';

export default function Centered({ content = {}, theme, assets, business }) {
  const style = themeToCssVars(theme);
  const heroUrl = assets?.hero?.url;

  return (
    <section
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        {business?.industry && (
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-6">
            {business.industry}
          </span>
        )}

        <h1
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02]"
        >
          {content.title || business?.businessName}
        </h1>

        {content.subtitle && (
          <p className="mt-6 text-lg md:text-xl text-[var(--muted)] leading-relaxed max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        )}

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          {content.ctaPrimary && (
            <a
              href="#contact"
              className="inline-flex items-center justify-center h-12 px-7 rounded-[var(--radius)] font-semibold shadow-lg transition-all hover:scale-[1.02]"
              style={{ background: 'var(--accent)', color: 'var(--background)' }}
            >
              {content.ctaPrimary}
            </a>
          )}
          {content.ctaSecondary && (
            <a
              href="#services"
              className="inline-flex items-center justify-center h-12 px-7 rounded-[var(--radius)] font-semibold border border-[var(--hairline)] text-[var(--foreground)] hover:bg-[var(--foreground)]/5 transition-all"
            >
              {content.ctaSecondary}
            </a>
          )}
        </div>

        <div
          className="mt-16 aspect-[16/9] rounded-[var(--radius)] overflow-hidden border border-[var(--hairline)] shadow-2xl"
          style={{ boxShadow: '0 30px 80px -20px color-mix(in srgb, var(--accent) 30%, transparent)' }}
        >
          {heroUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={heroUrl} alt={business?.businessName ?? ''} className="w-full h-full object-cover" />
          ) : (
            <HeroVisualPlaceholder
              businessName={business?.businessName}
              industry={business?.industry}
              className="h-full"
            />
          )}
        </div>
      </div>
    </section>
  );
}
