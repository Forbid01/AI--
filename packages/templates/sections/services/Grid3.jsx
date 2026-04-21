import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Grid3({ content = [], theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const services = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="services"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Үйлчилгээ', 'Services')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Юу санал болгож байна', 'What we offer')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => (
            <article
              key={i}
              className="p-6 rounded-[var(--radius)] border border-[var(--hairline)] hover:border-[var(--accent)] transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-[10px] font-mono text-[var(--muted)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.price && (
                  <span className="text-sm font-semibold text-[var(--accent)]">{s.price}</span>
                )}
              </div>
              <h3
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors"
              >
                {s.title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{s.description}</p>
            </article>
          ))}
        </div>

        {business?.contactPhone && (
          <div className="mt-12 text-center">
            <a
              href={`tel:${business.contactPhone}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {L(locale, 'Дэлгэрэнгүй асуух', 'Learn more')} — {business.contactPhone}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
