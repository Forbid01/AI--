import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function List({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const services = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="services"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <div className="mb-14">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Үйлчилгээ', 'Services')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Бид юу хийдэг вэ', 'What we do')}
          </h2>
        </div>

        <ul className="divide-y divide-[var(--hairline)]">
          {services.map((s, i) => (
            <li key={i} className="py-6 flex items-start gap-6 group">
              <span className="text-sm font-mono text-[var(--muted)] pt-1 w-8 shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-lg md:text-xl font-bold group-hover:text-[var(--accent)] transition-colors"
                  >
                    {s.title}
                  </h3>
                  {s.price && (
                    <span className="shrink-0 text-sm font-semibold text-[var(--accent)]">
                      {s.price}
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
                  {s.description}
                </p>
              </div>
              <span className="text-[var(--muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all shrink-0 pt-1" aria-hidden>
                →
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
