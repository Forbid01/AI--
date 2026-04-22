import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function QuoteWall({ content = [], theme, locale = 'mn' }) {
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
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Үйлчлүүлэгчид', 'Testimonials')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Бүрэн итгэлтэйгээр', 'Words they trust us with')}
          </h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
          {items.map((t, i) => {
            const tone = i % 3;
            const padding = tone === 0 ? 'p-6' : tone === 1 ? 'p-8' : 'p-7';
            const bg =
              tone === 0
                ? 'bg-[var(--foreground)]/[0.03] border border-[var(--hairline)]'
                : tone === 1
                  ? 'text-[var(--background)]'
                  : 'border border-[var(--hairline)]';
            return (
              <figure
                key={i}
                className={`${bg} ${padding} rounded-[var(--radius)] mb-5 break-inside-avoid`}
                style={tone === 1 ? { background: 'var(--accent)' } : undefined}
              >
                <span className={`block text-4xl leading-none mb-3 font-serif ${tone === 1 ? 'text-[var(--background)]/60' : 'text-[var(--accent)]'}`}>
                  “
                </span>
                <blockquote
                  className={`text-base leading-snug ${tone === 1 ? 'font-medium' : ''}`}
                >
                  {t.quote}
                </blockquote>
                <figcaption className={`mt-5 text-xs ${tone === 1 ? 'text-[var(--background)]/80' : 'text-[var(--muted)]'}`}>
                  <div className="font-semibold">{t.name}</div>
                  {t.role && <div className="mt-0.5">{t.role}</div>}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
