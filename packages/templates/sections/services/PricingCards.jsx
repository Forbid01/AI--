import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function PricingCards({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const services = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="services"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Үнийн багц', 'Pricing')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Танд тохирсон сонголт', 'Choose what fits')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const featured = i === Math.floor(services.length / 2);
            return (
              <article
                key={i}
                className={[
                  'relative p-8 rounded-[var(--radius)] border transition-all',
                  featured
                    ? 'border-[var(--accent)] bg-[var(--accent)]/5 md:scale-[1.03] shadow-xl'
                    : 'border-[var(--hairline)] hover:border-[var(--accent)]/50',
                ].join(' ')}
              >
                {featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--accent)] text-[var(--background)] text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {L(locale, 'Санал болгох', 'Popular')}
                  </span>
                )}

                <h3
                  style={{ fontFamily: 'var(--font-heading)' }}
                  className="text-xl font-bold mb-1"
                >
                  {s.title}
                </h3>

                {s.price && (
                  <div className="my-4">
                    <span
                      style={{ fontFamily: 'var(--font-heading)' }}
                      className="text-4xl font-black text-[var(--accent)] tracking-tighter"
                    >
                      {s.price}
                    </span>
                  </div>
                )}

                <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
                  {s.description}
                </p>

                <a
                  href="#contact"
                  className={[
                    'block text-center h-11 leading-[44px] rounded-[var(--radius)] font-semibold transition-all',
                    featured
                      ? 'bg-[var(--accent)] text-[var(--background)]'
                      : 'border border-[var(--hairline)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
                  ].join(' ')}
                >
                  {L(locale, 'Сонгох', 'Choose')}
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
