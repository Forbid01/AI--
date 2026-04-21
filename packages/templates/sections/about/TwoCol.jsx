import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function TwoCol({ content = {}, theme, assets, business }) {
  const style = themeToCssVars(theme);
  const galleryUrl = assets?.gallery?.[0]?.url;

  return (
    <section
      id="about"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
            {business?.industry || 'About'}
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
        </div>

        <div className="aspect-square rounded-[var(--radius)] overflow-hidden relative"
             style={{ background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 40%, var(--background)))` }}>
          {galleryUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={galleryUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <span style={{ fontFamily: 'var(--font-heading)' }} className="text-8xl font-black text-[var(--background)]/20">
                {(business?.businessName ?? '?')[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
