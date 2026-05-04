import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';
import { GalleryVisualTile } from '../_primitives/VisualPlaceholders.jsx';

export default function Fullwidth({ theme, assets, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const images = (assets?.gallery ?? []).slice(0, 3);

  return (
    <section
      id="gallery"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-10">
        <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-4">
          {L(locale, 'Галлерей', 'Gallery')}
        </span>
        <h2
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] max-w-2xl"
        >
          {L(locale, 'Бодит мэдрэмжээр', 'In pictures')}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 px-6 md:grid-cols-12 md:auto-rows-[132px] md:gap-4 md:px-6">
        <GalleryVisualTile image={images[0]} index={0} className="aspect-[4/5] md:col-span-4 md:row-span-3 md:aspect-auto" />
        <GalleryVisualTile image={images[1]} index={1} className="aspect-[4/5] md:col-span-4 md:row-span-4 md:aspect-auto" />
        <GalleryVisualTile image={images[2]} index={2} className="aspect-[4/5] md:col-span-4 md:row-span-3 md:aspect-auto" />
      </div>
      <div className="pb-20 md:pb-28" />
    </section>
  );
}
