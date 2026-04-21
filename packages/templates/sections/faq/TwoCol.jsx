import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function TwoCol({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const items = Array.isArray(content) ? content : (content?.items ?? []);
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);

  return (
    <section
      id="faq"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-3">
            FAQ
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl"
          >
            {L(locale, 'Танд хариулт бэлэн', 'Answers, ready')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
          {[left, right].map((col, ci) => (
            <div key={ci} className="space-y-8">
              {col.map((q, i) => (
                <div key={i}>
                  <h3
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-lg font-bold mb-2"
                  >
                    {q.question}
                  </h3>
                  <p className="text-[var(--muted)] leading-relaxed">{q.answer}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
