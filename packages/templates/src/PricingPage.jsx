/**
 * PricingPage — production-ready pricing template for SmartSite.mn.
 *
 * Self-contained, dark-mode-first, Tailwind-only. Copy-paste into any
 * Next.js 14 App Router project — no shadcn, no extra deps.
 *
 * @typedef {{ name?: string, headline?: string, description?: string }} Business
 * @typedef {{
 *   id: string,
 *   name: string,
 *   tagline: string,
 *   credits: string,
 *   priceLabel: string,
 *   oldPriceLabel?: string,
 *   featured?: boolean,
 *   benefits: string[],
 *   ctaLabel?: string,
 * }} Plan
 *
 * @param {{ business?: Business, plans?: Plan[], onSelect?: (planId: string) => void }} props
 */
export default function PricingPage({ business, plans, onSelect }) {
  const data = Array.isArray(plans) && plans.length > 0 ? plans : DEFAULT_PLANS;

  return (
    <section className="bg-[#0B0B0F] text-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <header className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 uppercase tracking-[0.2em]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
            Үнийн санал
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
            {business?.headline || 'Танд тохирох багцыг сонгоорой'}
          </h1>
          <p className="mt-5 text-lg text-white/60 leading-relaxed">
            {business?.description ||
              'Жижиг бизнесийнхээ AI вэбсайтыг өнөөдрөөс эхлүүлээрэй. Хэдхэн минутад мэргэжлийн дизайн, AI-аар бичсэн контент.'}
          </p>
        </header>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((plan) => (
            <PricingCard key={plan.id} plan={plan} onSelect={onSelect} />
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-white/40">
          Бүх багц нь 7 хоногийн үнэгүй туршилтын хугацаатай. Хэдийд ч цуцлах боломжтой.
        </p>
      </div>
    </section>
  );
}

function PricingCard({ plan, onSelect }) {
  const featured = !!plan.featured;
  return (
    <article
      className={[
        'relative flex flex-col rounded-2xl p-6 transition-all duration-300',
        featured
          ? 'bg-[#16121E] border-2 border-[#7C3AED] shadow-[0_24px_60px_-30px_rgba(124,58,237,0.6)] lg:-translate-y-2'
          : 'bg-[#1A1A1F] border border-white/10 hover:border-white/20 hover:-translate-y-0.5',
      ].join(' ')}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED] text-white text-[10px] font-semibold uppercase tracking-[0.2em] shadow-lg shadow-[#7C3AED]/40">
            <SparkIcon />
            Хамгийн алдартай
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
          {plan.name}
        </h3>
        {featured && <span className="h-2 w-2 rounded-full bg-[#7C3AED] animate-pulse" />}
      </div>

      <p className="mt-2 text-sm text-white/50 leading-relaxed min-h-[40px]">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-5xl font-bold tracking-tight">{plan.priceLabel}</span>
        <span className="text-sm text-white/50">/сар</span>
      </div>
      {plan.oldPriceLabel && (
        <span className="mt-1 inline-block text-sm text-white/40 line-through">
          {plan.oldPriceLabel}
        </span>
      )}

      <div className="mt-4 flex items-center gap-2 text-sm">
        <CreditsIcon />
        <span className="text-white/70">{plan.credits}</span>
      </div>

      <button
        type="button"
        onClick={() => onSelect?.(plan.id)}
        className={[
          'mt-6 w-full rounded-full py-3 text-sm font-semibold transition-all',
          featured
            ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-[#7C3AED]/30'
            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10',
        ].join(' ')}
      >
        {plan.ctaLabel || 'Сонгох'}
      </button>

      <ul className="mt-6 space-y-3 border-t border-white/5 pt-6">
        {plan.benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-white/75">
            <CheckIcon className={featured ? 'text-[#A78BFA]' : 'text-white/50'} />
            <span className="leading-snug">{b}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function CheckIcon({ className = '' }) {
  return (
    <svg
      className={`mt-0.5 h-4 w-4 shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
    </svg>
  );
}

function CreditsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#A78BFA"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}

const DEFAULT_PLANS = [
  {
    id: 'explorer',
    name: 'Explorer',
    tagline: 'Эхлэгчдэд зориулсан үнэгүй туршилт.',
    priceLabel: '₮0',
    credits: 'Сард 5 AI кредит',
    benefits: [
      '1 вэбсайт',
      'SmartSite дэд домэйн',
      'Үндсэн загварууд',
      'Имэйл туслах',
    ],
    ctaLabel: 'Үнэгүй эхлэх',
  },
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Жижиг бизнесүүдэд хамгийн тохиромжтой.',
    priceLabel: '₮29,000',
    oldPriceLabel: '₮49,000',
    featured: true,
    credits: 'Сард 30 AI кредит',
    benefits: [
      '3 вэбсайт',
      'Өөрийн домэйн (.mn)',
      'AI зураг үүсгэгч',
      'Бүх премиум загвар',
      'Тэргүүлэх дэмжлэг',
    ],
  },
  {
    id: 'hobbyist',
    name: 'Hobbyist',
    tagline: 'Илүү хувийн төслүүдэд зориулав.',
    priceLabel: '₮79,000',
    oldPriceLabel: '₮99,000',
    credits: 'Сард 100 AI кредит',
    benefits: [
      '10 вэбсайт',
      'Төлбөрт интеграци (QPay, Khan)',
      'Хэрэглэгчийн анализ',
      'Гар утасны апп урьдчилан үзэх',
    ],
  },
  {
    id: 'hustler',
    name: 'Hustler',
    tagline: 'Өсөн нэмэгдэж буй брэнд, агентлагт.',
    priceLabel: '₮199,000',
    oldPriceLabel: '₮249,000',
    credits: 'Сард 500 AI кредит',
    benefits: [
      'Хязгааргүй вэбсайт',
      'Багийн хамтын орчин (5 хүн)',
      'Цагаан шошготой экспорт',
      'API хандалт',
      'Зориулсан менежер',
    ],
  },
];
