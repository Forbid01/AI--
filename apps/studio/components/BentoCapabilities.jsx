'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useEffect, useState, useRef, useCallback } from 'react';

// ─── Typewriter hook ──────────────────────────────────────────────────────────

function useTypewriter(lines, startDelay = 600) {
  const [state, setState] = useState({ lineIdx: 0, charIdx: 0, done: false });
  const timersRef = useRef(new Set());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const CHAR_MS = 28;
    const LINE_PAUSE = 420;
    const timers = timersRef.current;

    function schedule(fn, ms) {
      const id = setTimeout(() => { timers.delete(id); if (mountedRef.current) fn(); }, ms);
      timers.add(id);
    }

    function tick(lineIdx, charIdx) {
      if (!mountedRef.current) return;
      const line = lines[lineIdx];
      if (!line) { setState((p) => ({ ...p, done: true })); return; }
      if (charIdx < line.value.length) {
        setState({ lineIdx, charIdx: charIdx + 1, done: false });
        schedule(() => tick(lineIdx, charIdx + 1), CHAR_MS);
      } else if (lineIdx + 1 < lines.length) {
        setState({ lineIdx: lineIdx + 1, charIdx: 0, done: false });
        schedule(() => tick(lineIdx + 1, 0), LINE_PAUSE);
      } else {
        setState((p) => ({ ...p, done: true }));
      }
    }

    schedule(() => tick(0, 0), startDelay);
    return () => { mountedRef.current = false; timers.forEach(clearTimeout); timers.clear(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { lineIdx: state.lineIdx, charIdx: state.charIdx, done: state.done };
}

// ─── 3D Tilt card ─────────────────────────────────────────────────────────────

function TiltCard({ children, className, style, onClick }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), { stiffness: 280, damping: 22 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), { stiffness: 280, damping: 22 });

  const handleMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [rawX, rawY]);

  const handleLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900, ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

// ─── Glow BentoCard ───────────────────────────────────────────────────────────

