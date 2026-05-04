import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';
import { GalleryVisualTile } from '../_primitives/VisualPlaceholders.jsx';

const TILE_LAYOUT = [
  'aspect-[4/3] md:col-span-7 md:row-span-3 md:aspect-auto',
  'aspect-[4/5] md:col-span-5 md:row-span-2 md:aspect-auto',
  'aspect-[4/3] md:col-span-4 md:row-span-2 md:aspect-auto',
  'aspect-[4/3] md:col-span-3 md:row-span-2 md:aspect-auto',
  'aspect-[4/3] md:col-span-5 md:row-span-3 md:aspect-auto',
];

export default function Masonry({ theme, assets, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const images = Array.isArray(assets?.gallery) ? assets.gallery : [];
  const tiles = Array.from({ length: Math.max(images.length, 5) }).map((_, i) => images[i] ?? null).slice(0, 5);

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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:auto-rows-[120px] md:gap-4">
          {tiles.map((img, i) => (
            <GalleryVisualTile
              key={img?.url ?? `placeholder-${i}`}
              image={img}
              index={i}
              className={TILE_LAYOUT[i] ?? TILE_LAYOUT[TILE_LAYOUT.length - 1]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
