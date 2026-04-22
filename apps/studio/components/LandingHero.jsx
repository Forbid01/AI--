'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  motion, AnimatePresence,
  useSpring, useMotionValue, useTransform,
} from 'framer-motion';

// ─── Demo content ─────────────────────────────────────────────────────────────

const DEMO_PROMPTS = {
  mn: [
    'Улаанбаатарын орчин үеийн кофе шоп',
    'Хуучны барилга сэргээн засварлах компани',
    'Йога студи — Зайсан хорооллын',
    'Монгол хоолны ресторан, аялал жуулчлалын',
    'Гэрийн барилгын дизайн студи',
  ],
  en: [
    'A modern coffee shop in Ulaanbaatar',
    'A heritage building restoration studio',
    'A boutique yoga studio in Zaisan',
    'Mongolian cuisine restaurant for travellers',
    'A residential architecture studio',
  ],
};

const CHIPS = {
  mn: ['Кофе шоп', 'Йога студи', 'Хуулийн фирм', 'Зочид буудал'],
  en: ['Coffee shop', 'Yoga studio', 'Law firm', 'Boutique hotel'],
};

// ─── Phase machine ─────────────────────────────────────────────────────────────

const PH = { IDLE: 'idle', EXPLODE: 'explode', SWARM: 'swarm', ASSEMBLE: 'assemble', DONE: 'done' };
const DUR = { IDLE: 1800, EXPLODE: 380, SWARM: 1500, ASSEMBLE: 1700, DONE: 4800 };

// ─── Palette + terminal logs ───────────────────────────────────────────────────

const PALETTE = ['#7c5cff', '#c084fc', '#22d3ee', '#1d4ed8', '#0f172a', '#f0f0f5'];

