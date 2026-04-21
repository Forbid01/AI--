import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function Inline({ content = [], theme }) {
  const style = themeToCssVars(theme);
  const stats = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section
      id="stats"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)] border-y border-[var(--hairline)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {stats.map((s, i) => (
            <div key={i} className={i > 0 ? 'md:border-l md:border-[var(--hairline)] md:pl-10' : ''}>
              <div
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-4xl md:text-5xl font-black text-[var(--accent)] tracking-tighter"
              >
                {s.value}
              </div>
              <div className="mt-2 text-xs md:text-sm text-[var(--muted)] uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
