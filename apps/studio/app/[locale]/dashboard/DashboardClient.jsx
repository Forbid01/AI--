'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Rotating placeholder examples ─── */
const HERO_EXAMPLES = {
  mn: ['кофе шоп', 'хувцасны дэлгүүр', 'ресторан', 'гоо сайхны салон', 'барилгын компани', 'хуульч фирм'],
  en: ['coffee shop', 'clothing store', 'restaurant', 'beauty salon', 'construction firm', 'law firm'],
};
const QUICK_CHIPS = {
  mn: ['Ресторан', 'Салон', 'Онлайн дэлгүүр', 'Зочид буудал'],
  en: ['Restaurant', 'Salon', 'Online store', 'Hotel'],
};
const TEMPLATE_STARTERS = [
  {
    icon: '🍜',
    mn: { title: 'Ресторан', prompt: 'Монгол хоолны ресторан, халуун хоол гэрт хүргэж өгдөг' },
    en: { title: 'Restaurant', prompt: 'Mongolian food restaurant with home delivery service' },
    color: '#f59e0b',
  },
  {
    icon: '💼',
    mn: { title: 'Портфолио', prompt: 'Чөлөөт дизайнер, брэнд айдентити, логотип' },
    en: { title: 'Portfolio', prompt: 'Freelance designer specializing in brand identity and logos' },
    color: '#7c5cff',
  },
  {
    icon: '🛍️',
    mn: { title: 'Дэлгүүр', prompt: 'Монгол гар урлалын бүтээгдэхүүн онлайн дэлгүүр' },
    en: { title: 'Shop', prompt: 'Mongolian handcraft products online store' },
    color: '#10b981',
  },
];

const STATUS_FILTERS = [
  { key: 'all', mn: 'Бүгд', en: 'All' },
  { key: 'published', mn: 'Нийтлэгдсэн', en: 'Published' },
  { key: 'draft', mn: 'Ноорог', en: 'Draft' },
];

