'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const BILLING = {
  monthly: { mn: 'Сар бүр', en: 'Monthly' },
  yearly: { mn: 'Жилээр', en: 'Yearly' },
};

const SALES_HREF = 'mailto:legal@aiweb.mn?subject=AiWeb%20Enterprise&body=Hello%20AiWeb%20team%2C%20we%20want%20to%20discuss%20the%20Enterprise%20plan.';

const PLANS = [
  {
    id: 'free',
    featured: false,
    prices: { monthly: 0, yearly: 0 },
    badge: { mn: 'Эхлэхэд тохиромжтой', en: 'Best for getting started' },
    name: { mn: 'Free', en: 'Free' },
    subtitle: {
      mn: 'Жижиг бизнес эсвэл анхны туршилтад',
      en: 'For first launches and small experiments',
    },
    cta: { mn: 'Үнэгүй эхлэх', en: 'Start free' },
    href: (locale) => `/${locale}/dashboard/sites/new`,
    ctaKind: 'link',
    stats: [
      { label: { mn: 'Сайт', en: 'Sites' }, value: '1' },
      { label: { mn: 'AI / өдөр', en: 'AI / day' }, value: '3' },
    ],
    features: {
      mn: [
        '1 сайт үүсгэх боломж',
        'Өдөрт 3 AI generation',
        'Template болон AI builder',
        'Нийтлэх болон хуваалцах боломж',
      ],
      en: [
        'Create 1 website',
        '3 AI generations per day',
        'Template and AI builder access',
        'Publish and share your site',
      ],
    },
    note: {
      mn: 'Кредит картгүйгээр шууд эхэлнэ.',
      en: 'Start instantly without a credit card.',
    },
  },
  {
    id: 'pro',
    featured: true,
    prices: { monthly: 29000, yearly: 290000 },
    badge: { mn: 'Ихэнх багийн сонголт', en: 'Most popular for teams' },
    name: { mn: 'Pro', en: 'Pro' },
    subtitle: {
      mn: 'Өсөлтөд зориулсан бүрэн боломж',
      en: 'Full power for growth-minded teams',
    },
    cta: { mn: 'Pro авах', en: 'Upgrade to Pro' },
    href: (locale, billing) => `/${locale}/dashboard/billing?plan=${billing === 'yearly' ? 'pro-yearly' : 'pro-monthly'}&amount=${billing === 'yearly' ? 290000 : 29000}`,
    ctaKind: 'link',
    stats: [
      { label: { mn: 'Сайт', en: 'Sites' }, value: '∞' },
      { label: { mn: 'AI', en: 'AI' }, value: '∞' },
    ],
    features: {
      mn: [
        'Хязгааргүй сайт үүсгэнэ',
        'Хязгааргүй AI generation',
        'Бүх template ба advanced remix tools',
        'Custom domain болон илүү хүчтэй growth flow',
      ],
      en: [
        'Create unlimited websites',
        'Unlimited AI generations',
        'All templates and advanced remix tools',
        'Custom domains and stronger growth workflows',
      ],
    },
    note: {
      mn: 'QPay, SocialPay, Khan, Golomt дэмжинэ. Жилийн сонголт нь growth багуудад хамгийн ашигтай.',
      en: 'Supports QPay, SocialPay, Khan, and Golomt. Annual billing is the best value for growing teams.',
    },
  },
  {
    id: 'enterprise',
    featured: false,
    prices: { monthly: null, yearly: null },
    badge: { mn: 'Contact sales', en: 'Contact sales' },
    name: { mn: 'Enterprise', en: 'Enterprise' },
    subtitle: {
      mn: 'Custom onboarding, rollout, ба олон брэндийн удирдлага',
      en: 'Custom onboarding, rollout support, and multi-brand management',
    },
    cta: { mn: 'Sales-тэй ярих', en: 'Talk to sales' },
    href: () => SALES_HREF,
    ctaKind: 'external',
    stats: [
      { label: { mn: 'Brand', en: 'Brands' }, value: 'Multi' },
      { label: { mn: 'Support', en: 'Support' }, value: 'Priority' },
    ],
    features: {
      mn: [
        'Custom onboarding ба migration support',
        'Олон brand/site rollout',
        'Internal workflow-д тааруулсан setup',
        'Priority support ба hands-on guidance',
      ],
      en: [
        'Custom onboarding and migration support',
        'Multi-brand / multi-site rollouts',
        'Setup tailored to internal workflows',
        'Priority support with hands-on guidance',
      ],
    },
    note: {
      mn: 'Тусгай үнийн санал, onboarding төлөвлөгөөтэйгээр sales багтай шууд холбогдоно.',
      en: 'Talk with sales for a tailored quote and onboarding plan.',
    },
  },
];

