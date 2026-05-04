'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import HeroPlaceholder from '@/components/ui/HeroPlaceholder.jsx';

/* ─── Constants ──────────────────────────────────────────────────────────── */

const HERO_EXAMPLES = {
  mn: ['кофе шоп', 'хувцасны дэлгүүр', 'ресторан', 'гоо сайхны салон', 'барилгын компани', 'хуульч фирм'],
  en: ['coffee shop', 'clothing store', 'restaurant', 'beauty salon', 'construction firm', 'law firm'],
};

const QUICK_CHIPS = {
  mn: ['Ресторан', 'Салон', 'Онлайн дэлгүүр', 'Зочид буудал'],
  en: ['Restaurant', 'Salon', 'Online store', 'Hotel'],
};

// Enriched with color2 + sections for gradient mini-preview in EmptyState
const TEMPLATE_STARTERS = [
  {
    color:  '#f59e0b', color2: '#ef4444',
    sections: ['Hero', 'Меню', 'Хүргэлт'],
    mn: { title: 'Ресторан',  prompt: 'Монгол хоолны ресторан, халуун хоол гэрт хүргэж өгдөг' },
    en: { title: 'Restaurant', prompt: 'Mongolian food restaurant with home delivery service' },
  },
  {
    color:  '#7c5cff', color2: '#c084fc',
    sections: ['About', 'Work', 'Contact'],
    mn: { title: 'Портфолио', prompt: 'Чөлөөт дизайнер, брэнд айдентити, логотип' },
    en: { title: 'Portfolio',  prompt: 'Freelance designer specializing in brand identity and logos' },
  },
  {
    color:  '#10b981', color2: '#06b6d4',
    sections: ['Shop', 'Featured', 'Cart'],
    mn: { title: 'Дэлгүүр', prompt: 'Монгол гар урлалын бүтээгдэхүүн онлайн дэлгүүр' },
    en: { title: 'Shop',    prompt: 'Mongolian handcraft products online store' },
  },
];

const STATUS_FILTERS = [
  { key: 'all',       mn: 'Бүгд',          en: 'All' },
  { key: 'published', mn: 'Нийтлэгдсэн',   en: 'Published' },
  { key: 'draft',     mn: 'Ноорог',         en: 'Draft' },
];

const SORT_OPTIONS = [
  { key: 'updated', mn: 'Сүүлд засварласан', en: 'Last updated' },
  { key: 'created', mn: 'Шинэ эхлэл',        en: 'Newest first' },
  { key: 'name',    mn: 'Нэрээр A–Z',        en: 'Name A–Z' },
  { key: 'status',  mn: 'Статусаар',          en: 'By status' },
];

const STAT_META = {
  total:     { icon: 'layers', color: '#7c5cff', bg: 'rgba(124,92,255,0.12)' },
  published: { icon: 'globe',  color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  drafts:    { icon: 'edit',   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  thisMonth: { icon: 'zap',    color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
};

const TEMPLATE_LABELS = {
  artisan:      { color: '#f59e0b', label: 'Artisan' },
  creative:     { color: '#ec4899', label: 'Creative' },
  fitness:      { color: '#10b981', label: 'Fitness' },
  wellness:     { color: '#06b6d4', label: 'Wellness' },
  proservice:   { color: '#7c5cff', label: 'Pro Service' },
  education:    { color: '#3b82f6', label: 'Education' },
  legal:        { color: '#6366f1', label: 'Legal' },
  music_school: { color: '#ec4899', label: 'Music' },
  pet_shop:     { color: '#f97316', label: 'Pet Shop' },
};

const RECENT_PROMPTS_KEY = 'aiweb_recent_prompts';
const MAX_RECENT_PROMPTS = 3;
const BANNER_DISMISS_KEY  = 'aiweb_banner_dismissed';
const RECENT_SITE_DAYS    = 7;

/* ─── Utilities ──────────────────────────────────────────────────────────── */

function siteGradient(name = '') {
  const palettes = [
    ['#7c5cff', '#c084fc'],
    ['#ec4899', '#8b5cf6'],
    ['#10b981', '#06b6d4'],
    ['#f59e0b', '#ef4444'],
    ['#3b82f6', '#6366f1'],
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

function loadRecentPrompts() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_PROMPTS_KEY) || '[]').slice(0, MAX_RECENT_PROMPTS);
  } catch { return []; }
}

function saveRecentPrompt(prompt) {
  try {
    const prev = loadRecentPrompts();
    const next = [prompt, ...prev.filter((p) => p !== prompt)].slice(0, MAX_RECENT_PROMPTS);
    localStorage.setItem(RECENT_PROMPTS_KEY, JSON.stringify(next));
  } catch { /* storage unavailable */ }
}

/* ─── Hooks ──────────────────────────────────────────────────────────────── */

// Ease-out cubic counter, triggers on mount
function useCounter(target, duration = 950) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

// Returns true after a brief delay — used to swap skeleton → real content
function useMounted(delay = 100) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(id);
  }, [delay]);
  return mounted;
}

