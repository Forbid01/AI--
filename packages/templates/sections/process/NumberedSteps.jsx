import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function NumberedSteps({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const steps = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="process"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl mb-14">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Үйл явц', 'Process')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Бид хэрхэн ажилладаг', 'How we work')}
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-4 left-10 right-0 h-px bg-[var(--hairline)]"
                  aria-hidden
                />
              )}
              <div
                style={{ fontFamily: 'var(--font-heading)' }}
                className="relative z-10 h-8 w-8 rounded-full bg-[var(--accent)] text-[var(--background)] grid place-items-center text-sm font-bold mb-5"
              >
                {i + 1}
              </div>
              <h3
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-lg font-bold mb-2"
              >
                {s.title}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
