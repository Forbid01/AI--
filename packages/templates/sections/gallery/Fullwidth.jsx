import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
        {(images.length > 0 ? images : [null, null, null]).map((img, i) => (
          <div
            key={i}
            className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden"
            style={{ background: `linear-gradient(${120 + i * 40}deg, var(--accent), color-mix(in srgb, var(--accent) 40%, var(--background)))` }}
          >
            {img?.url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            ) : null}
            <div
              className="absolute inset-x-0 bottom-0 p-5 text-white text-xs font-mono tracking-[0.2em] uppercase"
              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.55))' }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>
      <div className="pb-20 md:pb-28" />
    </section>
  );
}
