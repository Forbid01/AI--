'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

// ─── Template data ────────────────────────────────────────────────────────────

const BADGE = {
  popular: { mn: 'Эрэлттэй',  en: 'Popular', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  new:     { mn: 'Шинэ',      en: 'New',      color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
};

const LANDING_TEMPLATE_LIMIT = 9;

// ─── Shared premium mockup ────────────────────────────────────────────────────
// Renders a realistic website preview with real Unsplash photo, branded logo,
// nav (Home · About · Contact), hero title, CTA, and stats — driven by the
// template's `mock` config object.

export function PremiumMockup({ template, compact = false, locale = 'mn' }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const m = template.mock;
  if (!m) return null;

  const tier = m.tier ?? 'accent'; // 'gold' | 'accent'
  const isGold = tier === 'gold';
  const accentGrad = `linear-gradient(135deg, ${m.accent}, ${m.accent2})`;
  const coinGrad = isGold
    ? 'conic-gradient(from 45deg, #fde68a, #d4af37, #92400e, #fde68a)'
    : `conic-gradient(from 45deg, ${m.accent}, ${m.accent2}, ${m.accent})`;

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Real photo background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={m.img}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover scale-105"
        aria-hidden="true"
      />
      {/* Color grade overlay — template-specific */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${m.palette[2]}cc 0%, ${m.palette[0]}1a 50%, ${m.palette[1]}55 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Top sheen */}
      <div
        className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
        style={{ background: 'linear-gradient(165deg, rgba(255,255,255,0.10), transparent 70%)' }}
      />

      {/* Navbar */}
      <div
        className={`absolute top-0 inset-x-0 flex items-center justify-between ${compact ? 'px-3 py-1.5' : 'px-4 py-2.5'}`}
        style={{ background: 'linear-gradient(to bottom, rgba(6,4,2,0.55), transparent)', backdropFilter: 'blur(4px)' }}
      >
        <div className="flex items-center gap-1.5">
          <span className={`relative inline-block`} style={{ width: compact ? 9 : 12, height: compact ? 9 : 12 }}>
            <span className="absolute inset-0 rounded-full" style={{ background: coinGrad }} />
            <span className="absolute inset-[1.2px] rounded-full" style={{ background: m.palette[2] }} />
            <span
              className="absolute rounded-sm"
              style={{ inset: compact ? 2.8 : 3.5, background: isGold ? 'linear-gradient(135deg, #fde68a, #d4af37)' : accentGrad }}
            />
          </span>
          <span className={`font-black text-white tracking-widest uppercase ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
            {m.brand}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {['Home', 'About', 'Contact'].map((link, i) => (
            <span
              key={link}
              className={`font-semibold tracking-wider ${compact ? 'text-[6.5px]' : 'text-[7.5px]'}`}
              style={{ color: i === 0 ? (isGold ? '#fde68a' : m.accent) : 'rgba(255,255,255,0.55)' }}
            >
              {link}
            </span>
          ))}
          {!compact && (
            <span
              className="ml-1 inline-flex items-center h-[18px] px-2 rounded-full text-[7.5px] font-bold"
              style={{
                background: isGold ? 'linear-gradient(135deg, #fde68a, #d4af37)' : accentGrad,
                color: isGold ? '#0c0a09' : '#fff',
              }}
            >
              {L(m.ctaShort || 'Эхлэх', m.ctaShortEn || 'Start')}
            </span>
          )}
        </div>
      </div>

      {/* Center hero content */}
      <div className={`absolute inset-0 flex flex-col justify-center ${compact ? 'px-3' : 'px-5'}`}>
        <span
          className={`font-mono uppercase tracking-[0.25em] mb-1 ${compact ? 'text-[6px]' : 'text-[8px]'}`}
          style={{ color: isGold ? '#fde68a' : m.accent }}
        >
          — {L(m.eyebrow, m.eyebrowEn)}
        </span>
        <h3
          className={`font-black text-white leading-[1.05] tracking-tight drop-shadow-xl ${compact ? 'text-[11px]' : 'text-[14px]'}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          {L(m.hero, m.heroEn)}
        </h3>
        {!compact && (
          <p className="text-[8px] text-white/70 mt-1.5 max-w-[85%] leading-snug">
            {L(m.sub, m.subEn)}
          </p>
        )}
        <div className={`flex items-center gap-1.5 ${compact ? 'mt-2' : 'mt-3'}`}>
          <span
            className={`inline-flex items-center font-bold rounded-full ${compact ? 'h-[18px] px-2 text-[7px]' : 'h-[22px] px-2.5 text-[8.5px]'}`}
            style={{
              background: isGold ? 'linear-gradient(135deg, #fde68a, #d4af37)' : accentGrad,
              color: isGold ? '#0c0a09' : '#fff',
              boxShadow: `0 4px 12px -2px ${m.accent}55`,
            }}
          >
            {L(m.cta, m.ctaEn)} →
          </span>
          {!compact && (
            <span className="inline-flex items-center h-[22px] px-2 rounded-full text-[8px] font-semibold text-white/80 border border-white/25 backdrop-blur-sm">
              {L(m.cta2 || 'Дэлгэрэнгүй', m.cta2En || 'Learn more')}
            </span>
          )}
        </div>
      </div>

      {/* Bottom stats bar */}
      {!compact && m.stats && (
        <div
          className="absolute bottom-0 inset-x-0 px-4 py-1.5 flex items-center justify-between"
          style={{ background: 'linear-gradient(to top, rgba(6,4,2,0.9), rgba(6,4,2,0.3))' }}
        >
          <div className="flex items-center gap-3">
            {m.stats.map((s) => (
              <div key={s.l} className="flex items-center gap-1">
                <span className="text-[9px] font-black text-white tabular-nums" style={{ color: isGold ? '#fde68a' : m.accent }}>
                  {s.v}
                </span>
                <span className="text-[6px] font-mono uppercase tracking-wider text-white/40">{s.l}</span>
              </div>
            ))}
          </div>
          <span className="text-[6px] font-mono text-white/35">© {m.brand.toLowerCase()}</span>
        </div>
      )}
    </div>
  );
}

export const TEMPLATE_SHOWCASE_TEMPLATES = [
  {
    id: 'restaurant_mongolian',
    category: 'restaurant',
    badge: 'popular',
    name:        { mn: 'Монгол ресторан', en: 'MN Restaurant' },
    description: { mn: 'Дулаан, уламжлалт — хоол, хүргэлт, захиалгын систем.', en: 'Warm and traditional — menu, delivery, and reservations.' },
    domain:      'nomads-kitchen.aiweb.mn',
    features:    { mn: ['Цэс хуудас', 'Хүргэлт', 'Захиалга'], en: ['Menu page', 'Delivery', 'Reservation'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80&fit=crop',
      brand: 'NOMADS',
      tier: 'accent',
      accent: '#f59e0b',
      accent2: '#c2410c',
      palette: ['#fbbf24', '#c2410c', '#1c0a04'],
      eyebrow: 'Ресторан',     eyebrowEn: 'Restaurant',
      hero:    'Монгол амт',  heroEn:    'Nomad cuisine',
      sub:     'Уламжлалтаас модерн болтол — 30 жилийн туршлагатай.',
      subEn:   'From tradition to modernity — 30 years of experience.',
      cta:     'Ширээ захиалах',  ctaEn: 'Reserve table',
      cta2:    'Цэс харах',       cta2En: 'View menu',
      ctaShort:'Захиалах',        ctaShortEn: 'Reserve',
      stats:   [{ v: '4.9★', l: 'Rating' }, { v: '32', l: 'Dishes' }],
    },
  },
  {
    id: 'beauty_salon',
    category: 'beauty',
    badge: 'popular',
    name:        { mn: 'Гоо сайхан', en: 'Beauty Salon' },
    description: { mn: 'Нарийн, эелдэг — салон, спа, wellness газарт.', en: 'Elegant and soft — for salons, spas, and wellness studios.' },
    domain:      'glow-studio.aiweb.mn',
    features:    { mn: ['Үйлчилгээний жагсаалт', 'Цаг захиалга', 'Багийн танилцуулга'], en: ['Service list', 'Booking', 'Team intro'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80&fit=crop',
      brand: 'GLOW',
      tier: 'accent',
      accent: '#ec4899',
      accent2: '#a855f7',
      palette: ['#f472b6', '#a855f7', '#1a0a18'],
      eyebrow: 'Гоо сайхан',   eyebrowEn: 'Beauty',
      hero:    'Өөрийг нээн',  heroEn:    'Discover your glow',
      sub:     'Үс, нүүр, маникюр — бүх үйлчилгээ нэг дор.',
      subEn:   'Hair, face, nails — everything in one place.',
      cta:     'Цаг авах',      ctaEn: 'Book now',
      cta2:    'Үйлчилгээ',    cta2En: 'Services',
      ctaShort:'Цаг авах',      ctaShortEn: 'Book',
      stats:   [{ v: '2.1k', l: 'Members' }, { v: '18', l: 'Services' }],
    },
  },
  {
    id: 'portfolio',
    category: 'portfolio',
    badge: null,
    name:        { mn: 'Портфолио', en: 'Portfolio' },
    description: { mn: 'Цэвэр, эдиториал — дизайнер, зураач, бүтээлч мэргэжилтнүүдэд.', en: 'Clean, editorial — for designers, artists, and creative professionals.' },
    domain:      'creative-folio.aiweb.mn',
    features:    { mn: ['Төслийн гэрэл зураг', 'Намтар', 'Холбоо барих'], en: ['Project gallery', 'About', 'Contact'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=900&q=80&fit=crop',
      brand: 'ORBIT',
      tier: 'accent',
      accent: '#7c5cff',
      accent2: '#22d3ee',
      palette: ['#a78bfa', '#22d3ee', '#0a0a1f'],
      eyebrow: 'Дизайн портфолио', eyebrowEn: 'Design portfolio',
      hero:    'Өөр өнцгөөс',      heroEn:    'From another angle',
      sub:     'Бренд, вэбсайт, motion design бүтээлүүдийн түүвэр.',
      subEn:   'A selection of brand, web, and motion work.',
      cta:     'Ажлаа харах',      ctaEn: 'See work',
      cta2:    'Хамтран ажиллах',  cta2En: 'Work together',
      ctaShort:'Харах',             ctaShortEn: 'View',
      stats:   [{ v: '47', l: 'Clients' }, { v: '12', l: 'Awards' }],
    },
  },
  {
    id: 'business',
    category: 'service',
    badge: null,
    name:        { mn: 'Бизнес', en: 'Business' },
    description: { mn: 'Итгэлтэй, үр дүнд чиглэсэн — корпорат, мэргэжлийн үйлчилгээнд.', en: 'Confident, results-driven — for corporate and professional services.' },
    domain:      'enterprise-pro.aiweb.mn',
    features:    { mn: ['Үйлчилгээ', 'Баг', 'Холбоо барих'], en: ['Services', 'Team', 'Contact'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80&fit=crop',
      brand: 'ENTERPRISE',
      tier: 'accent',
      accent: '#3b82f6',
      accent2: '#1d4ed8',
      palette: ['#60a5fa', '#1d4ed8', '#0a0f1e'],
      eyebrow: 'Бизнес зөвлөгөө', eyebrowEn: 'Business consulting',
      hero:    'Өсөлтөд хамтдаа', heroEn:    'Partners in growth',
      sub:     '15+ жилийн бүтээмжтэй зөвлөгөө. Бизнес гартаа барь.',
      subEn:   'Proven consulting for 15+ years. Own your growth.',
      cta:     'Зөвлөгөө авах',   ctaEn: 'Get advice',
      cta2:    'Тухай',            cta2En: 'About us',
      ctaShort:'Холбогдох',       ctaShortEn: 'Contact',
      stats:   [{ v: '250+', l: 'Clients' }, { v: '15yr', l: 'Exp' }],
    },
  },
  {
    id: 'restaurant',
    category: 'restaurant',
    badge: 'popular',
    name:        { mn: 'Кафе ресторан', en: 'Restaurant' },
    description: { mn: 'Дулаахан, амт татам өнгө аяс — кафе, brunch, fine dining газарт.', en: 'Warm, appetite-driven design for cafes, brunch spots, and restaurants.' },
    domain:      'ember-table.aiweb.mn',
    features:    { mn: ['Меню', 'Ширээ захиалга', 'Байршил'], en: ['Menu', 'Reservations', 'Location'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80&fit=crop',
      brand: 'EMBER',
      tier: 'gold',
      accent: '#fb923c',
      accent2: '#7c2d12',
      palette: ['#fdba74', '#9a3412', '#140c0a'],
      eyebrow: 'Хотын ресторан', eyebrowEn: 'City restaurant',
      hero: 'Амттай орой', heroEn: 'Evenings worth tasting',
      sub: 'Гал тогоо, дарс, уур амьсгал гурав төгс нийлэх орон зай.',
      subEn: 'A place where kitchen, wine, and atmosphere come together.',
      cta: 'Ширээ захиалах', ctaEn: 'Reserve now',
      cta2: 'Меню үзэх', cta2En: 'View menu',
      ctaShort: 'Book', ctaShortEn: 'Book',
      stats: [{ v: '48', l: 'Seats' }, { v: '4.8★', l: 'Rating' }],
    },
  },
  {
    id: 'fitness',
    category: 'service',
    badge: null,
    name:        { mn: 'Фитнесс', en: 'Fitness' },
    description: { mn: 'Хүчтэй, эрчтэй харагдац — gym, club, coaching студид.', en: 'Bold, high-energy design for gyms, training clubs, and coaching studios.' },
    domain:      'iron-core.aiweb.mn',
    features:    { mn: ['Хөтөлбөр', 'Дасгалжуулагч', 'Гишүүнчлэл'], en: ['Programs', 'Coaches', 'Membership'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80&fit=crop',
      brand: 'IRON',
      tier: 'accent',
      accent: '#ef4444',
      accent2: '#f59e0b',
      palette: ['#f87171', '#f59e0b', '#0b0b0e'],
      eyebrow: 'Performance club', eyebrowEn: 'Performance club',
      hero: 'Хүчээ нээ', heroEn: 'Train for more',
      sub: 'Crossfit, strength, recovery бүгд нэг membership дотор.',
      subEn: 'Crossfit, strength, and recovery in one membership.',
      cta: 'Эхлэх', ctaEn: 'Start now',
      cta2: 'Хөтөлбөр', cta2En: 'Programs',
      ctaShort: 'Join', ctaShortEn: 'Join',
      stats: [{ v: '320+', l: 'Members' }, { v: '28', l: 'Classes' }],
    },
  },
  {
    id: 'crafts',
    category: 'store',
    badge: 'new',
    name:        { mn: 'Гар урлал', en: 'Crafts' },
    description: { mn: 'Дулаан, гар хийцийн мэдрэмжтэй — maker, artisan брэндүүдэд.', en: 'Warm, handcrafted presentation for makers and artisan brands.' },
    domain:      'earth-hands.aiweb.mn',
    features:    { mn: ['Цуглуулга', 'Түүх', 'Захиалга'], en: ['Collections', 'Story', 'Orders'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=900&q=80&fit=crop',
      brand: 'LOOM',
      tier: 'accent',
      accent: '#d97706',
      accent2: '#92400e',
      palette: ['#fbbf24', '#92400e', '#1a1208'],
      eyebrow: 'Artisan studio', eyebrowEn: 'Artisan studio',
      hero: 'Гараар бүтээсэн', heroEn: 'Made with intention',
      sub: 'Материал, хөдөлмөр, түүх гурав нэгдсэн цуглуулгууд.',
      subEn: 'Collections shaped by material, craft, and story.',
      cta: 'Цуглуулга үзэх', ctaEn: 'Explore collection',
      cta2: 'Түүх унших', cta2En: 'Read the story',
      ctaShort: 'Shop', ctaShortEn: 'Shop',
      stats: [{ v: '86', l: 'Pieces' }, { v: '12', l: 'Series' }],
    },
  },
  {
    id: 'education',
    category: 'service',
    badge: null,
    name:        { mn: 'Боловсрол', en: 'Education' },
    description: { mn: 'Glassmorphism · Дашборд мэдрэмж — сургалтын төв, онлайн курс, академид.', en: 'Glassmorphism dashboard feel — training centers, online courses, academies.' },
    domain:      'north-academy.aiweb.mn',
    features:    { mn: ['Хөтөлбөр', 'Багш нар', 'Бүртгэл'], en: ['Programs', 'Teachers', 'Enrollment'] },
    mock: {
      img: '/templates/education/cover.png',
      brand: 'NORTH',
      tier: 'accent',
      accent: '#2563eb',
      accent2: '#0f766e',
      palette: ['#60a5fa', '#0f766e', '#08111f'],
      eyebrow: 'Learning center', eyebrowEn: 'Learning center',
      hero: 'Шинэ шат руу', heroEn: 'Advance with confidence',
      sub: 'IELTS, coding, design зэрэг практик ур чадварын сургалтууд.',
      subEn: 'Practical programs in IELTS, coding, design, and more.',
      cta: 'Бүртгүүлэх', ctaEn: 'Enroll now',
      cta2: 'Хөтөлбөр үзэх', cta2En: 'View programs',
      ctaShort: 'Enroll', ctaShortEn: 'Enroll',
      stats: [{ v: '1.8k', l: 'Students' }, { v: '94%', l: 'Pass' }],
    },
  },
  {
    id: 'clinic',
    category: 'service',
    badge: null,
    name:        { mn: 'Эмнэлэг', en: 'Clinic' },
    description: { mn: 'Цэвэр, тайвшруулах өнгө төрх — clinic, health center, medical practice-д.', en: 'Clean, reassuring design for clinics, health centers, and medical practices.' },
    domain:      'whiteleaf-clinic.aiweb.mn',
    features:    { mn: ['Эмч нар', 'Үйлчилгээ', 'Цаг авах'], en: ['Doctors', 'Services', 'Appointments'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80&fit=crop',
      brand: 'WHITELEAF',
      tier: 'accent',
      accent: '#14b8a6',
      accent2: '#0f766e',
      palette: ['#5eead4', '#0f766e', '#071413'],
      eyebrow: 'Health clinic', eyebrowEn: 'Health clinic',
      hero: 'Эрүүл мэндэд ойр', heroEn: 'Care you can trust',
      sub: 'Мэргэжлийн тусламж, хурдан цаг авалт, ил тод зөвлөгөө.',
      subEn: 'Professional care, fast appointments, and clear guidance.',
      cta: 'Цаг захиалах', ctaEn: 'Book appointment',
      cta2: 'Эмч нар', cta2En: 'Meet doctors',
      ctaShort: 'Book', ctaShortEn: 'Book',
      stats: [{ v: '12', l: 'Doctors' }, { v: '4.9', l: 'Care' }],
    },
  },
  {
    id: 'auto_repair',
    category: 'service',
    badge: null,
    name:        { mn: 'Авто засвар', en: 'Auto Repair' },
    description: { mn: 'Шууд, хүчтэй өнгө төрх — сервис, засвар, оношлогоонд.', en: 'Strong, straightforward layout for garages, repair shops, and diagnostics.' },
    domain:      'torque-garage.aiweb.mn',
    features:    { mn: ['Засварын төрөл', 'Үнийн багц', 'Байршил'], en: ['Repair services', 'Pricing', 'Location'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=900&q=80&fit=crop',
      brand: 'TORQUE',
      tier: 'accent',
      accent: '#f97316',
      accent2: '#dc2626',
      palette: ['#fb923c', '#dc2626', '#090909'],
      eyebrow: 'Auto garage', eyebrowEn: 'Auto garage',
      hero: 'Илүү найдвартай яв', heroEn: 'Back on the road fast',
      sub: 'Оношлогоо, тос, тоормос, моторын үйлчилгээ нэг дор.',
      subEn: 'Diagnostics, oil, brakes, and engine service in one place.',
      cta: 'Цаг товлох', ctaEn: 'Schedule service',
      cta2: 'Үйлчилгээ', cta2En: 'Services',
      ctaShort: 'Service', ctaShortEn: 'Service',
      stats: [{ v: '600+', l: 'Cars' }, { v: '24h', l: 'Turn' }],
    },
  },
  {
    id: 'fashion_store',
    category: 'store',
    badge: 'new',
    name:        { mn: 'Fashion Store', en: 'Fashion' },
    description: { mn: 'Sleek, editorial feel — хувцас, аксессуар, fashion брэндүүдэд.', en: 'Sleek editorial feel for clothing stores and fashion brands.' },
    domain:      'atelier-mode.aiweb.mn',
    features:    { mn: ['Коллекц', 'Lookbook', 'Shop'], en: ['Collections', 'Lookbook', 'Shop'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80&fit=crop',
      brand: 'MODE',
      tier: 'accent',
      accent: '#f5f5f4',
      accent2: '#d6d3d1',
      palette: ['#fafaf9', '#d6d3d1', '#111111'],
      eyebrow: 'New collection', eyebrowEn: 'New collection',
      hero: 'Шинэ улирал', heroEn: 'For the new season',
      sub: 'Тайван, цэвэр шугамтай коллекцууд ба editorials.',
      subEn: 'Quiet silhouettes, clean lines, and editorial styling.',
      cta: 'Коллекц үзэх', ctaEn: 'View collection',
      cta2: 'Lookbook', cta2En: 'Lookbook',
      ctaShort: 'Shop', ctaShortEn: 'Shop',
      stats: [{ v: '36', l: 'Looks' }, { v: '8', l: 'Drops' }],
    },
  },
  {
    id: 'home_service',
    category: 'service',
    badge: null,
    name:        { mn: 'Home Service', en: 'Home Service' },
    description: { mn: 'Цэвэр, practical — cleaning, plumbing, repair, renovation бизнест.', en: 'Practical and clear for cleaning, repairs, plumbing, and renovation.' },
    domain:      'homestead-pro.aiweb.mn',
    features:    { mn: ['Үйлчилгээ', '24/7 дуудлага', 'Quote авах'], en: ['Services', '24/7 calls', 'Get a quote'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80&fit=crop',
      brand: 'HOMESTEAD',
      tier: 'accent',
      accent: '#0284c7',
      accent2: '#1d4ed8',
      palette: ['#38bdf8', '#1d4ed8', '#08111a'],
      eyebrow: 'Home care', eyebrowEn: 'Home care',
      hero: 'Гэрээ найдвартай даатга', heroEn: 'Reliable help for every room',
      sub: 'Цэвэрлэгээ, сантехник, цахилгаан, засвар нэг багт.',
      subEn: 'Cleaning, plumbing, electrical, and repairs from one team.',
      cta: 'Үнэ авах', ctaEn: 'Get a quote',
      cta2: 'Үйлчилгээ', cta2En: 'Services',
      ctaShort: 'Quote', ctaShortEn: 'Quote',
      stats: [{ v: '1h', l: 'Reply' }, { v: '900+', l: 'Jobs' }],
    },
  },
  {
    id: 'sales_rep',
    category: 'service',
    badge: null,
    name:        { mn: 'Sales Rep', en: 'Sales' },
    description: { mn: 'Results-driven дизайн — B2B sales, distribution, commerce багуудад.', en: 'Conversion-focused design for sales teams, distributors, and commerce operators.' },
    domain:      'tradebridge.aiweb.mn',
    features:    { mn: ['Partner болох', 'Барааны шугам', 'Quote'], en: ['Become a partner', 'Product lines', 'Quotes'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80&fit=crop',
      brand: 'TRADEBRIDGE',
      tier: 'accent',
      accent: '#8b5cf6',
      accent2: '#2563eb',
      palette: ['#a78bfa', '#2563eb', '#0b1020'],
      eyebrow: 'Distribution', eyebrowEn: 'Distribution',
      hero: 'Борлуулалтаа тэл', heroEn: 'Scale your channels',
      sub: 'Brand partner, wholesale, retail expansion-д зориулсан төв.',
      subEn: 'A hub for brand partners, wholesale, and retail expansion.',
      cta: 'Partner болох', ctaEn: 'Become a partner',
      cta2: 'Каталог', cta2En: 'Catalog',
      ctaShort: 'Partner', ctaShortEn: 'Partner',
      stats: [{ v: '42', l: 'Brands' }, { v: '18', l: 'Cities' }],
    },
  },
  {
    id: 'photography',
    category: 'portfolio',
    badge: null,
    name:        { mn: 'Photography', en: 'Photography' },
    description: { mn: 'Dark, visual-first — photographer, studio, visual artist нарт.', en: 'Dark, visual-first portfolio for photographers and visual studios.' },
    domain:      'afterlight-photo.aiweb.mn',
    features:    { mn: ['Gallery', 'Packages', 'Inquiry'], en: ['Gallery', 'Packages', 'Inquiry'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=80&fit=crop',
      brand: 'AFTERLIGHT',
      tier: 'accent',
      accent: '#22d3ee',
      accent2: '#0ea5e9',
      palette: ['#67e8f9', '#0ea5e9', '#05070d'],
      eyebrow: 'Visual stories', eyebrowEn: 'Visual stories',
      hero: 'Гэрлээр ярь', heroEn: 'Stories in light',
      sub: 'Portrait, editorial, commercial зураг авалтын бүтээлүүд.',
      subEn: 'Portrait, editorial, and commercial work in one portfolio.',
      cta: 'Ажлаа үзэх', ctaEn: 'See portfolio',
      cta2: 'Үнэ асуух', cta2En: 'Ask pricing',
      ctaShort: 'View', ctaShortEn: 'View',
      stats: [{ v: '210', l: 'Shoots' }, { v: '14', l: 'Cities' }],
    },
  },
  {
    id: 'furniture',
    category: 'store',
    badge: null,
    name:        { mn: 'Тавилга', en: 'Furniture' },
    description: { mn: 'Дулаан, refined — furniture maker, interior, home decor брэндүүдэд.', en: 'Warm and refined for furniture makers, interiors, and home decor brands.' },
    domain:      'oakform.aiweb.mn',
    features:    { mn: ['Collections', 'Materials', 'Inquiry'], en: ['Collections', 'Materials', 'Inquiry'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80&fit=crop',
      brand: 'OAKFORM',
      tier: 'gold',
      accent: '#d4af37',
      accent2: '#8b5e34',
      palette: ['#f5deb3', '#8b5e34', '#120e0b'],
      eyebrow: 'Interior craft', eyebrowEn: 'Interior craft',
      hero: 'Зайг зөөллөнө', heroEn: 'Spaces with character',
      sub: 'Мод, даавуу, гэрлийн тэнцвэртэй минимал цуглуулгууд.',
      subEn: 'Balanced minimal collections in wood, fabric, and light.',
      cta: 'Коллекц үзэх', ctaEn: 'View pieces',
      cta2: 'Материал', cta2En: 'Materials',
      ctaShort: 'Pieces', ctaShortEn: 'Pieces',
      stats: [{ v: '28', l: 'Designs' }, { v: '7', l: 'Wood' }],
    },
  },
  {
    id: 'pet_shop',
    category: 'store',
    badge: 'new',
    name:        { mn: 'Pet Shop', en: 'Pet Shop' },
    description: { mn: 'Friendly, warm — pet store, grooming, veterinary service-д.', en: 'Friendly and warm for pet shops, grooming, and veterinary services.' },
    domain:      'pawhaus.aiweb.mn',
    features:    { mn: ['Products', 'Grooming', 'Vet booking'], en: ['Products', 'Grooming', 'Vet booking'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&q=80&fit=crop',
      brand: 'PAWHAUS',
      tier: 'accent',
      accent: '#f59e0b',
      accent2: '#ec4899',
      palette: ['#fcd34d', '#ec4899', '#1a0f12'],
      eyebrow: 'Pet care', eyebrowEn: 'Pet care',
      hero: 'Сүүл савласан аз жаргал', heroEn: 'Care they run toward',
      sub: 'Хоол, тоглоом, grooming, vet зөвлөгөө бүгд нэг дор.',
      subEn: 'Food, toys, grooming, and vet guidance in one place.',
      cta: 'Shop эхлэх', ctaEn: 'Start shopping',
      cta2: 'Grooming', cta2En: 'Grooming',
      ctaShort: 'Pet', ctaShortEn: 'Pet',
      stats: [{ v: '120+', l: 'Items' }, { v: '4.9★', l: 'Happy' }],
    },
  },
  {
    id: 'phone_repair',
    category: 'service',
    badge: null,
    name:        { mn: 'Утас засвар', en: 'Phone Repair' },
    description: { mn: 'Technical, reliable — утас, tablet, device repair газарт.', en: 'Technical and reliable for phone, tablet, and device repair shops.' },
    domain:      'pixelfix.aiweb.mn',
    features:    { mn: ['Repair types', 'Үнэ', 'Warranty'], en: ['Repair types', 'Pricing', 'Warranty'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80&fit=crop',
      brand: 'PIXELFIX',
      tier: 'accent',
      accent: '#0ea5e9',
      accent2: '#22d3ee',
      palette: ['#38bdf8', '#22d3ee', '#06111a'],
      eyebrow: 'Device repair', eyebrowEn: 'Device repair',
      hero: 'Хурдан засвар', heroEn: 'Fast fixes, clear pricing',
      sub: 'Display, battery, camera, board-level service нэг дор.',
      subEn: 'Display, battery, camera, and board-level repair in one lab.',
      cta: 'Repair захиалах', ctaEn: 'Book repair',
      cta2: 'Үнэ харах', cta2En: 'View pricing',
      ctaShort: 'Repair', ctaShortEn: 'Repair',
      stats: [{ v: '45min', l: 'Avg' }, { v: '1yr', l: 'Warranty' }],
    },
  },
  {
    id: 'music_school',
    category: 'service',
    badge: 'new',
    name:        { mn: 'Хөгжим', en: 'Music' },
    description: { mn: 'Уран сайхны, expressive — music school, studio, instructors-д.', en: 'Artistic and expressive for music schools, studios, and instructors.' },
    domain:      'crescendo.aiweb.mn',
    features:    { mn: ['Classes', 'Teachers', 'Performances'], en: ['Classes', 'Teachers', 'Performances'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=900&q=80&fit=crop',
      brand: 'CRESCENDO',
      tier: 'accent',
      accent: '#a855f7',
      accent2: '#ec4899',
      palette: ['#c084fc', '#ec4899', '#120615'],
      eyebrow: 'Music school', eyebrowEn: 'Music school',
      hero: 'Дуу авиагаар өс', heroEn: 'Grow through sound',
      sub: 'Төгөлдөр хуур, гитар, vocal, theory сургалтууд.',
      subEn: 'Piano, guitar, vocal, and theory programs for every level.',
      cta: 'Хичээл эхлэх', ctaEn: 'Start lessons',
      cta2: 'Багш нар', cta2En: 'Teachers',
      ctaShort: 'Learn', ctaShortEn: 'Learn',
      stats: [{ v: '380', l: 'Students' }, { v: '24', l: 'Recitals' }],
    },
  },
  {
    id: 'organic_food',
    category: 'store',
    badge: null,
    name:        { mn: 'Organic Food', en: 'Organic' },
    description: { mn: 'Natural, green — farm shop, organic store, healthy food брэндүүдэд.', en: 'Natural and green for farm shops, organic markets, and healthy food brands.' },
    domain:      'rootandfield.aiweb.mn',
    features:    { mn: ['Products', 'Farms', 'Delivery'], en: ['Products', 'Farms', 'Delivery'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80&fit=crop',
      brand: 'ROOT&FIELD',
      tier: 'accent',
      accent: '#65a30d',
      accent2: '#ca8a04',
      palette: ['#bef264', '#ca8a04', '#0d1307'],
      eyebrow: 'Organic market', eyebrowEn: 'Organic market',
      hero: 'Шинэхэн, цэвэрхэн', heroEn: 'Closer to the harvest',
      sub: 'Фермээс шууд ирсэн хүнс, амт, улирлын сонголтууд.',
      subEn: 'Seasonal produce and pantry goods delivered from local farms.',
      cta: 'Захиалах', ctaEn: 'Order now',
      cta2: 'Фермүүд', cta2En: 'Our farms',
      ctaShort: 'Order', ctaShortEn: 'Order',
      stats: [{ v: '14', l: 'Farms' }, { v: '2h', l: 'Fresh' }],
    },
  },
  {
    id: 'minimal',
    category: 'portfolio',
    badge: null,
    name:        { mn: 'Минимал', en: 'Minimal' },
    description: { mn: 'Цаасан цагаан, тайван — хувийн брэнд, хэвлэлийн мэдиад.', en: 'Paper-white and calm — for personal brands and editorial media.' },
    domain:      'minimal-studio.aiweb.mn',
    features:    { mn: ['Нийтлэл', 'Портфолио', 'Захидал'], en: ['Articles', 'Portfolio', 'Newsletter'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80&fit=crop',
      brand: 'ESSAY',
      tier: 'accent',
      accent: '#f1f5f9',
      accent2: '#cbd5e1',
      palette: ['#f1f5f9', '#94a3b8', '#0f172a'],
      eyebrow: 'Хэвлэлийн нийтлэл', eyebrowEn: 'Editorial',
      hero:    'Үгс, түүхүүд',      heroEn:    'Words and stories',
      sub:     'Ботл тайван, цаасан цагаан — хувийн блог.',
      subEn:   'Calm, paper-white — a personal journal.',
      cta:     'Уншиж эхлэх',       ctaEn: 'Start reading',
      cta2:    'Бичих',             cta2En: 'Write',
      ctaShort:'Захиалах',          ctaShortEn: 'Subscribe',
      stats:   [{ v: '840', l: 'Readers' }, { v: '62', l: 'Essays' }],
    },
  },
  {
    id: 'gifts',
    category: 'store',
    badge: 'new',
    name:        { mn: 'Онлайн дэлгүүр', en: 'Online Store' },
    description: { mn: 'Гар урлал, бараа, бүтээгдэхүүн зарах онлайн дэлгүүр.', en: 'Sell handcrafts, goods, and products through your online store.' },
    domain:      'handcraft-store.aiweb.mn',
    features:    { mn: ['Бүтээгдэхүүний каталог', 'Бэлэгний цуглуулга', 'QPay/SocialPay'], en: ['Product catalog', 'Gift collections', 'QPay/SocialPay'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=900&q=80&fit=crop',
      brand: 'ATELIER',
      tier: 'accent',
      accent: '#10b981',
      accent2: '#0d9488',
      palette: ['#6ee7b7', '#0d9488', '#03211b'],
      eyebrow: 'Гар урлалын дэлгүүр', eyebrowEn: 'Handcraft store',
      hero:    'Гар бүтээмжээр',      heroEn:    'Made by hand',
      sub:     'Улаанбаатарт хийсэн, дэлхийд илгээнэ. QPay, банк.',
      subEn:   'Crafted in Ulaanbaatar, shipped worldwide.',
      cta:     'Худалдан авах',       ctaEn: 'Shop now',
      cta2:    'Бэлэг',                cta2En: 'Gifts',
      ctaShort:'Сагс',                 ctaShortEn: 'Cart',
      stats:   [{ v: '120', l: 'Items' }, { v: '6', l: 'Cities' }],
    },
  },
  {
    id: 'travel',
    category: 'service',
    badge: 'new',
    name:        { mn: 'Аялал жуулчлал', en: 'Travel & Hotel' },
    description: { mn: 'Тансаглаг, зочломтгой — жуулчлал, буудал, амралтын газарт.', en: 'Luxurious and welcoming — for tourism, hotels, and resorts.' },
    domain:      'steppe-lodge.aiweb.mn',
    features:    { mn: ['Аяллын пакет', 'Галерей', 'Газрын зураг'], en: ['Tour packages', 'Gallery', 'Map'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80&fit=crop',
      brand: 'SILK',
      tier: 'gold',
      accent: '#d4af37',
      accent2: '#92400e',
      palette: ['#fde68a', '#d97706', '#0c0a09'],
      eyebrow: 'Өв соёлт буудал',   eyebrowEn: 'Heritage hotel',
      hero:    'Уламжлалт тансаг',  heroEn:    'Heritage luxury',
      sub:     '1924 оноос буудагч Улаанбаатарын анхны 5★ boutique.',
      subEn:   'Ulaanbaatar\'s first 5★ boutique since 1924.',
      cta:     'Өрөө захиалах',     ctaEn: 'Book a suite',
      cta2:    'Түүх',              cta2En: 'Story',
      ctaShort:'Захиалах',          ctaShortEn: 'Book',
      stats:   [{ v: '4.9', l: 'Rating' }, { v: '42', l: 'Suites' }],
    },
  },
  {
    id: 'legal',
    category: 'service',
    badge: null,
    name:        { mn: 'Хуулийн фирм', en: 'Law Firm' },
    description: { mn: 'Харанхуй-алт эрх мэдэл — хуулийн фирм, өмгөөлөгч, нотариуст.', en: 'Dark-gold authority — law firms, attorneys, and notary services.' },
    domain:      'counsel-legal.aiweb.mn',
    features:    { mn: ['Үйлчилгэний чиглэл', 'Хуульчийн намтар', 'Зөвлөгөө авах'], en: ['Practice areas', 'Attorney bios', 'Consultation'] },
    mock: {
      img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80&fit=crop',
      brand: 'COUNSEL',
      tier: 'gold',
      accent: '#fbbf24',
      accent2: '#78350f',
      palette: ['#fde68a', '#78350f', '#0d0d0f'],
      eyebrow: 'Өмгөөллийн фирм',   eyebrowEn: 'Law firm',
      hero:    'Таны эрх бидний үг', heroEn:    'Your rights, our voice',
      sub:     '20+ жилийн хуулийн үйл ажиллагаа. Иргэний, бизнес, өмч.',
      subEn:   '20+ years of practice. Civil, business, property law.',
      cta:     'Зөвлөгөө авах',     ctaEn: 'Consult now',
      cta2:    'Багаа танил',      cta2En: 'Meet the team',
      ctaShort:'Холбогдох',         ctaShortEn: 'Contact',
      stats:   [{ v: '450+', l: 'Cases' }, { v: '98%', l: 'Won' }],
    },
  },
];

export const TEMPLATE_SHOWCASE_CATEGORIES = [
  { key: 'all',        mn: 'Бүгд',      en: 'All' },
  { key: 'restaurant', mn: 'Ресторан',  en: 'Restaurant' },
  { key: 'store',      mn: 'Дэлгүүр',  en: 'Store' },
  { key: 'service',    mn: 'Үйлчилгээ', en: 'Service' },
  { key: 'portfolio',  mn: 'Портфолио', en: 'Portfolio' },
  { key: 'beauty',     mn: 'Гоо сайхан', en: 'Beauty' },
];

// ─── Template card ─────────────────────────────────────────────────────────────

function TemplateCard({ template, locale, isActive, onHover, index }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const cardRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 25 });

  const handleMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [rawX, rawY]);

  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const badge = template.badge ? BADGE[template.badge] : null;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={() => onHover(template)}
      className="group cursor-pointer"
    >
      <div
        className="rounded-2xl overflow-hidden border transition-all duration-300"
        style={{
          borderColor: isActive ? 'rgba(124,92,255,0.5)' : 'rgba(255,255,255,0.08)',
          boxShadow: isActive ? '0 0 0 2px rgba(124,92,255,0.2), 0 16px 40px -12px rgba(0,0,0,0.6)' : '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Mini preview */}
        <div className="relative overflow-hidden" style={{ height: 140 }}>
          <PremiumMockup template={template} locale={locale} compact />
          {/* Overlay on hover */}
          <div
            className="absolute inset-0 transition-opacity duration-200 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)', opacity: isActive ? 1 : 0 }}
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 border border-white/25 text-white text-xs font-medium backdrop-blur-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              {L('Урьдчилан харах', 'Preview')}
            </div>
          </div>

          {/* Badge */}
          {badge && (
            <div
              className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
              style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color}30` }}
            >
              {badge[locale] ?? badge.mn}
            </div>
          )}
        </div>

        {/* Card footer */}
        <div
          className="px-3 py-2.5 transition-colors duration-300"
          style={{ background: isActive ? 'rgba(124,92,255,0.08)' : 'var(--surface)' }}
        >
          <div className="font-semibold text-sm text-[var(--text-primary)] truncate">
            {template.name[locale] ?? template.name.mn}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-0.5 capitalize">
            {TEMPLATE_SHOWCASE_CATEGORIES.find(c => c.key === template.category)?.[locale] ?? template.category}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Preview panel ─────────────────────────────────────────────────────────────

function PreviewPanel({ template, locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
      className="rounded-2xl overflow-hidden border border-[var(--surface-border-strong)] bg-[var(--surface)] shadow-2xl shadow-black/40"
    >
      {/* Browser chrome — padlock + domain, no macOS traffic lights */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--surface-border)]" style={{ background: 'linear-gradient(180deg, #111 0%, #0a0a10 100%)' }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span className="flex-1 truncate text-[11px] font-mono text-white/55 tracking-tight">{template.domain}</span>
        <span className="flex items-center gap-1 text-[9px] text-[var(--success)] font-medium shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-60 animate-ping" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
          </span>
          {L('Нийтлэгдсэн', 'Live')}
        </span>
      </div>

      {/* Preview */}
      <div className="relative overflow-hidden" style={{ height: 260 }}>
        <PremiumMockup template={template} locale={locale} />
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight">
              {template.name[locale] ?? template.name.mn}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
              {template.description[locale] ?? template.description.mn}
            </p>
          </div>
          {template.badge && (
            <div
              className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: BADGE[template.badge].bg, color: BADGE[template.badge].color }}
            >
              {BADGE[template.badge][locale]}
            </div>
          )}
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(template.features[locale] ?? template.features.mn).map((f) => (
            <span
              key={f}
              className="px-2.5 py-1 rounded-full text-xs border border-[var(--surface-border-strong)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
            >
              {f}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/${locale}/dashboard/sites/new?template=${template.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)] text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-[var(--accent-soft)] shine"
        >
          {L('Энэ загвараар эхлэх', 'Use this template')}
          <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function TemplateShowcase({ locale }) {
  const L = useCallback((mn, en) => (locale === 'mn' ? mn : en), [locale]);
  const [activeCategory, setActiveCategory] = useState('all');
  const landingTemplates = TEMPLATE_SHOWCASE_TEMPLATES.slice(0, LANDING_TEMPLATE_LIMIT);
  const [hoveredTemplate, setHoveredTemplate] = useState(landingTemplates[0]);

  const filtered = activeCategory === 'all'
    ? landingTemplates
    : landingTemplates.filter((t) => t.category === activeCategory);

  // Keep hovered template valid after filter change
  const displayTemplate = filtered.find(t => t.id === hoveredTemplate?.id) ?? filtered[0];

  return (
    <section className="border-t border-[var(--surface-border)] relative overflow-hidden">
      {/* Background orb */}
      <div className="orb orb-a absolute pointer-events-none" style={{ top: '10%', left: '-12%', width: '420px', height: '420px', opacity: 0.18 }} />
      <div className="orb orb-b absolute pointer-events-none" style={{ bottom: '5%', right: '-8%', width: '360px', height: '360px', opacity: 0.12 }} />

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

        {/* Header */}
        <motion.div
          className="flex items-end justify-between flex-wrap gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div>
            <span className="eyebrow text-[var(--accent-light)]">{L('Загварууд', 'Templates')}</span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-black tracking-tighter leading-[1.02]">
              {L('Мэргэжлийн загварын сан', 'A curated template library')}
            </h2>
            <p className="mt-3 text-[var(--text-secondary)] max-w-xl">
              {L(
                'Ресторанаас портфолио хүртэл — AI таны брэндэд тохирсон загварыг сонгож, контентыг бичнэ.',
                'From restaurants to portfolios — AI picks the right template and fills in your content.',
              )}
            </p>
          </div>
          <Link href={`/${locale}/dashboard/sites/new`} className="btn btn-outline btn-md shrink-0">
            {L('Бүгдийг үзэх', 'Browse all')} <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
        </motion.div>

        {/* Category filter */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {TEMPLATE_SHOWCASE_CATEGORIES.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={active ? {
                  background: 'var(--accent)',
                  color: 'white',
                  boxShadow: '0 0 20px rgba(124,92,255,0.35)',
                } : {
                  background: 'var(--surface)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--surface-border)',
                }}
              >
                {cat[locale] ?? cat.mn}
              </button>
            );
          })}
        </motion.div>

        {/* 2-pane layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left: card grid */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3"
              >
                {filtered.map((template, i) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    locale={locale}
                    index={i}
                    isActive={displayTemplate?.id === template.id}
                    onHover={setHoveredTemplate}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Template count */}
            <div className="mt-5 flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
              {L(`${filtered.length} загвар харагдаж байна`, `Showing ${filtered.length} templates`)}
              {activeCategory !== 'all' && (
                <button type="button" onClick={() => setActiveCategory('all')} className="text-[var(--accent-light)] hover:text-[var(--accent)] transition-colors ml-1">
                  {L('Бүгдийг харах', 'Show all')}
                </button>
              )}
            </div>
          </div>

          {/* Right: preview panel (sticky) */}
          <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-24 shrink-0">
            <AnimatePresence mode="wait">
              {displayTemplate && (
                <PreviewPanel
                  key={displayTemplate.id}
                  template={displayTemplate}
                  locale={locale}
                />
              )}
            </AnimatePresence>

            {/* Hover hint (desktop only) */}
            <p className="hidden lg:block mt-3 text-center text-[11px] text-[var(--text-muted)]">
              {L('Загвар дарж урьдчилан харах', 'Hover a card to preview')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
