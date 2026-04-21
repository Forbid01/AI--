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

// ─── Typewriter for Card A headline ───────────────────────────────────────────

const HERO_TEXT = 'Premium Coffee Experience';

function HeroTypewriter({ assembled }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!assembled) { setShown(0); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= HERO_TEXT.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [assembled]);

  return (
    <span className="text-sm font-display font-bold text-white leading-tight tracking-tight">
      {HERO_TEXT.slice(0, shown)}
      {assembled && shown < HERO_TEXT.length && (
        <span className="opacity-50">|</span>
      )}
    </span>
  );
}

// ─── Card A: Hero Preview ─────────────────────────────────────────────────────

function CardHeroPreview({ assembled }) {
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
          {/* Mini browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/[0.07] shrink-0">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" style={{ boxShadow: '0 0 5px #ff5f5766' }} />
            <span className="h-2 w-2 rounded-full bg-[#febc2e]" style={{ boxShadow: '0 0 5px #febc2e66' }} />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" style={{ boxShadow: '0 0 5px #28c84066' }} />
            <div className="flex-1 mx-2 h-4 rounded bg-white/[0.05] border border-white/[0.07] flex items-center px-2">
              <span className="text-[8px] font-mono text-white/30 truncate">nomad-coffee.aiweb.mn</span>
            </div>
            <div className="flex items-center gap-1 text-[8px] text-[#10b981] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Live
            </div>
          </div>

          {/* Site preview — full mini-website look */}
          <div className="relative flex-1 overflow-hidden">

            {/* ── Photo background: warm coffee shop interior ── */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(175deg, #100806 0%, #1c0e06 40%, #080404 100%)' }} />
            {/* Warm ceiling lamp glow top-right */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 78% 8%, rgba(230,150,50,0.30) 0%, transparent 46%)' }} />
            {/* Soft wall-light left */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 12% 28%, rgba(180,90,20,0.20) 0%, transparent 40%)' }} />
            {/* Depth shadow center-bottom */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 90%, rgba(0,0,0,0.55) 0%, transparent 65%)' }} />

            {/* Bokeh: large warm lamp */}
            <div className="absolute rounded-full" style={{ width: 48, height: 48, top: '7%', left: '64%', background: 'radial-gradient(circle, rgba(240,180,60,0.38) 0%, transparent 70%)', filter: 'blur(7px)' }} />
            {/* Bokeh: mid warm left */}
            <div className="absolute rounded-full" style={{ width: 28, height: 28, top: '16%', left: '10%', background: 'radial-gradient(circle, rgba(210,120,40,0.28) 0%, transparent 70%)', filter: 'blur(5px)' }} />
            {/* Bokeh: tiny accent far right */}
            <div className="absolute rounded-full" style={{ width: 16, height: 16, top: '8%', left: '86%', background: 'radial-gradient(circle, rgba(255,210,90,0.40) 0%, transparent 70%)', filter: 'blur(3px)' }} />

            {/* Table surface */}
            <div className="absolute" style={{ bottom: '28%', left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent 5%, rgba(160,110,50,0.18) 40%, rgba(160,110,50,0.18) 60%, transparent 95%)' }} />

            {/* ── CSS coffee cup art ── */}
            <div className="absolute" style={{ bottom: '30%', left: '50%', transform: 'translateX(-50%)' }}>
              {/* Steam wisps */}
              <motion.div
                style={{ position: 'absolute', bottom: '100%', left: '22%', marginBottom: 3, width: 2, height: 16, background: 'linear-gradient(to top, rgba(255,255,255,0.35), transparent)', borderRadius: 4 }}
                animate={{ scaleY: [0.6, 1, 0.6], opacity: [0.35, 0.6, 0.35], x: [0, -1.5, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                style={{ position: 'absolute', bottom: '100%', left: '50%', marginBottom: 3, width: 2, height: 20, background: 'linear-gradient(to top, rgba(255,255,255,0.28), transparent)', borderRadius: 4 }}
                animate={{ scaleY: [1, 0.65, 1], opacity: [0.5, 0.22, 0.5], x: [0, 1.8, 0] }}
                transition={{ duration: 2.9, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              />
              <motion.div
                style={{ position: 'absolute', bottom: '100%', left: '74%', marginBottom: 3, width: 2, height: 13, background: 'linear-gradient(to top, rgba(255,255,255,0.22), transparent)', borderRadius: 4 }}
                animate={{ scaleY: [0.8, 1.1, 0.8], opacity: [0.22, 0.48, 0.22], x: [0, -1, 0] }}
                transition={{ duration: 3.3, repeat: Infinity, ease: 'easeInOut', delay: 1.3 }}
              />
              {/* Saucer */}
              <div style={{ width: 50, height: 9, background: 'linear-gradient(180deg, #6b3a1a 0%, #3d200a 100%)', borderRadius: '50%', marginBottom: -4 }} />
              {/* Cup body */}
              <div style={{ position: 'relative', width: 40, height: 36, background: 'linear-gradient(175deg, #5e3219 0%, #3a1a08 100%)', borderRadius: '3px 3px 10px 10px', margin: '0 auto', boxShadow: 'inset 0 2px 5px rgba(255,190,90,0.14), 0 5px 14px rgba(0,0,0,0.65)' }}>
                {/* Coffee surface inside cup */}
                <div style={{ position: 'absolute', top: 5, left: 5, right: 5, height: 11, background: 'radial-gradient(ellipse, #1a0a02 55%, #301408 100%)', borderRadius: '50%' }} />
                {/* Latte art swirl */}
                <div style={{ position: 'absolute', top: 7, left: 9, width: 14, height: 5, background: 'rgba(210,160,70,0.26)', borderRadius: '50%', filter: 'blur(1.5px)' }} />
                {/* Cup handle */}
                <div style={{ position: 'absolute', right: -10, top: 7, width: 11, height: 18, border: '3px solid #5e3219', borderRadius: '0 50% 50% 0', borderLeft: 'none' }} />
              </div>
            </div>

            {/* ── Mini site navbar (absolute, top of photo) ── */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute top-0 inset-x-0 flex items-center justify-between px-3 py-2"
              style={{ background: 'linear-gradient(to bottom, rgba(8,4,2,0.88) 0%, transparent 100%)' }}
            >
              {/* Logo */}
              <span className="flex items-center gap-1 text-[8.5px] font-bold text-white/90 tracking-tight">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'linear-gradient(135deg, #7c5cff, #c084fc)', display: 'inline-block', flexShrink: 0 }} />
                Nomad
              </span>
              {/* Nav links */}
              <div className="flex items-center gap-2.5">
                {['Home', 'Menu', 'Contact', 'About'].map((item) => (
                  <span key={item} className="text-[7px] font-medium text-white/52 cursor-default select-none">{item}</span>
                ))}
              </div>
            </motion.div>

            {/* ── Hero text overlay at bottom ── */}
            <div
              className="absolute bottom-0 inset-x-0 px-3 pt-8 pb-3"
              style={{ background: 'linear-gradient(to top, rgba(6,3,1,0.97) 0%, rgba(6,3,1,0.55) 65%, transparent 100%)' }}
            >
              <p className="text-[7.5px] font-mono uppercase tracking-widest text-white/35 mb-1.5">
                Nomad Coffee · Ulaanbaatar
              </p>
              <HeroTypewriter assembled={assembled} />
            </div>
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