const VALUE_POINTS = [
  {
    key: 'payments',
    mn: 'MNT төлбөр',
    en: 'MNT billing',
    descMn: 'Монгол банк, апп-уудтай нийцсэн checkout flow.',
    descEn: 'Checkout built for Mongolian bank apps and local payments.',
  },
  {
    key: 'launch',
    mn: '2 минутын launch',
    en: '2-minute launch',
    descMn: 'Хэт урт setup хэрэггүй, prompt-оос шууд нийтэлнэ.',
    descEn: 'No long setup flow. Go from prompt to live launch fast.',
  },
  {
    key: 'scale',
    mn: 'Scale-ready',
    en: 'Scale-ready',
    descMn: 'Custom domain, олон template, AI regeneration бүгд нэг дор.',
    descEn: 'Custom domains, many templates, and AI regeneration in one place.',
  },
];

const TRUST_BADGES = [
  { key: 'qpay', mn: 'QPay', en: 'QPay' },
  { key: 'socialpay', mn: 'SocialPay', en: 'SocialPay' },
  { key: 'mnt', mn: '₮ MNT billing', en: '₮ MNT billing' },
  { key: 'cardless', mn: 'Картгүй эхлэх', en: 'Start card-free' },
];

const COMPARISON_ROWS = [
  {
    key: 'sites',
    label: { mn: 'Үүсгэх сайт', en: 'Websites' },
    free: '1',
    pro: '∞',
    enterprise: { mn: 'Custom', en: 'Custom' },
  },
  {
    key: 'ai',
    label: { mn: 'AI generation', en: 'AI generations' },
    free: { mn: '3 / өдөр', en: '3 / day' },
    pro: { mn: 'Хязгааргүй', en: 'Unlimited' },
    enterprise: { mn: 'Custom policy', en: 'Custom policy' },
  },
  {
    key: 'templates',
    label: { mn: 'Template access', en: 'Template access' },
    free: { mn: 'Тийм', en: 'Yes' },
    pro: { mn: 'Бүгд + premium flow', en: 'All + premium flow' },
    enterprise: { mn: 'Тийм', en: 'Yes' },
  },
  {
    key: 'domains',
    label: { mn: 'Custom domain', en: 'Custom domain' },
    free: { mn: 'Хязгаарлагдмал', en: 'Limited' },
    pro: { mn: 'Тийм', en: 'Yes' },
    enterprise: { mn: 'Advanced', en: 'Advanced' },
  },
  {
    key: 'remix',
    label: { mn: 'AI remix tools', en: 'AI remix tools' },
    free: { mn: 'Үндсэн', en: 'Basic' },
    pro: { mn: 'Advanced', en: 'Advanced' },
    enterprise: { mn: 'Advanced+', en: 'Advanced+' },
  },
  {
    key: 'support',
    label: { mn: 'Support', en: 'Support' },
    free: { mn: 'Standard', en: 'Standard' },
    pro: { mn: 'Priority', en: 'Priority' },
    enterprise: { mn: 'Dedicated', en: 'Dedicated' },
  },
  {
    key: 'rollout',
    label: { mn: 'Team rollout', en: 'Team rollout' },
    free: { mn: 'Үгүй', en: 'No' },
    pro: { mn: 'Хязгаарлагдмал', en: 'Limited' },
    enterprise: { mn: 'Тийм', en: 'Yes' },
  },
];