function BentoCard({ children, span = 'md:col-span-3', delay = 0, noPad = false, depth = 1 }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`card ${noPad ? '' : 'p-6'} ${span} group relative overflow-hidden`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.8, 0.2, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={noPad ? undefined : {
        y: -5,
        boxShadow: '0 24px 64px -20px rgba(124, 92, 255, 0.30)',
        borderColor: 'rgba(255,255,255,0.14)',
        transition: { duration: 0.25 },
      }}
    >
      {/* Radial glow that follows mouse */}
      {isHovered && !noPad && (
        <div
          className="absolute pointer-events-none z-0 transition-opacity duration-300"
          style={{
            width: 280,
            height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 70%)',
            transform: `translate(${mousePos.x - 140}px, ${mousePos.y - 140}px)`,
            top: 0,
            left: 0,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ─── Sub-visuals ──────────────────────────────────────────────────────────────

function GeminiTerminal() {
  const lines = [
    { key: 'headline', value: '"Coffee from the heart of Mongolia"', color: 'text-emerald-400' },
    { key: 'tagline',  value: '"Third wave. First sip."',            color: 'text-sky-400' },
    { key: 'cta',      value: '"Explore the menu"',                   color: 'text-violet-400' },
    { key: 'about',    value: '"A cozy corner in the heart of UB…"', color: 'text-emerald-400' },
  ];

  const { lineIdx, charIdx } = useTypewriter(lines, 700);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.07] bg-[#080812] shadow-inner shadow-black/40">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#06060f]">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="font-mono text-[10px] text-white/20 mx-auto pr-14">gemini-2.5-flash</span>
      </div>

      <div className="p-4 font-mono text-[11px] space-y-2 min-h-[148px]">
        <p className="text-white/25">{'// Generating: Nomad Coffee'}</p>
        {lines.map((l, i) => {
          const isActive = i === lineIdx;
          const isPast = i < lineIdx;
          if (i > lineIdx) return null;
          const visibleValue = isPast ? l.value : isActive ? l.value.slice(0, charIdx) : '';
          return (
            <motion.div key={l.key} className="flex gap-2 flex-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
              <span className="text-[var(--accent-light)]">{l.key}</span>
              <span className="text-white/25">:</span>
              <span className={l.color}>{visibleValue}</span>
              {isActive && (
                <motion.span
                  className="inline-block w-[2px] h-[11px] bg-[var(--accent-light)] align-middle"
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear', times: [0, 0.45, 0.5, 0.95] }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="px-4 pb-3">
        <div className="h-px rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)]"
            initial={{ width: '0%' }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 2.8, ease: 'easeInOut', delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

const FLUX_PHOTOS = [
  { label: 'Yoga',       labelMn: 'Йога',        src: '/images/bento-yoga.jpg',       palette: 'from-amber-900/60 to-amber-600/20',  accent: '#fbbf24' },
  { label: 'Restaurant', labelMn: 'Ресторан',    src: '/images/bento-restaurant.jpg', palette: 'from-orange-900/60 to-rose-600/20',   accent: '#fb923c' },
  { label: 'Hotel',      labelMn: 'Зочид буудал', src: '/images/bento-hotel.jpg',      palette: 'from-slate-900/70 to-cyan-900/20',   accent: '#67e8f9' },
];

function PhotoGrid({ locale }) {
  const L = useCallback((mn, en) => (locale === 'mn' ? mn : en), [locale]);
  return (
    <div className="grid grid-cols-3 gap-2 h-[148px]">
      {FLUX_PHOTOS.map((p, i) => (
        <motion.div
          key={p.label}
          className="relative rounded-xl overflow-hidden cursor-default"
          initial={{ scale: 0.88, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 + i * 0.1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <motion.img
            src={p.src}
            alt={p.label}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            whileHover={{ scale: 1.18 }}
            transition={{ duration: 5, ease: 'easeOut' }}
            draggable={false}
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${p.palette}`} />
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full" style={{ backgroundColor: p.accent, boxShadow: `0 0 6px ${p.accent}` }} />
              <span className="text-[9px] font-mono text-white/70 uppercase tracking-widest">{L(p.labelMn, p.label)}</span>
            </div>
          </div>
          <div className="absolute inset-0 rounded-xl border border-white/[0.08] pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
}

function DomainVisual() {
  const [copied, setCopied] = useState(false);
  const domain = 'yourdomain.mn';
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(`_aiweb.${domain}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className="h-[120px] flex flex-col items-center justify-center gap-3">
      <TiltCard
        className="font-mono text-xs bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-xl px-4 py-3 flex items-center gap-2.5 cursor-pointer select-none shadow-lg shadow-black/20 hover:border-white/[0.14] transition-colors duration-200"
        onClick={handleCopy}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-50" />
          <span className="relative rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-white/30">_aiweb.</span>
        <span className="text-[var(--accent-light)]">{domain}</span>
        <span className="ml-1 text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full border border-emerald-500/20">LIVE</span>
        <AnimatePresence mode="wait">
          <motion.span key={copied ? 'copied' : 'copy'} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.15 }} className="ml-auto text-[9px] font-mono text-white/30">
            {copied ? 'copied' : 'copy'}
          </motion.span>
        </AnimatePresence>
      </TiltCard>
      <p className="text-[9px] font-mono text-white/20 tracking-widest">HTTPS · AUTO-RENEW · CDN</p>
    </div>
  );
}

function QPayLogo()     { return <svg width="52" height="22" viewBox="0 0 52 22" fill="none"><circle cx="11" cy="11" r="9.5" stroke="white" strokeWidth="1.4"/><text x="11" y="15.5" textAnchor="middle" fill="white" fontSize="10" fontWeight="800" fontFamily="system-ui,sans-serif">Q</text><text x="35" y="15" textAnchor="middle" fill="white" fontSize="10" fontWeight="600" fontFamily="system-ui,sans-serif">Pay</text></svg>; }
function SocialPayLogo() { return <svg width="68" height="22" viewBox="0 0 68 22" fill="none"><path d="M2 7C2 4.79 3.79 3 6 3h10c2.21 0 4 1.79 4 4v6c0 2.21-1.79 4-4 4H9l-4 4V17H6c-2.21 0-4-1.79-4-4V7Z" stroke="white" strokeWidth="1.3" fill="none"/><text x="25" y="15" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui,sans-serif">Social</text><text x="52" y="15" fill="white" fontSize="9" fontWeight="400" fontFamily="system-ui,sans-serif">Pay</text></svg>; }
function KhanLogo()     { return <svg width="48" height="22" viewBox="0 0 48 22" fill="none"><path d="M12 8 L15 4 L18 7 L21 3 L24 7 L27 4 L30 8" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/><text x="21" y="18" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="1">KHAN</text></svg>; }
function GolomtLogo()   { return <svg width="58" height="22" viewBox="0 0 58 22" fill="none"><path d="M9 19 C9 19 4 15 6 10 C7 7 10 8 10 8 C10 8 8 5 11 3 C11 3 11 7 13 8 C15 9 14 12 14 12 C16 10 15 7 16 6 C18 9 18 15 13 19 Z" stroke="white" strokeWidth="1.2" fill="none" strokeLinejoin="round"/><text x="36" y="15" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="700" fontFamily="system-ui,sans-serif" letterSpacing="0.5">GOLOMT</text></svg>; }

function PaymentsVisual() {
  const providers = [
    { key: 'qpay',   logo: <QPayLogo /> },
    { key: 'social', logo: <SocialPayLogo /> },
    { key: 'khan',   logo: <KhanLogo /> },
    { key: 'golomt', logo: <GolomtLogo /> },
  ];
  return (
    <div className="h-[120px] grid grid-cols-2 gap-2">
      {providers.map((p, i) => (
        <motion.div
          key={p.key}
          className="flex items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/[0.13] transition-colors duration-200 cursor-default"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 + i * 0.07, duration: 0.4 }}
          whileHover={{ y: -2, transition: { duration: 0.15 } }}
        >
          {p.logo}
        </motion.div>
      ))}
    </div>
  );
}

function MNFlag() { return <svg width="36" height="24" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="3" fill="#C4272E"/><rect x="10" width="16" height="24" fill="#015197"/><circle cx="18" cy="12" r="3.5" fill="#F5A623" opacity="0.9"/><path d="M18 7 L19 10 L18 9.5 L17 10 Z" fill="#F5A623" opacity="0.9"/></svg>; }
function ENFlag() { return <svg width="36" height="24" viewBox="0 0 36 24" fill="none"><rect width="36" height="24" rx="3" fill="#012169"/><path d="M0 0 L36 24 M36 0 L0 24" stroke="white" strokeWidth="5"/><path d="M0 0 L36 24 M36 0 L0 24" stroke="#C8102E" strokeWidth="3"/><rect x="14" y="0" width="8" height="24" fill="white"/><rect x="0" y="8" width="36" height="8" fill="white"/><rect x="15.5" y="0" width="5" height="24" fill="#C8102E"/><rect x="0" y="9.5" width="36" height="5" fill="#C8102E"/></svg>; }

function BilingualVisual() {
  const [active, setActive] = useState('mn');
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a === 'mn' ? 'en' : 'mn')), 2600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="h-[120px] flex items-center justify-center gap-4">
      <motion.div className="flex flex-col items-center gap-2" animate={{ opacity: active === 'mn' ? 1 : 0.3, scale: active === 'mn' ? 1.05 : 0.95 }} transition={{ duration: 0.5 }}>
        <MNFlag />
        <div className="text-center">
          <div className="text-[18px] font-display font-black text-[var(--accent-light)] leading-none">МН</div>
          <div className="text-[8px] font-mono text-white/25 mt-0.5 tracking-widest">MONGOLIAN</div>
        </div>
      </motion.div>
      <div className="flex flex-col items-center gap-1.5">
        <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <motion.div className="text-[8px] font-mono text-white/25 bg-white/[0.04] border border-white/[0.07] px-1.5 py-0.5 rounded-full" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 2.6, repeat: Infinity }}>sync</motion.div>
        <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>
      <motion.div className="flex flex-col items-center gap-2" animate={{ opacity: active === 'en' ? 1 : 0.3, scale: active === 'en' ? 1.05 : 0.95 }} transition={{ duration: 0.5 }}>
        <ENFlag />
        <div className="text-center">
          <div className="text-[18px] font-display font-black text-[var(--accent-light)] leading-none">EN</div>
          <div className="text-[8px] font-mono text-white/25 mt-0.5 tracking-widest">ENGLISH</div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── NEW: Templates marquee card ──────────────────────────────────────────────

const TEMPLATE_NAMES = [
  'Монгол ресторан','Кофе шоп','Йога студи','Гоо сайхны салон','Барилгын компани',
  'Хуулийн фирм','Зочид буудал','Онлайн дэлгүүр','Портфолио','Фитнесс клуб',
  'Аялал жуулчлал','Эмнэлгийн клиник','Сургалтын төв','Хувийн брэнд',
  'Байгаль орчны NGO','Гар урлал','Номын дэлгүүр','Тайлбарлагч','Дэлгүүр',
  'Кинотеатр','Авто засвар','Зурхайч','Мал эмнэлэг',
];

const EN_NAMES = [
  'Restaurant','Coffee Shop','Yoga Studio','Beauty Salon','Construction Co.',
  'Law Firm','Hotel','Online Store','Portfolio','Fitness Club',
  'Travel Agency','Medical Clinic','Training Center','Personal Brand',
  'Environmental NGO','Handcraft Shop','Book Store','Translator','Retail',
  'Cinema','Auto Repair','Astrologer','Vet Clinic',
];

function TemplatesMarqueeCard({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const names = locale === 'mn' ? TEMPLATE_NAMES : EN_NAMES;
  const half = Math.ceil(names.length / 2);
  const row1 = names.slice(0, half);
  const row2 = names.slice(half);

  return (
    <>
      {/* Marquee row 1 — left */}
      <div className="relative overflow-hidden h-8" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
        <div className="flex gap-2 w-max animate-[marquee_28s_linear_infinite]">
          {[...row1, ...row1].map((name, i) => (
            <span
              key={i}
              className="shrink-0 px-3 py-1 rounded-full text-[11px] border border-[var(--surface-border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Marquee row 2 — right (reverse) */}
      <div className="relative overflow-hidden h-8 mt-2" style={{ maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)' }}>
        <div className="flex gap-2 w-max animate-[marquee_24s_linear_infinite_reverse]">
          {[...row2, ...row2].map((name, i) => (
            <span
              key={i}
              className="shrink-0 px-3 py-1 rounded-full text-[11px] border border-[var(--accent-soft)] bg-[var(--accent-soft)] text-[var(--accent-light)] whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <h3 className="font-display text-lg font-bold tracking-tight">
          {L('23 мэргэжлийн загвар', '23 professional templates')}
        </h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
          {L(
            'Ресторанаас хуулийн фирм хүртэл — AI таны салбарт тохирсон загварыг автоматаар сонгоно.',
            'From restaurants to law firms — AI picks the right template for your industry.',
          )}
        </p>
      </div>
    </>
  );
}

// ─── NEW: Publish animation card ──────────────────────────────────────────────

function PublishCard({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [state, setState] = useState('idle'); // idle | publishing | done
  const [ripples, setRipples] = useState([]);

  function handlePublish(e) {
    if (state !== 'idle') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((r2) => r2.id !== id)), 700);

    setState('publishing');
    setTimeout(() => {
      setState('done');
      setTimeout(() => setState('idle'), 2500);
    }, 1600);
  }

  return (
    <>
      <div className="h-[120px] flex flex-col items-center justify-center gap-3 relative">
        {/* URL pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--surface-border)] text-[11px] font-mono text-[var(--text-tertiary)]">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
          mybusiness.aiweb.mn
          <AnimatePresence mode="wait">
            {state === 'done' ? (
              <motion.span key="live" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} className="text-[var(--success)] font-bold flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />{L('LIVE', 'LIVE')}</motion.span>
            ) : (
              <motion.span key="draft" exit={{ opacity: 0 }} className="text-[var(--warn)] flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[var(--warn)]" />{L('НООРОГ', 'DRAFT')}</motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Publish button */}
        <div className="relative">
          <motion.button
            type="button"
            onClick={handlePublish}
            disabled={state !== 'idle'}
            className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
            style={{
              background: state === 'done'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, var(--gradient-start), var(--gradient-mid))',
              boxShadow: state === 'done'
                ? '0 0 30px rgba(16,185,129,0.4)'
                : '0 0 20px rgba(124,92,255,0.35)',
            }}
            whileHover={state === 'idle' ? { scale: 1.04, brightness: 1.1 } : {}}
            whileTap={state === 'idle' ? { scale: 0.97 } : {}}
          >
            {/* Ripple effects */}
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                className="absolute rounded-full bg-white/30 pointer-events-none"
                initial={{ width: 0, height: 0, x: r.x, y: r.y, opacity: 0.6, translateX: '-50%', translateY: '-50%' }}
                animate={{ width: 120, height: 120, opacity: 0 }}
                transition={{ duration: 0.65, ease: 'easeOut' }}
              />
            ))}

            <AnimatePresence mode="wait">
              {state === 'idle' && (
                <motion.span key="idle" className="flex items-center gap-2" exit={{ opacity: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>
                  {L('Нийтлэх', 'Publish')}
                </motion.span>
              )}
              {state === 'publishing' && (
                <motion.span key="publishing" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span className="flex gap-0.5">
                    {[0,1,2].map(i=><span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-white"/>)}
                  </span>
                  {L('Нийтэлж байна...', 'Publishing...')}
                </motion.span>
              )}
              {state === 'done' && (
                <motion.span key="done" className="flex items-center gap-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><polyline points="20 6 9 17 4 12"/></svg>
                  {L('Нийтлэгдлээ!', 'Live!')}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-display text-lg font-bold tracking-tight">{L('Нэг товчлуураар нийтлэх', 'One-click publish')}</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
          {L(
            'Засаж дуусмагц нийтлэх товч дар — хэдхэн секундэд таны сайт дэлхийд харагдана.',
            'When you\'re done editing, hit Publish — your site goes live in seconds.',
          )}
        </p>
      </div>
    </>
  );
}

// ─── Mongolia showcase ────────────────────────────────────────────────────────

const SHOWCASE_STEPS = [
  { key: 'copy',   mn: 'AI текст',    en: 'AI copy'    },
  { key: 'domain', mn: '.mn домэйн',  en: '.mn domain' },
  { key: 'pay',    mn: 'QPay ready',  en: 'QPay ready' },
  { key: 'live',   mn: 'Live',        en: 'Live'       },
];

function MongoliaShowcase({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  // Track hover/touch with state so we can drive every layer independently
  // and avoid the whileInView="dawn" bug that permanently locks the card in dawn.
  const [isDawn, setIsDawn] = useState(false);

  const T = (duration, delay = 0, ease = 'easeInOut') => ({ duration, delay, ease });

  return (
    <div
      className="relative h-64 md:h-80 overflow-hidden rounded-2xl group cursor-default select-none"
      onMouseEnter={() => setIsDawn(true)}
      onMouseLeave={() => setIsDawn(false)}
      onTouchStart={() => setIsDawn(true)}
      onTouchEnd={() => setIsDawn(false)}
    >
      {/* ── Sky gradient ── */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isDawn
            ? 'linear-gradient(180deg, #3b1b5f 0%, #9b3f72 32%, #f59e5c 68%, #2b1630 100%)'
            : 'linear-gradient(180deg, #02040e 0%, #0a1232 30%, #180840 65%, #1a0c18 100%)',
        }}
        transition={T(1.2)}
      />

      {/* ── Aurora / northern lights — pulses at night, fades at dawn ── */}
      <motion.div
        className="absolute inset-0"
        animate={
          isDawn
            ? { opacity: 0 }
            : { opacity: [0.35, 0.55, 0.35] }
        }
        transition={
          isDawn
            ? T(1.0)
            : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{
          background:
            'radial-gradient(ellipse 90% 35% at 25% 18%, rgba(16,185,129,0.28) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 70% 25% at 72% 12%, rgba(124,92,255,0.22) 0%, transparent 65%)',
        }}
      />

      {/* ── Horizon warmth (dawn only) ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: isDawn ? 1 : 0 }}
        transition={T(1.1)}
        style={{
          background:
            'radial-gradient(ellipse 70% 35% at 50% 70%, rgba(251,191,36,0.42) 0%, rgba(249,115,22,0.18) 38%, transparent 72%)',
        }}
      />

      {/* ── Stars — dim dramatically at dawn ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: isDawn ? 0.06 : 0.5 }}
        transition={T(1.0)}
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px), ' +
            'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px, 44px 44px',
          backgroundPosition: '0 0, 22px 22px',
        }}
      />

      {/* ── Sun rising ── */}
      <motion.div
        className="absolute left-1/2 bottom-[56px] h-24 w-24 -translate-x-1/2 rounded-full"
        animate={isDawn
          ? { y: 0, scale: 1, opacity: 1 }
          : { y: 68, scale: 0.74, opacity: 0 }
        }
        transition={T(1.15, 0, [0.22, 1, 0.36, 1])}
        style={{
          background: 'radial-gradient(circle, #fff7ad 0%, #fbbf24 45%, #fb923c 72%, rgba(251,146,60,0) 74%)',
          boxShadow: '0 0 54px rgba(251,191,36,0.62), 0 0 120px rgba(249,115,22,0.36)',
        }}
      />

      {/* ── Floating UI card — left ── */}
      <motion.div
        className="absolute left-[12%] top-[22%] hidden sm:block"
        animate={isDawn
          ? { opacity: 0.82, y: 0, rotate: -3 }
          : { opacity: 0, y: 24, rotate: -8 }
        }
        transition={T(0.8, 0.15, 'easeOut')}
      >
        <motion.div
          className="w-28 rounded-lg border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-md"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="mb-2 flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          </div>
          <div className="space-y-1">
            <span className="block h-1 rounded-full bg-white/55" />
            <span className="block h-1 w-2/3 rounded-full bg-emerald-300/70" />
            <span className="block h-1 w-5/6 rounded-full bg-white/35" />
          </div>
        </motion.div>
      </motion.div>

      {/* ── Floating code tag — right ── */}
      <motion.div
        className="absolute right-[10%] top-[18%] hidden sm:block"
        animate={isDawn
          ? { opacity: 0.76, y: 0, rotate: 4 }
          : { opacity: 0, y: 26, rotate: 8 }
        }
        transition={T(0.85, 0.24, 'easeOut')}
      >
        <motion.div
          className="rounded-lg border border-cyan-200/20 bg-slate-950/35 px-3 py-2 font-mono text-[10px] leading-relaxed text-cyan-100/85 shadow-2xl backdrop-blur-md"
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-emerald-300">&lt;ai</span> web=<span className="text-amber-200">&quot;mn&quot;</span> /<span className="text-emerald-300">&gt;</span>
        </motion.div>
      </motion.div>

      {/* ── Floating grid widget — center-right ── */}
      <motion.div
        className="absolute left-[54%] top-[30%] hidden md:block"
        animate={isDawn
          ? { opacity: 0.68, y: 0, scale: 1 }
          : { opacity: 0, y: 18, scale: 0.85 }
        }
        transition={T(0.75, 0.32, 'easeOut')}
      >
        <motion.div
          className="grid h-14 w-16 grid-cols-2 gap-1 rounded-lg border border-white/20 bg-white/10 p-2 backdrop-blur-md"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="rounded bg-white/45" />
          <span className="rounded bg-emerald-300/55" />
          <span className="rounded bg-amber-200/55" />
          <span className="rounded bg-white/30" />
        </motion.div>
      </motion.div>

      {/* ── URL badge — bottom right (dawn only) ── */}
      <motion.div
        className="absolute right-[8%] bottom-[54px] z-[7] hidden rounded-xl border border-amber-200/25 bg-amber-200/10 px-3 py-2 text-[10px] font-mono text-amber-100 shadow-2xl backdrop-blur-md sm:block"
        animate={isDawn
          ? { opacity: 0.9, x: 0, scale: 1 }
          : { opacity: 0, x: 18, scale: 0.9 }
        }
        transition={T(0.55, 0.86, 'easeOut')}
      >
        <span className="text-emerald-200">https://</span>business.mn
      </motion.div>

      {/* ── Mountain landscape ── */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          <path d="M0,105 L70,58 L130,82 L210,32 L290,68 L370,22 L450,60 L530,40 L615,78 L700,30 L785,65 L865,44 L950,80 L1030,40 L1115,72 L1200,28 L1285,62 L1380,46 L1440,58 L1440,160 L0,160 Z" fill="#1a1a38" opacity="0.92"/>
          <path d="M0,128 L90,80 L190,108 L310,60 L430,96 L555,50 L670,90 L790,58 L910,100 L1040,65 L1155,108 L1280,75 L1440,92 L1440,160 L0,160 Z" fill="#0f0f28"/>
          <path d="M0,150 Q360,142 720,148 Q1080,154 1440,144 L1440,160 L0,160 Z" fill="#09091e"/>
        </svg>
        {/* Warm dawn tint over mountains */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: isDawn ? 1 : 0 }}
          transition={T(1.2)}
          style={{
            background: 'linear-gradient(to top, rgba(160,72,28,0.52) 0%, rgba(200,95,40,0.22) 45%, transparent 72%)',
          }}
        />
      </div>

      {/* ── Ger (yurt) silhouettes — white at dawn, dark at night ── */}
      <motion.div
        className="absolute bottom-[26px] left-[8%]"
        animate={{ color: isDawn ? 'rgba(255,255,255,0.82)' : '#09091e' }}
        transition={T(1.2)}
      >
        {/* fillRule=evenodd makes the door opening a transparent cutout */}
        <svg width="44" height="26" viewBox="0 0 44 26">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M2,26 L6,14 Q22,2 38,14 L42,26 Z M19,26 L19,18 L25,18 L25,26 Z"
          />
          <motion.circle
            cx="22" cy="3" r="1.5"
            animate={{ fill: isDawn ? 'rgba(255,255,255,0.5)' : '#27c93f' }}
            transition={T(1.2)}
            opacity="0.75"
          />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-[22px] right-[12%]"
        animate={{ color: isDawn ? 'rgba(255,255,255,0.55)' : 'rgba(9,9,30,0.7)' }}
        transition={T(1.2)}
      >
        <svg width="28" height="17" viewBox="0 0 28 17">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M1,17 L4,9 Q14,1 24,9 L27,17 Z M11,17 L11,12 L17,12 L17,17 Z"
          />
        </svg>
      </motion.div>

      {/* ── Center text ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pb-10">
        <motion.span
          className="eyebrow mb-3"
          style={{ color: 'rgba(52,211,153,0.85)' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={T(0.6)}
        >
          {L('Монголд зориулсан', 'Built for Mongolia')}
        </motion.span>
        <motion.h3
          className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white leading-[1.05]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={T(0.65, 0.1)}
        >
          {L('Монгол бизнесийн ', 'Mongolian business ')}
          <span style={{ color: '#34d399' }}>{L('цифрлэл', 'going digital')}</span>
        </motion.h3>
        <motion.p
          className="mt-3 text-sm max-w-sm"
          style={{ color: 'rgba(255,255,255,0.45)' }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={T(0.65, 0.2)}
        >
          {L(
            'Тал нутгийн өргөн уудамтай адил — таны бизнес дэлхийд харагддаг болог.',
            'As vast as the steppes — let your business be seen by the world.',
          )}
        </motion.p>

        {/* Steps — subtle ambient metadata, not feature callouts */}
        <motion.div
          className="mt-4 flex items-center gap-1.5 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={T(0.5, 0.35)}
        >
          {SHOWCASE_STEPS.map((step, i) => (
            <span
              key={step.key}
              className="px-2 py-0.5 rounded-full font-mono text-[9px] border border-white/[0.09] bg-black/20 text-white/35 backdrop-blur-sm"
            >
              {i > 0 && <span className="mr-1.5 text-white/15">·</span>}
              {step[locale] ?? step.en}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Hover glow overlay ── */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 65%)' }}
      />
    </div>
  );
}

// ─── Section with mouse parallax ──────────────────────────────────────────────

export default function BentoCapabilities({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax offsets for the grid (very subtle)
  const gridX = useSpring(useTransform(mouseX, [-1, 1], [-6, 6]), { stiffness: 60, damping: 20 });
  const gridY = useSpring(useTransform(mouseY, [-1, 1], [-4, 4]), { stiffness: 60, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      className="border-t border-[var(--surface-border)]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">

        {/* Header */}
        <motion.div
          className="flex items-end justify-between flex-wrap gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div>
            <span className="eyebrow text-[var(--accent-light)]">{L('Чадварууд', 'Capabilities')}</span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-black tracking-tighter leading-[1.02]">
              {L('Эхлэлээс публиш хүртэл ', 'From prompt to production ')}
              <span className="gradient-text">{L('нэг платформ', 'on one platform')}</span>
            </h2>
          </div>
          <p className="text-sm text-[var(--text-tertiary)] max-w-sm">
            {L(
              'Hosting, домэйн, AI, төлбөр — бид бүгдийг нэгтгэсэн. Та зөвхөн бизнест анхаарлаа төвлөрүүл.',
              'Hosting, domains, AI, and payments in one place. You stay on the business, we stitch the rest.',
            )}
          </p>
        </motion.div>

        <motion.div
          className="mt-10 hidden items-center gap-3 md:flex"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {[
            L('Prompt', 'Prompt'),
            L('AI сайт угсарна', 'AI assembles'),
            L('Domain + төлбөр', 'Domain + payments'),
            L('Live', 'Live'),
          ].map((label, i, arr) => (
            <div key={label} className="flex flex-1 items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--surface-border)] bg-white/[0.025] px-3 py-2">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[10px] font-bold text-[var(--accent-light)]">
                  {i + 1}
                </span>
                <span className="truncate text-xs font-semibold text-[var(--text-secondary)]">{label}</span>
              </div>
              {i < arr.length - 1 ? (
                <span className="h-px w-8 shrink-0 bg-gradient-to-r from-[var(--accent-light)]/55 to-transparent" />
              ) : null}
            </div>
          ))}
        </motion.div>

        {/* Grid with subtle parallax */}
        <motion.div
          className="mt-14 grid md:grid-cols-6 gap-4"
          style={{ x: gridX, y: gridY }}
        >
          {/* Row 1 */}
          <BentoCard span="md:col-span-4" delay={0.08}>
            <GeminiTerminal />
            <div className="mt-5">
              <h3 className="font-display text-lg font-bold tracking-tight">{L('AI зохиомжтой контент', 'AI copywriting')}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {L('AI таны салбарт тохирсон hero, about, FAQ бичнэ. MN/EN хоёул.', 'AI writes hero, about, and FAQ copy tuned to your vertical. MN + EN.')}
              </p>
            </div>
          </BentoCard>

          <BentoCard span="md:col-span-2" delay={0.14}>
            <PhotoGrid locale={locale} />
            <div className="mt-5">
              <h3 className="font-display text-lg font-bold tracking-tight">{L('AI зургийн генератор', 'AI image generator')}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {L('Hero + gallery зургийг брэндийн өнгөтэй нийцүүлж бүтээнэ.', 'Hero imagery rendered to match your brand palette.')}
              </p>
            </div>
          </BentoCard>

          {/* Row 2 */}
          <BentoCard span="md:col-span-2" delay={0.20}>
            <DomainVisual />
            <div className="mt-4">
              <h3 className="font-display text-lg font-bold tracking-tight">{L('Өөрийн домэйн', 'Custom domain')}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {L('DNS TXT-ээр баталгаажуулах, HTTPS автоматаар.', 'DNS TXT-verified, HTTPS provisioned automatically.')}
              </p>
            </div>
          </BentoCard>

          <BentoCard span="md:col-span-2" delay={0.26}>
            <PaymentsVisual />
            <div className="mt-4">
              <h3 className="font-display text-lg font-bold tracking-tight">{L('Монгол төлбөр', 'Mongolian payments')}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {L('QPay, SocialPay, Хаан, Голомт.', 'QPay, SocialPay, Khan, Golomt.')}
              </p>
            </div>
          </BentoCard>

          <BentoCard span="md:col-span-2" delay={0.32}>
            <BilingualVisual />
            <div className="mt-4">
              <h3 className="font-display text-lg font-bold tracking-tight">{L('Хоёр хэл', 'Bilingual')}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {L('MN/EN нэг workspace-ээс, синхрончлогддог.', 'MN / EN from a single workspace, always in sync.')}
              </p>
            </div>
          </BentoCard>

          {/* Row 3 — NEW: Templates + Publish */}
          <BentoCard span="md:col-span-3" delay={0.38}>
            <TemplatesMarqueeCard locale={locale} />
          </BentoCard>

          <BentoCard span="md:col-span-3" delay={0.44}>
            <PublishCard locale={locale} />
          </BentoCard>

          {/* Row 4 — Mongolia showcase */}
          <BentoCard span="md:col-span-6" delay={0.50} noPad>
            <MongoliaShowcase locale={locale} />
          </BentoCard>
        </motion.div>
      </div>
    </section>
  );
}
