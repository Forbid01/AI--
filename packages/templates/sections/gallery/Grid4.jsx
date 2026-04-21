import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Grid4({ theme, assets, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const images = Array.isArray(assets?.gallery) ? assets.gallery : [];

  if (images.length === 0) {
    return (
      <section id="gallery" style={style} className="bg-[var(--background)] text-[var(--foreground)]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div
            className="aspect-[3/1] rounded-[var(--radius)]"
            style={{ background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 30%, var(--background)))` }}
          />
        </div>
      </section>
    );
  }

  return (
    <section
      id="gallery"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-2">
              {L(locale, 'Галерей', 'Gallery')}
            </span>
            <h2
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-3xl md:text-4xl font-black tracking-tight"
            >
              {L(locale, 'Ажлын орчноос', 'Behind the scenes')}
            </h2>
          </div>
          <span className="text-xs text-[var(--muted)]">{images.length} {L(locale, 'зураг', 'photos')}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {images.slice(0, 4).map((img, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              src={img.url}
              alt={img.prompt ?? ''}
              className="aspect-square rounded-[var(--radius)] object-cover w-full hover:scale-[1.02] transition-transform cursor-pointer"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
