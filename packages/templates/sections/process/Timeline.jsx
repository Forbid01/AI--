import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Timeline({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const steps = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="process"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <div className="mb-14">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Үйл явц', 'Process')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Алхам алхмаар', 'Step by step')}
          </h2>
        </div>

        <ol className="relative border-l-2 border-[var(--hairline)] pl-8 space-y-10">
          {steps.map((s, i) => (
            <li key={i} className="relative">
              <span
                className="absolute -left-[37px] top-0 h-7 w-7 rounded-full grid place-items-center text-[10px] font-bold"
                style={{
                  background: 'var(--background)',
                  color: 'var(--accent)',
                  border: '2px solid var(--accent)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-xl md:text-2xl font-bold mb-2"
              >
                {s.title}
              </h3>
              <p className="text-[var(--muted)] leading-relaxed">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
