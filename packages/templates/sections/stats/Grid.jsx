import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Grid({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const items = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="stats"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Тоон баримт', 'By the numbers')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Бидний хийсэн ажил', 'What we have delivered')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--hairline)] rounded-[var(--radius)] overflow-hidden">
          {items.map((stat, i) => (
            <div key={i} className="bg-[var(--background)] p-8 md:p-10">
              <div
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-4xl md:text-6xl font-black tabular-nums text-[var(--accent)] leading-none mb-3"
              >
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-semibold">{stat.label}</div>
              {stat.description && (
                <div className="text-xs text-[var(--muted)] mt-1.5">{stat.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
