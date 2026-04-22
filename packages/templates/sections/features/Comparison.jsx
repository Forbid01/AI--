import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Comparison({ content = [], theme, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const rows = Array.isArray(content) ? content : (content?.items ?? []);
  const brand = business?.businessName || L(locale, 'Бид', 'Us');

  return (
    <section
      id="features"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-5xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {L(locale, 'Харьцуулалт', 'Compared')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {L(locale, 'Ялгаа нь юунд вэ', 'What sets us apart')}
          </h2>
        </div>

        <div className="rounded-[var(--radius)] border border-[var(--hairline)] overflow-hidden">
          <div className="grid grid-cols-3 bg-[var(--foreground)]/5">
            <div className="p-4 md:p-5 text-xs md:text-sm font-semibold text-[var(--muted)]">
              {L(locale, 'Шинж чанар', 'Feature')}
            </div>
            <div
              className="p-4 md:p-5 text-xs md:text-sm font-bold text-center"
              style={{ background: 'color-mix(in srgb, var(--accent) 18%, transparent)' }}
            >
              {brand}
            </div>
            <div className="p-4 md:p-5 text-xs md:text-sm font-semibold text-center text-[var(--muted)]">
              {L(locale, 'Бусад', 'Others')}
            </div>
          </div>

          {rows.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 ${i < rows.length - 1 ? 'border-b border-[var(--hairline)]' : ''}`}
            >
              <div className="p-4 md:p-5 text-sm md:text-base">
                <div className="font-semibold">{r.title}</div>
                {r.description && (
                  <div className="text-xs text-[var(--muted)] mt-1">{r.description}</div>
                )}
              </div>
              <div
                className="p-4 md:p-5 text-center text-[var(--accent)]"
                style={{ background: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}
              >
                <span className="inline-block text-xl font-bold">✓</span>
              </div>
              <div className="p-4 md:p-5 text-center text-[var(--muted)]/60">
                <span className="inline-block text-xl font-bold">—</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
