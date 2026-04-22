'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  motion, AnimatePresence,
  useMotionValue, useTransform, useSpring, animate,
} from 'framer-motion';

// ─── Real-looking website showcase cards ─────────────────────────────────────
// Uses Unsplash CDN (free, permanent) for hero imagery — no local assets needed.

const SHOWCASE_CARDS = [
  {
    domain: 'silkhotel.aiweb.mn',
    brand: 'Silk Hotel',
    badge: 'Hospitality',
    hero: 'Улаанбаатарын өв соёлт буудал',
    heroEn: "Ulaanbaatar's heritage hotel",
    sub: 'Boutique · 5★',
    subEn: 'Boutique · 5★',
    cta: 'Өрөө захиалах',
    ctaEn: 'Book a suite',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=80&fit=crop',
    accent: '#d4af37',
    accent2: '#92400e',
    palette: ['#fbbf24', '#d97706', '#0c0a09'],
    stats: [
      { label: 'Suites', value: '42' },
      { label: 'Rating', value: '4.9★' },
    ],
  },
  {
    domain: 'pulse.aiweb.mn',
    brand: 'Pulse Analytics',
    badge: 'SaaS',
    hero: 'Бизнес мэдээлэлд зам харуул',
    heroEn: 'Data that drives decisions',
    sub: 'Realtime dashboard',
    subEn: 'Realtime dashboard',
    cta: 'Үнэгүй эхлэх',
    ctaEn: 'Start free',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1000&q=80&fit=crop',
    accent: '#22d3ee',
    accent2: '#7c3aed',
    palette: ['#67e8f9', '#a855f7', '#020617'],
    stats: [
      { label: 'Teams', value: '1.2k' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
  {
    domain: 'stretch.aiweb.mn',
    brand: 'Stretch Studio',
    badge: 'Wellness',
    hero: 'Өөрийгөө чагнаж сурна',
    heroEn: 'Breathe deeper, move freer',
    sub: 'Yoga · Pilates',
    subEn: 'Yoga · Pilates',
    cta: 'Анхны хичээл',
    ctaEn: 'First class free',
    image: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1000&q=80&fit=crop',
    accent: '#84cc16',
    accent2: '#0ea5e9',
    palette: ['#a3e635', '#38bdf8', '#0c1510'],
    stats: [
      { label: 'Members', value: '840' },
      { label: 'Weekly', value: '28' },
    ],
  },
  {
    domain: 'atelier.aiweb.mn',
    brand: 'Mode Atelier',
    badge: 'Fashion',
    hero: 'Өөрийн стилийг бүтээ',
    heroEn: 'Tailored, just for you',
    sub: 'Улирлын цуглуулга',
    subEn: 'Seasonal drops',
    cta: 'Худалдаж авах',
    ctaEn: 'Shop now',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&q=80&fit=crop',
    accent: '#ec4899',
    accent2: '#1e1b4b',
    palette: ['#f472b6', '#6366f1', '#1e1b4b'],
    stats: [
      { label: 'Items', value: '120' },
      { label: 'Cities', value: '6' },
    ],
  },
];

// ─── 3D tilt card wrapper ────────────────────────────────────────────────────

function TiltCard({ children, className = '', strength = 12, floatDuration = 6, floatDelay = 0, baseRotate = 0 }) {
  const cardRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [strength, -strength]), { stiffness: 180, damping: 16 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-strength, strength]), { stiffness: 180, damping: 16 });

  const onMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    animate(mx, 0, { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] });
    animate(my, 0, { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
      }}
      className={className}
      animate={{ y: [0, -10, 0], rotate: [baseRotate, baseRotate + 0.3, baseRotate] }}
      transition={{
        y: { duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
        rotate: { duration: floatDuration * 1.3, repeat: Infinity, ease: 'easeInOut', delay: floatDelay },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Realistic browser + website mockup ──────────────────────────────────────

function ShowcaseCard({ card, locale, floatDelay = 0, floatDuration = 6, baseRotate = 0, style, size = 'md' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const dims = size === 'lg'
    ? { w: 420, h: 280 }
    : size === 'sm'
      ? { w: 300, h: 200 }
      : { w: 360, h: 240 };

  return (
    <TiltCard
      strength={10}
      floatDelay={floatDelay}
      floatDuration={floatDuration}
      baseRotate={baseRotate}
      className="absolute"
    >
      <div
        className="rounded-2xl overflow-hidden shadow-2xl shadow-black/70 border border-white/10"
        style={{
          ...style,
          width: dims.w,
          height: dims.h,
        }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1a] border-b border-white/10">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <div className="ml-2 flex-1 h-5 rounded-md bg-white/[0.07] px-2.5 flex items-center gap-1.5">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            </svg>
            <span className="text-[10px] font-mono text-white/50 truncate">{card.domain}</span>
          </div>
        </div>

        {/* Hero image with overlays */}
        <div className="relative h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${card.palette[2]}aa 0%, ${card.palette[0]}22 55%, ${card.palette[1]}55 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

          {/* Top badge + nav */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded-md grid place-items-center shadow-lg"
                style={{ background: `linear-gradient(135deg, ${card.accent}, ${card.accent2})` }}
              >
                <div className="h-2 w-2 rounded-sm bg-white/95" />
              </div>
              <span className="text-[11px] font-bold text-white tracking-tight">{card.brand}</span>
            </div>
            <span
              className="px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}
            >
              {card.badge}
            </span>
          </div>

          {/* Hero content (bottom-left) */}
          <div className="absolute bottom-3 left-3 right-3">
            <span className="block text-[8px] font-mono uppercase tracking-widest text-white/60 mb-1.5">
              {L(card.sub, card.subEn)}
            </span>
            <h3
              className="text-white font-black leading-tight mb-2.5"
              style={{ fontSize: size === 'lg' ? '20px' : '16px', letterSpacing: '-0.02em' }}
            >
              {L(card.hero, card.heroEn)}
            </h3>
            <div className="flex items-center gap-1.5">
              <span
                className="inline-flex items-center h-6 px-3 rounded-full text-[9px] font-bold text-white"
                style={{ background: card.accent }}
              >
                {L(card.cta, card.ctaEn)}
              </span>
              <span className="inline-flex items-center h-6 px-2.5 rounded-full text-[9px] font-semibold text-white/80 border border-white/25 backdrop-blur-md">
                →
              </span>
              <div className="ml-auto flex gap-2.5">
                {card.stats.map((s) => (
                  <div key={s.label} className="text-right">
                    <div className="text-[11px] font-bold text-white leading-none">{s.value}</div>
                    <div className="text-[7px] font-mono text-white/55 tracking-widest uppercase">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Glossy highlight */}
          <div
            className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.10), transparent)' }}
          />
        </div>
      </div>
    </TiltCard>
  );
}

// ─── Auto-rotating 3D carousel — cards cycle through 3 positions ─────────────

function ShowcaseCarousel({ locale }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SHOWCASE_CARDS.length), 4500);
    return () => clearInterval(id);
  }, []);

  // positions[slot] = style for the slot (left / center / right)
  const slots = [
    { x: '-55%', y: 20, rotate: -8, scale: 0.82, zIndex: 1, opacity: 0.7, blur: 2 },   // left-back
    { x: '0%',   y: 0,  rotate: 0,  scale: 1.0,  zIndex: 3, opacity: 1,   blur: 0 },   // center-front
    { x: '55%',  y: 20, rotate: 8,  scale: 0.82, zIndex: 1, opacity: 0.7, blur: 2 },   // right-back
  ];

  // For each card, compute which slot it's in right now based on rotation index.
  function slotFor(cardIndex) {
    const rel = (cardIndex - index + SHOWCASE_CARDS.length) % SHOWCASE_CARDS.length;
    // rel=0 → center, rel=1 → right, rel=2 → left
    return rel === 0 ? slots[1] : rel === 1 ? slots[2] : slots[0];
  }

  return (
    <div className="relative w-full" style={{ height: 420, perspective: 1600 }}>
      {SHOWCASE_CARDS.map((card, i) => {
        const slot = slotFor(i);
        const isFront = slot.zIndex === 3;
        return (
          <motion.div
            key={card.domain}
            className="absolute top-1/2 left-1/2"
            initial={false}
            animate={{
              x: `calc(-50% + ${slot.x})`,
              y: `calc(-50% + ${slot.y}px)`,
              rotate: slot.rotate,
              scale: slot.scale,
              opacity: slot.opacity,
              filter: `blur(${slot.blur}px)`,
            }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ zIndex: slot.zIndex }}
          >
            <CarouselCard card={card} locale={locale} interactive={isFront} />
          </motion.div>
        );
      })}

    </div>
  );
}

