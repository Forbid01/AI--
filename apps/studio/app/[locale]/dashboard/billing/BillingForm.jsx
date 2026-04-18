'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDictionary } from '@aiweb/i18n';

/* ─────────────────────────────────────────────────────────
   Provider metadata
───────────────────────────────────────────────────────── */
function QPayIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="1" y="1" width="9" height="9" rx="1.5" fill="currentColor" />
      <rect x="14" y="1" width="9" height="9" rx="1.5" fill="currentColor" />
      <rect x="1" y="14" width="9" height="9" rx="1.5" fill="currentColor" />
      <rect x="14" y="14" width="4" height="4" rx="0.75" fill="currentColor" />
      <rect x="19" y="14" width="4" height="4" rx="0.75" fill="currentColor" />
      <rect x="14" y="19" width="4" height="4" rx="0.75" fill="currentColor" />
      <rect x="19" y="19" width="4" height="4" rx="0.75" fill="currentColor" />
    </svg>
  );
}
function SocialPayIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="currentColor" />
      <path d="M8 10.5h8M8 13.5h5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function KhanBankIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="5" fill="currentColor" />
      <path d="M8 7v10M8 12h8M16 7v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function GolomtIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M16.5 12a4.5 4.5 0 01-4.5 4.5A4.5 4.5 0 017.5 12" stroke="white" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 7.5v4.5h4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PROVIDERS = [
  { id: 'qpay',     name: 'QPay',      sub: 'Бүх банкны QR', color: '#3B82F6', Icon: QPayIcon },
  { id: 'socialpay',name: 'SocialPay', sub: 'Голомт аппаар',  color: '#10B981', Icon: SocialPayIcon },
  { id: 'khanbank', name: 'Хаан банк', sub: 'Khan Bank',       color: '#F59E0B', Icon: KhanBankIcon },
  { id: 'golomt',   name: 'Голомт',    sub: 'Golomt Bank',     color: '#EF4444', Icon: GolomtIcon },
];

const PRESETS = [29000, 89000, 290000];

const fmt = (n) => Number(n).toLocaleString('mn-MN');