/* ─── Icon ───────────────────────────────────────────────────────────────── */

function Icon({ name, size = 16, ...props }) {
  const s = size;
  const base = {
    width: s, height: s, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round',
  };
  const paths = {
    layers:  <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    globe:   <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    edit:    <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    zap:     <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    plus:    <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    credit:  <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
    home:    <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    upload:  <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></>,
    search:  <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    copy:    <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    check:   <><polyline points="20 6 9 17 4 12"/></>,
    arrow:   <><polyline points="9 18 15 12 9 6"/></>,
    dots:    <><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></>,
    ext:     <><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
    sparkle: <><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></>,
    image:   <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    clock:   <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    x:       <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    sort:    <><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="18" x2="12" y2="18" strokeWidth={3}/></>,
  };
  return <svg {...base} {...props}>{paths[name]}</svg>;
}

/* ─── TrendBadge ─────────────────────────────────────────────────────────── */

function TrendBadge({ delta, locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  if (delta === null || delta === undefined) return null;
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-[var(--text-muted)]">
        = {L('өмнөх сартай адил', 'same as last month')}
      </span>
    );
  }
  const up = delta > 0;
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10px] font-semibold"
      style={{ color: up ? 'var(--success)' : 'var(--warn)' }}
    >
      <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" aria-hidden>
        {up ? <path d="M5 1L9 7H1L5 1Z" /> : <path d="M5 9L1 3H9L5 9Z" />}
      </svg>
      {up ? '+' : ''}{delta} {L('өмнөх сараас', 'vs last month')}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   Stats row
═══════════════════════════════════════════════════ */

function StatCard({ statKey, label, value, trend, locale, delay }) {
  const animated = useCounter(value, 900);
  const meta = STAT_META[statKey];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--surface-border-strong)] hover:bg-[var(--surface-raised)] hover:-translate-y-0.5 transition-all duration-200 p-5"
    >
      <div className="h-9 w-9 rounded-lg grid place-items-center" style={{ background: meta.bg }}>
        <Icon name={meta.icon} size={16} stroke={meta.color} strokeWidth={2} />
      </div>
      <div className="mt-3 font-display text-3xl font-bold tabular tracking-tight" style={{ color: meta.color }}>
        {animated}
      </div>
      <div className="mt-1 text-xs text-[var(--text-muted)]">{label}</div>
      {trend !== undefined && (
        <div className="mt-1.5">
          <TrendBadge delta={trend} locale={locale} />
        </div>
      )}
    </motion.div>
  );
}