const FAQS = {
  mn: [
    {
      q: 'Free-ээс Pro руу дараа нь upgrade хийж болох уу?',
      a: 'Тийм. Эхлээд free-ээр сайтаа туршаад, хэрэгцээ өсөх үед billing хэсгээс Pro руу шууд шилжиж болно.',
    },
    {
      q: 'Жилийн төлбөрийн сонголт бодитоор дэмжигдэж байгаа юу?',
      a: 'Тийм. Landing page дээрх yearly toggle нь жилийн үнийн давуу талыг харуулна, харин checkout нь billing хэсэг дээрээс явагдана.',
    },
    {
      q: 'Төлбөрийг ямар сувгаар хийх вэ?',
      a: 'QPay, SocialPay, Khan Bank, Golomt Bank зэрэг локал төлбөрийн сувгууд дэмжигдэнэ.',
    },
    {
      q: 'Pro багцад яг хамгийн том ялгаа нь юу вэ?',
      a: 'Хамгийн том ялгаа нь velocity. Хязгааргүй AI generation, олон сайт, custom domain болон advanced remix flow нь танай багийг туршилтаас growth engine рүү хурдан шилжүүлнэ.',
    },
    {
      q: 'Enterprise багц хэнд хамгийн тохирох вэ?',
      a: 'Нэгээс олон брэнд, дотоод approval workflow, эсвэл баг дотроо coordinated rollout хийх шаардлагатай бол Enterprise хамгийн зөв сонголт болно.',
    },
  ],
  en: [
    {
      q: 'Can I start on Free and upgrade later?',
      a: 'Yes. You can validate your first site on Free and upgrade to Pro from the billing area whenever you need more power.',
    },
    {
      q: 'Is annual billing actually supported?',
      a: 'Yes. The yearly toggle shows the annual option and value, while checkout is completed through the billing page.',
    },
    {
      q: 'Which payment methods are supported?',
      a: 'AiWeb supports local payment rails including QPay, SocialPay, Khan Bank, and Golomt Bank.',
    },
    {
      q: 'What is the biggest difference in Pro?',
      a: 'The biggest difference is velocity. Pro removes limits so your team can move from testing ideas to shipping growth-ready websites much faster.',
    },
    {
      q: 'Who is Enterprise best for?',
      a: 'Enterprise is the right fit for teams running multiple brands, needing approval-heavy workflows, or planning a coordinated rollout with onboarding support.',
    },
  ],
};

function formatPrice(price) {
  return price === 0 ? '0' : Number(price).toLocaleString('mn-MN');
}

function resolveText(locale, value) {
  if (typeof value === 'string') return value;
  return value?.[locale] ?? value?.mn ?? '';
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BillingToggle({ locale, billing, setBilling }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <div className="mt-6 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white/[0.04] p-1.5 shadow-[0_20px_40px_-28px_rgba(0,0,0,0.45)]">
      {Object.keys(BILLING).map((key) => {
        const active = billing === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setBilling(key)}
            className="relative rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors"
          >
            {active ? (
              <motion.span
                layoutId="billing-pill"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
              />
            ) : null}
            <span className={`relative ${active ? 'text-black' : 'text-[var(--text-secondary)]'}`}>
              {BILLING[key][locale] ?? BILLING[key].mn}
            </span>
          </button>
        );
      })}
      <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
        {L('Жилийн багцад хэмнэлттэй', 'Save more yearly')}
      </div>
    </div>
  );
}