function CarouselCard({ card, locale, interactive }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const dims = { w: 460, h: 320 };

  const content = (
    <div className="relative" style={{ width: dims.w, height: dims.h }}>
      {/* Metallic platinum frame — subtle silver→violet→cyan gradient border */}
      <div
        className="absolute -inset-px rounded-[20px]"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(124,92,255,0.25) 30%, rgba(255,255,255,0.12) 50%, rgba(34,211,238,0.25) 75%, rgba(255,255,255,0.35) 100%)',
          padding: 1,
        }}
      >
        <div className="w-full h-full rounded-[19px]" style={{ background: '#0a0a12' }} />
      </div>

      {/* Card body */}
      <div
        className="relative rounded-[19px] overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          boxShadow:
            '0 40px 80px -20px rgba(0,0,0,0.75), 0 20px 40px -10px rgba(124,92,255,0.25), inset 0 1px 0 rgba(255,255,255,0.10)',
        }}
      >
        {/* Premium URL bar — dark with metallic sheen */}
        <div
          className="relative flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.08]"
          style={{ background: 'linear-gradient(180deg, #0e0e1a 0%, #08080f 100%)' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-[11px] font-mono text-white/55 truncate tracking-tight">{card.domain}</span>
          <span className="ml-auto inline-flex items-center gap-1 text-[8px] font-mono uppercase tracking-widest text-white/35">
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }}
            />
            secure
          </span>
          {/* Subtle sheen overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(100deg, transparent 45%, rgba(255,255,255,0.04) 50%, transparent 55%)' }}
          />
        </div>

        {/* Website body */}
        <div className="relative h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.image}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${card.palette[2]}cc 0%, ${card.palette[0]}22 50%, ${card.palette[1]}55 100%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* Top-row: metallic brand mark + PLATINUM badge */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Metallic coin-style logo */}
              <div className="relative h-7 w-7 rounded-full grid place-items-center overflow-hidden">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `conic-gradient(from 45deg, ${card.accent}, ${card.accent2}, ${card.accent})`,
                  }}
                />
                <div className="absolute inset-[1.5px] rounded-full grid place-items-center" style={{ background: card.palette[2] }}>
                  <div
                    className="h-2 w-2 rounded-sm"
                    style={{ background: `linear-gradient(135deg, ${card.accent}, ${card.accent2})` }}
                  />
                </div>
              </div>
              <div className="leading-tight">
                <div className="text-[13px] font-black text-white tracking-tight">{card.brand}</div>
                <div className="text-[8px] font-mono text-white/45 tracking-widest uppercase">{card.sub}</div>
              </div>
            </div>

            {/* Platinum badge — gold shimmer */}
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest backdrop-blur-md border"
              style={{
                background: 'linear-gradient(135deg, rgba(250,204,21,0.18), rgba(251,191,36,0.08))',
                borderColor: 'rgba(250,204,21,0.35)',
                color: '#fde68a',
              }}
            >
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2z" />
              </svg>
              {card.badge}
            </div>
          </div>

          {/* Bottom content block */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3
              className="text-white font-black leading-[1.08] mb-3 drop-shadow-xl"
              style={{ fontSize: '22px', letterSpacing: '-0.025em' }}
            >
              {L(card.hero, card.heroEn)}
            </h3>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* CTA — metallic with inner highlight */}
                <span
                  className="relative inline-flex items-center h-8 px-4 rounded-full text-[11px] font-bold text-white overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${card.accent}, ${card.accent2})`,
                    boxShadow: `0 8px 20px -4px ${card.accent}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
                  }}
                >
                  {L(card.cta, card.ctaEn)}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="ml-1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>

              {/* Stats — luxury numerals */}
              <div className="flex items-center gap-4">
                {card.stats.map((s) => (
                  <div key={s.label} className="text-right">
                    <div
                      className="text-[14px] font-black text-white leading-none tabular-nums"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {s.value}
                    </div>
                    <div className="text-[7px] font-mono text-white/45 tracking-[0.15em] uppercase mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platinum glass reflection — top-left highlight */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
            style={{
              background:
                'linear-gradient(165deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.04) 35%, transparent 65%)',
            }}
          />

          {/* Bottom sheen */}
          <div
            className="absolute inset-x-0 bottom-0 h-[1px] pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            }}
          />
        </div>
      </div>
    </div>
  );

  if (!interactive) return content;
  return <TiltCard strength={8} floatDuration={6} floatDelay={0} baseRotate={0}>{content}</TiltCard>;
}

// ─── Showcase panel — carousel + animated mesh ───────────────────────────────

function ShowcasePanel({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  const FEATURES = [
    {
      mn: 'Gemini 2.5 AI — контент бичнэ',
      en: 'Gemini 2.5 AI — writes content',
      Icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
          <path d="M19 3v4M21 5h-4M5 17v3M6.5 18.5H3.5" />
        </svg>
      ),
    },
    {
      mn: '48 section, 23 template',
      en: '48 sections, 23 templates',
      Icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      ),
    },
    {
      mn: 'Flux AI зураг 60 секундэд',
      en: 'Flux AI imagery in 60s',
      Icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      ),
    },
    {
      mn: 'QPay · SocialPay · Банкны тооцоо',
      en: 'QPay · SocialPay · Bank rails',
      Icon: (props) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <path d="M6 15h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative h-full w-full flex flex-col overflow-hidden px-8 lg:px-10 py-10">
      {/* Top: headline only — no logo/brand block */}
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 text-center font-display font-black tracking-tight leading-[1.05]"
        style={{ fontSize: 'clamp(1.7rem, 2.3vw, 2.2rem)' }}
      >
        {L('Бизнесээ тайлбарла.', 'Describe your business.')}
        <br />
        <span
          className="bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(95deg, #c4b5fd 0%, #22d3ee 50%, #f472b6 100%)',
          }}
        >
          {L('AI вэбсайт бүтээнэ.', 'AI builds the site.')}
        </span>
      </motion.h2>

      {/* Middle: auto-rotating carousel */}
      <div className="relative z-10 flex-1 flex items-center justify-center min-h-0">
        <ShowcaseCarousel locale={locale} />
      </div>

      {/* Bottom: compact feature list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative z-10"
      >
        <div
          className="rounded-2xl p-4 backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(10,10,15,0.4)' }}
        >
          <ul className="grid grid-cols-2 gap-x-5 gap-y-2.5">
            {FEATURES.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.3 }}
                className="flex items-center gap-2.5 text-xs text-white/85"
              >
                <span className="text-[var(--accent-light)] shrink-0 w-4 h-4 flex items-center justify-center">
                  <f.Icon width="14" height="14" />
                </span>
                <span className="truncate">{L(f.mn, f.en)}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Form field with glow focus ──────────────────────────────────────────────

function GlowField({ children }) {
  return (
    <div className="relative group/glow">
      <div className="absolute -inset-[1.5px] rounded-xl bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] opacity-0 group-focus-within/glow:opacity-40 transition-opacity duration-300 blur-[3px]" />
      <div className="relative">{children}</div>
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// ─── Cursor-tracking form card halo ──────────────────────────────────────────

function FormCardGlow({ children }) {
  const wrap = useRef(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);

  const onMove = (e) => {
    if (!wrap.current) return;
    const rect = wrap.current.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <div ref={wrap} onMouseMove={onMove} className="relative">
      <motion.div
        className="pointer-events-none absolute -inset-20 rounded-[40px] opacity-60"
        style={{
          background: useTransform(
            [mx, my],
            ([x, y]) =>
              `radial-gradient(400px circle at ${x}px ${y}px, rgba(124,92,255,0.25), transparent 60%)`,
          ),
        }}
      />
      {children}
    </div>
  );
}

// ─── Main AuthForm ───────────────────────────────────────────────────────────

export default function AuthForm({ locale, mode }) {
  const router = useRouter();
  const L = useCallback((mn, en) => (locale === 'mn' ? mn : en), [locale]);
  const isSignup = mode === 'signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isSignup) {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, locale }),
        });
        if (!res.ok) throw new Error((await res.json()).error || L('Алдаа гарлаа', 'Something went wrong'));
      }
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) throw new Error(L('И-мэйл эсвэл нууц үг буруу', 'Invalid email or password'));
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setShakeKey((k) => k + 1);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex relative overflow-hidden">
      {/* ── UNIFIED ambient mesh background spanning both panels ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.30), transparent 70%)' }}
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.20), transparent 70%)' }}
          animate={{ x: [-80, 80, -80], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[650px] h-[600px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.22), transparent 70%)' }}
          animate={{ x: [0, -60, 0], y: [0, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        <div className="absolute inset-0 grid-pattern opacity-[0.18]" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 100% 80% at 50% 120%, rgba(124,92,255,0.12), transparent), linear-gradient(180deg, #050509 0%, #0a0a12 100%)',
          }}
        />
      </div>

      {/* ── Left: Form ── */}
      <div className="flex-1 lg:w-1/2 flex items-center lg:justify-end justify-center px-6 py-10 lg:pr-16 xl:pr-20 relative">

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-lg">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" fillOpacity="0.95" />
              </svg>
            </div>
            <span className="font-display text-base font-bold">AiWeb</span>
          </div>

          {/* Hero header — no large logo icon; just accent eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: 'linear-gradient(135deg, #7c5cff, #22d3ee)' }}
              />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">
                {isSignup ? L('Шинэ бүртгэл', 'New account') : L('Нэвтрэлт', 'Sign in')}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight leading-[1.05]">
              {isSignup ? L('Бүртгэл үүсгэх', 'Create your account') : L('Тавтай морилно уу', 'Welcome back')}
            </h1>
            <p className="mt-2.5 text-sm text-[var(--text-secondary)]">
              {isSignup
                ? L('Хэдхэн минутад AI вэбсайтаа бүтээнэ', 'Build your AI website in minutes')
                : L('Вэбсайтуудаа удирдаж үргэлжлүүлэх', 'Continue managing your websites')}
            </p>
          </motion.div>

          {/* Glass form card with cursor halo */}
          <FormCardGlow>
            <motion.div
              key={shakeKey}
              animate={shakeKey > 0 ? { x: [0, -8, 8, -8, 8, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.42, ease: 'easeInOut' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative rounded-2xl p-7 shadow-2xl shadow-black/40 backdrop-blur-xl"
                style={{
                  background:
                    'linear-gradient(160deg, rgba(24,24,32,0.85) 0%, rgba(12,12,18,0.9) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <form onSubmit={submit} className="space-y-5">
                  <AnimatePresence>
                    {isSignup && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                          {L('Нэр', 'Full name')}
                        </label>
                        <GlowField>
                          <input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="field"
                            autoComplete="name"
                            placeholder={L('Таны нэр', 'Your name')}
                          />
                        </GlowField>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      {L('И-мэйл', 'Email')}
                    </label>
                    <GlowField>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="field"
                        autoComplete="email"
                        required
                        placeholder="you@example.com"
                      />
                    </GlowField>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      {L('Нууц үг', 'Password')}
                    </label>
                    <GlowField>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPw ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="field pr-11"
                          autoComplete={isSignup ? 'new-password' : 'current-password'}
                          required
                          minLength={8}
                          placeholder="--------"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1"
                          tabIndex={-1}
                          aria-label={showPw ? L('Нуух', 'Hide') : L('Харуулах', 'Show')}
                        >
                          <EyeIcon open={showPw} />
                        </button>
                      </div>
                    </GlowField>
                    {isSignup && (
                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                        {L('Хамгийн багадаа 8 тэмдэгт', 'At least 8 characters')}
                      </p>
                    )}
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        key="error"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="text-sm text-[var(--danger)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 rounded-xl px-4 py-3 flex items-center gap-2"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.015 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className="relative w-full overflow-hidden rounded-xl font-semibold text-white h-12 text-sm tracking-tight"
                    style={{
                      background:
                        'linear-gradient(95deg, #7c5cff 0%, #c084fc 50%, #22d3ee 100%)',
                      boxShadow: '0 10px 30px -5px rgba(124,92,255,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2 relative z-10">
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                        {L('Түр хүлээнэ үү...', 'One moment...')}
                      </span>
                    ) : (
                      <span className="relative z-10">
                        {isSignup ? L('Бүртгэл үүсгэх', 'Create account') : L('Нэвтрэх', 'Sign in')}
                      </span>
                    )}
                    {/* shine sweep */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
                        width: '200%',
                      }}
                      animate={{ x: ['-100%', '50%'] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          </FormCardGlow>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-sm text-[var(--text-tertiary)] text-center"
          >
            {isSignup ? (
              <>
                {L('Аль хэдийн бүртгэлтэй юу?', 'Already have an account?')}{' '}
                <Link href={`/${locale}/signin`} className="text-[var(--accent-light)] hover:text-[var(--accent)] font-medium transition-colors">
                  {L('Нэвтрэх', 'Sign in')}
                </Link>
              </>
            ) : (
              <>
                {L('Бүртгэлгүй юу?', 'No account yet?')}{' '}
                <Link href={`/${locale}/signup`} className="text-[var(--accent-light)] hover:text-[var(--accent)] font-medium transition-colors">
                  {L('Бүртгүүлэх', 'Sign up')}
                </Link>
              </>
            )}
          </motion.p>

          <p className="mt-3 text-xs text-[var(--text-muted)] text-center max-w-xs mx-auto">
            {L(
              'Үргэлжлүүлснээр та Нууцлалын бодлого, Үйлчилгээний нөхцлийг зөвшөөрч байна.',
              'By continuing you agree to our Terms of Service and Privacy Policy.',
            )}
          </p>
        </div>
      </div>

      {/* ── Right: showcase — no border, unified BG ── */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <ShowcasePanel locale={locale} />
      </div>
    </div>
  );
}
