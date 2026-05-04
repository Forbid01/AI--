import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';
import { GalleryVisualTile } from '../_primitives/VisualPlaceholders.jsx';

export default function Grid4({ theme, assets, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const images = Array.isArray(assets?.gallery) ? assets.gallery : [];
  const tiles = Array.from({ length: 4 }).map((_, i) => images[i] ?? null);

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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:auto-rows-[118px] md:gap-4">
          <GalleryVisualTile image={tiles[0]} index={0} className="aspect-[4/3] md:col-span-7 md:row-span-3 md:aspect-auto" />
          <GalleryVisualTile image={tiles[1]} index={1} className="aspect-[4/3] md:col-span-5 md:row-span-2 md:aspect-auto" />
          <GalleryVisualTile image={tiles[2]} index={2} className="aspect-[4/3] md:col-span-5 md:row-span-2 md:aspect-auto" />
          <GalleryVisualTile image={tiles[3]} index={3} className="aspect-[4/3] md:col-span-7 md:row-span-2 md:aspect-auto" />
        </div>
      </div>
    </section>
  );
}
