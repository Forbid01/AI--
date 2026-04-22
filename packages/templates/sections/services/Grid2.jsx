import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Grid2({ content = [], theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const services = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="services"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
              {L(locale, 'Үйлчилгээ', 'Services')}
            </span>
            <h2
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
            >
              {L(locale, 'Таны бизнесийг өсгөх шийдлүүд', 'Solutions that scale')}
            </h2>
          </div>
          {business?.contactPhone && (
            <a
              href={`tel:${business.contactPhone}`}
              className="inline-flex items-center text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              {business.contactPhone} →
            </a>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {services.map((s, i) => (
            <article
              key={i}
              className="p-8 md:p-10 rounded-[var(--radius)] border border-[var(--hairline)] hover:border-[var(--accent)] transition-colors group relative overflow-hidden"
            >
              <div
                className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ background: 'var(--accent)' }}
                aria-hidden
              />
              <span className="block text-[10px] font-mono text-[var(--muted)] mb-5">
                {String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
              </span>
              <h3
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors"
              >
                {s.title}
              </h3>
              <p className="text-base text-[var(--muted)] leading-relaxed">{s.description}</p>
              {s.price && (
                <div className="mt-6 pt-6 border-t border-[var(--hairline)] text-sm font-semibold text-[var(--accent)]">
                  {s.price}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
