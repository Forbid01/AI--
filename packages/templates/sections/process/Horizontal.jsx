import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Horizontal({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const steps = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="process"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="mb-14 max-w-2xl">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Ажиллах зарчим', 'How we work')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Зүүнээс баруун тийш', 'Left to right')}
          </h2>
        </div>

        <div className="relative">
          <div className="absolute top-6 left-0 right-0 h-px bg-[var(--hairline)]" aria-hidden />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
            {steps.slice(0, 4).map((s, i) => (
              <div key={i} className="relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-5 relative z-10 bg-[var(--background)] border-2"
                  style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3
                  style={{ fontFamily: 'var(--font-heading)' }}
                  className="text-lg md:text-xl font-bold mb-2"
                >
                  {s.title}
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