function StatsRow({ stats, locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const monthDelta = useMemo(() => {
    const { thisMonth, lastMonthNew } = stats;
    if (lastMonthNew === undefined) return undefined;
    return thisMonth - lastMonthNew;
  }, [stats]);

  const cards = [
    { key: 'total',     label: L('Нийт сайт', 'Total sites'), value: stats.total },
    { key: 'published', label: L('Нийтлэгдсэн', 'Published'), value: stats.published },
    { key: 'drafts',    label: L('Ноорог', 'Drafts'),          value: stats.drafts },
    { key: 'thisMonth', label: L('Энэ сар', 'This month'),     value: stats.thisMonth, trend: monthDelta },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map(({ key, label, value, trend }, i) => (
        <StatCard key={key} statKey={key} label={label} value={value} trend={trend} locale={locale} delay={i * 0.06} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Hero AI Card — with localStorage recent prompts
═══════════════════════════════════════════════════ */

function HeroAiCard({ locale, userName }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [phIdx, setPhIdx] = useState(0);
  const [phVisible, setPhVisible] = useState(true);
  const [recentPrompts, setRecentPrompts] = useState([]);
  const examples = HERO_EXAMPLES[locale] ?? HERO_EXAMPLES.mn;
  const chips = QUICK_CHIPS[locale] ?? QUICK_CHIPS.mn;

  // Load recent prompts from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setRecentPrompts(loadRecentPrompts());
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setPhVisible(false);
      setTimeout(() => {
        setPhIdx((i) => (i + 1) % examples.length);
        setPhVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(id);
  }, [examples.length]);

  function go(text) {
    const p = (text ?? prompt).trim();
    if (p) saveRecentPrompt(p);
    if (!p) {
      router.push(`/${locale}/dashboard/sites/new`);
    } else {
      router.push(`/${locale}/dashboard/sites/new?prompt=${encodeURIComponent(p)}`);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-tertiary)] to-[#1a102e]">
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-50" />
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--gradient-start)] opacity-[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-12 h-36 w-36 rounded-full bg-[var(--gradient-mid)] opacity-[0.06] blur-3xl" />

      <div className="relative px-7 py-8 md:py-10">
        <div className="flex items-start gap-3 mb-6">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-lg shadow-[var(--accent-soft)]">
            <Icon name="layers" size={20} stroke="white" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight">
              {L('Сайн байна уу, ', 'Hey, ')}
              <span className="text-[var(--accent-light)]">{userName}</span>!
            </h2>
            <p className="mt-0.5 text-[var(--text-secondary)] text-sm">
              {L('Ямар бизнесийн вэбсайт хийх вэ?', 'What kind of website would you like to build?')}
            </p>
          </div>
        </div>

        {/* Input row */}
        <div className="flex gap-3 items-stretch">
          <div className="relative flex-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && go()}
              className="w-full h-12 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]/60 focus:bg-white/[0.08] transition-colors"
              aria-label={L('Бизнесийн тайлбар', 'Business description')}
            />
            {!prompt && (
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: phVisible ? 1 : 0, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="block"
                  >
                    {L('Жишээ: ', 'e.g. ')}
                    <span className="text-[var(--text-tertiary)]">{examples[phIdx]}</span>
                  </motion.span>
                </AnimatePresence>
              </div>
            )}
          </div>
          <motion.button
            type="button"
            onClick={() => go()}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 flex items-center gap-2 px-5 h-12 rounded-xl bg-[var(--accent)] text-white text-sm font-semibold shadow-lg shadow-[var(--accent-soft)] hover:bg-[var(--accent-light)] transition-colors"
          >
            <Icon name="sparkle" size={15} stroke="white" strokeWidth={1.5} />
            {L('Бүтээх', 'Build')}
          </motion.button>
        </div>

        {/* Recent prompts from localStorage */}
        {recentPrompts.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider shrink-0">
              {L('Сүүлийн:', 'Recent:')}
            </span>
            {recentPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => { setPrompt(p); go(p); }}
                className="px-3 py-1.5 rounded-full text-xs border border-[var(--accent)]/20 bg-[var(--accent-soft)] text-[var(--accent-light)] hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)] transition-all truncate max-w-[180px]"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Default quick chips */}
        <div className="mt-2 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setPrompt(c); go(c); }}
              className="px-3 py-1.5 rounded-full text-xs border border-white/[0.1] bg-white/[0.04] text-[var(--text-secondary)] hover:bg-[var(--accent-soft)] hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)] transition-all"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Quick action pills
═══════════════════════════════════════════════════ */

function QuickActions({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const actions = [
    { href: `/${locale}/dashboard/sites/new`, icon: 'plus',   label: L('Шинэ сайт', 'New site'),  accent: true },
    { href: `/${locale}/dashboard/billing`,   icon: 'credit', label: L('Төлбөр', 'Billing'),       accent: false },
    { href: `/${locale}`,                     icon: 'home',   label: L('Нүүр хуудас', 'Homepage'), accent: false },
    { href: '#',                               icon: 'upload', label: L('Импортлох', 'Import'),      accent: false, disabled: true },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(({ href, icon, label, accent, disabled }) => (
        <Link
          key={label}
          href={href}
          aria-disabled={disabled}
          className={[
            'flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
            disabled
              ? 'opacity-40 pointer-events-none border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)]'
              : accent
                ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-md shadow-[var(--accent-soft)] hover:bg-[var(--accent-light)] hover:border-[var(--accent-light)]'
                : 'bg-[var(--surface)] border-[var(--surface-border)] text-[var(--text-secondary)] hover:bg-[var(--surface-raised)] hover:border-[var(--surface-border-strong)] hover:text-[var(--text-primary)]',
          ].join(' ')}
        >
          <Icon name={icon} size={13} strokeWidth={2} />
          {label}
          {disabled && <span className="text-[9px] uppercase tracking-wider opacity-60">{L('Удахгүй', 'Soon')}</span>}
        </Link>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   "Сүүлд засварласан" banner
   Shows when the most recently updated site is within RECENT_SITE_DAYS days.
   Dismissed per session (sessionStorage) so it reappears on fresh visits.
═══════════════════════════════════════════════════ */

function RecentBanner({ sites, locale, root }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [visible, setVisible] = useState(false);

  const recentSite = sites[0]; // server sends sites sorted by updatedAt desc

  useEffect(() => {
    if (!recentSite) return;
    const age = Date.now() - new Date(recentSite.updatedAt).getTime();
    if (age > RECENT_SITE_DAYS * 86_400_000) return;
    try {
      if (sessionStorage.getItem(BANNER_DISMISS_KEY) === recentSite.id) return;
    } catch { /* storage blocked */ }
    setVisible(true);
  }, [recentSite]);

  function dismiss() {
    setVisible(false);
    try { sessionStorage.setItem(BANNER_DISMISS_KEY, recentSite.id); } catch { /* ok */ }
  }

  if (!visible || !recentSite) return null;

  const displayDomain = recentSite.customDomain && recentSite.customDomainVerified
    ? recentSite.customDomain
    : `${recentSite.subdomain}.${root}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--accent)]/20 bg-[var(--accent-soft)] text-sm"
      >
        <span className="shrink-0 h-7 w-7 rounded-lg bg-[var(--accent)]/15 grid place-items-center">
          <Icon name="clock" size={14} stroke="var(--accent-light)" strokeWidth={2} />
        </span>
        <span className="flex-1 text-[var(--text-secondary)]">
          {L('Сүүлд засварласан:', 'Last edited:')}
          {' '}
          <span className="font-semibold text-[var(--text-primary)]">{recentSite.name}</span>
          {' · '}
          <span className="font-mono text-[11px] text-[var(--text-tertiary)]">{displayDomain}</span>
        </span>
        <Link
          href={`/${locale}/dashboard/sites/${recentSite.id}`}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-light)] transition-colors"
        >
          {L('Үргэлжлүүлэх', 'Continue')}
          <Icon name="arrow" size={11} stroke="white" strokeWidth={2.5} />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label={L('Хаах', 'Dismiss')}
          className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <Icon name="x" size={14} strokeWidth={2} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════
   Site card
═══════════════════════════════════════════════════ */

function StatusBadge({ status, locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const cfg = {
    published: { bg: 'rgba(16,185,129,0.15)', color: 'var(--success)', label: L('Нийтлэгдсэн', 'Live') },
    draft:     { bg: 'rgba(245,158,11,0.15)',  color: 'var(--warn)',    label: L('Ноорог', 'Draft') },
    archived:  { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-tertiary)', label: L('Архивласан', 'Archived') },
  }[status] ?? { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-tertiary)', label: status };

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider shrink-0"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function TemplateBadge({ templateId }) {
  const meta = TEMPLATE_LABELS[templateId];
  if (!meta) return null;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wide"
      style={{ background: `${meta.color}18`, color: meta.color }}
    >
      {meta.label}
    </span>
  );
}

function SiteCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden">
      <div className="h-36 animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />
      <div className="p-4 space-y-2.5">
        <div className="flex justify-between items-center gap-2">
          <div className="h-4 w-28 rounded animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />
          <div className="h-4 w-14 rounded-full animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />
        </div>
        <div className="h-3 w-36 rounded animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />
        <div className="flex gap-2">
          <div className="h-3 w-16 rounded animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />
          <div className="h-3 w-20 rounded animate-pulse" style={{ background: 'var(--bg-tertiary)' }} />
        </div>
      </div>
    </div>
  );
}

function SiteCard({ site, locale, root }) {
  const [copied, setCopied] = useState(false);
  const [genImg, setGenImg]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef(null);
  const router  = useRouter();
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springCfg = { stiffness: 220, damping: 22 };
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [8, -8]),  springCfg);
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-8, 8]), springCfg);
  const glowX   = useTransform(rawX, [-1, 1], [0, 100]);
  const glowY   = useTransform(rawY, [-1, 1], [0, 100]);
  const specular = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.07) 0%, transparent 55%)`
  );

  function handleMouseMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width  - 0.5) * 2);
    rawY.set(((e.clientY - r.top)  / r.height - 0.5) * 2);
  }
  function handleMouseLeave() { rawX.set(0); rawY.set(0); setHovered(false); }

  const displayDomain = site.customDomain && site.customDomainVerified
    ? site.customDomain
    : `${site.subdomain}.${root}`;
  const publicUrl = `https://${displayDomain}`;

  async function copyDomain(e) {
    e.preventDefault(); e.stopPropagation();
    await navigator.clipboard.writeText(displayDomain).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function triggerHeroGen() {
    if (genImg) return;
    setGenImg(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id, action: 'hero-image' }),
      });
      if (res.ok) router.refresh();
    } finally { setGenImg(false); }
  }

  const editHref = `/${locale}/dashboard/sites/${site.id}`;

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => { if (e.target.closest('a, button')) return; router.push(editHref); }}
      role="link"
      tabIndex={0}
      aria-label={site.name}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(editHref); }}
      animate={{ scale: hovered ? 1.025 : 1 }}
      transition={{ scale: { type: 'spring', stiffness: 280, damping: 24 } }}
      className="group relative rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden cursor-pointer will-change-transform"
    >
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        animate={{
          boxShadow: hovered
            ? `0 0 0 1px rgba(124,92,255,0.5), 0 8px 40px rgba(124,92,255,0.18), 0 2px 8px rgba(0,0,0,0.4)`
            : `0 0 0 1px transparent, 0 0 0 rgba(124,92,255,0), 0 2px 8px rgba(0,0,0,0.2)`,
        }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-300"
        style={{ background: specular, opacity: hovered ? 1 : 0 }}
      />

      {/* Thumbnail */}
      <div className="relative h-36 w-full overflow-hidden">
        <HeroPlaceholder
          name={site.name}
          heroUrl={site.heroImage}
          generating={genImg}
          onRequestGenerate={triggerHeroGen}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center gap-2.5"
          animate={{ opacity: hovered ? 1 : 0, backdropFilter: hovered ? 'blur(4px)' : 'blur(0px)' }}
          transition={{ duration: 0.2 }}
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 100%)' }}
        >
          <Link
            href={editHref}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <Icon name="edit" size={12} stroke="white" strokeWidth={2} />
            {L('Засах', 'Edit')}
          </Link>
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <Icon name="ext" size={12} stroke="white" strokeWidth={2} />
            {L('Харах', 'View')}
          </a>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); triggerHeroGen(); }}
            disabled={genImg}
            title={site.heroImage ? L('Зураг дахин үүсгэх', 'Regenerate image') : L('Зураг үүсгэх', 'Generate image')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm hover:bg-white/20 disabled:opacity-50 transition-colors"
          >
            {genImg ? (
              <span className="flex gap-0.5">
                <span className="typing-dot h-1 w-1 rounded-full bg-white" />
                <span className="typing-dot h-1 w-1 rounded-full bg-white" />
                <span className="typing-dot h-1 w-1 rounded-full bg-white" />
              </span>
            ) : (
              <Icon name="image" size={12} stroke="white" strokeWidth={2} />
            )}
          </button>
        </motion.div>
      </div>

      {/* Card body */}
      <div className="relative p-4" style={{ transform: 'translateZ(8px)' }}>
        <div className="flex items-start justify-between gap-2">
          <span className="font-semibold text-sm truncate">{site.name}</span>
          <StatusBadge status={site.status} locale={locale} />
        </div>

        <div className="mt-2 flex items-center gap-1.5">
          <span className="font-mono text-[11px] text-[var(--text-tertiary)] truncate flex-1">{displayDomain}</span>
          <button
            type="button"
            onClick={copyDomain}
            aria-label={L('Домэйн хуулах', 'Copy domain')}
            className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                  <Icon name="check" size={12} stroke="var(--success)" strokeWidth={2.5} />
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Icon name="copy" size={12} strokeWidth={2} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Template badge + updated date */}
        <div className="mt-2 flex items-center gap-2">
          <TemplateBadge templateId={site.templateId} />
          <span className="text-[11px] text-[var(--text-muted)] tabular">{site.updatedAtLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════
   Empty state — richer template preview cards
═══════════════════════════════════════════════════ */

function EmptyState({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden">
      <div className="relative px-8 py-14 md:py-20 text-center max-w-md mx-auto">
        <div className="mx-auto mb-8 w-24 h-24 relative">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-dashed border-[var(--surface-border-strong)]"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 rounded-full border border-dashed border-[var(--accent)]/20"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-xl bg-[var(--accent-soft)] grid place-items-center">
              <Icon name="sparkle" size={22} stroke="var(--accent-light)" strokeWidth={1.5} />
            </div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[var(--accent)]" />
          </motion.div>
        </div>

        <h2 className="font-display text-2xl font-bold tracking-tight">
          {L('Анхны вэбсайтаа бүтээе', 'Build your first website')}
        </h2>
        <p className="mt-3 text-[var(--text-secondary)] text-sm leading-relaxed">
          {L(
            'AI туслахтай ярилцаж, хэдхэн минутад бэлэн вэбсайт аваарай.',
            'Chat with the AI assistant and get a ready website in minutes.',
          )}
        </p>
        <Link href={`/${locale}/dashboard/sites/new`} className="btn btn-accent btn-lg mt-6 inline-flex">
          {L('AI-аар эхлэх', 'Start with AI')}
          <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* Template starter cards — with gradient mini-preview */}
      <div className="border-t border-[var(--surface-border)] px-6 py-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-4">
          {L('Загвараас эхлэх', 'Start from a template')}
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          {TEMPLATE_STARTERS.map((t) => {
            const data = t[locale] ?? t.mn;
            return (
              <button
                key={data.title}
                type="button"
                onClick={() => router.push(`/${locale}/dashboard/sites/new?prompt=${encodeURIComponent(data.prompt)}`)}
                className="rounded-xl border border-[var(--surface-border)] bg-[var(--bg-secondary)] hover:border-[var(--surface-border-strong)] hover:bg-[var(--bg-tertiary)] hover:-translate-y-0.5 transition-all text-left group overflow-hidden"
              >
                {/* Gradient preview header */}
                <div
                  className="relative w-full h-16 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${t.color}26, ${t.color2}18)` }}
                >
                  {/* Fake navbar */}
                  <div className="absolute top-2 left-3 right-3 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full" style={{ background: t.color, opacity: 0.8 }} />
                    <div className="h-1 rounded-full flex-1" style={{ background: `${t.color}40` }} />
                  </div>
                  {/* Fake section labels */}
                  <div className="absolute bottom-2 left-3 flex gap-1.5">
                    {t.sections.map((s) => (
                      <span
                        key={s}
                        className="text-[7px] font-mono px-1.5 py-0.5 rounded"
                        style={{ background: `${t.color}22`, color: t.color }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  {/* Glow dot top-right */}
                  <div
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full blur-md"
                    style={{ background: t.color, opacity: 0.25 }}
                  />
                </div>

                <div className="p-3">
                  <div className="text-sm font-semibold">{data.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5 group-hover:text-[var(--text-tertiary)] transition-colors">
                    {L('AI-аар үүсгэх →', 'Generate with AI →')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Sites section — search + filter + sort + skeleton + grid
═══════════════════════════════════════════════════ */

function SitesSection({ sites, locale, root }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sort, setSort]               = useState('updated');
  const mounted = useMounted(120);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return sites
      .filter((s) => {
        const matchStatus = statusFilter === 'all' || s.status === statusFilter;
        const matchSearch = !q || s.name.toLowerCase().includes(q) || s.subdomain.includes(q);
        return matchStatus && matchSearch;
      })
      .sort((a, b) => {
        if (sort === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
        if (sort === 'created') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sort === 'name')    return a.name.localeCompare(b.name);
        if (sort === 'status')  return a.status.localeCompare(b.status);
        return 0;
      });
  }, [sites, search, statusFilter, sort]);

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
  };
  const containerVariants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.055 } },
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {L('Таны сайтууд', 'Your sites')}
        </h3>
        {sites.length > 0 && (
          <span className="text-xs text-[var(--text-muted)] tabular">
            {filtered.length !== sites.length
              ? `${filtered.length} / ${sites.length}`
              : `${sites.length} ${L('сайт', 'sites')}`}
          </span>
        )}
      </div>

      {sites.length === 0 ? (
        <EmptyState locale={locale} />
      ) : (
        <>
          {/* Search + filter + sort */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1 min-w-[160px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <Icon name="search" size={14} strokeWidth={2} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={L('Хайх...', 'Search...')}
                className="w-full h-9 bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl pl-8 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]/50 transition-colors"
              />
            </div>

            {/* Status filter tabs */}
            <div className="flex items-center gap-1 bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl p-1">
              {STATUS_FILTERS.map((f) => {
                const active = statusFilter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setStatusFilter(f.key)}
                    className={[
                      'px-3 py-1 rounded-lg text-xs font-medium transition-all',
                      active
                        ? 'bg-[var(--accent)] text-white shadow-sm'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
                    ].join(' ')}
                  >
                    {f[locale] ?? f.mn}
                  </button>
                );
              })}
            </div>

            {/* Sort select */}
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-[var(--text-muted)] pointer-events-none">
                <Icon name="sort" size={13} strokeWidth={2} />
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-9 pl-7 pr-7 bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)]/50 transition-colors appearance-none cursor-pointer hover:border-[var(--surface-border-strong)] hover:text-[var(--text-primary)]"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>{o[locale] ?? o.en}</option>
                ))}
              </select>
              <span className="absolute right-2.5 text-[var(--text-muted)] pointer-events-none">
                <Icon name="arrow" size={11} strokeWidth={2.5} style={{ transform: 'rotate(90deg)' }} />
              </span>
            </div>
          </div>

          {/* Grid — skeleton until mounted */}
          {!mounted ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: Math.min(sites.length, 6) }).map((_, i) => (
                <SiteCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {filtered.length === 0 ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center text-sm text-[var(--text-muted)]"
                >
                  {L('Тохирох сайт олдсонгүй', 'No sites match your search')}
                </motion.div>
              ) : (
                <motion.div
                  key={`grid-${statusFilter}-${search}-${sort}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {filtered.map((s) => (
                    <motion.div key={s.id} variants={cardVariants}>
                      <SiteCard site={s} locale={locale} root={root} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Root export
═══════════════════════════════════════════════════ */

export default function DashboardClient({ locale, userName, sites, stats, root }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12 space-y-8">
      <HeroAiCard locale={locale} userName={userName} />
      <StatsRow stats={stats} locale={locale} />
      <QuickActions locale={locale} />
      {sites.length > 0 && <RecentBanner sites={sites} locale={locale} root={root} />}
      <SitesSection sites={sites} locale={locale} root={root} />
    </div>
  );
}
