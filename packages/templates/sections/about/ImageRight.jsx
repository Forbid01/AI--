import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function ImageRight({ content = {}, theme, assets, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const img = assets?.gallery?.[0]?.url || assets?.hero?.url;

  return (
    <section
      id="about"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-5 gap-10 md:gap-16 items-center">
        <div className="md:col-span-3">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {business?.industry || L(locale, 'Бидний тухай', 'About us')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]"
          >
            {content.title}
          </h2>
          {content.body && (
            <div className="mt-6 space-y-4 text-[var(--muted)] leading-relaxed text-base md:text-lg">
              {content.body.split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          {Array.isArray(content.highlights) && content.highlights.length > 0 && (
            <ul className="mt-8 space-y-3">
              {content.highlights.slice(0, 4).map((h, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  <span className="text-[var(--foreground)]/85">{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="md:col-span-2">
          <div
            className="aspect-[4/5] rounded-[var(--radius)] overflow-hidden relative"
            style={{ background: `linear-gradient(160deg, var(--accent), color-mix(in srgb, var(--accent) 40%, var(--background)))` }}
          >
            {img ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={img} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <span style={{ fontFamily: 'var(--font-heading)' }} className="text-8xl font-black text-[var(--background)]/25">
                  {(business?.businessName ?? '?')[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