const STAT_META = {
  total:     { icon: 'layers',  color: '#7c5cff', bg: 'rgba(124,92,255,0.12)' },
  published: { icon: 'globe',   color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  drafts:    { icon: 'edit',    color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  thisMonth: { icon: 'zap',     color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
};

/* ─── gradient by site name hash ─── */
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

/* ─── icon components ─── */
function Icon({ name, size = 16, ...props }) {
  const s = size;
  const base = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' };
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
    cmd:     <><path d="M18 3a3 3 0 00-3 3v12a3 3 0 003 3 3 3 0 003-3 3 3 0 00-3-3H6a3 3 0 00-3 3 3 3 0 003 3 3 3 0 003-3V6a3 3 0 00-3-3 3 3 0 00-3 3 3 3 0 003 3h12a3 3 0 003-3 3 3 0 00-3-3z"/></>,
    sparkle: <><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></>,
  };
  return <svg {...base} {...props}>{paths[name]}</svg>;
}

/* ═══════════════════════════════════════════════════
   Hero AI Card — client-side input + chips
═══════════════════════════════════════════════════ */
function HeroAiCard({ locale, userName }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [phIdx, setPhIdx] = useState(0);
  const [phVisible, setPhVisible] = useState(true);
  const examples = HERO_EXAMPLES[locale] ?? HERO_EXAMPLES.mn;
  const chips = QUICK_CHIPS[locale] ?? QUICK_CHIPS.mn;

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
    if (!p) {
      router.push(`/${locale}/dashboard/sites/new`);
    } else {
      router.push(`/${locale}/dashboard/sites/new?prompt=${encodeURIComponent(p)}`);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--surface-border)] bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-tertiary)] to-[#1a102e]">
      {/* Grid pattern */}
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-50" />
      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[var(--gradient-start)] opacity-[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 left-12 h-36 w-36 rounded-full bg-[var(--gradient-mid)] opacity-[0.06] blur-3xl" />

      <div className="relative px-7 py-8 md:py-10">
        {/* Top row */}
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
              className="w-full h-12 bg-white/[0.06] border border-white/[0.1] rounded-xl px-4 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)]/60 focus:bg-white/[0.08] transition-colors"
              aria-label={L('Бизнесийн тайлбар', 'Business description')}
            />
            {/* Animated placeholder text when input is empty */}
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
                    {L('Жишээ: ', 'e.g. ')}<span className="text-[var(--text-tertiary)]">{examples[phIdx]}</span>
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

        {/* Quick chips */}
        <div className="mt-3 flex flex-wrap gap-2">
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
   Stats row — 4 glassmorphism cards
═══════════════════════════════════════════════════ */
function StatsRow({ stats, locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const cards = [
    { key: 'total',     label: L('Нийт сайт', 'Total sites'),     value: stats.total },
    { key: 'published', label: L('Нийтлэгдсэн', 'Published'),     value: stats.published },
    { key: 'drafts',    label: L('Ноорог', 'Drafts'),              value: stats.drafts },
    { key: 'thisMonth', label: L('Энэ сар', 'This month'),         value: stats.thisMonth },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {cards.map(({ key, label, value }, i) => {
        const meta = STAT_META[key];
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="group relative overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--surface-border-strong)] hover:bg-[var(--surface-raised)] hover:-translate-y-0.5 transition-all duration-200 p-5"
          >
            <div className="flex items-start justify-between">
              <div className="h-9 w-9 rounded-lg grid place-items-center" style={{ background: meta.bg }}>
                <Icon name={meta.icon} size={16} stroke={meta.color} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-medium tabular" style={{ color: meta.color }}>
                {value > 0 ? `+${value}` : '—'}
              </span>
            </div>
            <div className="mt-3 font-display text-3xl font-bold tabular tracking-tight" style={{ color: meta.color }}>
              {value}
            </div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">{label}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Quick action pills
═══════════════════════════════════════════════════ */
function QuickActions({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const actions = [
    { href: `/${locale}/dashboard/sites/new`, icon: 'plus',   label: L('Шинэ сайт', 'New site'),       accent: true },
    { href: `/${locale}/dashboard/billing`,  icon: 'credit', label: L('Төлбөр', 'Billing'),           accent: false },
    { href: `/${locale}`,                    icon: 'home',   label: L('Нүүр хуудас', 'Homepage'),      accent: false },
    { href: '#',                              icon: 'upload', label: L('Импортлох', 'Import'),           accent: false, disabled: true },
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

      {/* Command-K hint */}
      <div className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--text-muted)] text-[10px] font-mono select-none cursor-default">
        <Icon name="cmd" size={11} />
        <span>K</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Site card (grid item)
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
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function SiteCard({ site, locale, root }) {
  const [copied, setCopied] = useState(false);
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [g1, g2] = siteGradient(site.name);

  const displayDomain = site.customDomain && site.customDomainVerified
    ? site.customDomain
    : `${site.subdomain}.${root}`;
  const publicUrl = `https://${displayDomain}`;

  async function copyDomain(e) {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(displayDomain).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    // Cover-link pattern: outer div + absolute Link at z-0.
    // Avoids nested <a> (invalid HTML → hydration mismatch).
    // Interactive elements (View Live, copy) sit at z-10+ above the cover link.
    <div className="group relative rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--surface-border-strong)] transition-all duration-200 overflow-hidden">

      {/* Cover link — fills card, navigates to edit page */}
      <Link
        href={`/${locale}/dashboard/sites/${site.id}`}
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset"
        aria-label={site.name}
      />

      {/* Thumbnail */}
      <div
        className="relative h-32 w-full flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)` }}
      >
        <span className="font-display text-6xl font-bold text-white/20 select-none">
          {(site.name || '?')[0].toUpperCase()}
        </span>

        {/* Hover overlay — z-10 so it sits above cover link */}
        <div className="absolute inset-0 z-10 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm pointer-events-none">
            <Icon name="edit" size={12} stroke="white" strokeWidth={2} />
            {L('Засах', 'Edit')}
          </span>
          {/* z-20: proper <a> tag above the cover Link — no nesting */}
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="relative z-20 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            <Icon name="ext" size={12} stroke="white" strokeWidth={2} />
            {L('Харах', 'View')}
          </a>
        </div>
      </div>

      {/* Card body — z-10 so copy button is clickable above cover link */}
      <div className="relative z-10 p-4">
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

        <div className="mt-2 text-[11px] text-[var(--text-muted)] tabular">
          {new Date(site.updatedAt).toLocaleDateString(locale === 'mn' ? 'mn-MN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden">
      <div className="relative px-8 py-14 md:py-20 text-center max-w-md mx-auto">
        {/* Animated SVG illustration */}
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
          {/* Orbiting dot */}
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
          {L('AI-аар эхлэх', 'Start with AI')} <span aria-hidden>→</span>
        </Link>
      </div>

      {/* Template starter cards */}
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
                className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--surface-border)] bg-[var(--bg-secondary)] hover:border-[var(--surface-border-strong)] hover:bg-[var(--bg-tertiary)] transition-all text-left group"
              >
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <div className="text-sm font-semibold">{data.title}</div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5 group-hover:text-[var(--text-tertiary)] transition-colors">
                    {L('AI-аар үүсгэх', 'Generate with AI')} →
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
   Sites section — search + filter + grid
═══════════════════════════════════════════════════ */
function SitesSection({ sites, locale, root }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = sites.filter((s) => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.subdomain.includes(q);
    return matchStatus && matchSearch;
  });

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
          {/* Search + filter */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
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

            {/* Filter tabs */}
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
          </div>

          {/* Grid */}
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
                key={`grid-${statusFilter}-${search}`}
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
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   Root client component
═══════════════════════════════════════════════════ */
export default function DashboardClient({ locale, userName, sites, stats, root }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12 space-y-8">
      <HeroAiCard locale={locale} userName={userName} />
      <StatsRow stats={stats} locale={locale} />
      <QuickActions locale={locale} />
      <SitesSection sites={sites} locale={locale} root={root} />
    </div>
  );
}
