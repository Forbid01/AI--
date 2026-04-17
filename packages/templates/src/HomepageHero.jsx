/**
 * HomepageHero — split-layout hero with 2x2 image grid for SmartSite.mn.
 *
 * Self-contained, dark-mode-first, Tailwind-only. Drop into any Next.js 14
 * App Router project — no shadcn, no extra deps, no custom CSS.
 *
 * Inspired by the Midcentury template: editorial typography, large headline,
 * rounded-full primary CTA, layered Unsplash imagery on the right.
 *
 * @typedef {{ name?: string, headline?: string, description?: string }} Business
 * @typedef {{ src: string, alt: string }} HeroImage
 *
 * @param {{
 *   business?: Business,
 *   primaryCtaLabel?: string,
 *   secondaryCtaLabel?: string,
 *   primaryHref?: string,
 *   secondaryHref?: string,
 *   images?: HeroImage[],
 * }} props
 */
export default function HomepageHero({
  business,
  primaryCtaLabel = 'Үнэгүй эхлэх',
  secondaryCtaLabel = 'Жишээ үзэх',
  primaryHref = '#start',
  secondaryHref = '#examples',
  images,
}) {
  const grid = Array.isArray(images) && images.length === 4 ? images : DEFAULT_IMAGES;

  return (
    <section className="relative bg-[#0B0B0F] text-white overflow-hidden">
      {/* Ambient purple glow */}
      <div
        aria-hidden
        className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(124,58,237,0.45), transparent 60%)',
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-1/4 h-[320px] w-[320px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(34,211,238,0.35), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Left — copy */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            {business?.name || 'SmartSite.mn'}
          </span>

          <h1 className="mt-7 text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-[-0.03em] leading-[1.02]">
            {business?.headline || (
              <>
                AI-аар бүтсэн{' '}
                <span className="bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#22D3EE] bg-clip-text text-transparent">
                  премиум вэбсайт
                </span>{' '}
                хэдхэн минутад
              </>
            )}
          </h1>

          <p className="mt-7 text-lg md:text-xl text-white/65 leading-relaxed">
            {business?.description ||
              'Бизнесийнхээ тухай ярь — бид загвар, дизайн, контент, зургийг бүгдийг бэлдэнэ. Кодлох шаардлагагүй.'}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={primaryHref}
              className="group inline-flex items-center gap-2 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] px-7 py-3.5 text-sm font-semibold transition-all shadow-lg shadow-[#7C3AED]/30 hover:shadow-xl hover:shadow-[#7C3AED]/40"
            >
              {primaryCtaLabel}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 hover:border-white/30 hover:bg-white/5 px-7 py-3.5 text-sm font-semibold transition-colors"
            >
              {secondaryCtaLabel}
            </a>
          </div>

          {/* Trust row */}
          <div className="mt-12 flex items-center gap-5 text-sm text-white/55">
            <div className="flex -space-x-2">
              {DEFAULT_IMAGES.slice(0, 4).map((img, i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={i}
                  src={`${img.src}?w=80&h=80&fit=crop&auto=format&q=70`}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-[#0B0B0F] object-cover"
                  loading="lazy"
                />
              ))}
            </div>
            <span>
              <span className="text-white font-semibold">1,200+</span> бизнес SmartSite-ыг сонгожээ
            </span>
          </div>
        </div>

        {/* Right — 2x2 image grid */}
        <div className="relative">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 aspect-square">
            {grid.map((img, i) => (
              <figure
                key={i}
                className={[
                  'relative overflow-hidden rounded-2xl border border-white/10 bg-white/5',
                  i === 0 ? 'translate-y-2 lg:translate-y-4' : '',
                  i === 1 ? '-translate-y-2 lg:-translate-y-4' : '',
                  i === 2 ? '-translate-y-2 lg:-translate-y-4' : '',
                  i === 3 ? 'translate-y-2 lg:translate-y-4' : '',
                ].join(' ')}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${img.src}?w=800&fit=crop&auto=format&q=75`}
                  alt={img.alt}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading={i < 2 ? 'eager' : 'lazy'}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/30 via-transparent to-transparent pointer-events-none"
                />
              </figure>
            ))}
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-2 -left-2 lg:-bottom-4 lg:-left-4 rounded-2xl bg-[#1A1A1F] border border-white/10 px-4 py-3 shadow-2xl shadow-black/50">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
              AI үүсгэв
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              42с дотор
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const DEFAULT_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    alt: 'Workspace дээр зөөврийн компьютер',
  },
  {
    src: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
    alt: 'Багийн уулзалт ширээний эргэн тойронд',
  },
  {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    alt: 'Загвар бүтээгчийн ажлын талбар',
  },
  {
    src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    alt: 'Хамтын ажиллагаа цахим багт',
  },
];
