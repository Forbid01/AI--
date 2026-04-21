import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function Banner({ content = [], theme }) {
  const style = themeToCssVars(theme);
  const stats = Array.isArray(content) ? content : (content?.items ?? []);

  return (
    <section id="stats" style={style}>
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div
          className="rounded-[var(--radius)] p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10"
          style={{
            background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, var(--background)))`,
            color: 'var(--background)',
          }}
        >
          {stats.map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <div
                style={{ fontFamily: 'var(--font-heading)' }}
                className="text-4xl md:text-6xl font-black tracking-tighter"
              >
                {s.value}
              </div>
              <div className="mt-2 text-xs md:text-sm opacity-75 uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