const LOGS = [
  { t: 0,    text: '> Analyzing business context...',       cls: 'text-[#22d3ee]' },
  { t: 300,  text: '> Selecting optimal template...',       cls: 'text-white/55'  },
  { t: 600,  text: '> Gemini 2.5 generating copy...',       cls: 'text-[#a699ff]' },
  { t: 880,  text: '> Flux rendering hero image...',        cls: 'text-[#c084fc]' },
  { t: 1140, text: '> Building color palette...',           cls: 'text-white/55'  },
  { t: 1390, text: '> Assembling site structure...',        cls: 'text-[#22d3ee]' },
  { t: 1620, text: '✓ Published → nomad-coffee.aiweb.mn',  cls: 'text-[#10b981] font-semibold' },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── SVG noise filter for orb ─────────────────────────────────────────────────

const NOISE_ID = 'aiorb-grain';

function NoiseFilter() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute pointer-events-none">
      <defs>
        <filter id={NOISE_ID} colorInterpolationFilters="linearRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 16 -7"
            result="shaped" />
          <feComposite in="SourceGraphic" in2="shaped" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

// ─── AI Orb ───────────────────────────────────────────────────────────────────

function AIOrb({ phase }) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: 96, height: 96, willChange: 'transform, opacity' }}
      animate={{
        scale: phase === PH.EXPLODE ? 2.0 : 1,
        opacity: phase === PH.DONE ? 0 : 1,
      }}
      transition={{ duration: 0.36, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <NoiseFilter />

      {/* Outer pulse ring */}
      <motion.div
        className="absolute rounded-full"
        style={{ inset: -28, background: 'radial-gradient(circle, rgba(124,92,255,0.38) 0%, transparent 68%)' }}
        animate={{ scale: [1, 1.38, 1], opacity: [0.38, 0.82, 0.38] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blob: Royal Blue */}
      <motion.div
        className="absolute w-[90px] h-[90px] rounded-full"
        style={{ background: 'radial-gradient(circle at 34% 34%, #1d4ed8, #3b82f6 48%, transparent 74%)', filter: 'blur(16px)' }}
        animate={{ x: [0, 11, -6, 10, 0], y: [0, -11, 9, -7, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Blob: Deep Purple */}
      <motion.div
        className="absolute w-[90px] h-[90px] rounded-full"
        style={{ background: 'radial-gradient(circle at 66% 28%, #6d28d9, #7c3aed 48%, transparent 74%)', filter: 'blur(16px)' }}
        animate={{ x: [0, -11, 8, -13, 0], y: [0, 11, -8, 7, 0] }}
        transition={{ duration: 7.3, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
      />

      {/* Blob: Cyan */}
      <motion.div
        className="absolute w-[74px] h-[74px] rounded-full"
        style={{ background: 'radial-gradient(circle at 63% 67%, #0891b2, #22d3ee 50%, transparent 74%)', filter: 'blur(14px)' }}
        animate={{ x: [0, 9, -10, 7, 0], y: [0, 8, -11, 9, 0] }}
        transition={{ duration: 4.9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* Blob: Magenta */}
      <motion.div
        className="absolute w-[74px] h-[74px] rounded-full"
        style={{ background: 'radial-gradient(circle at 28% 71%, #a21caf, #c026d3 48%, transparent 74%)', filter: 'blur(14px)' }}
        animate={{ x: [0, -8, 11, -9, 0], y: [0, -9, 10, -6, 0] }}
        transition={{ duration: 8.6, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
      />

      {/* Core sphere */}
      <div
        className="relative rounded-full"
        style={{
          width: 74, height: 74,
          background: 'radial-gradient(circle at 31% 29%, #c4b5fd 0%, #7c5cff 38%, #1d4ed8 70%, #080814 100%)',
          filter: `url(#${NOISE_ID})`,
          boxShadow: '0 0 36px rgba(124,92,255,0.68), 0 0 80px rgba(124,92,255,0.28), inset 0 1px 1px rgba(255,255,255,0.28)',
        }}
      />

      {/* Specular highlight */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 28, height: 15, top: '14%', left: '17%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.85) 0%, transparent 100%)', filter: 'blur(4px)', opacity: 0.42 }}
      />
    </motion.div>
  );
}

// ─── Single particle ──────────────────────────────────────────────────────────

function ParticleItem({ p, phase }) {
  const swarming = phase === PH.SWARM || phase === PH.ASSEMBLE;
  return (
    <motion.div
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={
        phase === PH.EXPLODE
          ? { x: p.burstX, y: p.burstY, scale: 1, opacity: 1 }
          : swarming
          ? { x: p.destX, y: p.destY, scale: 0.25, opacity: 0 }
          : {}
      }
      transition={{
        duration: phase === PH.EXPLODE ? 0.30 : p.dur,
        delay: phase === PH.EXPLODE ? 0 : p.delay,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      style={{
        position: 'absolute',
        width: p.size,
        height: p.size,
        left: -(p.size / 2),
        top: -(p.size / 2),
        borderRadius: '50%',
        background: p.color,
        boxShadow: `0 0 ${p.size * 2.8}px ${p.color}99`,
        willChange: 'transform, opacity',
      }}
    />
  );
}

// ─── Skeleton block ───────────────────────────────────────────────────────────

function Skel({ className = '', style }) {
  return (
    <motion.div
      className={`rounded-lg ${className}`}
      style={{ background: 'rgba(255,255,255,0.055)', ...style }}
      animate={{ opacity: [0.55, 1, 0.55] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ─── Card A sites — three rotating businesses ───────────────────────────────

const SITES = [
  {
    domain: 'silkhotel.aiweb.mn',
    brand: 'SILK',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80&fit=crop',
    tier: 'gold',
    accent: '#fde68a',
    accent2: '#d4af37',
    dark: '#0c0a09',
    nav: ['Home', 'About', 'Suites', 'Contact'],
    eyebrow: '— Boutique Hotel · Ulaanbaatar',
    title: 'The Heritage Hotel of Ulaanbaatar',
    sub: 'Өв соёлт 42 өрөөтэй, зүрхнүүдийн нэг — 100 жилийн уламжлалт зочломхой буудал.',
    ctaPrimary: 'Өрөө захиалах →',
    ctaSecondary: 'Тоймыг үзэх',
    ctaShort: 'Book',
    stats: [
      { v: '4.9', l: 'Rating' },
      { v: '42', l: 'Suites' },
      { v: '1924', l: 'Since' },
    ],
    grading: 'linear-gradient(135deg, rgba(12,10,9,0.72) 0%, rgba(217,119,6,0.10) 45%, rgba(12,10,9,0.82) 100%)',
  },
  {
    domain: 'nova-ev.aiweb.mn',
    brand: 'NOVA',
    img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&q=80&fit=crop',
    tier: 'accent',
    accent: '#22d3ee',
    accent2: '#7c3aed',
    dark: '#020617',
    nav: ['Home', 'Models', 'Tech', 'Contact'],
    eyebrow: '— Electric · Performance',
    title: 'Дараагийн үеийн цахим машин',
    sub: '0 → 100 км/ц 2.6 секундэд. 600+ км ширхэг. Ухаалаг driver assist.',
    ctaPrimary: 'Тест жолоо →',
    ctaSecondary: 'Моделүүд',
    ctaShort: 'Drive',
    stats: [
      { v: '600', l: 'km range' },
      { v: '2.6s', l: '0-100' },
      { v: '800V', l: 'Arch' },
    ],
    grading: 'linear-gradient(135deg, rgba(2,6,23,0.75) 0%, rgba(34,211,238,0.08) 50%, rgba(2,6,23,0.85) 100%)',
  },
  {
    domain: 'verse-music.aiweb.mn',
    brand: 'VERSE',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&q=80&fit=crop',
    tier: 'accent',
    accent: '#ec4899',
    accent2: '#8b5cf6',
    dark: '#0f0a1a',
    nav: ['Home', 'Charts', 'Live', 'Pricing'],
    eyebrow: '— Streaming · Discover',
    title: 'Дуу чинь дуртай хүмүүст хүрнэ',
    sub: 'Өдөрт 50 сая хэрэглэгч. Подкаст, амьд эфир, lossless чанар.',
    ctaPrimary: 'Сонсож эхлэх →',
    ctaSecondary: 'Тарифууд',
    ctaShort: 'Play',
    stats: [
      { v: '50M', l: 'Daily' },
      { v: '120M', l: 'Tracks' },
      { v: '180', l: 'Countries' },
    ],
    grading: 'linear-gradient(135deg, rgba(15,10,26,0.75) 0%, rgba(236,72,153,0.12) 45%, rgba(15,10,26,0.85) 100%)',
  },
];

function HeroTypewriter({ assembled, text, accent }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!assembled) { setShown(0); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= text.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [assembled, text]);

  return (
    <span
      className="font-display font-black text-white leading-[1.05] tracking-tight block"
      style={{ fontSize: '13px', letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
    >
      {text.slice(0, shown)}
      {assembled && shown < text.length && (
        <span className="opacity-60" style={{ color: accent }}>|</span>
      )}
    </span>
  );
}

// ─── Card A: Hero Preview (auto-rotating through 3 sites) ───────────────────

function CardHeroPreview({ assembled }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!assembled) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SITES.length), 5200);
    return () => clearInterval(id);
  }, [assembled]);

  const site = SITES[index];
  const isGold = site.tier === 'gold';
  const coinGrad = isGold
    ? 'conic-gradient(from 45deg, #fde68a, #d4af37, #92400e, #fde68a)'
    : `conic-gradient(from 45deg, ${site.accent}, ${site.accent2}, ${site.accent})`;
  const ctaBgGrad = `linear-gradient(135deg, ${site.accent}, ${site.accent2})`;
  const ctaTextColor = isGold ? site.dark : '#ffffff';
  const eyebrowColor = isGold ? `${site.accent}cc` : site.accent;

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/[0.08] relative flex flex-col"
      style={{
        gridRow: 'span 2',
        background: 'rgba(10,10,20,0.90)',
        backdropFilter: 'blur(24px)',
        minHeight: 272,
      }}
    >
      {!assembled ? (
        <div className="p-3 flex flex-col gap-2.5 h-full">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
            <Skel className="w-5 h-5 rounded-md" />
            <Skel className="w-24 h-2.5" />
            <div className="flex-1" />
            <Skel className="w-14 h-5 rounded-full" />
          </div>
          <Skel className="flex-1 rounded-xl" style={{ minHeight: 130 }} />
          <Skel className="w-5/6 h-2.5" />
          <Skel className="w-3/5 h-2.5" />
          <Skel className="w-2/5 h-7 rounded-xl" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col h-full"
        >
          {/* Premium URL bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.08] shrink-0" style={{ background: 'linear-gradient(180deg, #0e0e1a 0%, #08080f 100%)' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <AnimatePresence mode="wait">
              <motion.span
                key={site.domain}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[8.5px] font-mono text-white/50 truncate tracking-tight"
              >
                {site.domain}
              </motion.span>
            </AnimatePresence>
            <div className="ml-auto flex items-center gap-1 text-[8px] text-[#10b981] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Live
            </div>
          </div>

          {/* Rotating site body */}
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={site.domain}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-0"
              >
                {/* Photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={site.img}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover scale-105"
                  aria-hidden="true"
                />
                <div className="absolute inset-0" style={{ background: site.grading }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0.75), transparent 60%)' }} />
                <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none" style={{ background: 'linear-gradient(165deg, rgba(255,255,255,0.08), transparent 70%)' }} />
              </motion.div>
            </AnimatePresence>

            {/* Navbar */}
            <div
              className="absolute top-0 inset-x-0 flex items-center justify-between px-3 py-2 z-10"
              style={{ background: 'linear-gradient(to bottom, rgba(8,6,4,0.72) 0%, transparent 100%)', backdropFilter: 'blur(3px)' }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={`brand-${site.brand}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-1.5 text-[9px] font-black text-white tracking-widest uppercase"
                >
                  <span className="relative inline-block" style={{ width: 10, height: 10 }}>
                    <span className="absolute inset-0 rounded-full" style={{ background: coinGrad }} />
                    <span className="absolute inset-[1.5px] rounded-full" style={{ background: site.dark }} />
                    <span className="absolute inset-[3px] rounded-full" style={{ background: ctaBgGrad }} />
                  </span>
                  {site.brand}
                </motion.span>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`nav-${site.brand}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  {site.nav.map((item, i) => (
                    <span
                      key={item}
                      className="text-[7.5px] font-semibold tracking-wider select-none"
                      style={{ color: i === 0 ? site.accent : 'rgba(255,255,255,0.55)' }}
                    >
                      {item}
                    </span>
                  ))}
                  <span
                    className="ml-1 inline-flex items-center h-4 px-1.5 rounded-full text-[7px] font-bold"
                    style={{ background: ctaBgGrad, color: ctaTextColor }}
                  >
                    {site.ctaShort}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Center hero */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`hero-${site.brand}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-0 flex flex-col justify-center px-4 z-10"
              >
                <p
                  className="text-[6.5px] font-mono uppercase tracking-[0.3em] mb-1.5"
                  style={{ color: eyebrowColor }}
                >
                  {site.eyebrow}
                </p>
                <HeroTypewriter key={`tw-${site.domain}`} assembled={assembled} text={site.title} accent={site.accent} />
                <p className="text-[7px] text-white/70 mt-2 max-w-[85%] leading-snug">
                  {site.sub}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[7px] font-bold"
                    style={{ background: ctaBgGrad, color: ctaTextColor, boxShadow: `0 4px 12px -2px ${site.accent2}55` }}
                  >
                    {site.ctaPrimary}
                  </span>
                  <span className="inline-flex items-center h-5 px-2 rounded-full text-[7px] font-semibold text-white/80 border border-white/25 backdrop-blur-sm">
                    {site.ctaSecondary}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stats bar */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`stats-${site.brand}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="absolute bottom-0 inset-x-0 px-3 py-1.5 flex items-center justify-between z-10"
                style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.95), rgba(8,6,4,0.4))' }}
              >
                <div className="flex items-center gap-2.5">
                  {site.stats.map((s) => (
                    <div key={s.l} className="flex items-center gap-1">
                      <span className="text-[8px] font-black tabular-nums" style={{ color: site.accent }}>{s.v}</span>
                      <span className="text-[6px] font-mono uppercase tracking-wider text-white/40">{s.l}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[6px] font-mono text-white/35">© {site.brand.toLowerCase()}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Card B: Color Palette ────────────────────────────────────────────────────

function CardPalette({ assembled }) {
  return (
    <div
      className="rounded-2xl border border-white/[0.08] p-4"
      style={{ background: 'rgba(14,14,28,0.88)', backdropFilter: 'blur(24px)', minHeight: 130 }}
    >
      <p className="text-[9px] font-mono uppercase tracking-widest text-white/32 mb-3">Brand Palette</p>
      {!assembled ? (
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => <Skel key={i} className="flex-1 rounded-xl" style={{ height: 44 }} />)}
        </div>
      ) : (
        <div className="flex gap-2">
          {PALETTE.map((color, i) => (
            <motion.div
              key={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.072, duration: 0.34, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex-1 rounded-xl relative overflow-hidden flex flex-col justify-end pb-1"
              style={{ height: 44, background: color, boxShadow: `0 4px 18px ${color}4a` }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.072 + 0.22 }}
                className="text-center font-mono text-[6.5px] text-white/55"
              >
                {color}
              </motion.span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Card C: Typography ───────────────────────────────────────────────────────

function CardTypography({ assembled }) {
  return (
    <div
      className="rounded-2xl border border-white/[0.08] p-4"
      style={{ background: 'rgba(14,14,28,0.88)', backdropFilter: 'blur(24px)', minHeight: 130 }}
    >
      <p className="text-[9px] font-mono uppercase tracking-widest text-white/32 mb-3">Typography</p>
      {!assembled ? (
        <div className="space-y-2">
          <Skel className="w-3/4 h-5" />
          <Skel className="w-full h-2" />
          <Skel className="w-5/6 h-2" />
          <div className="flex gap-2 mt-2">
            <Skel className="w-10 h-5 rounded-md" />
            <Skel className="w-10 h-5 rounded-md" />
            <Skel className="w-10 h-5 rounded-md" />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <p className="font-display font-bold text-lg text-white leading-none tracking-tight">Neue Grotesk</p>
          <p className="text-[10px] text-white/42 mt-1.5 leading-relaxed">
            The quick brown fox jumps over the lazy dog
          </p>
          <div className="mt-2.5 flex gap-2">
            {['Aa', 'Bb', 'Cc'].map((l, i) => (
              <motion.span
                key={l}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.09, duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="text-[11px] font-mono px-2 py-0.5 rounded border border-white/[0.10] text-white/55"
              >
                {l}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Card D: Terminal ─────────────────────────────────────────────────────────

function CardTerminal({ assembled }) {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!assembled) { setLines([]); return; }
    const timers = LOGS.map((log) =>
      setTimeout(() => setLines((prev) => [...prev, log]), log.t)
    );
    return () => timers.forEach(clearTimeout);
  }, [assembled]);

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/[0.08]"
      style={{
        gridColumn: '1 / -1',
        background: 'rgba(4,6,14,0.94)',
        backdropFilter: 'blur(24px)',
        minHeight: 90,
      }}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.06]">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[8.5px] font-mono text-white/22">aiweb — build log</span>
      </div>
      {/* Log body */}
      <div className="px-3 py-2.5 font-mono text-[8.5px] space-y-1 min-h-[52px]">
        {!assembled ? (
          <span className="text-white/18 animate-pulse">awaiting prompt_</span>
        ) : (
          <AnimatePresence>
            {lines.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className={log.cls}
              >
                {log.text}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ─── AI Bento Orchestrator ────────────────────────────────────────────────────

function AIBentoOrchestrator() {
  const wrapRef = useRef(null);
  const [phase, setPhase] = useState(PH.IDLE);
  const [dim, setDim] = useState({ w: 600, h: 420 });

  // Measure container for particle destinations
  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const { width, height } = wrapRef.current.getBoundingClientRect();
      if (width > 10) setDim({ w: width, h: height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  // Infinite phase loop
  useEffect(() => {
    let alive = true;
    async function loop() {
      while (alive) {
        setPhase(PH.IDLE);     await wait(DUR.IDLE);
        if (!alive) break;
        setPhase(PH.EXPLODE);  await wait(DUR.EXPLODE);
        if (!alive) break;
        setPhase(PH.SWARM);    await wait(DUR.SWARM);
        if (!alive) break;
        setPhase(PH.ASSEMBLE); await wait(DUR.ASSEMBLE);
        if (!alive) break;
        setPhase(PH.DONE);     await wait(DUR.DONE);
      }
    }
    loop();
    return () => { alive = false; };
  }, []);

  // 3D mouse parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-1, 1], [5, -5]), { stiffness: 155, damping: 26 });
  const rotY = useSpring(useTransform(mx, [-1, 1], [-5, 5]), { stiffness: 155, damping: 26 });

  const onMouseMove = useCallback((e) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }, [mx, my]);

  const onMouseLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  // Particles — recomputed when container size changes
  // Orb sits at approximately (62% left, 37% top) of the bento container
  // Percentages are based on the 2-col grid (1.65fr : 1fr) + 3-row layout
  const particles = useMemo(() => {
    const { w: W, h: H } = dim;
    const orbX = W * 0.62;
    const orbY = H * 0.37;

    const cards = [
      // Card A: col1 rows1-2, center ≈ (31%, 37%)
      { cx: W * 0.31, cy: H * 0.37, n: 22, colors: ['#a699ff', '#7c5cff', '#22d3ee', '#c084fc'] },
      // Card B: col2 row1, center ≈ (81%, 17%)
      { cx: W * 0.81, cy: H * 0.17, n: 16, colors: ['#7c5cff', '#c084fc', '#22d3ee', '#1d4ed8', '#f0f0f5'] },
      // Card C: col2 row2, center ≈ (81%, 55%)
      { cx: W * 0.81, cy: H * 0.55, n: 14, colors: ['#f0f0f5', '#a699ff', '#22d3ee'] },
      // Card D: full row3, center ≈ (50%, 87%)
      { cx: W * 0.50, cy: H * 0.87, n: 8,  colors: ['#10b981', '#22d3ee'] },
    ];

    return cards.flatMap(({ cx, cy, n, colors }, ci) =>
      Array.from({ length: n }, (_, i) => {
        const spread = 32;
        const angle = Math.random() * Math.PI * 2;
        const r = 14 + Math.random() * 22;
        return {
          id: `${ci}-${i}`,
          burstX: Math.cos(angle) * r,
          burstY: Math.sin(angle) * r,
          destX: (cx - orbX) + (Math.random() - 0.5) * spread * 2,
          destY: (cy - orbY) + (Math.random() - 0.5) * spread * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 2.5 + Math.random() * 2.5,
          delay: 0.04 + Math.random() * 0.52,
          dur: 1.0 + Math.random() * 0.55,
        };
      })
    );
  }, [dim]);

  const assembled = phase === PH.DONE;
  const showOrb = phase !== PH.DONE;
  const showParticles = phase === PH.EXPLODE || phase === PH.SWARM || phase === PH.ASSEMBLE;

  return (
    <div style={{ perspective: '1100px' }}>
      <motion.div
        ref={wrapRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', position: 'relative' }}
      >
        {/* Bento grid */}
        <div className="grid gap-3" style={{ gridTemplateColumns: '1.65fr 1fr' }}>
          <CardHeroPreview assembled={assembled} />
          <CardPalette assembled={assembled} />
          <CardTypography assembled={assembled} />
          <CardTerminal assembled={assembled} />
        </div>

        {/* AI Orb overlay at col/row intersection */}
        <AnimatePresence>
          {showOrb && (
            <motion.div
              className="absolute pointer-events-none"
              style={{ left: '62%', top: '37%', transform: 'translate(-50%, -50%)', zIndex: 20 }}
              exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.36 } }}
            >
              <AIOrb phase={phase} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle swarm — zero-size origin at orb center */}
        {showParticles && (
          <div
            style={{ position: 'absolute', left: '62%', top: '37%', width: 0, height: 0, zIndex: 25, pointerEvents: 'none' }}
          >
            {particles.map((p) => (
              <ParticleItem key={p.id} p={p} phase={phase} />
            ))}
          </div>
        )}

        {/* Ambient glow behind the grid */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: -24,
            zIndex: -1,
            background: 'radial-gradient(ellipse at 62% 37%, rgba(124,92,255,0.14) 0%, transparent 62%)',
            filter: 'blur(22px)',
            pointerEvents: 'none',
          }}
        />
      </motion.div>
    </div>
  );
}

// ─── Animated counter hook ─────────────────────────────────────────────────────

function useCounter(target, duration = 1200, delay = 0) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        setTimeout(() => {
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            setVal(Math.round(p * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, delay);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration, delay]);

  return [val, ref];
}

// ─── Social proof bar ─────────────────────────────────────────────────────────

function SocialProof({ locale }) {
  const L = (mn, en) => locale === 'mn' ? mn : en;
  const [sites, sitesRef] = useCounter(500, 1400, 0);
  const [tpl, tplRef]   = useCounter(23,  900,  150);

  const AVATARS = [
    ['#7c5cff', '#c084fc', 'Б'],
    ['#10b981', '#06b6d4', 'Т'],
    ['#f59e0b', '#ef4444', 'Э'],
    ['#ec4899', '#8b5cf6', 'Н'],
    ['#3b82f6', '#6366f1', 'М'],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className="flex flex-wrap items-center gap-5 pt-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {AVATARS.map(([a, b, letter], i) => (
            <div
              key={i}
              className="h-8 w-8 rounded-full border-2 border-[var(--bg-primary)] grid place-items-center text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
            >
              {letter}
            </div>
          ))}
        </div>
        <div>
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="13" height="13" viewBox="0 0 24 24" className="star-filled">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">4.9 / 5 {L('үнэлгээ', 'rating')}</div>
        </div>
      </div>

      <div className="hidden sm:block h-8 w-px bg-[var(--surface-border)]" />

      <div className="flex gap-4">
        <div ref={sitesRef} className="text-center">
          <div className="font-display text-lg font-bold tabular" style={{ color: 'var(--accent-light)' }}>{sites}+</div>
          <div className="text-[10px] text-[var(--text-muted)]">{L('сайт', 'sites built')}</div>
        </div>
        <div ref={tplRef} className="text-center">
          <div className="font-display text-lg font-bold tabular" style={{ color: 'var(--gradient-mid)' }}>{tpl}</div>
          <div className="text-[10px] text-[var(--text-muted)]">{L('загвар', 'templates')}</div>
        </div>
        <div className="text-center">
          <div className="font-display text-lg font-bold tabular" style={{ color: 'var(--gradient-end)' }}>2{L('мин', 'min')}</div>
          <div className="text-[10px] text-[var(--text-muted)]">{L('live болно', 'to go live')}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main hero export ─────────────────────────────────────────────────────────

export default function LandingHero({ locale }) {
  const router = useRouter();
  const L = (mn, en) => locale === 'mn' ? mn : en;
  const list  = DEMO_PROMPTS[locale] ?? DEMO_PROMPTS.en;
  const chips = CHIPS[locale]        ?? CHIPS.en;

  const [value,   setValue]   = useState('');
  const [typed,   setTyped]   = useState('');
  const [focused, setFocused] = useState(false);

  const typingRef  = useRef({ promptIndex: 0, charIndex: 0, mode: 'typing' });
  const focusedRef = useRef(false);

  useEffect(() => { focusedRef.current = focused || value.length > 0; }, [focused, value]);

  // Typewriter loop
  useEffect(() => {
    let cancelled = false;
    const loop = async () => {
      while (!cancelled) {
        if (focusedRef.current) { await wait(250); continue; }
        const s = typingRef.current;
        const current = list[s.promptIndex];
        if (s.mode === 'typing') {
          s.charIndex += 1;
          setTyped(current.slice(0, s.charIndex));
          if (s.charIndex >= current.length) {
            s.mode = 'hold';
            await wait(1800);
            s.mode = 'deleting';
          } else {
            await wait(34 + Math.random() * 42);
          }
        } else if (s.mode === 'deleting') {
          s.charIndex -= 2;
          if (s.charIndex <= 0) {
            s.charIndex = 0;
            s.promptIndex = (s.promptIndex + 1) % list.length;
            s.mode = 'typing';
            await wait(250);
          } else {
            setTyped(current.slice(0, s.charIndex));
            await wait(22);
          }
        }
      }
    };
    loop();
    return () => { cancelled = true; };
  }, [list]);

  function handleSubmit(e) {
    e.preventDefault();
    const prompt = (value || typed).trim();
    router.push(
      prompt
        ? `/${locale}/dashboard/sites/new?prompt=${encodeURIComponent(prompt)}`
        : `/${locale}/dashboard/sites/new`
    );
  }

  const placeholder = focused || value
    ? ''
    : (typed || L('Бизнесийнхээ тухай бичнэ үү...', 'Describe your business...'));

  return (
    <section className="relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-a" style={{ top: '-8%', left: '-6%', width: '520px', height: '520px' }} />
        <div className="orb orb-b" style={{ top: '35%', right: '-8%', width: '480px', height: '480px' }} />
        <div className="orb orb-c" style={{ bottom: '-15%', left: '35%', width: '400px', height: '400px' }} />
        <div className="absolute inset-0 grid-pattern opacity-60" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, var(--bg-primary) 100%)' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">

          {/* LEFT: copy + prompt */}
          <div className="md:col-span-5">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border-strong)] bg-[var(--surface)]/70 backdrop-blur px-4 py-1.5 text-xs text-[var(--text-secondary)] mb-7"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-70 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--success)]" />
              </span>
              <span className="font-mono">Gemini 2.5 · Flux schnell</span>
              <span className="text-[var(--text-muted)]">·</span>
              <span className="text-[var(--accent-light)] font-medium">{L('Шинэ хувилбар', 'New release')}</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-display font-bold tracking-[-0.03em] leading-[1.04]"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)' }}
            >
              {L('Бизнесээ тайлбарла.', 'Describe your business.')}
              <br />
              <span className="gradient-text">{L('AI вэбсайт бүтээнэ.', 'AI builds the website.')}</span>
            </motion.h1>

            {/* Subline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-5 text-base md:text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg"
            >
              {L(
                'Хэдхэн өгүүлбэрээр бичнэ үү — Gemini контент бичиж, Flux зураг үүсгэж, бэлэн загвар сонгоод хэдхэн минутад publish хийнэ.',
                "Say a few sentences — Gemini writes the copy, Flux generates imagery, picks a template, and you're live in minutes.",
              )}
            </motion.p>

            {/* Prompt form */}
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              onSubmit={handleSubmit}
              className="mt-7"
            >
              <div className="relative group">
                <div className="absolute -inset-[2px] bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] rounded-2xl opacity-30 group-hover:opacity-55 group-focus-within:opacity-75 transition-opacity duration-300 blur-[5px]" />
                <div className="relative flex items-center bg-[var(--bg-secondary)]/95 backdrop-blur-xl border border-[var(--surface-border-strong)] rounded-2xl overflow-hidden">
                  <div className="pl-4 text-[var(--accent-light)] shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent px-3 py-4 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none text-sm"
                    aria-label={L('Бизнесийн тайлбар', 'Business description')}
                  />
                  <button
                    type="submit"
                    className="m-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)] text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-[var(--accent-soft)] shine shrink-0 flex items-center gap-1.5"
                  >
                    {L('Эхлэх', 'Generate')}
                    <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
                </div>
              </div>

              {/* Suggestion chips */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {chips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setValue(chip)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface)]/60 text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)] hover:bg-[var(--accent-soft)] transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </motion.form>

            <SocialProof locale={locale} />
          </div>

          {/* RIGHT: AI Bento Orchestrator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            className="md:col-span-7 hidden md:block"
          >
            <AIBentoOrchestrator />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
