import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Checklist({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const items = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="features"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Онцлогууд', 'What you get')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Багтаан буй зүйлс', 'Everything included')}
          </h2>
        </div>

        <ul className="grid md:grid-cols-2 gap-x-10 gap-y-4 text-base md:text-lg">
          {items.map((f, i) => (
            <li key={i} className="flex items-start gap-3 py-2">
              <span
                className="shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: 'var(--accent)' }}
              >
                <svg viewBox="0 0 20 20" fill="none" className="w-3 h-3">
                  <path d="M4 10l3.5 3.5L16 5" stroke="var(--background)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                <strong className="font-semibold">{f.title}</strong>
                {f.description && (
                  <span className="block text-sm text-[var(--muted)] mt-0.5">
                    {f.description}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
