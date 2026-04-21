import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function StatsFirst({ content = {}, theme, business }) {
  const style = themeToCssVars(theme);
  const stats = Array.isArray(content.stats) ? content.stats.slice(0, 4) : [];

  return (
    <section
      id="about"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-b border-[var(--hairline)] pb-12 mb-12">
            {stats.map((s, i) => (
              <div key={i}>
                <div
                  style={{ fontFamily: 'var(--font-heading)' }}
                  className="text-4xl md:text-5xl font-black text-[var(--accent)] tracking-tighter"
                >
                  {s.value}
                </div>
                <div className="mt-2 text-sm text-[var(--muted)] uppercase tracking-widest">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
              {business?.industry || 'About'}
            </span>
            <h2
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-3xl md:text-4xl font-black tracking-tight leading-[1.1]"
            >
              {content.title}
            </h2>
          </div>
          <div className="md:col-span-8 md:col-start-6">
            {content.body && (
              <div className="space-y-4 text-[var(--muted)] text-base md:text-lg leading-relaxed">
                {content.body.split(/\n\n+/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
