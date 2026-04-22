import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Carousel({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const items = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="testimonials"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 pt-20 md:pt-28">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Үйлчлүүлэгчид', 'Testimonials')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Үг бол үйлдэлээсээ өмнө', 'Hear from our clients')}
          </h2>
        </div>
      </div>

      <div className="pb-20 md:pb-28">
        <div
          className="flex gap-5 overflow-x-auto px-6 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          {items.map((t, i) => (
            <figure
              key={i}
              className="snap-start shrink-0 w-[320px] md:w-[420px] p-8 rounded-[var(--radius)] border border-[var(--hairline)] bg-[var(--background)]"
            >
              <span className="block text-5xl leading-none text-[var(--accent)] mb-4 font-serif">“</span>
              <blockquote
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-lg md:text-xl leading-snug mb-6"
              >
                {t.quote}
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-5 border-t border-[var(--hairline)]">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'var(--accent)', color: 'var(--background)' }}
                >
                  {(t.name ?? '?')[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  {t.role && <div className="text-xs text-[var(--muted)]">{t.role}</div>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
