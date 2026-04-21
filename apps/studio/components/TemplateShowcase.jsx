'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';

// ─── Template data ────────────────────────────────────────────────────────────

const BADGE = {
  popular: { mn: 'Эрэлттэй',  en: 'Popular', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  new:     { mn: 'Шинэ',      en: 'New',      color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
};

const TEMPLATES = [
  {
    id: 'restaurant_mongolian',
    category: 'restaurant',
    badge: 'popular',
    name:        { mn: 'Монгол ресторан', en: 'MN Restaurant' },
    description: { mn: 'Дулаан, уламжлалт — хоол, хүргэлт, захиалгын систем.', en: 'Warm and traditional — menu, delivery, and reservations.' },
    domain:      'nomads-kitchen.aiweb.mn',
    features:    { mn: ['Цэс хуудас', 'Хүргэлт', 'Захиалга'], en: ['Menu page', 'Delivery', 'Reservation'] },
    gradient:    ['#7c2d12', '#c2410c'],
    cover:       '/templates/restaurant_mongolian/cover.jpg',
    preview: () => (
      <div className="h-full flex flex-col" style={{ background: 'linear-gradient(150deg,#7c2d12,#c2410c 60%,#ea580c)' }}>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-black/25">
          <div className="h-5 w-5 rounded bg-white/20" />
          <div className="h-2 w-20 rounded bg-white/60" />
          <div className="ml-auto flex gap-2">
            {[28,36,32].map((w,i)=><div key={i} className="h-1.5 rounded bg-white/35" style={{width:w}}/>)}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-2.5 text-center px-5">
          <div className="h-6 w-6 rounded-full bg-amber-400/70 mx-auto" />
          <div className="h-4 w-44 rounded-md bg-white/90" />
          <div className="h-2.5 w-32 rounded bg-white/50" />
          <div className="flex gap-2 mt-1">
            <div className="h-7 w-20 rounded-full bg-amber-400/90" />
            <div className="h-7 w-20 rounded-full border border-white/40" />
          </div>
        </div>
        <div className="flex gap-2 px-4 pb-3">
          {['Хоол','Хүргэлт','Захиалга'].map(t=>(
            <div key={t} className="flex-1 rounded-lg bg-black/20 p-2">
              <div className="h-2 w-10 rounded bg-white/70 mb-1" />
              <div className="h-1.5 w-full rounded bg-white/30" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'beauty_salon',
    category: 'beauty',
    badge: 'popular',
    name:        { mn: 'Гоо сайхан', en: 'Beauty Salon' },
    description: { mn: 'Нарийн, эелдэг — салон, спа, wellness газарт.', en: 'Elegant and soft — for salons, spas, and wellness studios.' },
    domain:      'glow-studio.aiweb.mn',
    features:    { mn: ['Үйлчилгээний жагсаалт', 'Цаг захиалга', 'Багийн танилцуулга'], en: ['Service list', 'Booking', 'Team intro'] },
    gradient:    ['#4a044e', '#86198f'],
    cover:       '/templates/beauty_salon/cover.jpg',
    preview: () => (
      <div className="h-full flex flex-col" style={{ background: 'linear-gradient(150deg,#4a044e,#86198f 55%,#c026d3)' }}>
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/20">
          <div className="h-2 w-24 rounded bg-white/70" />
          <div className="h-6 w-16 rounded-full bg-pink-400/80" />
        </div>
        <div className="flex-1 flex items-center gap-3 px-4 py-2">
          <div className="flex-1">
            <div className="h-4 w-36 rounded bg-white/90 mb-1.5" />
            <div className="h-2.5 w-24 rounded bg-white/50 mb-2.5" />
            <div className="flex gap-0.5 mb-2">
              {[1,2,3,4,5].map(i=><svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
            </div>
            <div className="h-7 w-24 rounded-lg bg-white/20 border border-white/35" />
          </div>
          <div className="w-20 h-24 rounded-xl bg-white/15 border border-white/20" />
        </div>
        <div className="px-4 pb-3 grid grid-cols-3 gap-1.5">
          {['Үс','Маникюр','Нүүр'].map(s=>(
            <div key={s} className="rounded-lg bg-white/10 border border-white/20 p-1.5 text-center">
              <div className="h-1.5 w-10 rounded bg-white/70 mx-auto mb-1" />
              <div className="h-1.5 w-8 rounded bg-white/35 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'portfolio',
    category: 'portfolio',
    badge: null,
    name:        { mn: 'Портфолио', en: 'Portfolio' },
    description: { mn: 'Цэвэр, эдиториал — дизайнер, зураач, бүтээлч мэргэжилтнүүдэд.', en: 'Clean, editorial — for designers, artists, and creative professionals.' },
    domain:      'creative-folio.aiweb.mn',
    features:    { mn: ['Төслийн гэрэл зураг', 'Намтар', 'Холбоо барих'], en: ['Project gallery', 'About', 'Contact'] },
    gradient:    ['#1e1b4b', '#4f46e5'],
    cover:       '/templates/portfolio/cover.jpg',
    preview: () => (
      <div className="h-full flex flex-col" style={{ background: 'linear-gradient(150deg,#0f0c29,#302b63 50%,#24243e)' }}>
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-700" />
          <div className="flex gap-2">{[28,36,28].map((w,i)=><div key={i} className="h-1.5 rounded bg-white/30" style={{width:w}}/>)}</div>
        </div>
        <div className="px-4 pt-1 pb-2">
          <div className="h-6 w-48 rounded bg-gradient-to-r from-violet-400 to-cyan-400 mb-1.5 opacity-90" />
          <div className="h-2.5 w-40 rounded bg-white/40 mb-1" />
          <div className="h-2.5 w-32 rounded bg-white/25 mb-3" />
          <div className="flex gap-2">
            <div className="h-6 w-20 rounded-md bg-violet-600/80" />
            <div className="h-6 w-16 rounded-md border border-white/20" />
          </div>
        </div>
        <div className="px-4 pb-3 grid grid-cols-2 gap-1.5 flex-1">
          {[['#4c1d95','#6d28d9'],['#064e3b','#059669'],['#1e3a5f','#2563eb'],['#7c2d12','#ea580c']].map(([a,b],i)=>(
            <div key={i} className="rounded-lg overflow-hidden" style={{background:`linear-gradient(135deg,${a},${b})`,minHeight:44}}>
              <div className="p-1.5"><div className="h-1.5 w-12 rounded bg-white/60 mb-1"/><div className="h-1.5 w-8 rounded bg-white/35"/></div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'business',
    category: 'service',
    badge: null,
    name:        { mn: 'Бизнес', en: 'Business' },
    description: { mn: 'Итгэлтэй, үр дүнд чиглэсэн — корпорат, мэргэжлийн үйлчилгээнд.', en: 'Confident, results-driven — for corporate and professional services.' },
    domain:      'enterprise-pro.aiweb.mn',
    features:    { mn: ['Үйлчилгээ', 'Баг', 'Холбоо барих'], en: ['Services', 'Team', 'Contact'] },
    gradient:    ['#1e3a5f', '#1d4ed8'],
    cover:       '/templates/business/cover.jpg',
    preview: () => (
      <div className="h-full flex flex-col bg-[#0a0f1e]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
          <div className="flex items-center gap-2"><div className="h-5 w-5 rounded bg-blue-600"/><div className="h-2 w-16 rounded bg-white/70"/></div>
          <div className="h-6 w-16 rounded bg-blue-500/80"/>
        </div>
        <div className="flex items-center gap-4 px-4 py-4 flex-1">
          <div className="flex-1">
            <div className="h-5 w-40 rounded bg-white/90 mb-2"/>
            <div className="h-2.5 w-32 rounded bg-white/45 mb-1"/>
            <div className="h-2.5 w-28 rounded bg-white/30 mb-4"/>
            <div className="h-7 w-24 rounded-md bg-blue-500/80"/>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {[0,1,2,3].map(i=><div key={i} className="h-10 w-14 rounded-lg bg-white/[0.05] border border-white/10"/>)}
          </div>
        </div>
        <div className="px-4 pb-3 flex gap-2">
          {['Үйлчилгээ','Туршлага','Холбоо'].map(t=>(
            <div key={t} className="flex-1 rounded-lg bg-blue-900/30 border border-blue-500/20 p-2">
              <div className="h-2 w-full rounded bg-white/50 mb-1.5"/>
              <div className="h-1.5 w-3/4 rounded bg-white/25"/>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'minimal',
    category: 'portfolio',
    badge: null,
    name:        { mn: 'Минимал', en: 'Minimal' },
    description: { mn: 'Цаасан цагаан, тайван — хувийн брэнд, хэвлэлийн мэдиад.', en: 'Paper-white and calm — for personal brands and editorial media.' },
    domain:      'minimal-studio.aiweb.mn',
    features:    { mn: ['Нийтлэл', 'Портфолио', 'Захидал'], en: ['Articles', 'Portfolio', 'Newsletter'] },
    gradient:    ['#18181b', '#3f3f46'],
    cover:       '/templates/minimal/cover.jpg',
    preview: () => (
      <div className="h-full flex flex-col bg-[#fafafa]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/10">
          <div className="h-2 w-20 rounded bg-black/70"/>
          <div className="flex gap-3">{[24,32,24].map((w,i)=><div key={i} className="h-1.5 rounded bg-black/30" style={{width:w}}/>)}</div>
        </div>
        <div className="flex-1 flex flex-col justify-center px-5 py-4">
          <div className="h-6 w-52 rounded bg-black/90 mb-2"/>
          <div className="h-3 w-44 rounded bg-black/40 mb-1"/>
          <div className="h-3 w-36 rounded bg-black/25 mb-5"/>
          <div className="h-8 w-24 rounded-full border-2 border-black/60"/>
        </div>
        <div className="px-4 pb-3 grid grid-cols-3 gap-2">
          {[0,1,2].map(i=>(
            <div key={i} className="rounded-lg bg-black/[0.04] border border-black/10 p-2">
              <div className="h-12 rounded bg-black/[0.06] mb-1.5"/>
              <div className="h-1.5 w-full rounded bg-black/30 mb-1"/>
              <div className="h-1.5 w-2/3 rounded bg-black/20"/>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'gifts',
    category: 'store',
    badge: 'new',
    name:        { mn: 'Онлайн дэлгүүр', en: 'Online Store' },
    description: { mn: 'Гар урлал, бараа, бүтээгдэхүүн зарах онлайн дэлгүүр.', en: 'Sell handcrafts, goods, and products through your online store.' },
    domain:      'handcraft-store.aiweb.mn',
    features:    { mn: ['Бүтээгдэхүүний каталог', 'Бэлэгний цуглуулга', 'QPay/SocialPay'], en: ['Product catalog', 'Gift collections', 'QPay/SocialPay'] },
    gradient:    ['#064e3b', '#0d9488'],
    cover:       '/templates/gifts/cover.jpg',
    preview: () => (
      <div className="h-full flex flex-col bg-[#0a0a0f]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
          <div className="h-2 w-20 rounded bg-white/70"/>
          <div className="flex gap-2 items-center">{[28,36].map((w,i)=><div key={i} className="h-1.5 rounded bg-white/30" style={{width:w}}/>)}<div className="h-6 w-14 rounded-full bg-emerald-500/80"/></div>
        </div>
        <div className="mx-3 mt-2 rounded-xl p-3" style={{background:'linear-gradient(135deg,#064e3b,#0d9488)'}}>
          <div className="h-3 w-32 rounded bg-white/80 mb-1"/><div className="h-2 w-20 rounded bg-white/50"/>
        </div>
        <div className="px-3 pt-2 pb-3 grid grid-cols-3 gap-1.5 flex-1">
          {['#1d4ed8','#7c3aed','#b45309','#0f766e','#9d174d','#1e40af'].map((c,i)=>(
            <div key={i} className="rounded-lg overflow-hidden border border-white/10">
              <div className="h-12" style={{background:`${c}55`}}/>
              <div className="p-1"><div className="h-1.5 w-full rounded bg-white/50 mb-1"/><div className="h-1.5 w-8 rounded bg-emerald-400/70"/></div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'travel',
    category: 'service',
    badge: 'new',
    name:        { mn: 'Аялал жуулчлал', en: 'Travel & Hotel' },
    description: { mn: 'Тансаглаг, зочломтгой — жуулчлал, буудал, амралтын газарт.', en: 'Luxurious and welcoming — for tourism, hotels, and resorts.' },
    domain:      'steppe-lodge.aiweb.mn',
    features:    { mn: ['Аяллын пакет', 'Галерей', 'Газрын зураг'], en: ['Tour packages', 'Gallery', 'Map'] },
    gradient:    ['#0f2027', '#203a43'],
    cover:       '/templates/travel/cover.jpg',
    preview: () => (
      <div className="h-full flex flex-col" style={{background:'linear-gradient(150deg,#0f2027,#203a43 50%,#2c5364)'}}>
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/30">
          <div className="h-2 w-24 rounded bg-white/70"/>
          <div className="h-6 w-20 rounded bg-amber-400/80"/>
        </div>
        <div className="flex-1 relative px-4 py-3">
          <div className="h-24 rounded-xl bg-white/10 border border-white/15 mb-3" />
          <div className="h-4 w-40 rounded bg-white/90 mb-1.5"/>
          <div className="h-2.5 w-32 rounded bg-white/50"/>
        </div>
        <div className="px-4 pb-3 grid grid-cols-3 gap-1.5">
          {['Стандарт','Делюкс','Люкс'].map(r=>(
            <div key={r} className="rounded-lg bg-white/10 border border-white/15 p-2">
              <div className="h-2 w-full rounded bg-white/70 mb-1"/>
              <div className="h-1.5 w-10 rounded bg-amber-400/80"/>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'legal',
    category: 'service',
    badge: null,
    name:        { mn: 'Хуулийн фирм', en: 'Law Firm' },
    description: { mn: 'Найдвартай, мэргэжлийн — өмгөөллийн газар, зөвлөх үйлчилгээнд.', en: 'Authoritative, professional — for law firms and consulting services.' },
    domain:      'counsel-legal.aiweb.mn',
    features:    { mn: ['Үйлчилгэний чиглэл', 'Хуульчийн намтар', 'Зөвлөгөө авах'], en: ['Practice areas', 'Attorney bios', 'Consultation'] },
    gradient:    ['#1c1c1e', '#2c2c2e'],
    cover:       '/templates/legal/cover.jpg',
    preview: () => (
      <div className="h-full flex flex-col bg-[#0d0d0f]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
          <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-amber-400"/><div className="h-2 w-24 rounded bg-white/70"/></div>
          <div className="h-6 w-20 rounded bg-amber-500/30 border border-amber-500/40"/>
        </div>
        <div className="px-4 py-4 flex-1">
          <div className="h-5 w-48 rounded bg-white/90 mb-2"/>
          <div className="h-2.5 w-40 rounded bg-white/40 mb-1"/>
          <div className="h-2.5 w-36 rounded bg-white/25 mb-4"/>
          <div className="flex gap-2">
            <div className="h-7 w-28 rounded bg-amber-500/80"/>
            <div className="h-7 w-24 rounded border border-white/20"/>
          </div>
        </div>
        <div className="px-4 pb-3 grid grid-cols-2 gap-2">
          {['Иргэний хэрэг','Бизнесийн хууль','Хөдөлмөр','Өмч'].map(t=>(
            <div key={t} className="rounded-lg bg-white/[0.04] border border-white/10 p-2">
              <div className="h-2 w-3 rounded bg-amber-400 mb-1.5"/>
              <div className="h-1.5 w-full rounded bg-white/50 mb-1"/>
              <div className="h-1.5 w-2/3 rounded bg-white/25"/>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const CATEGORIES = [
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
  const PreviewComp = template.preview;

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
          <PreviewComp />
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
            {CATEGORIES.find(c => c.key === template.category)?.[locale] ?? template.category}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Preview panel ─────────────────────────────────────────────────────────────

function PreviewPanel({ template, locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const PreviewComp = template.preview;

  return (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
      className="rounded-2xl overflow-hidden border border-[var(--surface-border-strong)] bg-[var(--surface)] shadow-2xl shadow-black/40"
    >
      {/* Browser chrome */}
      <div className="browser-chrome">
        <span className="browser-dot" style={{ background: '#ff5f57' }} />
        <span className="browser-dot" style={{ background: '#febc2e' }} />
        <span className="browser-dot" style={{ background: '#28c840' }} />
        <div className="browser-url">{template.domain}</div>
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
        <PreviewComp />
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-12 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--surface), transparent)' }} />
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
  const [hoveredTemplate, setHoveredTemplate] = useState(TEMPLATES[0]);

  const filtered = activeCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

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
          {CATEGORIES.map((cat) => {
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
