'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';

/* ═══════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════ */

const SAMPLES = {
  mn: [
    {
      label: 'Фитнес',
      slug: 'fitness',
      eyebrow: 'Crossfit · Performance',
      title: 'Хязгаарыг эвдэж, шинэ өндрийг эзэл.',
      body: 'Мэргэшсэн тренер, стандартын тоног төхөөрөмж, бодит үр дүн.',
      cta: 'Туршилтын хичээл',
      palette: ['#050505', '#0d1517', '#22d3ee'],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&fit=crop',
      ai: 'Performance layout тохируулж байна…',
    },
    {
      label: 'Архитектор',
      slug: 'architecture',
      eyebrow: 'Studio · Interior',
      title: 'Орон зай — амьдралын хэл.',
      body: 'Орон сууц, оффис, public space — модерн минималист загвар.',
      cta: 'Төслүүдийг харах',
      palette: ['#1a1612', '#3b2e22', '#d4a574'],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&fit=crop',
      ai: 'Архитектурын grid тохируулж байна…',
    },
    {
      label: 'SaaS',
      slug: 'saas',
      eyebrow: 'Analytics · Platform',
      title: 'Өгөгдөл — дараагийн алхамын зам.',
      body: 'Realtime dashboard, integrations, баг хамтын ажлын орчин.',
      cta: 'Үнэгүй эхлэх',
      palette: ['#020617', '#1e1b4b', '#a855f7'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&fit=crop',
      ai: 'Product hero блок угсарч байна…',
    },
  ],
  en: [
    {
      label: 'Fitness',
      slug: 'fitness',
      eyebrow: 'Crossfit · Performance',
      title: 'Break limits. Own the next peak.',
      body: 'Expert coaches, certified equipment, real results.',
      cta: 'Try a class',
      palette: ['#050505', '#0d1517', '#22d3ee'],
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80&fit=crop',
      ai: 'Calibrating performance layout…',
    },
    {
      label: 'Architecture',
      slug: 'architecture',
      eyebrow: 'Studio · Interior',
      title: 'Space is the language of living.',
      body: 'Residential, commercial, public — modern minimalist design.',
      cta: 'See our projects',
      palette: ['#1a1612', '#3b2e22', '#d4a574'],
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80&fit=crop',
      ai: 'Tuning architectural grid…',
    },
    {
      label: 'SaaS',
      slug: 'saas',
      eyebrow: 'Analytics · Platform',
      title: 'Your data. Your next move.',
      body: 'Realtime dashboards, integrations, and a workspace for your whole team.',
      cta: 'Start free',
      palette: ['#020617', '#1e1b4b', '#a855f7'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&fit=crop',
      ai: 'Assembling product hero block…',
    },
  ],
};

const INTERVAL_MS = 4800;
const TICK_MS = 50;

/* ═══════════════════════════════════════════════════════════
   Static assets & spring configs
   ═══════════════════════════════════════════════════════════ */

const NOISE_URI = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;
const NOISE_STYLE = { backgroundImage: NOISE_URI, backgroundSize: '128px 128px' };

const SPRING_SNAPPY = { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 };
const SPRING_GENTLE = { type: 'spring', stiffness: 120, damping: 20, mass: 1 };
const SPRING_SLOW = { type: 'spring', stiffness: 80, damping: 18, mass: 1.2 };

/* ═══════════════════════════════════════════════════════════
   Animation variants
   ═══════════════════════════════════════════════════════════ */

const heroContainer = {
  animate: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const heroChild = {
  initial: { opacity: 0, y: 28, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: SPRING_SNAPPY },
  exit: { opacity: 0, y: -14, filter: 'blur(4px)', transition: { duration: 0.25 } },
};

const bgScale = {
  initial: { scale: 1.08, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: SPRING_SLOW },
  exit: { scale: 0.96, opacity: 0, transition: { duration: 0.35 } },
};

/* Ken Burns — slow zoom drift on hero image */
const kenBurns = {
  initial: { scale: 1.15, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { scale: { duration: 5.2, ease: 'easeOut' }, opacity: { duration: 0.8 } },
  },
  exit: {
    scale: 1.04,
    opacity: 0,
    transition: { duration: 0.4 },
  },
};

/* ═══════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════ */

function BrowserDots() {
  return (
    <div className="flex items-center gap-[6px]">
      <span className="h-[10px] w-[10px] rounded-full bg-[#ff5f57]" />
      <span className="h-[10px] w-[10px] rounded-full bg-[#febc2e]" />
      <span className="h-[10px] w-[10px] rounded-full bg-[#28c840]" />
    </div>
  );
}

function LiveDot({ label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-[5px] w-[5px]">
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
        <span className="relative rounded-full h-[5px] w-[5px] bg-emerald-400" />
      </span>
      <span className="text-[9px] font-semibold tracking-[0.16em] text-emerald-400/90 uppercase">
        {label}
      </span>
    </div>
  );
}

/** Floating badge with mouse-driven perspective tilt */
function TiltBadge({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [8, -8]), { stiffness: 200, damping: 15 });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-8, 8]), { stiffness: 200, damping: 15 });

  const handleMouse = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width * 2 - 1);
    rawY.set((e.clientY - rect.top) / rect.height * 2 - 1);
  }, [rawX, rawY]);

  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 5.5, ease: 'easeInOut', repeat: Infinity, delay }}
      style={{ rotateX, rotateY, perspective: 600 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════════════ */

export default function LivePreview({ locale }) {
  const L = useCallback((mn, en) => (locale === 'mn' ? mn : en), [locale]);
  const samples = useMemo(() => SAMPLES[locale] ?? SAMPLES.en, [locale]);

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  /* Timer ─────────────────────────────────────────────── */
  useEffect(() => {
    let elapsed = 0;
    const id = setInterval(() => {
      elapsed += TICK_MS;
      setProgress(Math.min((elapsed / INTERVAL_MS) * 100, 100));
      if (elapsed >= INTERVAL_MS) {
        elapsed = 0;
        setIndex((i) => (i + 1) % samples.length);
        setProgress(0);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [samples.length]);

  const sample = samples[index];

  /* Derived glow styles ────────────────────────────────── */
  const glowGradient = useMemo(
    () =>
      `radial-gradient(ellipse 80% 60% at 50% 60%, ${sample.palette[0]}40 0%, ${sample.palette[1]}20 50%, transparent 80%)`,
    [sample.palette],
  );

  const heroGradient = useMemo(
    () =>
      `linear-gradient(135deg, ${sample.palette[0]} 0%, ${sample.palette[1]} 55%, ${sample.palette[2]} 100%)`,
    [sample.palette],
  );

  const progressDone = progress > 97;

  return (
    <div className="relative reveal group/preview">
      {/* ── Ambient glow ── */}
      <motion.div
        className="absolute -inset-12 pointer-events-none rounded-full"
        style={{ filter: 'blur(72px)' }}
        animate={{ background: glowGradient, opacity: 0.45 }}
        transition={SPRING_GENTLE}
      />

      {/* ── Glass container ── */}
      <div
        className="relative rounded-[22px] overflow-hidden shadow-2xl shadow-black/50"
        style={{
          /* gradient border via background-clip trick */
          background: `linear-gradient(160deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 40%, rgba(255,255,255,0.08) 100%)`,
          padding: '1px',
        }}
      >
        {/* Inner container with glass fill */}
        <div className="rounded-[21px] overflow-hidden bg-[var(--surface)]/70 backdrop-blur-3xl relative">
          {/* Shimmer border highlight — animated sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-[3] rounded-[21px]"
            style={{
              background:
                'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.06) 55%, transparent 60%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
            transition={{ duration: 6, ease: 'linear', repeat: Infinity, repeatDelay: 3 }}
          />

          {/* Noise texture */}
          <div
            className="absolute inset-0 pointer-events-none z-[2] rounded-[21px] opacity-[0.035]"
            style={NOISE_STYLE}
          />

          {/* ── Browser chrome ── */}
          <div className="relative z-[4] flex items-center px-4 h-10 border-b border-white/[0.05] bg-[var(--bg-secondary)]/50 backdrop-blur-2xl">
            <BrowserDots />

            {/* Address bar — centered, minimal */}
            <div className="flex-1 flex justify-center mx-4">
              <div className="h-[26px] w-full max-w-[220px] rounded-lg bg-white/[0.05] border border-white/[0.04] flex items-center justify-center gap-1.5 px-3">
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-[var(--text-muted)] shrink-0 opacity-50"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={sample.slug}
                    initial={{ opacity: 0, filter: 'blur(4px)' }}
                    animate={{ opacity: 0.5, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, filter: 'blur(4px)' }}
                    transition={{ duration: 0.25 }}
                    className="text-[10px] font-mono text-[var(--text-tertiary)] truncate"
                  >
                    {sample.slug}.aiweb.mn
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <LiveDot label={L('Амьд', 'Live')} />
          </div>

          {/* ── Hero viewport ── */}
          <div className="relative z-[4] aspect-[4/3] md:aspect-[16/10] overflow-hidden">
            {/* Background image with Ken Burns effect */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${index}`}
                className="absolute inset-0"
                variants={kenBurns}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Image
                  src={sample.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            {/* Gradient color overlay — blends palette with photo */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`overlay-${index}`}
                className="absolute inset-0 mix-blend-multiply"
                variants={bgScale}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ background: heroGradient, opacity: 0.55 }}
              />
            </AnimatePresence>

            {/* Dark scrim for text readability */}
            <div className="absolute inset-0 bg-black/30 z-[1]" />

            {/* Grain on hero */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.1] mix-blend-overlay z-[2]"
              style={NOISE_STYLE}
            />

            {/* Editorial vignette — bottom heavy for text contrast */}
            <div
              className="absolute inset-0 z-[2] pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 130% 70% at 50% 110%, rgba(0,0,0,0.6) 0%, transparent 65%), radial-gradient(ellipse 80% 50% at 0% 0%, rgba(0,0,0,0.2) 0%, transparent 50%)',
              }}
            />

            <div className="absolute left-4 top-4 z-[5] hidden max-w-[185px] rounded-xl border border-white/15 bg-black/35 p-3 shadow-2xl backdrop-blur-md md:block">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  {L('Өмнө', 'Before')}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[7px] font-mono text-white/45">
                  prompt
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`prompt-${sample.slug}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="text-[10px] leading-relaxed text-white/72"
                >
                  {L(`"${sample.label} бизнесийн modern сайт"`, `"Modern ${sample.label.toLowerCase()} website"`)}
                </motion.p>
              </AnimatePresence>
              <div className="mt-3 flex items-center gap-1.5 text-[8px] font-mono text-emerald-200/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                {L('AI live preview болгож байна', 'AI turns it into preview')}
              </div>
            </div>

            <div className="absolute right-4 top-4 z-[5] hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-white/70 backdrop-blur-md md:flex">
              <span>{L('Дараа', 'After')}</span>
              <motion.span
                className="h-1.5 w-8 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300"
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span>live</span>
            </div>

            {/* Content layer */}
            <div className="absolute inset-0 z-[2] flex flex-col justify-between p-6 md:p-10 text-white">
              {/* Fake nav */}
              <div className="flex items-center justify-between">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={sample.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={SPRING_SNAPPY}
                    className="font-display text-sm font-bold tracking-tight"
                  >
                    {sample.label}
                  </motion.span>
                </AnimatePresence>
                <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] opacity-40 font-medium">
                  <span>{L('Тухай', 'About')}</span>
                  <span>{L('Ажлууд', 'Work')}</span>
                  <span>{L('Холбогдох', 'Contact')}</span>
                </div>
              </div>

              {/* Hero text — staggered children */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  variants={heroContainer}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <motion.div
                    variants={heroChild}
                    className="text-[9px] uppercase tracking-[0.35em] opacity-60 font-medium"
                  >
                    {sample.eyebrow}
                  </motion.div>

                  <motion.h3
                    variants={heroChild}
                    className="mt-2.5 font-display text-[22px] md:text-[36px] font-black leading-none tracking-tighter max-w-md"
                  >
                    {sample.title}
                  </motion.h3>

                  <motion.p
                    variants={heroChild}
                    className="mt-2.5 max-w-xs text-[13px] md:text-[15px] opacity-70 leading-snug font-light"
                  >
                    {sample.body}
                  </motion.p>

                  <motion.div variants={heroChild} className="mt-5">
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/90 text-black text-[13px] font-semibold shadow-lg shadow-black/15 backdrop-blur-sm">
                      {sample.cta}
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── AI status bar ── */}
          <div className="relative z-[4] flex items-center justify-between px-4 py-2 border-t border-white/[0.05] bg-[var(--bg-secondary)]/50 backdrop-blur-2xl">
            {/* Left cluster */}
            <div className="flex items-center gap-2.5">
              {/* Pulsing AI dot */}
              <span className="relative flex h-[5px] w-[5px]">
                <span className="absolute inset-0 rounded-full bg-[var(--accent-light)] ai-pulse" />
                <span className="relative rounded-full h-[5px] w-[5px] bg-[var(--accent-light)]" />
              </span>

              <span className="text-[9px] font-mono font-semibold text-[var(--text-secondary)] tracking-[0.12em] uppercase select-none">
                AI
              </span>

              <span className="hidden sm:block h-3 w-px bg-white/[0.08]" />

              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                  transition={{ ...SPRING_SNAPPY, stiffness: 200 }}
                  className="text-[10px] font-mono text-[var(--text-tertiary)] hidden sm:inline"
                >
                  {sample.ai}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Right cluster — progress + counter */}
            <div className="flex items-center gap-3">
              {/* Progress bar with glow on completion */}
              <div className="hidden sm:block relative w-20 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: progressDone
                      ? `linear-gradient(90deg, ${sample.palette[0]}, ${sample.palette[2]})`
                      : 'var(--accent-light)',
                    opacity: progressDone ? 1 : 0.5,
                  }}
                />
                {/* Pulse glow when full */}
                <AnimatePresence>
                  {progressDone && (
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${sample.palette[0]}60, ${sample.palette[2]}60)`,
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.8, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                    />
                  )}
                </AnimatePresence>
              </div>

              <span className="text-[9px] font-mono tabular-nums text-[var(--text-muted)] select-none">
                {String(index + 1).padStart(2, '0')}/{String(samples.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating badges with tilt ── */}
      <TiltBadge
        delay={0}
        className="absolute -top-5 -right-6 hidden sm:flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-[var(--surface)]/75 backdrop-blur-2xl px-3.5 py-2.5 shadow-2xl shadow-black/25 cursor-default"
      >
        <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-emerald-500/10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold text-[var(--text-primary)] leading-none">
            {L('Контент бэлэн', 'Copy generated')}
          </span>
          <span className="text-[8px] text-[var(--text-muted)] font-mono leading-none">
            {L('3 секундын өмнө', '3s ago')}
          </span>
        </div>
      </TiltBadge>

      <TiltBadge
        delay={1.8}
        className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-2.5 rounded-2xl border border-white/[0.06] bg-[var(--surface)]/75 backdrop-blur-2xl px-3.5 py-2.5 shadow-2xl shadow-black/25 cursor-default"
      >
        <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-violet-500/10">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-semibold text-[var(--text-primary)] leading-none">
            {L('Hero зураг', 'Hero image')}
          </span>
          <span className="text-[8px] text-[var(--text-muted)] font-mono leading-none">
            AI image · 1024×768
          </span>
        </div>
      </TiltBadge>
    </div>
  );
}
