import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Grid({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const items = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="testimonials"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-3">
            {L(locale, 'Сэтгэгдэл', 'Testimonials')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight"
          >
            {L(locale, 'Үйлчлүүлэгчид юу хэлдэг', 'What clients say')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <blockquote
              key={i}
              className="p-6 rounded-[var(--radius)] border border-[var(--hairline)] bg-[var(--background)] flex flex-col"
            >
              <span className="text-[var(--accent)] font-black text-4xl leading-none mb-4" aria-hidden>
                "
              </span>
              <p className="text-sm md:text-base leading-relaxed flex-1 text-[var(--foreground)]">
                {t.quote}
              </p>
              <footer className="mt-5 pt-4 border-t border-[var(--hairline)] flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full grid place-items-center text-sm font-bold shrink-0"
                  style={{ background: 'var(--accent)', color: 'var(--background)' }}
                >
                  {(t.author ?? '?')[0].toUpperCase()}
                </div>
                <div>
                  <cite className="not-italic font-semibold text-sm block">{t.author}</cite>
                  {t.role && (
                    <span className="text-xs text-[var(--muted)]">{t.role}</span>
                  )}
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
