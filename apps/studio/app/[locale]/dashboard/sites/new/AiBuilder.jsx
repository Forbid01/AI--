'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getDictionary } from '@aiweb/i18n';
import TonePicker from '@/components/TonePicker.jsx';
import { formatSiteValidationError } from '@/lib/siteValidation.js';
import {
  PremiumMockup,
  TEMPLATE_SHOWCASE_CATEGORIES,
  TEMPLATE_SHOWCASE_TEMPLATES,
} from '@/components/TemplateShowcase.jsx';

const PHASE_CHAT       = 'chat';
const PHASE_TEMPLATE   = 'template';
const PHASE_TONE       = 'tone';
const PHASE_REVIEW     = 'review';
const PHASE_GENERATING = 'generating';
const PHASE_SUCCESS    = 'success';

const STEPS = [
  { key: PHASE_CHAT,     icon: '1' },
  { key: PHASE_TEMPLATE, icon: '2' },
  { key: PHASE_TONE,     icon: '3' },
  { key: PHASE_REVIEW,   icon: '4' },
];
const PHASE_ORDER = [PHASE_CHAT, PHASE_TEMPLATE, PHASE_TONE, PHASE_REVIEW, PHASE_GENERATING, PHASE_SUCCESS];
const TEMPLATE_PREVIEW_BY_ID = new Map(TEMPLATE_SHOWCASE_TEMPLATES.map((t) => [t.id, t]));

// Module-level constant — does not change, no need to define inside component
const GEN_STEPS = [
  { mn: 'Бизнесийн мэдээлэл боловсруулж байна...', en: 'Processing your business info...' },
  { mn: 'AI контент бичиж байна...',               en: 'AI is writing your content...' },
  { mn: 'Hero зураг үүсгэж байна...',              en: 'Generating hero image...' },
  { mn: 'Gallery зургуудыг бүтээж байна...',       en: 'Creating gallery images...' },
  { mn: 'Загвар тохируулж байна...',               en: 'Applying your template...' },
  { mn: 'Сайтыг бэлдэж байна...',                  en: 'Finalising your site...' },
];

// ─── Streaming text hook ──────────────────────────────────────────────────────

function useStreamingText(text, active, speedMs = 16) {
  const [shown, setShown] = useState(active ? '' : text);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!active) { setShown(text); return; }
    cancelRef.current = false;
    setShown('');
    let i = 0;
    const tick = () => {
      if (cancelRef.current) return;
      i++;
      setShown(text.slice(0, i));
      if (i < text.length) setTimeout(tick, speedMs);
    };
    setTimeout(tick, speedMs);
    return () => { cancelRef.current = true; };
  }, [text, active, speedMs]);

  return { shown, done: shown.length >= text.length };
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#7c5cff', '#c084fc', '#22d3ee', '#10b981', '#f59e0b', '#ec4899', '#a78bfa'];

