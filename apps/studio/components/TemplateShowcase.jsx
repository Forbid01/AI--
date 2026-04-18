'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// ─── Data ────────────────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: 'minimal',
    tag: 'MINIMAL',
    name: { mn: 'Минимал', en: 'Minimal' },
    description: {
      mn: 'Цэвэрхэн, эдиториал — дизайн студи, бүтээлч мэргэжилтнүүдэд.',
      en: 'Clean and editorial — for design studios and creative professionals.',
    },
    cover: '/templates/minimal/cover.jpg',
    preview: '/templates/minimal/cover.jpg',
  },
  {
    id: 'business',
    tag: 'BUSINESS',
    name: { mn: 'Бизнес', en: 'Business' },
    description: {
      mn: 'Итгэлтэй, үр дүнд чиглэсэн — корпорат, мэргэжлийн үйлчилгээнд.',
      en: 'Confident and result-oriented — for corporate and professional services.',
    },
    cover: '/templates/business/cover.jpg',
    preview: '/templates/business/cover.jpg',
  },
  {
    id: 'restaurant_mongolian',
    tag: 'RESTAURANT',
    name: { mn: 'Монгол ресторан', en: 'MN Restaurant' },
    description: {
      mn: 'Дулаан, уламжлалт — монгол хоолны газар, зочид буудалд.',
      en: 'Warm and traditional — Mongolian dining and hospitality.',
    },
    cover: '/templates/restaurant_mongolian/cover.jpg',
    preview: '/templates/restaurant_mongolian/cover.jpg',
  },
  {
    id: 'beauty_salon',
    tag: 'BEAUTY',
    name: { mn: 'Гоо сайхан', en: 'Beauty' },
    description: {
      mn: 'Нарийн, эелдэг — гоо сайхны салон, спа, эрүүл мэндийн газарт.',
      en: 'Elegant and soft — for beauty salons, spas, and wellness studios.',
    },
    cover: '/templates/beauty_salon/cover.jpg',
    preview: '/templates/beauty_salon/cover.jpg',
  },
];

const NOISE_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// ─── Template card with 3D tilt ───────────────────────────────────────────────