function formatTime(s) {
  const m = String(Math.floor(s / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

/* ─────────────────────────────────────────────────────────
   Small UI helpers
───────────────────────────────────────────────────────── */
function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
      className="inline-block h-4 w-4 rounded-full border-2 border-white/25 border-t-white"
    />
  );
}

function TrustRow({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const items = [
    { label: 'SSL хамгаалалттай', icon: 'lock' },
    { label: 'PCI Compliant', icon: 'shield' },
    { label: '3D Secure', icon: 'key' },
  ];
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
      {items.map(({ label, icon }) => (
        <span key={label} className="flex items-center gap-1.5 text-[10px] tracking-wide text-[var(--text-muted)]">
          {icon === 'lock' && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          )}
          {icon === 'shield' && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          )}
          {icon === 'key' && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="7.5" cy="15.5" r="5.5" /><path d="M21 2l-9.6 9.6M15.5 7.5l3 3" />
            </svg>
          )}
          {label}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────── */
export default function BillingForm({ locale }) {
  const dict = getDictionary(locale);
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  // ── existing state (unchanged) ──
  const [provider, setProvider] = useState('qpay');
  const [amount, setAmount] = useState(29000);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── UI state ──
  const [customMode, setCustomMode] = useState(false);
  const [customRaw, setCustomRaw] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const selectedProvider = PROVIDERS.find((p) => p.id === provider);

  // countdown when invoice arrives
  useEffect(() => {
    if (!invoice) return;
    setTimeLeft(15 * 60);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [invoice]);

  // auto-dismiss error after 5s
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(id);
  }, [error]);

  // ── existing logic (unchanged) ──
  async function pay() {
    setLoading(true);
    setError(null);
    setInvoice(null);
    try {
      const res = await fetch(`/api/payments/${provider}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description: 'AiWeb Pro', plan: 'pro' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInvoice(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ── helpers ──
  function selectPreset(val) {
    setAmount(val);
    setCustomMode(false);
    setCustomRaw('');
  }

  function enableCustom() {
    setCustomMode(true);
    setCustomRaw(String(amount));
  }

  function handleCustomChange(raw) {
    const digits = raw.replace(/\D/g, '');
    setCustomRaw(digits);
    const n = parseInt(digits, 10);
    if (n >= 100) setAmount(n);
  }

  async function copyInvoiceId() {
    if (!invoice?.invoiceId) return;
    await navigator.clipboard.writeText(invoice.invoiceId).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQr() {
    if (!invoice?.qrImage) return;
    const a = document.createElement('a');
    a.href = invoice.qrImage;
    a.download = `aiweb-invoice-${invoice.invoiceId ?? 'qr'}.png`;
    a.click();
  }

  /* ── layout ── */
  const cardBase =
    'rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl shadow-[0_32px_72px_rgba(0,0,0,0.55)]';

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12 md:py-20 bg-[var(--bg-primary)]">
      <div className="w-full max-w-xl">

        {/* ── Error toast ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 flex items-start gap-3 px-4 py-3.5 rounded-xl border border-red-500/20 bg-red-500/8 text-red-400 text-sm"
            >
              <svg className="mt-px shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity" aria-label="Хаах">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* ══════════════════════ CHECKOUT CARD ══════════════════════ */}
          {!invoice ? (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={cardBase}>

                {/* ── Header ── */}
                <div className="px-7 pt-7 pb-6 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-lg shadow-[var(--accent-soft)]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-display font-bold tracking-tight text-[var(--text-primary)]">AiWeb Pro</div>
                        <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{L('Сарын захиалга', 'Monthly subscription')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-2xl font-bold tabular tracking-tight text-[var(--text-primary)]">
                        ₮{fmt(amount)}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">{L('/ сар', '/ month')}</div>
                    </div>
                  </div>
                  <TrustRow locale={locale} />
                </div>

                <div className="px-7 py-6 space-y-7">

                  {/* ── Provider selector ── */}
                  <fieldset>
                    <legend className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-3">
                      {dict.payments.selectMethod}
                    </legend>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {PROVIDERS.map((p) => {
                        const active = provider === p.id;
                        return (
                          <motion.button
                            key={p.id}
                            type="button"
                            onClick={() => setProvider(p.id)}
                            whileTap={{ scale: 0.95 }}
                            whileHover={active ? {} : { scale: 1.02 }}
                            aria-pressed={active}
                            aria-label={p.name}
                            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                            className={[
                              'relative flex flex-col items-center gap-2.5 p-4 rounded-xl border text-center',
                              'transition-colors duration-200',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
                              active
                                ? 'bg-[var(--surface-raised)] border-transparent'
                                : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-white/[0.12]',
                            ].join(' ')}
                            style={active ? { boxShadow: `0 0 0 1.5px ${p.color}, 0 0 22px ${p.color}28` } : {}}
                          >
                            {/* Checkmark */}
                            <AnimatePresence>
                              {active && (
                                <motion.span
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                                  className="absolute top-2 right-2 h-4 w-4 rounded-full grid place-items-center"
                                  style={{ background: p.color }}
                                >
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </motion.span>
                              )}
                            </AnimatePresence>

                            <span style={{ color: active ? p.color : 'var(--text-muted)' }} className="transition-colors duration-200">
                              <p.Icon size={24} />
                            </span>
                            <div>
                              <div className="text-[11px] font-semibold leading-tight" style={{ color: active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                {p.name}
                              </div>
                              <div className="text-[9px] text-[var(--text-muted)] mt-0.5 leading-tight">{p.sub}</div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* ── Amount stepper ── */}
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-3">
                      {dict.payments.amount}
                    </div>

                    {/* Preset pills */}
                    <div className="flex gap-2 mb-3" role="group" aria-label={L('Дүн сонгох', 'Select amount')}>
                      {PRESETS.map((p) => {
                        const active = amount === p && !customMode;
                        return (
                          <motion.button
                            key={p}
                            type="button"
                            onClick={() => selectPreset(p)}
                            whileTap={{ scale: 0.96 }}
                            aria-pressed={active}
                            className={[
                              'flex-1 py-1.5 rounded-lg text-xs font-semibold tabular transition-colors duration-150',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                              active
                                ? 'bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent-soft)]'
                                : 'bg-white/[0.05] text-[var(--text-secondary)] hover:bg-white/[0.09] hover:text-[var(--text-primary)]',
                            ].join(' ')}
                          >
                            {fmt(p)}
                          </motion.button>
                        );
                      })}
                      <motion.button
                        type="button"
                        onClick={enableCustom}
                        whileTap={{ scale: 0.96 }}
                        aria-pressed={customMode}
                        className={[
                          'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]',
                          customMode
                            ? 'bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent-soft)]'
                            : 'bg-white/[0.05] text-[var(--text-secondary)] hover:bg-white/[0.09]',
                        ].join(' ')}
                      >
                        {L('Өөр', 'Custom')}
                      </motion.button>
                    </div>

                    {/* Amount display / input */}
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-5 py-4 transition-colors focus-within:border-[var(--accent)]/40">
                      {customMode ? (
                        <div className="flex items-baseline gap-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={customRaw}
                            onChange={(e) => handleCustomChange(e.target.value)}
                            placeholder="0"
                            autoFocus
                            aria-label={L('Дүн оруулах', 'Enter amount')}
                            className="flex-1 w-full bg-transparent font-display text-3xl font-bold tabular tracking-tight text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-muted)]"
                          />
                          <span className="font-display text-3xl font-bold text-[var(--text-muted)]">₮</span>
                        </div>
                      ) : (
                        <div className="font-display text-3xl font-bold tabular tracking-tight text-[var(--text-primary)]">
                          {fmt(amount)}₮
                        </div>
                      )}
                      <div className="mt-1 text-[11px] text-[var(--text-muted)]">
                        {L('НӨАТ орсон дүн', 'VAT included')}
                      </div>
                    </div>
                  </div>

                </div>

                {/* ── Pay button ── */}
                <div className="px-7 pb-7">
                  <motion.button
                    type="button"
                    onClick={pay}
                    disabled={loading || amount < 100}
                    whileTap={{ scale: 0.985 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    aria-label={loading ? L('Төлбөр үүсгэж байна', 'Creating invoice') : `${selectedProvider?.name ?? ''} ${L('р төлөх', 'pay')} — ${fmt(amount)}₮`}
                    className={[
                      'relative w-full overflow-hidden rounded-xl py-4 px-6',
                      'text-sm font-semibold text-white',
                      'transition-opacity duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                      'disabled:opacity-40 disabled:cursor-not-allowed',
                    ].join(' ')}
                    style={{
                      background: 'linear-gradient(135deg, #09090b 0%, #18181b 60%, #1c1917 100%)',
                      boxShadow: loading || amount < 100
                        ? 'none'
                        : '0 0 0 1px rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
                    }}
                  >
                    {/* Subtle glow overlay on hover */}
                    <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
                      style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)' }}
                    />
                    <span className="relative flex items-center justify-center gap-2.5">
                      {loading ? (
                        <>
                          <Spinner />
                          {L('Төлбөр үүсгэж байна...', 'Creating invoice...')}
                        </>
                      ) : selectedProvider ? (
                        <>
                          <span style={{ color: selectedProvider.color }}>
                            <selectedProvider.Icon size={18} />
                          </span>
                          <span>
                            {selectedProvider.name}{L('-р төлөх', ' — pay')} — {fmt(amount)}₮
                          </span>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </>
                      ) : null}
                    </span>
                  </motion.button>
                </div>

              </div>
            </motion.div>

          /* ══════════════════════ INVOICE TICKET ══════════════════════ */
          ) : (
            <motion.div
              key="invoice"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={cardBase}>

                {/* ── Ticket header ── */}
                <div className="px-7 pt-7 pb-5 border-b border-dashed border-white/[0.08]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Invoice ID</div>
                      <div className="mt-1.5 font-mono text-sm text-[var(--text-primary)] break-all">{invoice.invoiceId}</div>
                    </div>
                    <button
                      onClick={copyInvoiceId}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/[0.08] text-[var(--text-secondary)] hover:bg-white/[0.08] transition-colors"
                      aria-label={L('Invoice ID хуулах', 'Copy Invoice ID')}
                    >
                      {copied ? (
                        <>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {L('Хуулсан', 'Copied')}
                        </>
                      ) : (
                        <>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </svg>
                          {L('Хуулах', 'Copy')}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Status + countdown */}
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${timeLeft > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                      <span className="text-xs text-[var(--text-secondary)]">
                        {timeLeft > 0
                          ? <>{L('Хүлээгдэж байна', 'Awaiting payment')}</>
                          : <span className="text-red-400">{L('Хугацаа дууссан', 'Expired')}</span>}
                      </span>
                    </div>
                    {timeLeft > 0 && (
                      <div className="flex items-center gap-1.5 font-mono text-sm font-semibold tabular"
                        style={{ color: timeLeft < 120 ? '#f87171' : timeLeft < 300 ? '#fbbf24' : 'var(--text-primary)' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formatTime(timeLeft)}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── QR code ── */}
                {invoice.qrImage && (
                  <div className="px-7 py-7 flex flex-col items-center">
                    <div className="relative group w-full max-w-[220px]">
                      <div className="p-4 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                        <img
                          src={invoice.qrImage}
                          alt={L('Төлбөрийн QR код', 'Payment QR code')}
                          className="w-full block"
                        />
                      </div>
                      {/* Download on hover */}
                      <button
                        onClick={downloadQr}
                        aria-label={L('QR татаж авах', 'Download QR')}
                        className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white text-xs font-medium"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        {L('Татаж авах', 'Download')}
                      </button>
                    </div>
                    <p className="mt-4 text-xs text-[var(--text-muted)] text-center">
                      {L('Банкны аппликейшнээрээ QR скан хийнэ үү', 'Scan with your banking app')}
                    </p>
                  </div>
                )}

                {/* Tear line */}
                <div className="mx-7 border-t border-dashed border-white/[0.08]" />

                {/* ── Actions ── */}
                <div className="px-7 py-5 space-y-2.5">
                  {invoice.payUrl && (
                    <a
                      href={invoice.payUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
                      style={{
                        background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 6px 24px rgba(0,0,0,0.5)',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      {L('Төлбөрийн хуудас нээх', 'Open payment page')}
                    </a>
                  )}

                  {/* Deeplinks as app icon buttons */}
                  {Array.isArray(invoice.deeplinks) && invoice.deeplinks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {invoice.deeplinks.map((d, i) => (
                        <a
                          key={i}
                          href={d.link}
                          className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs text-[var(--text-secondary)] hover:bg-white/[0.07] hover:border-white/[0.13] transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
                          </svg>
                          {d.name}
                        </a>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => { setInvoice(null); setTimeLeft(0); }}
                    className="w-full py-2 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/[0.04] transition-colors"
                  >
                    {L('← Буцах', '← Back')}
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