function Confetti() {
  const pieces = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 0.9 + Math.random() * 0.7,
      size: 6 + Math.random() * 8,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      shape: Math.random() > 0.5 ? 'circle' : 'rect',
      rotate: Math.random() * 360,
    })), []);

  return (
    <div className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden" style={{ height: 200, zIndex: 50 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -16,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : 2,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s ease-out ${p.delay}s both`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Generating overlay ───────────────────────────────────────────────────────

function GeneratingOverlay({ locale, complete }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  // Step cycling — stops when complete
  useEffect(() => {
    if (complete) return;
    const id = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, GEN_STEPS.length - 1));
    }, 3200);
    return () => clearInterval(id);
  }, [complete]);

  // Progress animation — caps at 90%, jumps to 100% on complete
  useEffect(() => {
    if (complete) {
      setProgress(1);
      return;
    }
    const start = performance.now();
    const DURATION = 19000;
    let rafId;
    const tick = (now) => {
      const p = Math.min(((now - start) / DURATION) * 0.9, 0.9);
      setProgress(p);
      if (p < 0.9) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [complete]);

  const R = 64;
  const CIRC = 2 * Math.PI * R;
  const dashOffset = CIRC * (1 - progress);
  const pct = Math.round(progress * 100);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ background: 'var(--bg-secondary)', zIndex: 20 }}
    >
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-a" style={{ top: '-20%', left: '-10%', width: '320px', height: '320px', opacity: 0.22 }} />
        <div className="orb orb-b" style={{ bottom: '-20%', right: '-10%', width: '300px', height: '300px', opacity: 0.18 }} />
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        {/* SVG progress ring */}
        <div className="relative mb-7">
          <div
            className="absolute inset-[-10px] rounded-full border border-dashed border-[var(--surface-border-strong)]"
            style={{ animation: 'ring-spin 18s linear infinite' }}
          />
          <div
            className="absolute inset-[-22px] rounded-full border border-[var(--surface-border)]"
            style={{ animation: 'ring-spin 28s linear infinite reverse' }}
          />

          <svg width="160" height="160" viewBox="0 0 160 160">
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--gradient-start)" />
                <stop offset="60%" stopColor="var(--gradient-mid)" />
                <stop offset="100%" stopColor="var(--gradient-end)" />
              </linearGradient>
              <filter id="ringGlow">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(124,92,255,0.1)" strokeWidth="7" />
            <circle
              cx="80" cy="80" r={R}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 80 80)"
              filter="url(#ringGlow)"
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.2,0.8,0.2,1)' }}
            />
            <circle cx="80" cy="80" r="3" fill="var(--accent-light)" />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <motion.span
              key={pct}
              className="font-display text-3xl font-bold tabular"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {pct}%
            </motion.span>
            <span className="text-[10px] font-mono text-[var(--accent-light)] mt-0.5 tracking-widest">AI</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={stepIdx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-[var(--text-secondary)] text-sm font-medium max-w-xs leading-relaxed"
          >
            {L(GEN_STEPS[stepIdx].mn, GEN_STEPS[stepIdx].en)}
          </motion.p>
        </AnimatePresence>

        <div className="flex gap-1.5 mt-5">
          {GEN_STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="h-1.5 rounded-full"
              animate={{
                width: i === stepIdx ? 20 : 6,
                background: i <= stepIdx ? 'var(--accent)' : 'var(--surface-border)',
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        <p className="mt-8 text-xs text-[var(--text-muted)] max-w-sm">
          {L(
            'AI агуулга бичиж, зураг үүсгэж, загвар тохируулж байна. Энэ 30–60 секунд үргэлжилнэ.',
            'AI is writing content, generating images, and applying your template. This takes 30–60 seconds.',
          )}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Success overlay ──────────────────────────────────────────────────────────

function SuccessOverlay({ locale, siteName }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: 'var(--bg-secondary)', zIndex: 20 }}
    >
      <Confetti />

      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
          className="h-20 w-20 rounded-full bg-gradient-to-br from-[var(--success)] to-emerald-400 grid place-items-center shadow-[0_0_40px_rgba(16,185,129,0.5)] mb-6"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="font-display text-3xl font-bold tracking-tight"
        >
          {L('Амжилттай!', 'Site is ready!')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-3 text-[var(--text-secondary)] text-sm"
        >
          {siteName
            ? L(`"${siteName}" вэбсайт бэлэн боллоо.`, `"${siteName}" is live and ready.`)
            : L('Таны вэбсайт бэлэн боллоо.', 'Your website is ready.')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center gap-1.5 text-xs text-[var(--text-muted)]"
        >
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
          {L('Шилжүүлж байна...', 'Redirecting...')}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Chat message bubble ──────────────────────────────────────────────────────

function ChatBubble({ msg, isLatest, locale }) {
  const isAi   = msg.role === 'ai';
  const isSkip = msg.isSkip === true;
  const { shown, done } = useStreamingText(msg.text, isAi && isLatest && !msg.noStream, 14);

  if (isSkip) {
    return (
      <div className="flex justify-end">
        <span className="text-[11px] italic text-[var(--text-muted)] px-3 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02]">
          {msg.text}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}
      initial={{ opacity: 0, x: isAi ? -10 : 10, y: 4 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {isAi && (
        <div className="shrink-0 h-7 w-7 rounded-lg bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center mr-2.5 mt-0.5 shadow-md shadow-[var(--accent-soft)]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
        </div>
      )}

      <div className="max-w-[80%]">
        <div
          className="rounded-2xl px-4 py-3 text-sm leading-relaxed"
          style={isAi ? {
            background: 'var(--surface)',
            border: '1px solid var(--surface-border)',
            borderBottomLeftRadius: 6,
            boxShadow: isLatest ? '0 0 20px rgba(124,92,255,0.08)' : 'none',
          } : {
            background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-mid))',
            borderBottomRightRadius: 6,
            color: 'white',
            boxShadow: '0 4px 16px rgba(124,92,255,0.25)',
          }}
        >
          {shown}
          {isAi && isLatest && !done && (
            <span className="caret" style={{ height: '0.85em', width: '2px' }} />
          )}
          {msg.hint && (
            <span className="block mt-1.5 text-xs opacity-55">{msg.hint}</span>
          )}
        </div>

        {isAi && isLatest && Array.isArray(msg.suggestions) && msg.suggestions.length > 0 && done && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {msg.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                data-suggestion={s}
                className="px-3 py-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)] hover:bg-[var(--accent-soft)] transition-all"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      className="flex justify-start items-center gap-2.5"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
    >
      <div className="shrink-0 h-7 w-7 rounded-lg bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-md shadow-[var(--accent-soft)]">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)]">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-light)]" />
          <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-light)]" />
          <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-light)]" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sidebar progress ─────────────────────────────────────────────────────────

function SidebarProgress({ phase, locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const currentIdx = PHASE_ORDER.indexOf(phase);

  const STEP_LABELS = [
    { key: PHASE_CHAT,     mn: 'Бизнес мэдээлэл', en: 'Business info' },
    { key: PHASE_TEMPLATE, mn: 'Загвар сонгох',   en: 'Choose template' },
    { key: PHASE_TONE,     mn: 'Өнгө аяс',        en: 'Style & tone' },
    { key: PHASE_REVIEW,   mn: 'Үүсгэх',          en: 'Generate' },
  ];

  return (
    <div className="space-y-1">
      {STEP_LABELS.map((s, si) => {
        const stepIdx = PHASE_ORDER.indexOf(s.key);
        const done    = stepIdx < currentIdx;
        const active  = s.key === phase || (s.key === PHASE_REVIEW && (phase === PHASE_GENERATING || phase === PHASE_SUCCESS));

        return (
          <div key={s.key} className="relative flex items-center gap-3 py-1">
            {si < STEP_LABELS.length - 1 && (
              <div
                className="absolute left-[13px] top-8 w-px h-6 transition-colors duration-500"
                style={{ background: done ? 'var(--accent)' : 'var(--surface-border)' }}
              />
            )}

            <motion.div
              className="relative h-7 w-7 rounded-lg text-xs font-bold grid place-items-center shrink-0 z-10"
              animate={{
                background: active ? 'var(--accent)' : done ? 'rgba(124,92,255,0.18)' : 'var(--bg-tertiary)',
                color: active ? '#fff' : done ? 'var(--accent-light)' : 'var(--text-muted)',
                boxShadow: active ? '0 0 14px rgba(124,92,255,0.4)' : 'none',
              }}
              transition={{ duration: 0.3 }}
            >
              {active && !done && (
                <span className="absolute inset-0 rounded-lg bg-[var(--accent)] opacity-30 animate-ping" />
              )}
              {done ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                String(si + 1)
              )}
            </motion.div>

            <span className={`text-sm transition-colors duration-300 ${active ? 'text-[var(--text-primary)] font-medium' : done ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
              {L(s.mn, s.en)}
            </span>
          </div>
        );
      })}

      {(phase === PHASE_GENERATING || phase === PHASE_SUCCESS) && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-3 py-2.5 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-xs text-[var(--accent-light)] flex items-center gap-2"
        >
          {phase === PHASE_SUCCESS ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
          )}
          {phase === PHASE_SUCCESS ? L('Бэлэн боллоо!', 'Ready!') : L('Үүсгэж байна...', 'Generating...')}
        </motion.div>
      )}
    </div>
  );
}

// ─── Back button ──────────────────────────────────────────────────────────────

function BackButton({ onClick, locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5" /><path d="m12 5-7 7 7 7" />
      </svg>
      {L('Буцах', 'Back')}
    </button>
  );
}

// ─── Template grid ────────────────────────────────────────────────────────────

function TemplateGrid({ templates, templateId, locale, onSelect, onBack }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  const availableCategories = useMemo(() => {
    const used = new Set(
      templates.map((t) => TEMPLATE_PREVIEW_BY_ID.get(t.id)?.category).filter(Boolean),
    );
    return TEMPLATE_SHOWCASE_CATEGORIES.filter((cat) => cat.key === 'all' || used.has(cat.key));
  }, [templates]);

  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredId, setHoveredId] = useState(templateId || templates[0]?.id || null);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === 'all') return templates;
    return templates.filter((t) => TEMPLATE_PREVIEW_BY_ID.get(t.id)?.category === activeCategory);
  }, [activeCategory, templates]);

  useEffect(() => {
    if (!filteredTemplates.some((t) => t.id === hoveredId)) {
      setHoveredId(templateId || filteredTemplates[0]?.id || templates[0]?.id || null);
    }
  }, [filteredTemplates, hoveredId, templateId, templates]);

  const previewId       = hoveredId || templateId || filteredTemplates[0]?.id || templates[0]?.id || null;
  const previewTemplate = previewId ? TEMPLATE_PREVIEW_BY_ID.get(previewId) : null;
  const selectedTemplate = templates.find((t) => t.id === previewId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="mt-6"
    >
      {/* Phase header */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <BackButton onClick={onBack} locale={locale} />
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {L('Загвар сонгоорой', 'Choose a template')}
        </h3>
        <span /> {/* spacer */}
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-5">
        {L(
          'Сонгоход амар болгохын тулд төрөл, боломж, урьдчилсан харагдацыг нэг дор харууллаа.',
          'Browse by category, compare features, and preview each layout before choosing.',
        )}
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {availableCategories.map((cat) => {
          const active = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-[var(--accent)] text-white shadow-[0_0_20px_rgba(124,92,255,0.28)]'
                  : 'bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--surface-border)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat[locale] ?? cat.mn}
            </button>
          );
        })}
      </div>

      <div className="grid xl:grid-cols-[minmax(0,1.15fr)_340px] gap-6 items-start">
        <div className="grid sm:grid-cols-2 gap-4">
          {filteredTemplates.map((t, i) => {
            const active          = templateId === t.id;
            const tplPreview      = TEMPLATE_PREVIEW_BY_ID.get(t.id);
            const theme           = t.defaultTheme ?? {};
            const features        = tplPreview?.features?.[locale] ?? tplPreview?.features?.mn ?? [];
            const categoryLabel   = TEMPLATE_SHOWCASE_CATEGORIES.find((c) => c.key === tplPreview?.category)?.[locale]
              ?? TEMPLATE_SHOWCASE_CATEGORIES.find((c) => c.key === tplPreview?.category)?.mn
              ?? tplPreview?.category;

            return (
              <motion.button
                key={t.id}
                type="button"
                onClick={() => onSelect(t.id)}
                onMouseEnter={() => setHoveredId(t.id)}
                onFocus={() => setHoveredId(t.id)}
                aria-pressed={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="relative text-left rounded-xl overflow-hidden border transition-colors duration-200"
                style={{
                  borderColor: active ? 'var(--accent)' : 'var(--surface-border)',
                  boxShadow: active
                    ? '0 0 0 2px rgba(124,92,255,0.25), 0 8px 30px rgba(124,92,255,0.2)'
                    : '0 2px 12px rgba(0,0,0,0.2)',
                }}
              >
                <div
                  className="aspect-[5/3] relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${theme.primary ?? '#6c5ce7'} 0%, ${theme.background ?? '#0a0a0f'} 100%)` }}
                >
                  {tplPreview ? (
                    <PremiumMockup template={tplPreview} locale={locale} compact />
                  ) : (
                    <>
                      <div className="absolute inset-0 grid-pattern opacity-30" />
                      <div className="absolute inset-4 flex flex-col justify-between">
                        <div className="flex gap-1.5">
                          <div className="h-1.5 w-12 rounded-full bg-white/30" />
                          <div className="h-1.5 w-8 rounded-full bg-white/20" />
                        </div>
                        <div>
                          <div className="h-2.5 w-32 rounded bg-white/70 mb-1.5" />
                          <div className="h-1.5 w-24 rounded bg-white/40" />
                        </div>
                      </div>
                    </>
                  )}

                  <span className="absolute top-3 left-3 font-mono text-[9px] tracking-widest text-white/40 bg-black/20 px-2 py-0.5 rounded-full">
                    {t.id}
                  </span>

                  <AnimatePresence>
                    {active && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 360, damping: 20 }}
                        className="absolute top-3 right-3 h-7 w-7 grid place-items-center rounded-full bg-[var(--accent)] shadow-lg shadow-[var(--accent-soft)]"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="p-4 bg-[var(--surface)]">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="font-semibold text-sm">{t.name[locale] ?? t.name.mn}</div>
                    {categoryLabel && (
                      <span className="shrink-0 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                        {categoryLabel}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {t.description[locale] ?? t.description.mn}
                  </p>
                  {features.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {features.slice(0, 3).map((f) => (
                        <span
                          key={f}
                          className="px-2 py-1 rounded-full text-[10px] border border-[var(--surface-border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <TemplatePreviewDrawer
            key={previewId ?? 'none'}
            locale={locale}
            template={previewTemplate}
            fallbackTemplate={selectedTemplate}
            onSelect={onSelect}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function TemplatePreviewDrawer({ template, fallbackTemplate, locale, onSelect }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const displayName        = template?.name?.[locale] ?? template?.name?.mn ?? fallbackTemplate?.name?.[locale] ?? fallbackTemplate?.name?.mn;
  const displayDescription = template?.description?.[locale] ?? template?.description?.mn ?? fallbackTemplate?.description?.[locale] ?? fallbackTemplate?.description?.mn;
  const displayFeatures    = template?.features?.[locale] ?? template?.features?.mn ?? [];

  return (
    <motion.aside
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 18 }}
      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
      className="xl:sticky xl:top-24 rounded-2xl overflow-hidden border border-[var(--surface-border-strong)] bg-[var(--surface)] shadow-2xl shadow-black/35"
    >
      {template ? (
        <>
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--surface-border)] bg-[linear-gradient(180deg,#111_0%,#0a0a10_100%)]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="flex-1 truncate text-[11px] font-mono text-white/55 tracking-tight">{template.domain}</span>
            <span className="text-[9px] font-medium text-[var(--success)]">{L('Preview', 'Preview')}</span>
          </div>
          <div className="relative overflow-hidden h-[250px]">
            <PremiumMockup template={template} locale={locale} />
          </div>
        </>
      ) : (
        <div className="h-[250px] bg-[var(--bg-secondary)] grid place-items-center text-sm text-[var(--text-muted)]">
          {L('Урьдчилан харагдац бэлдэж байна', 'Preview is loading')}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h4 className="font-display text-lg font-bold tracking-tight">{displayName}</h4>
            <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{displayDescription}</p>
          </div>
          {template?.badge && (
            <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 bg-white/5 text-white/70">
              {template.badge}
            </span>
          )}
        </div>

        {displayFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {displayFeatures.map((f) => (
              <span
                key={f}
                className="px-2.5 py-1 rounded-full text-xs border border-[var(--surface-border-strong)] bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
              >
                {f}
              </span>
            ))}
          </div>
        )}

        {fallbackTemplate && (
          <button
            type="button"
            onClick={() => onSelect(fallbackTemplate.id)}
            className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)] text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-[var(--accent-soft)] shine"
          >
            {L('Энэ загвараар эхлэх', 'Use this template')}
            <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </motion.aside>
  );
}

// ─── Review panel ─────────────────────────────────────────────────────────────

function ReviewPanel({ business, subdomain, tone, templateId, templates, locale, root, loading, error, onBack, onSubmit, onSubdomainChange }) {
  const L    = (mn, en) => (locale === 'mn' ? mn : en);
  const dict = getDictionary(locale);
  const selectedTemplate = templates.find((t) => t.id === templateId);

  // Subdomain availability check
  const [subStatus, setSubStatus] = useState(null); // null | 'checking' | 'available' | 'taken'
  useEffect(() => {
    if (!subdomain || subdomain.length < 2) { setSubStatus(null); return; }
    setSubStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/sites/available?subdomain=${encodeURIComponent(subdomain)}`);
        if (!res.ok) { setSubStatus(null); return; }
        const data = await res.json();
        setSubStatus(data.available ? 'available' : 'taken');
      } catch { setSubStatus(null); }
    }, 600);
    return () => clearTimeout(timer);
  }, [subdomain]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
      className="mt-6"
    >
      <div className="card p-6">
        <h3 className="font-display text-lg font-semibold tracking-tight mb-4">{L('Хураангуй', 'Review')}</h3>
        <dl className="divide-y divide-[var(--surface-border)]">
          {[
            [L('Загвар', 'Template'), selectedTemplate?.name?.[locale] ?? templateId],
            [L('Бизнес', 'Business'), business.businessName],
            [L('Салбар', 'Industry'), business.industry],
            [L('Тайлбар', 'Description'), business.description],
            [L('Өнгө аяс', 'Tone'), dict.tones[tone]],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-6 py-3 text-sm">
              <dt className="text-[var(--text-secondary)] shrink-0">{label}</dt>
              <dd className="font-medium text-right truncate max-w-[60%]">{value || '—'}</dd>
            </div>
          ))}
        </dl>

        {/* Subdomain edit */}
        <div className="mt-5">
          <label className="eyebrow text-[var(--text-muted)]" htmlFor="subdomain">{L('Домэйн засах', 'Edit domain')}</label>
          <div className="mt-2 flex items-stretch border border-[var(--surface-border)] rounded-xl bg-[var(--surface)] focus-within:border-[var(--accent)]/60 focus-within:shadow-[0_0_0_3px_rgba(124,92,255,0.12)] transition-all overflow-hidden">
            <input
              id="subdomain"
              className="flex-1 bg-transparent px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none font-mono text-sm"
              value={subdomain}
              onChange={(e) => onSubdomainChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="mybiz"
            />
            <div className="px-4 py-2.5 text-[var(--text-muted)] text-sm font-mono border-l border-[var(--surface-border)] bg-[var(--bg-tertiary)] shrink-0">
              .{root}
            </div>
          </div>

          {/* Availability indicator */}
          {subStatus && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-1.5 text-xs"
            >
              {subStatus === 'checking' && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] animate-pulse" />
                  <span className="text-[var(--text-muted)]">{L('Шалгаж байна...', 'Checking...')}</span>
                </>
              )}
              {subStatus === 'available' && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400">{L('Боломжтой', 'Available')}</span>
                </>
              )}
              {subStatus === 'taken' && (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                  <span className="text-red-400">{L('Аль хэдийн ашиглагдсан', 'Already taken')}</span>
                </>
              )}
            </motion.div>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 text-sm text-[var(--danger)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 rounded-xl px-4 py-3"
          >
            {error}
          </motion.p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" onClick={onBack} className="btn btn-ghost btn-md">
          <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><path d="m12 5-7 7 7 7" />
          </svg>
          {L('Буцах', 'Back')}
        </button>

        <motion.button
          type="button"
          onClick={onSubmit}
          disabled={loading || !subdomain || subStatus === 'taken'}
          whileHover={!loading && subdomain && subStatus !== 'taken' ? { scale: 1.02 } : {}}
          whileTap={!loading && subdomain && subStatus !== 'taken' ? { scale: 0.98 } : {}}
          className="btn btn-accent btn-lg relative overflow-hidden shine"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
              {L('Үүсгэж байна...', 'Generating...')}
            </span>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
              {L('Сайт үүсгэх', 'Generate site')}
              <svg aria-hidden width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Main AiBuilder ───────────────────────────────────────────────────────────

export default function AiBuilder({ locale, templates, initialPrompt, initialTemplate }) {
  const dict   = getDictionary(locale);
  const router = useRouter();
  const L      = useCallback((mn, en) => (locale === 'mn' ? mn : en), [locale]);

  const [phase,             setPhase]             = useState(PHASE_CHAT);
  const [messages,          setMessages]          = useState([]);
  const [input,             setInput]             = useState('');
  const [business,          setBusiness]          = useState({
    businessName: '', industry: '', description: '',
    services: '', contactEmail: '', contactPhone: '', address: '',
  });
  const [templateId,        setTemplateId]        = useState(
    templates.some((t) => t.id === initialTemplate) ? initialTemplate : templates[0]?.id ?? 'minimal',
  );
  const [tone,              setTone]              = useState('friendly');
  const [subdomain,         setSubdomain]         = useState('');
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState(null);
  const [chatStep,          setChatStep]          = useState(0);
  const [typing,            setTyping]            = useState(false);
  const [latestMsgId,       setLatestMsgId]       = useState(null);
  const [generatingComplete, setGeneratingComplete] = useState(false);

  const chatRef            = useRef(null);
  const inputRef           = useRef(null);
  const hasInit            = useRef(false);
  const submitAnswerRef    = useRef(null); // always-fresh ref for suggestion delegation
  const root = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || 'platform.mn';

  const INDUSTRY_SUGGESTIONS = locale === 'mn'
    ? ['Кафе, Ресторан', 'Зөвлөх үйлчилгээ', 'Дизайн студи', 'Жижиглэн худалдаа', 'Гоо сайхан', 'Боловсрол']
    : ['Cafe, Restaurant', 'Consulting', 'Design studio', 'Retail', 'Beauty & wellness', 'Education'];

  const questions = useMemo(() => [
    { ask: L('Бизнесийнхээ нэрийг хэлнэ үү?',               'What\'s the name of your business?'),             field: 'businessName', hint: L('Жишээ: "Nomad Coffee"',        'e.g. "Nomad Coffee"') },
    { ask: L('Ямар салбарт ажилладаг вэ?',                   'What industry are you in?'),                       field: 'industry',     hint: L('Жишээ: "Кафе, Ресторан"',    'e.g. "Cafe, Restaurant"'), suggestions: INDUSTRY_SUGGESTIONS },
    { ask: L('Бизнесийнхээ тухай товчхон тайлбарлана уу?',   'Give a short description of your business.'),     field: 'description',  hint: L('2-3 өгүүлбэр',                '2-3 sentences') },
    { ask: L('Ямар үйлчилгээ / бүтээгдэхүүн санал болгодог вэ?', 'What services or products do you offer?'),   field: 'services',     hint: L('Таслалаар тусгаарлана уу',    'Separate with commas') },
    { ask: L('Холбоо барих и-мэйл хаяг?',                    'Contact email address?'),                         field: 'contactEmail', hint: L('Заавал биш', 'Optional'), optional: true },
    { ask: L('Утасны дугаар?',                               'Phone number?'),                                   field: 'contactPhone', hint: L('Заавал биш', 'Optional'), optional: true },
    { ask: L('Хаяг / байршил?',                              'Address / location?'),                             field: 'address',      hint: L('Заавал биш', 'Optional'), optional: true },
  ], [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  function addAiMsg(msg, delay = 420) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const id = Date.now();
      setLatestMsgId(id);
      setMessages((prev) => [...prev, { ...msg, id }]);
    }, delay);
  }

  // Init
  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;

    const greeting = initialPrompt
      ? L(`Таны оруулсан мэдээлэл: "${decodeURIComponent(initialPrompt)}". Дэлгэрэнгүй мэдээлэл цуглуулъя!`, `Got it: "${decodeURIComponent(initialPrompt)}". Let me gather a few more details!`)
      : L('Сайн байна уу! Би таны AI вэбсайт туслах. Бизнесийнхээ тухай хэлээрэй — загвар, дизайн, контент бүгдийг бэлдэнэ.', 'Hi there! I\'m your AI website assistant. Tell me about your business — I\'ll handle templates, design, and content.');

    const id0 = Date.now();
    setLatestMsgId(id0);
    setMessages([{ role: 'ai', text: greeting, id: id0 }]);

    if (initialPrompt) setBusiness((b) => ({ ...b, description: decodeURIComponent(initialPrompt) }));

    addAiMsg({ role: 'ai', text: questions[0].ask, hint: questions[0].hint, suggestions: questions[0].suggestions }, 700);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ResizeObserver — auto-scroll on streaming text growth
  useEffect(() => {
    const inner = chatRef.current?.firstElementChild;
    if (!inner) return;
    const obs = new ResizeObserver(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    });
    obs.observe(inner);
    return () => obs.disconnect();
  }, []);

  // Also scroll when messages list changes (new message added / typing indicator)
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    if (phase === PHASE_CHAT && !typing && inputRef.current) inputRef.current.focus();
  }, [messages, typing, phase]);

  // Suggestion chip clicks — stale-closure-safe via ref
  submitAnswerRef.current = (rawText) => submitAnswer(rawText);

  useEffect(() => {
    const handler = (e) => {
      const btn = e.target.closest('[data-suggestion]');
      if (btn) submitAnswerRef.current(btn.dataset.suggestion);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []); // no chatStep dependency — ref is always current

  function submitAnswer(rawText) {
    const text   = (rawText ?? '').trim();
    const isSkip = !text && questions[chatStep]?.optional;

    if (!text && !questions[chatStep]?.optional) return;

    const uid = Date.now();
    if (isSkip) {
      // Render a muted "Алгасав" badge instead of "(хоосон)"
      setMessages((prev) => [...prev, { role: 'user', text: L('Алгасав', 'Skipped'), id: uid, noStream: true, isSkip: true }]);
    } else {
      setMessages((prev) => [...prev, { role: 'user', text, id: uid, noStream: true }]);
    }
    setLatestMsgId(uid);
    setInput('');

    if (chatStep >= questions.length) return;
    const field = questions[chatStep].field;
    setBusiness((b) => ({ ...b, [field]: text }));

    if (field === 'businessName' && text) {
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 30);
      setSubdomain(slug || 'my-site');
    }

    const nextStep = chatStep + 1;
    setChatStep(nextStep);

    if (nextStep < questions.length) {
      addAiMsg({ role: 'ai', text: questions[nextStep].ask, hint: questions[nextStep].hint, suggestions: questions[nextStep].suggestions });
    } else {
      addAiMsg({ role: 'ai', text: L('Маш сайн! Одоо загвар сонгоорой. Таны бизнест тохирох загварыг санал болгож байна.', 'Great! Now let\'s pick a template. I\'m suggesting options that match your business.') }, 600);
      setTimeout(() => setPhase(PHASE_TEMPLATE), 650);
    }
  }

  function handleSend(e) {
    e.preventDefault();
    submitAnswer(input);
  }

  function selectTemplate(id) {
    setTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    const uid = Date.now();
    setMessages((prev) => [...prev, { role: 'user', text: `${L('Загвар:', 'Template:')} ${tpl?.name?.[locale] ?? id}`, id: uid, noStream: true }]);
    setLatestMsgId(uid);
    addAiMsg({ role: 'ai', text: L('Гоё сонголт! Одоо сайтынхаа өнгө аясыг сонгоорой.', 'Nice choice! Now let\'s pick the tone for your site.') });
    setTimeout(() => setPhase(PHASE_TONE), 500);
  }

  function selectTone(t) {
    setTone(t);
    const uid = Date.now();
    setMessages((prev) => [...prev, { role: 'user', text: `${L('Өнгө аяс:', 'Tone:')} ${dict.tones[t]}`, id: uid, noStream: true }]);
    setLatestMsgId(uid);
    addAiMsg({ role: 'ai', text: L('Бүх мэдээлэл бэлэн боллоо! Доорх хураангуйг шалгаад "Сайт үүсгэх" товчийг дарна уу.', 'All set! Review the summary and hit "Generate site" when ready.') });
    setTimeout(() => setPhase(PHASE_REVIEW), 500);
  }

  async function submit() {
    setLoading(true);
    setError(null);
    setGeneratingComplete(false);
    setPhase(PHASE_GENERATING);

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId, tone, defaultLocale: locale, subdomain,
          business: {
            ...business,
            services: business.services.split(',').map((s) => s.trim()).filter(Boolean),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(formatSiteValidationError(data, locale));

      // Complete the ring to 100% before showing success screen
      setGeneratingComplete(true);
      await new Promise((r) => setTimeout(r, 350));

      setPhase(PHASE_SUCCESS);
      setTimeout(() => router.push(`/${locale}/dashboard/sites/${data.site.id}`), 2200);
    } catch (e) {
      setError(e.message);
      setLoading(false);
      setGeneratingComplete(false);
      setPhase(PHASE_REVIEW);
    }
  }

  const chatMaxH = phase === PHASE_CHAT ? '55vh' : '32vh';

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:py-12 grid lg:grid-cols-12 gap-8">

      {/* ── Sidebar ── */}
      <aside className="lg:col-span-4 xl:col-span-3">
        <div className="sticky top-24">
          <div className="flex items-center gap-3 mb-7">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-lg shadow-[var(--accent-soft)] shine">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight">{L('AI Бүтээгч', 'AI Builder')}</h1>
              <p className="text-xs text-[var(--text-tertiary)]">{L('Вэбсайт туслах', 'Website assistant')}</p>
            </div>
          </div>

          <SidebarProgress phase={phase} locale={locale} />

          {business.businessName && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-7 p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-sm"
            >
              <div className="eyebrow text-[var(--text-muted)] mb-3">{L('Хураангуй', 'Summary')}</div>
              <dl className="space-y-2">
                {[
                  [L('Нэр', 'Name'),     business.businessName, false],
                  [L('Салбар', 'Industry'), business.industry,  false],
                  subdomain ? [L('Домэйн', 'Domain'), `${subdomain}.${root}`, true] : null,
                ].filter(Boolean).map(([label, value, mono]) => (
                  <div key={label} className="flex justify-between gap-3">
                    <dt className="text-[var(--text-muted)]">{label}</dt>
                    <dd className={`text-[var(--text-primary)] text-right truncate ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <section className="lg:col-span-8 xl:col-span-9 relative">

        {/* Chat panel */}
        <div
          ref={chatRef}
          className="rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-secondary)] overflow-y-auto transition-all duration-500"
          style={{ maxHeight: chatMaxH }}
        >
          <div className="p-5 space-y-4">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                msg={msg}
                isLatest={msg.id === latestMsgId}
                locale={locale}
              />
            ))}
            <AnimatePresence>
              {typing && <TypingIndicator key="typing" />}
            </AnimatePresence>
          </div>
        </div>

        {/* Chat input */}
        <AnimatePresence>
          {phase === PHASE_CHAT && (
            <motion.form
              key="chat-input"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              onSubmit={handleSend}
              className="mt-4 flex items-center gap-3"
            >
              <div className="flex-1 relative group">
                <div className="absolute -inset-[1.5px] bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)] rounded-xl opacity-0 group-focus-within:opacity-40 transition-opacity blur-[4px]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={L('Энд бичнэ үү...', 'Type here...')}
                  className="field relative"
                  disabled={typing}
                  autoFocus
                />
              </div>
              {questions[chatStep]?.optional && (
                <button
                  type="button"
                  onClick={() => submitAnswer('')}
                  disabled={typing}
                  className="btn btn-ghost btn-md text-xs disabled:opacity-40"
                >
                  {L('Алгасах', 'Skip')}
                </button>
              )}
              <motion.button
                type="submit"
                disabled={typing || (!input.trim() && !questions[chatStep]?.optional)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary btn-md disabled:opacity-40"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Template selection */}
        <AnimatePresence mode="wait">
          {phase === PHASE_TEMPLATE && (
            <TemplateGrid
              key="templates"
              templates={templates}
              templateId={templateId}
              locale={locale}
              onSelect={selectTemplate}
              onBack={() => setPhase(PHASE_CHAT)}
            />
          )}
        </AnimatePresence>

        {/* Tone selection */}
        <AnimatePresence mode="wait">
          {phase === PHASE_TONE && (
            <motion.div
              key="tone"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-6"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <BackButton onClick={() => setPhase(PHASE_TEMPLATE)} locale={locale} />
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {L('Өнгө аяс сонгоорой', 'Choose a style')}
                </h3>
                <span />
              </div>
              <TonePicker value={tone} onChange={selectTone} locale={locale} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review */}
        <AnimatePresence mode="wait">
          {phase === PHASE_REVIEW && (
            <ReviewPanel
              key="review"
              business={business}
              subdomain={subdomain}
              tone={tone}
              templateId={templateId}
              templates={templates}
              locale={locale}
              root={root}
              loading={loading}
              error={error}
              onBack={() => setPhase(PHASE_TONE)}
              onSubmit={submit}
              onSubdomainChange={setSubdomain}
            />
          )}
        </AnimatePresence>

        {/* Generating / Success overlays */}
        <AnimatePresence>
          {phase === PHASE_GENERATING && (
            <GeneratingOverlay key="generating" locale={locale} complete={generatingComplete} />
          )}
          {phase === PHASE_SUCCESS && (
            <SuccessOverlay key="success" locale={locale} siteName={business.businessName} />
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
