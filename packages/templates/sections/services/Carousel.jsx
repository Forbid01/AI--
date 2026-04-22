import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Carousel({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const services = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="services"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-6">
        <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
          {L(locale, 'Үйлчилгээ', 'Services')}
        </span>
        <h2
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] max-w-2xl"
        >
          {L(locale, 'Хажуу тийш гүйлгэж харна уу', 'Slide to explore')}
        </h2>
      </div>

      <div className="pb-20 md:pb-28 pt-8">
        <div
          className="flex gap-5 overflow-x-auto px-6 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          {services.map((s, i) => (
            <article
              key={i}
              className="snap-start shrink-0 w-[300px] md:w-[380px] p-8 rounded-[var(--radius)] border border-[var(--hairline)] bg-[var(--background)] hover:border-[var(--accent)] transition-colors"
            >
              <span className="block text-[10px] font-mono text-[var(--muted)] mb-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-xl md:text-2xl font-bold mb-3"
              >
                {s.title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
                {s.description}
              </p>
              {s.price && (
                <div className="text-sm font-semibold text-[var(--accent)]">{s.price}</div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