function TemplateCard({ template, locale, index, onSelect }) {
  const L = useCallback((mn, en) => (locale === 'mn' ? mn : en), [locale]);
  const cardRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 25 });
  const shineX = useTransform(rawX, [-0.5, 0.5], ['-80%', '180%']);
  const shineOpacity = useMotionValue(0);

  const handleMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    shineOpacity.set(1);
  }, [rawX, rawY, shineOpacity]);

  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    shineOpacity.set(0);
  }, [rawX, rawY, shineOpacity]);

  const DELAYS = ['reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4'];

  return (
    <motion.article
      ref={cardRef}
      layoutId={`card-${template.id}`}
      className={`relative cursor-pointer reveal ${DELAYS[index] ?? ''}`}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => onSelect(template)}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card shell */}
      <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40 group">
        {/* Image area — aspect 3/4 */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#0d0d1a]">
          {/* Photo */}
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 8, ease: 'easeOut' }}
          >
            <Image
              src={template.cover}
              alt={template.name[locale] ?? template.name.mn}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
              priority={index < 2}
            />
          </motion.div>

          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)' }}
          />

          {/* Noise texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
            style={{ backgroundImage: NOISE_URI, backgroundSize: '128px 128px' }}
          />

          {/* Shine sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.12) 50%, transparent 70%)',
              x: shineX,
              opacity: shineOpacity,
            }}
            transition={{ opacity: { duration: 0.2 } }}
          />

          {/* Top row: tag + live preview badge */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
            <span className="font-mono text-[9px] tracking-[0.25em] text-white/50 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full border border-white/[0.08]">
              {template.tag}
            </span>

            {/* "Live Preview" badge — appears on card hover via CSS group */}
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2.5 py-1 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 pointer-events-none">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono text-white/80">Preview</span>
            </div>
          </div>

          {/* Bottom: template name */}
          <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
            <h3 className="font-display text-2xl font-black tracking-tighter text-white leading-none">
              {template.name[locale] ?? template.name.mn}
            </h3>
          </div>
        </div>

        {/* Description bar */}
        <div className="p-4 bg-[var(--surface)] border-t border-white/[0.06]">
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            {template.description[locale] ?? template.description.mn}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function TemplateModal({ template, locale, onClose }) {
  const L = useCallback((mn, en) => (locale === 'mn' ? mn : en), [locale]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal panel */}
      <motion.div
        layoutId={`card-${template.id}`}
        className="relative z-10 w-full max-w-3xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60 bg-[#0d0d1a]"
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.07] bg-[#09091a]">
          <div className="flex gap-1.5 shrink-0">
            <button
              aria-label="Close"
              onClick={onClose}
              className="h-3 w-3 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all"
            />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>

          {/* URL bar */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1.5 h-7 w-full max-w-[260px] rounded-lg bg-white/[0.04] border border-white/[0.06] px-3">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/25 shrink-0">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="text-[10px] font-mono text-white/30 truncate">
                {template.id.replace('_', '-')}.aiweb.mn
              </span>
            </div>
          </div>

          {/* Close text shortcut */}
          <span className="text-[9px] font-mono text-white/20 shrink-0">ESC</span>
        </div>

        {/* Preview image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#060612]">
          <Image
            src={template.preview}
            alt={template.name[locale] ?? template.name.mn}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
          {/* Subtle overlay for polish */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

          {/* "Generated by AI" watermark badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/[0.1]">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[9px] font-mono text-white/60">AI Generated</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0a0a18] border-t border-white/[0.06]">
          <div>
            <p className="text-[13px] font-semibold text-white/80">
              {template.name[locale] ?? template.name.mn}
            </p>
            <p className="text-[11px] text-white/30 mt-0.5">
              {template.description[locale] ?? template.description.mn}
            </p>
          </div>

          <Link
            href={`/${locale}/dashboard/sites/new?template=${template.id}`}
            className="shrink-0 ml-4 btn btn-primary btn-sm"
            onClick={onClose}
          >
            {L('Энэ загварыг ашиглах', 'Use this template')}
            <span aria-hidden className="ml-1">→</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function TemplateShowcase({ locale }) {
  const L = useCallback((mn, en) => (locale === 'mn' ? mn : en), [locale]);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <section className="border-t border-[var(--surface-border)] relative overflow-hidden">
        <div
          className="orb orb-a absolute pointer-events-none"
          style={{ top: '20%', left: '-10%', width: '420px', height: '420px', opacity: 0.2 }}
        />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          {/* Header */}
          <div className="flex items-end justify-between flex-wrap gap-6 reveal">
            <div>
              <span className="eyebrow text-[var(--accent-light)]">{L('Загварууд', 'Templates')}</span>
              <h2 className="mt-4 font-display text-3xl md:text-5xl font-black tracking-tighter leading-[1.02]">
                {L('Мэргэжлийн загварын сан', 'A curated template library')}
              </h2>
              <p className="mt-3 text-[var(--text-secondary)] max-w-xl">
                {L(
                  'Ресторанаас портфолио хүртэл — AI таны брэндэд тохирсон загварыг санал болгоно.',
                  'From restaurants to portfolios — the AI picks the right fit and tunes it to your brand.',
                )}
              </p>
            </div>
            <Link href={`/${locale}/dashboard/sites/new`} className="btn btn-outline btn-md">
              {L('Бүгдийг үзэх', 'Browse all')} <span aria-hidden>&rarr;</span>
            </Link>
          </div>

          {/* Cards grid */}
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEMPLATES.map((template, i) => (
              <TemplateCard
                key={template.id}
                template={template}
                locale={locale}
                index={i}
                onSelect={setSelected}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal portal */}
      <AnimatePresence>
        {selected && (
          <TemplateModal
            key="modal"
            template={selected}
            locale={locale}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
