/**
 * TestimonialsSection — masonry-style review wall for SmartSite.mn.
 *
 * Self-contained, dark-mode-first, Tailwind-only. Drop into any Next.js 14
 * App Router project — no shadcn, no extra deps, no custom CSS.
 *
 * @typedef {{ name?: string, headline?: string, description?: string }} Business
 * @typedef {{
 *   id: string,
 *   name: string,
 *   handle: string,
 *   avatar: string,
 *   quote: string,
 *   role?: string,
 *   accent?: 'purple' | 'cyan' | 'amber',
 * }} Testimonial
 *
 * @param {{ business?: Business, items?: Testimonial[] }} props
 */
export default function TestimonialsSection({ business, items }) {
  const data = Array.isArray(items) && items.length > 0 ? items : DEFAULT_TESTIMONIALS;

  return (
    <section className="bg-[#0B0B0F] text-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <header className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
            Хэрэглэгчдийн сэтгэгдэл
          </span>
          <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">
            {business?.headline || 'Бизнес эрхлэгчид юу гэж хэлдэг вэ?'}
          </h2>
          <p className="mt-4 text-white/60 text-lg leading-relaxed">
            {business?.description ||
              'Монгол даяар 1,200+ жижиг бизнес SmartSite-ыг сонгожээ. Тэдний жинхэнэ туршлага.'}
          </p>
        </header>

        {/* Masonry via CSS columns — no JS needed, balances naturally */}
        <div className="mt-14 columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {data.map((t) => (
            <TestimonialCard key={t.id} item={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item }) {
  const accentRing = ACCENTS[item.accent] || ACCENTS.purple;
  return (
    <figure
      className="mb-6 break-inside-avoid rounded-2xl bg-[#1A1A1F] border border-white/10 p-6 transition-all duration-300 hover:bg-[#1F1F26] hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(124,58,237,0.4)]"
    >
      <QuoteMark />
      <blockquote className="mt-3 text-[15px] leading-[1.65] text-white/85">
        {item.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className={`relative shrink-0 rounded-full p-[2px] ${accentRing}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${item.avatar}?w=128&h=128&fit=crop&auto=format&q=70`}
            alt={item.name}
            className="h-11 w-11 rounded-full object-cover bg-[#0B0B0F]"
            loading="lazy"
          />
        </span>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">{item.name}</div>
          <div className="text-xs text-white/50 truncate">
            {item.handle}
            {item.role ? ` · ${item.role}` : ''}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

function QuoteMark() {
  return (
    <svg
      className="h-6 w-6 text-[#7C3AED]/70"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v1a3 3 0 0 1-3 3v2a5 5 0 0 0 5-5V9a2 2 0 0 0 0-2zm12 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v1a3 3 0 0 1-3 3v2a5 5 0 0 0 5-5V9a2 2 0 0 0 0-2z" />
    </svg>
  );
}

const ACCENTS = {
  purple: 'bg-gradient-to-br from-[#7C3AED] to-[#A78BFA]',
  cyan: 'bg-gradient-to-br from-[#06B6D4] to-[#22D3EE]',
  amber: 'bg-gradient-to-br from-[#F59E0B] to-[#FBBF24]',
};

const DEFAULT_TESTIMONIALS = [
  {
    id: 't1',
    name: 'Энхбаатар Б.',
    handle: '@enkhbaatar',
    role: 'Эзэн, Nomad Coffee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    accent: 'purple',
    quote:
      'Кафегийн сайтыг нэг шөнийн дотор бэлэн болгосон. AI нь меню тайлбараа надаас илүү гоё бичсэн, үнэндээ.',
  },
  {
    id: 't2',
    name: 'Цэцэгмаа Д.',
    handle: '@tsetsegmaa',
    role: 'Үүсгэн байгуулагч, Mongol Studio',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    accent: 'cyan',
    quote:
      'Дизайн агентлагийн портфолио сайт хэрэгтэй болсон. SmartSite дээр 20 минутад л үүсгэлээ. Үйлчлүүлэгчид "ямар студи дээр хийлгэсэн юм?" гэж асууж байна.',
  },
  {
    id: 't3',
    name: 'Болор-Эрдэнэ Г.',
    handle: '@bolor_e',
    role: 'CEO, Khan Logistics',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    accent: 'amber',
    quote: 'B2B сайт бүтээж байгаагаа төсөөлөөгүй ч 2 цаг л зарцуулсан. QPay интеграци ч ажиллаж байна.',
  },
  {
    id: 't4',
    name: 'Хулан Ш.',
    handle: '@khulan.shop',
    role: 'Эзэн, Khulan Boutique',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    accent: 'purple',
    quote:
      'Онлайн дэлгүүрээ Shopify-аас SmartSite руу шилжүүлсэн. Сайт хурдан, утсан дээр төгс харагддаг, бараагаа тогтмол шинэчлэхэд хялбар.',
  },
  {
    id: 't5',
    name: 'Цогтбаяр Ү.',
    handle: '@tsogt.dev',
    role: 'Зөвлөх, Freelance',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    accent: 'cyan',
    quote: 'Зөвлөгөө өгдөг сайт минь долоо хоногийн дотор 3 шинэ үйлчлүүлэгч авчирсан. AI-ийн SEO ажиллаж байна.',
  },
  {
    id: 't6',
    name: 'Мөнхтөр А.',
    handle: '@munkhtor.makes',
    role: 'Гар урлаач, Khangai Crafts',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
    accent: 'amber',
    quote:
      'Кодлож чаддаггүй ч өөрийн брэндийнхээ түүхийг ярьдаг сайт хүсдэг байсан. Одоо тэр сайт минь намайг өдөр бүр борлуулдаг.',
  },
];
