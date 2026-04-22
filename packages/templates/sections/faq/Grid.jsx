import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Grid({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const items = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="faq"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Асуулт', 'FAQ')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Түгээмэл асуулт хариулт', 'Common questions')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {items.map((q, i) => (
            <div
              key={i}
              className="p-6 md:p-7 rounded-[var(--radius)] border border-[var(--hairline)] hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  style={{ background: 'var(--accent)', color: 'var(--background)' }}
                  className="shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                >
                  Q
                </span>
                <h3
                  style={{ fontFamily: 'var(--font-heading)' }}
                  className="font-bold text-base md:text-lg leading-snug"
                >
                  {q.question}
                </h3>
              </div>
              <p className="ml-9 text-sm md:text-base text-[var(--muted)] leading-relaxed">
                {q.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
