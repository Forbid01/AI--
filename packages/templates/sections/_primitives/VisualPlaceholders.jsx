const GALLERY_CAPTIONS = [
  'Signature scene',
  'Atmosphere',
  'Featured detail',
  'Customer moment',
  'Studio highlight',
];

export function HeroVisualPlaceholder({
  businessName = '',
  industry = '',
  mode = 'panel',
  className = '',
}) {
  const initial = (businessName || '?').trim().charAt(0).toUpperCase() || '?';
  const isImmersive = mode === 'immersive';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 18% 20%, color-mix(in srgb, var(--accent) 34%, white) 0%, transparent 34%),
            radial-gradient(circle at 82% 18%, color-mix(in srgb, var(--foreground) 14%, transparent) 0%, transparent 28%),
            linear-gradient(135deg, color-mix(in srgb, var(--accent) 82%, #0f172a) 0%, color-mix(in srgb, var(--background) 25%, #020617) 48%, #020617 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: isImmersive ? '96px 96px' : '72px 72px',
        }}
      />
      <div
        className={`absolute rounded-full blur-3xl ${isImmersive ? 'h-56 w-56 -top-16 -left-8' : 'h-40 w-40 -top-10 -left-8'}`}
        style={{ background: 'color-mix(in srgb, var(--accent) 42%, transparent)' }}
      />
      <div
        className={`absolute rounded-full blur-3xl ${isImmersive ? 'h-64 w-64 -bottom-20 right-0' : 'h-44 w-44 -bottom-16 -right-6'}`}
        style={{ background: 'color-mix(in srgb, white 12%, transparent)' }}
      />

      <div className={`relative z-10 flex h-full ${isImmersive ? 'items-end' : 'items-stretch'}`}>
        <div className={`w-full ${isImmersive ? 'p-6 md:p-10' : 'p-5 md:p-7'} flex flex-col justify-between`}>
          <div className="flex items-start justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/[0.78] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-white/80" />
              Visual system
            </div>
            <div className="rounded-2xl border border-white/[0.12] bg-white/[0.08] px-4 py-3 backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-[0.24em] text-white/50">Mode</div>
              <div className="mt-1 text-sm font-semibold text-white">
                {isImmersive ? 'Cinematic' : 'Editorial'}
              </div>
            </div>
          </div>

          <div className={`${isImmersive ? 'max-w-2xl' : 'max-w-md'}`}>
            {industry ? (
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/[0.58]">
                {industry}
              </div>
            ) : null}
            <div
              style={{ fontFamily: 'var(--font-heading)' }}
              className={`${isImmersive ? 'mt-4 text-4xl md:text-6xl' : 'mt-3 text-3xl md:text-4xl'} font-black tracking-tight text-white`}
            >
              {businessName || 'Your brand here'}
            </div>
            <p className={`${isImmersive ? 'mt-4 max-w-xl text-base md:text-lg' : 'mt-3 text-sm md:text-base'} text-white/[0.72] leading-relaxed`}>
              Crafted layout, polished typography, and a branded visual shell appear instantly while AI imagery is still arriving.
            </p>
          </div>

          <div className={`grid gap-3 ${isImmersive ? 'mt-8 max-w-3xl md:grid-cols-3' : 'mt-6 md:grid-cols-2'}`}>
            <InfoCard label="Look" value="Premium" />
            <InfoCard label="Layout" value="Adaptive" />
            <InfoCard label="Motion" value={isImmersive ? 'Layered' : 'Refined'} />
          </div>
        </div>
      </div>

      <div className={`absolute ${isImmersive ? 'right-6 top-6 md:right-10 md:top-10' : 'right-5 top-5 md:right-7 md:top-7'} rounded-[28px] border border-white/[0.14] bg-black/[0.18] p-4 md:p-5 backdrop-blur-xl shadow-[0_30px_80px_-35px_rgba(0,0,0,0.65)]`}>
        <div className="flex items-center gap-2">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/[0.14] text-lg font-black text-white">
            {initial}
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/[0.48]">Brand</div>
            <div className="mt-1 text-sm font-semibold text-white">
              {businessName || 'Modern identity'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.12] bg-white/[0.09] px-4 py-3 backdrop-blur-md">
      <div className="text-[10px] uppercase tracking-[0.24em] text-white/[0.48]">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

export function GalleryVisualTile({
  image,
  index = 0,
  className = '',
}) {
  const caption = GALLERY_CAPTIONS[index % GALLERY_CAPTIONS.length];

  return (
    <article className={`group relative isolate overflow-hidden rounded-[var(--radius)] border border-[var(--hairline)] bg-[#020617] shadow-[0_26px_60px_-30px_rgba(2,6,23,0.7)] ${className}`}>
      {image?.url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.url}
            alt={image.prompt ?? ''}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/[0.72] via-black/10 to-transparent" />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 18% 20%, rgba(255,255,255,0.18) 0%, transparent 26%),
                radial-gradient(circle at 78% 16%, color-mix(in srgb, var(--accent) 38%, white) 0%, transparent 28%),
                linear-gradient(145deg, color-mix(in srgb, var(--accent) 72%, #0f172a) 0%, #0b1120 58%, #020617 100%)
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px)
              `,
              backgroundSize: '44px 44px',
            }}
          />
          <div className="absolute left-5 top-5 text-5xl font-black text-white/[0.14]">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="absolute right-4 top-4 h-10 w-10 rounded-2xl border border-white/[0.14] bg-white/10 backdrop-blur-md" />
          <div className="absolute bottom-6 left-6 h-16 w-16 rounded-full border border-white/[0.12] bg-white/10 blur-[1px]" />
        </>
      )}

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
        <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/[0.56]">
          {String(index + 1).padStart(2, '0')}
        </div>
        <div className="mt-1 text-sm md:text-base font-semibold">{caption}</div>
      </div>
    </article>
  );
}