function PlanCard({ plan, locale, index, billing }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const cardRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const shineX = useMotionValue(50);
  const shineY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [4, -4]), { stiffness: 260, damping: 24 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-5, 5]), { stiffness: 260, damping: 24 });
  const shineBackground = useTransform(
    [shineX, shineY],
    ([x, y]) => `radial-gradient(190px circle at ${x}% ${y}%, rgba(255,255,255,0.15), transparent 62%)`,
  );
  const price = plan.prices[billing];
  const priceLabel = price == null ? L('Custom', 'Custom') : price === 0 ? L('Үнэгүй', 'Free') : `₮${formatPrice(price)}`;
  const monthlyEquivalent = billing === 'yearly' && price > 0 ? Math.round(price / 12) : null;
  const oldYearlyPrice = billing === 'yearly' && plan.id === 'pro' ? plan.prices.monthly * 12 : null;
  const savings = oldYearlyPrice && oldYearlyPrice > price ? oldYearlyPrice - price : 0;

  const handleMove = useCallback((event) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    rawX.set(x - 0.5);
    rawY.set(y - 0.5);
    shineX.set(x * 100);
    shineY.set(y * 100);
  }, [rawX, rawY, shineX, shineY]);

  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    shineX.set(50);
    shineY.set(0);
  }, [rawX, rawY, shineX, shineY]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100, transformStyle: 'preserve-3d' }}
      className="group relative h-full"
    >
      {plan.featured ? (
        <div className="absolute -inset-[1px] rounded-2xl bg-[linear-gradient(135deg,rgba(124,92,255,0.82),rgba(34,211,238,0.62),rgba(255,255,255,0.16))] opacity-80 blur-[1px] transition-opacity group-hover:opacity-100" />
      ) : null}

      <div
        className={[
          'relative h-full overflow-hidden rounded-2xl border p-5 transition-shadow duration-300 md:p-5',
          plan.featured
            ? 'border-white/[0.14] bg-[linear-gradient(180deg,rgba(16,18,33,0.95),rgba(10,10,16,0.98))] shadow-[0_24px_70px_-38px_rgba(124,92,255,0.55)] group-hover:shadow-[0_34px_90px_-44px_rgba(124,92,255,0.8)]'
            : 'border-[var(--surface-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.032),rgba(255,255,255,0.012))] shadow-[0_18px_52px_-38px_rgba(0,0,0,0.65)] group-hover:shadow-[0_30px_72px_-48px_rgba(0,0,0,0.82)]',
        ].join(' ')}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-20 right-[-18%] h-44 w-44 rounded-full blur-3xl"
            style={{
              background: plan.featured
                ? 'rgba(124,92,255,0.2)'
                : 'rgba(255,255,255,0.045)',
            }}
          />
          <div className="absolute inset-0 grid-pattern opacity-[0.18]" />
          <motion.div
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: shineBackground }}
          />
        </div>

        {plan.featured ? (
          <motion.div
            className="absolute right-[-42px] top-5 rotate-[32deg] rounded-full border border-white/15 bg-[linear-gradient(135deg,rgba(124,92,255,0.95),rgba(34,211,238,0.82))] px-11 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_16px_35px_-18px_rgba(124,92,255,0.8)]"
            animate={{ y: [0, -2, 0], filter: ['brightness(1)', 'brightness(1.08)', 'brightness(1)'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {L('Most popular', 'Most popular')}
          </motion.div>
        ) : null}

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div
                className="inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em]"
                style={{
                  borderColor: plan.featured ? 'rgba(124,92,255,0.35)' : 'rgba(255,255,255,0.1)',
                  color: plan.featured ? '#c4b5fd' : 'var(--text-muted)',
                  background: plan.featured ? 'rgba(124,92,255,0.1)' : 'rgba(255,255,255,0.03)',
                }}
              >
                {plan.badge[locale] ?? plan.badge.mn}
              </div>
              <h3 className="mt-4 font-display text-2xl font-black text-[var(--text-primary)]">
                {plan.name[locale] ?? plan.name.mn}
              </h3>
              <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-[var(--text-secondary)]">
                {plan.subtitle[locale] ?? plan.subtitle.mn}
              </p>
            </div>

            <div
              className="rounded-xl border px-3 py-2 backdrop-blur-md"
              style={{
                borderColor: plan.featured ? 'rgba(124,92,255,0.22)' : 'rgba(255,255,255,0.08)',
                background: plan.featured ? 'rgba(124,92,255,0.08)' : 'rgba(255,255,255,0.03)',
              }}
            >
              <div className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {L('Төлөв', 'Plan')}
              </div>
              <div className="mt-0.5 text-xs font-semibold text-[var(--text-primary)]">
                {plan.id === 'pro' ? 'Scale' : 'Launch'}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-end gap-2">
            <div className="font-display text-4xl font-black text-[var(--text-primary)]">
              {priceLabel}
            </div>
            <div className="pb-1.5 text-xs text-[var(--text-muted)]">
              {price === 0
                ? L('/ эхлэх', '/ start')
                : billing === 'yearly'
                  ? L('/ жил', '/ year')
                  : L('/ сар', '/ month')}
            </div>
          </div>

          {billing === 'yearly' && price > 0 ? (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="rounded-full border border-emerald-400/18 bg-emerald-400/10 px-3 py-1 font-semibold text-emerald-300">
                {L(`₮${formatPrice(savings)} хэмнэнэ`, `Save ₮${formatPrice(savings)}`)}
              </span>
              <span className="text-[var(--text-muted)] line-through">
                ₮{formatPrice(oldYearlyPrice)}
              </span>
              <span className="text-[var(--text-secondary)]">
                {L(`Сард дундажаар ₮${formatPrice(monthlyEquivalent)}`, `About ₮${formatPrice(monthlyEquivalent)}/month`)}
              </span>
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-2">
            {plan.stats.map((stat) => (
              <div
                key={stat.value + String(stat.label.mn)}
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5"
              >
                <div className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  {stat.label[locale] ?? stat.label.mn}
                </div>
                <div className="mt-0.5 text-xl font-black text-[var(--text-primary)]">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2.5">
            {(plan.features[locale] ?? plan.features.mn).map((feature) => (
              <div key={feature} className="flex items-start gap-2.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                <span
                  className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: plan.featured ? 'rgba(124,92,255,0.16)' : 'rgba(255,255,255,0.06)',
                    color: plan.featured ? '#c4b5fd' : 'var(--text-primary)',
                  }}
                >
                  <CheckIcon />
                </span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {plan.ctaKind === 'external' ? (
          <a
            href={plan.href(locale, billing)}
            className={[
              'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
              plan.featured
                ? 'bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] text-white shadow-xl shadow-[var(--accent-soft)] hover:brightness-110'
                : 'border border-[var(--surface-border-strong)] bg-white/[0.04] text-[var(--text-primary)] hover:bg-white/[0.08]',
            ].join(' ')}
          >
            {plan.cta[locale] ?? plan.cta.mn}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          ) : (
          <Link
            href={plan.href(locale, billing)}
            className={[
              'mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
              plan.featured
                ? 'bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] text-white shadow-xl shadow-[var(--accent-soft)] hover:brightness-110'
                : 'border border-[var(--surface-border-strong)] bg-white/[0.04] text-[var(--text-primary)] hover:bg-white/[0.08]',
            ].join(' ')}
          >
            {plan.cta[locale] ?? plan.cta.mn}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          )}

          <p className="mt-3 text-[11px] leading-relaxed text-[var(--text-muted)]">
            {plan.note[locale] ?? plan.note.mn}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ComparisonTable({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <div className="mt-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-black tracking-tight text-[var(--text-primary)]">
            {L('Багцын харьцуулалт', 'Feature comparison')}
          </h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {L('Ямар багц танд тохирохыг хурдан харах хүснэгт.', 'A quick side-by-side view to help you choose faster.')}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--surface-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] shadow-[0_22px_60px_-38px_rgba(0,0,0,0.55)]">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-[var(--surface-border)] text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              <th className="px-5 py-4 font-semibold">{L('Feature', 'Feature')}</th>
              <th className="px-5 py-4 font-semibold">Free</th>
              <th className="px-5 py-4 font-semibold text-[var(--accent-light)]">Pro</th>
              <th className="px-5 py-4 font-semibold">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row, index) => (
              <tr key={row.key} className={index !== COMPARISON_ROWS.length - 1 ? 'border-b border-[var(--surface-border)]' : ''}>
                <td className="px-5 py-4 text-sm font-medium text-[var(--text-primary)]">
                  {resolveText(locale, row.label)}
                </td>
                <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                  {resolveText(locale, row.free)}
                </td>
                <td className="px-5 py-4 text-sm font-semibold text-[var(--text-primary)]">
                  {resolveText(locale, row.pro)}
                </td>
                <td className="px-5 py-4 text-sm text-[var(--text-secondary)]">
                  {resolveText(locale, row.enterprise)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          {item.q}
        </span>
        <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--surface-border-strong)] text-[var(--text-secondary)] transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
              {item.a}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PricingFaq({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [openIndex, setOpenIndex] = useState(0);
  const items = FAQS[locale] ?? FAQS.mn;

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr,1.2fr] lg:items-start">
      <div>
        <h3 className="font-display text-2xl font-black text-[var(--text-primary)]">
          {L('Pricing FAQ', 'Pricing FAQ')}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] max-w-md">
          {L(
            'Төлбөр, багц солих, жилийн сонголт, local payment-ийн тухай түгээмэл асуултууд.',
            'The most common questions about billing, switching plans, annual pricing, and local payments.',
          )}
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <FaqItem
            key={item.q}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </div>
  );
}

export default function PricingSection({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [billing, setBilling] = useState('monthly');

  return (
    <section className="relative overflow-hidden border-t border-[var(--surface-border)]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-a" style={{ top: '8%', left: '-10%', width: '420px', height: '420px', opacity: 0.16 }} />
        <div className="orb orb-b" style={{ bottom: '-8%', right: '-8%', width: '400px', height: '400px', opacity: 0.12 }} />
        <div className="absolute inset-0 grid-pattern opacity-[0.16]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-2xl"
        >
          <span className="eyebrow text-[var(--accent-light)]">{L('Үнэ ба багц', 'Pricing')}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-black leading-[1.05]">
            {L('Бизнесийнхээ хэмжээнд ', 'Choose a plan that ')}
            <span className="gradient-text">{L('таарсан багцаа сонго', 'fits your growth')}</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm text-[var(--text-secondary)] leading-relaxed">
            {L(
              'Эхлэхэд free хангалттай, харин тогтмол контент үүсгэж, олон сайт ажиллуулах бол Pro багц руу шууд өсөхөөр хийсэн.',
              'Start free when you are validating, then move to Pro when you need more AI output, more sites, and a faster growth workflow.',
            )}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <BillingToggle locale={locale} billing={billing} setBilling={setBilling} />
          </motion.div>
          <motion.div
            className="mt-4 flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge.key}
                className="rounded-full border border-white/[0.09] bg-white/[0.035] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]"
              >
                {badge[locale] ?? badge.en}
              </span>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-9 grid gap-4 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.16 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
          }}
        >
          {PLANS.map((plan, index) => (
            <PlanCard key={plan.id} plan={plan} locale={locale} index={index} billing={billing} />
          ))}
        </motion.div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {VALUE_POINTS.map((point, index) => (
            <motion.div
              key={point.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.42, delay: 0.08 * index, ease: [0.2, 0.8, 0.2, 1] }}
              className="rounded-2xl border border-[var(--surface-border)] bg-white/[0.03] px-4 py-4 backdrop-blur-sm"
            >
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                {point[locale] ?? point.mn}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                {point[`desc${locale === 'mn' ? 'Mn' : 'En'}`]}
              </p>
            </motion.div>
          ))}
        </div>

        <ComparisonTable locale={locale} />
        <PricingFaq locale={locale} />
      </div>
    </section>
  );
}
