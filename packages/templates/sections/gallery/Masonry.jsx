import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Masonry({ theme, assets, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const images = Array.isArray(assets?.gallery) ? assets.gallery : [];

  const tiles = images.length > 0 ? images : Array.from({ length: 4 }).map((_, i) => ({ placeholder: true, i }));

  return (
    <section
      id="gallery"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="mb-10 text-center">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-3">
            {L(locale, 'Галерей', 'Gallery')}
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight"
          >
            {L(locale, 'Хормын хувилбар', 'Moments')}
          </h2>
        </div>

        <div className="columns-2 md:columns-3 gap-3 space-y-3">
          {tiles.map((img, i) => {
            const aspect = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[5/4]'][i % 4];
            if (img.placeholder) {
              return (
                <div
                  key={i}
                  className={`break-inside-avoid ${aspect} rounded-[var(--radius)]`}
                  style={{ background: `linear-gradient(${30 + i * 60}deg, color-mix(in srgb, var(--accent) 30%, var(--background)), var(--accent))` }}
                />
              );
            }
            return (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                src={img.url}
                alt={img.prompt ?? ''}
                className={`break-inside-avoid ${aspect} w-full rounded-[var(--radius)] object-cover mb-3`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
