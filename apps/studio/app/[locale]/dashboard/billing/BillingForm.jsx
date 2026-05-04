'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getDictionary } from '@aiweb/i18n';

/* ─── Provider icons ─────────────────────────────────────────────────────── */

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
  { id: 'qpay',      name: 'QPay',      sub: { mn: 'Бүх банкны QR', en: 'All banks QR' }, color: '#3B82F6', Icon: QPayIcon },
  { id: 'socialpay', name: 'SocialPay', sub: { mn: 'Голомт аппаар',  en: 'Golomt app'  }, color: '#10B981', Icon: SocialPayIcon },
  { id: 'khanbank',  name: 'Хаан банк', sub: { mn: 'Khan Bank',      en: 'Khan Bank'   }, color: '#22C55E', Icon: KhanBankIcon },
  { id: 'golomt',    name: 'Голомт',    sub: { mn: 'Golomt Bank',    en: 'Golomt Bank' }, color: '#D946EF', Icon: GolomtIcon },
];

/* ─── Package options ────────────────────────────────────────────────────── */

const PACKAGE_OPTIONS = [
  {
    id: 'pro-monthly',
    amount: 29000,
    billingInterval: 'monthly',
    contactOnly: false,
    popular: true,
    description: 'AiWeb Pro Monthly',
    title:       { mn: 'AiWeb Pro',        en: 'AiWeb Pro' },
    subtitle:    { mn: 'Сарын захиалга',   en: 'Monthly' },
    priceSuffix: { mn: '/ сар',            en: '/ month' },
    blurb: {
      mn: 'Жижиг багаас өсөлтийн баг хүртэл өдөр тутмын AI workflow-д тохиромжтой.',
      en: 'Perfect for daily AI website work from solo founders to growth teams.',
    },
    features: {
      mn: ['10 сайт хүртэл', 'Custom domain', 'AI hero image үүсгэх', 'QPay / SocialPay холболт', 'Монгол + Англи контент'],
      en: ['Up to 10 sites', 'Custom domain', 'AI hero image generation', 'QPay / SocialPay integration', 'MN + EN content'],
    },
  },
  {
    id: 'pro-yearly',
    amount: 290000,
    billingInterval: 'yearly',
    contactOnly: false,
    popular: false,
    savings: 17, // percent saved vs monthly × 12
    description: 'AiWeb Pro Yearly',
    title:       { mn: 'AiWeb Pro Annual', en: 'AiWeb Pro Annual' },
    subtitle:    { mn: 'Жилийн захиалга',  en: 'Yearly' },
    priceSuffix: { mn: '/ жил',            en: '/ year' },
    blurb: {
      mn: 'Growth багуудад зориулсан хамгийн ашигтай сонголт. Нэг дор бүтэн жилээр lock-in хийнэ.',
      en: 'The best-value option for growth teams that want a full year of momentum.',
    },
    features: {
      mn: ['Pro-ийн бүх боломж', '₮58,000 хэмнэлт', 'Тэргүүлэх дэмжлэг', 'Жилийн аналитик тайлан', 'Custom domain × 10'],
      en: ['Everything in Pro', '₮58,000 savings', 'Priority support', 'Annual analytics report', 'Custom domain × 10'],
    },
  },
  {
    id: 'enterprise',
    amount: 0,
    billingInterval: 'yearly',
    contactOnly: true,
    popular: false,
    description: 'AiWeb Enterprise',
    title:       { mn: 'Enterprise',       en: 'Enterprise' },
    subtitle:    { mn: 'Custom onboarding', en: 'Custom onboarding' },
    priceSuffix: { mn: 'Custom',            en: 'Custom' },
    blurb: {
      mn: 'Олон брэнд, custom workflow, priority onboarding хэрэгтэй багуудад.',
      en: 'For teams that need multi-brand setup, custom workflows, and priority onboarding.',
    },
    features: {
      mn: ['Хязгааргүй сайт', 'Custom AI workflow', 'Dedicated onboarding', 'SLA guarantee', 'API нэвтрэлт'],
      en: ['Unlimited sites', 'Custom AI workflow', 'Dedicated onboarding', 'SLA guarantee', 'API access'],
    },
    contactHref: 'mailto:legal@aiweb.mn?subject=AiWeb%20Enterprise&body=Hello%20AiWeb%20team%2C%20we%20want%20to%20discuss%20the%20Enterprise%20plan.',
  },
];

/* ─── Utilities ──────────────────────────────────────────────────────────── */

const fmt = (n) => Number(n).toLocaleString('mn-MN');

function formatTime(s) {
  const m   = String(Math.floor(s / 60)).padStart(2, '0');
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

/* ─── Small components ───────────────────────────────────────────────────── */

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }}
      className="inline-block h-4 w-4 rounded-full border-2 border-white/25 border-t-white"
    />
  );
}

function TrustRow() {
  const items = [
    {
      label: 'SSL хамгаалалттай',
      svg: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    },
    {
      label: 'PCI Compliant',
      svg: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>,
    },
    {
      label: '3D Secure',
      svg: <><circle cx="7.5" cy="15.5" r="5.5" /><path d="M21 2l-9.6 9.6M15.5 7.5l3 3" /></>,
    },
  ];
  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
      {items.map(({ label, svg }) => (
        <span key={label} className="flex items-center gap-1.5 text-[10px] tracking-wide text-[var(--text-muted)]">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            {svg}
          </svg>
          {label}
        </span>
      ))}
    </div>
  );
}

function CheckIcon({ size = 14, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ─── Package card ───────────────────────────────────────────────────────── */

function PackageCard({ pkg, active, locale, onClick }) {
  const L   = (mn, en) => (locale === 'mn' ? mn : en);
  const title    = pkg.title[locale]    ?? pkg.title.mn;
  const subtitle = pkg.subtitle[locale] ?? pkg.subtitle.mn;
  const suffix   = pkg.priceSuffix[locale] ?? pkg.priceSuffix.mn;
  const features = pkg.features[locale]  ?? pkg.features.mn;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'relative rounded-2xl border text-left transition-all duration-200 p-4 flex flex-col',
        active
          ? 'border-transparent bg-[var(--surface-raised)] shadow-[0_0_0_1.5px_rgba(124,92,255,0.5),0_0_28px_rgba(124,92,255,0.18)]'
          : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12]',
      ].join(' ')}
    >
      {/* Active sheen */}
      {active && (
        <motion.div
          layoutId="pkg-sheen"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07), transparent 60%)' }}
          transition={{ type: 'spring', stiffness: 360, damping: 34 }}
        />
      )}

      {/* Badges row */}
      <div className="flex items-center gap-1.5 mb-3 h-5">
        {pkg.popular && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[var(--accent)]/15 text-[var(--accent-light)] border border-[var(--accent)]/20">
            {L('Хамгийн алдартай', 'Most popular')}
          </span>
        )}
        {pkg.savings && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/12 text-emerald-400 border border-emerald-500/20">
            {L(`${pkg.savings}% хэмнэнэ`, `Save ${pkg.savings}%`)}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-3">
        <div className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
          {pkg.contactOnly ? L('Custom', 'Custom') : `₮${fmt(pkg.amount)}`}
        </div>
        <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{suffix}</div>
      </div>

      {/* Title */}
      <div className="text-xs font-semibold text-[var(--text-primary)]">{title}</div>
      <div className="text-[10px] text-[var(--text-muted)] mt-0.5 mb-3">{subtitle}</div>

      {/* Features */}
      <ul className="mt-auto space-y-1.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-1.5 text-[10px] text-[var(--text-secondary)]">
            <span className="shrink-0 mt-px text-emerald-400">
              <CheckIcon size={10} color="currentColor" />
            </span>
            {f}
          </li>
        ))}
      </ul>
    </button>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function BillingForm({ locale, initialPackageId = 'pro-monthly', initialAmount }) {
  const dict   = getDictionary(locale);
  const router = useRouter();
  const L      = (mn, en) => (locale === 'mn' ? mn : en);

  const normalizedPackageId = PACKAGE_OPTIONS.some((p) => p.id === initialPackageId)
    ? initialPackageId
    : 'pro-monthly';

  const [provider,   setProvider]   = useState('qpay');
  const [packageId,  setPackageId]  = useState(normalizedPackageId);
  const [invoice,    setInvoice]    = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [copied,     setCopied]     = useState(false);
  const [timeLeft,   setTimeLeft]   = useState(0);
  const [succeeded,  setSucceeded]  = useState(false);

  const selectedProvider = PROVIDERS.find((p) => p.id === provider);
  const selectedPackage  = PACKAGE_OPTIONS.find((p) => p.id === packageId) ?? PACKAGE_OPTIONS[0];
  // Amount is always driven by the selected package; initialAmount can pre-select a package
  const amount = selectedPackage.amount;

  // Auto-select package from initialAmount if provided
  useEffect(() => {
    if (!initialAmount) return;
    const n   = Number(initialAmount);
    const match = PACKAGE_OPTIONS.find((p) => p.amount === n && !p.contactOnly);
    if (match) setPackageId(match.id);
  }, [initialAmount]);

  // Reset invoice when package changes
  useEffect(() => {
    setInvoice(null);
    setSucceeded(false);
  }, [packageId]);

  // Countdown timer
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

  // Auto-dismiss error
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(id);
  }, [error]);

  // Poll payment status every 4s while invoice is open
  const pollStatus = useCallback(async () => {
    if (!invoice?.invoiceId) return;
    try {
      const res = await fetch(`/api/payments/${provider}/status?invoiceId=${invoice.invoiceId}`);
      if (!res.ok) return; // endpoint may not exist yet — silently skip
      const data = await res.json();
      if (data?.status === 'paid' || data?.paid === true) setSucceeded(true);
    } catch { /* network error — ignore */ }
  }, [invoice, provider]);

  useEffect(() => {
    if (!invoice || succeeded) return;
    const id = setInterval(pollStatus, 4000);
    return () => clearInterval(id);
  }, [invoice, succeeded, pollStatus]);

  /* ── Handlers ── */

  async function pay() {
    if (selectedPackage.contactOnly) return;
    setLoading(true);
    setError(null);
    setInvoice(null);
    try {
      const res = await fetch(`/api/payments/${provider}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          description:     selectedPackage.description,
          plan:            'pro',
          billingInterval: selectedPackage.billingInterval,
          packageId:       selectedPackage.id,
        }),
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

  async function copyInvoiceId() {
    if (!invoice?.invoiceId) return;
    await navigator.clipboard.writeText(invoice.invoiceId).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadQr() {
    if (!invoice?.qrImage) return;
    const a  = document.createElement('a');
    a.href   = invoice.qrImage;
    a.download = `aiweb-invoice-${invoice.invoiceId ?? 'qr'}.png`;
    a.click();
  }

  /* ── Shared card style ── */
  const cardBase = 'rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-xl shadow-[0_32px_72px_rgba(0,0,0,0.55)]';

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-12 md:py-20 bg-[var(--bg-primary)]">
      <div className="w-full max-w-xl">

        {/* Error toast */}
        <AnimatePresence>
          {error && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0,   y: -8,  scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mb-4 flex items-start gap-3 px-4 py-3.5 rounded-xl border border-red-500/20 bg-red-500/8 text-red-400 text-sm"
            >
              <svg className="mt-px shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r="0.5" fill="currentColor" />
              </svg>
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity" aria-label="Хаах">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* ══════════════ SUCCESS STATE ══════════════ */}
          {succeeded ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1,    y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={`${cardBase} px-8 py-14 text-center`}>
                {/* Animated checkmark circle */}
                <div className="mx-auto mb-7 relative w-20 h-20">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                    className="w-20 h-20 rounded-full grid place-items-center"
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.06) 70%)' }}
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.28, type: 'spring', stiffness: 320, damping: 18 }}
                      className="w-12 h-12 rounded-full bg-emerald-500 grid place-items-center shadow-[0_0_28px_rgba(16,185,129,0.55)]"
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  </motion.div>
                  {/* Ripple */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-emerald-500/30"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ delay: 0.35, duration: 1.0, ease: 'easeOut' }}
                  />
                </div>

                <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                  {L('Төлбөр амжилттай!', 'Payment successful!')}
                </h2>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">
                  {L(
                    `${selectedPackage.title.mn} идэвхжлээ. Dashboard руу буцаж, сайтаа бүтээж эхлэнэ үү.`,
                    `${selectedPackage.title.en} is now active. Head back to your dashboard to start building.`,
                  )}
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-emerald-500/20 bg-emerald-500/08 text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {selectedPackage.title[locale] ?? selectedPackage.title.mn} · ₮{fmt(amount)}
                </div>

                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/dashboard`)}
                  className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    boxShadow: '0 0 0 1px rgba(16,185,129,0.2), 0 8px 28px rgba(16,185,129,0.28)',
                  }}
                >
                  {L('Dashboard руу буцах', 'Go to Dashboard')}
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            </motion.div>

          /* ══════════════ INVOICE TICKET ══════════════ */
          ) : invoice ? (
            <motion.div
              key="invoice"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={cardBase}>

                {/* Summary banner — what you're paying */}
                <div
                  className="px-6 py-4 rounded-t-2xl border-b border-white/[0.06] flex items-center justify-between gap-3"
                  style={{ background: `linear-gradient(135deg, ${selectedProvider?.color ?? '#7c5cff'}12, transparent 70%)` }}
                >
                  <div className="flex items-center gap-2.5">
                    {selectedProvider && (
                      <span style={{ color: selectedProvider.color }}>
                        <selectedProvider.Icon size={18} />
                      </span>
                    )}
                    <div>
                      <div className="text-xs font-semibold text-[var(--text-primary)]">
                        {selectedPackage.title[locale] ?? selectedPackage.title.mn}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                        {selectedProvider?.name} {L('р төлж байна', 'payment')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-display text-lg font-bold tabular" style={{ color: selectedProvider?.color ?? 'var(--text-primary)' }}>
                      ₮{fmt(amount)}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {selectedPackage.priceSuffix[locale] ?? selectedPackage.priceSuffix.mn}
                    </div>
                  </div>
                </div>

                {/* Invoice ID + status */}
                <div className="px-6 pt-5 pb-4 border-b border-dashed border-white/[0.08]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Invoice ID</div>
                      <div className="mt-1 font-mono text-sm text-[var(--text-primary)] break-all">{invoice.invoiceId}</div>
                    </div>
                    <button
                      type="button"
                      onClick={copyInvoiceId}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/[0.08] text-[var(--text-secondary)] hover:bg-white/[0.08] transition-colors"
                      aria-label={L('Invoice ID хуулах', 'Copy Invoice ID')}
                    >
                      {copied ? (
                        <>
                          <CheckIcon size={11} />
                          {L('Хуулсан', 'Copied')}
                        </>
                      ) : (
                        <>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                          </svg>
                          {L('Хуулах', 'Copy')}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${timeLeft > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                      <span className="text-xs text-[var(--text-secondary)]">
                        {timeLeft > 0
                          ? L('Хүлээгдэж байна', 'Awaiting payment')
                          : <span className="text-red-400">{L('Хугацаа дууссан', 'Expired')}</span>}
                      </span>
                    </div>
                    {timeLeft > 0 && (
                      <div
                        className="flex items-center gap-1.5 font-mono text-sm font-semibold tabular"
                        style={{ color: timeLeft < 120 ? '#f87171' : timeLeft < 300 ? '#fbbf24' : 'var(--text-primary)' }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                        </svg>
                        {formatTime(timeLeft)}
                      </div>
                    )}
                  </div>
                </div>

                {/* QR code */}
                {invoice.qrImage && (
                  <div className="px-6 py-7 flex flex-col items-center">
                    <div className="relative group w-full max-w-[220px]">
                      <div className="p-4 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                        <img
                          src={invoice.qrImage}
                          alt={L('Төлбөрийн QR код', 'Payment QR code')}
                          className="w-full block"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={downloadQr}
                        aria-label={L('QR татаж авах', 'Download QR')}
                        className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white text-xs font-medium"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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

                <div className="mx-6 border-t border-dashed border-white/[0.08]" />

                {/* Actions */}
                <div className="px-6 py-5 space-y-3">
                  {invoice.payUrl && (
                    <a
                      href={invoice.payUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                      style={{
                        background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 6px 24px rgba(0,0,0,0.5)',
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      {L('Төлбөрийн хуудас нээх', 'Open payment page')}
                    </a>
                  )}

                  {/* Deeplink app buttons — prominent */}
                  {Array.isArray(invoice.deeplinks) && invoice.deeplinks.length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-2">
                        {L('Аппликейшнээр нээх', 'Open in app')}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {invoice.deeplinks.map((d, i) => (
                          <a
                            key={i}
                            href={d.link}
                            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-white/[0.10] bg-white/[0.04] text-sm font-medium text-[var(--text-secondary)] hover:bg-white/[0.08] hover:border-white/[0.16] hover:text-[var(--text-primary)] transition-all"
                          >
                            <span className="h-8 w-8 rounded-lg bg-white/[0.06] grid place-items-center shrink-0">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                                <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
                              </svg>
                            </span>
                            <span className="truncate">{d.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Manual success confirm */}
                  <button
                    type="button"
                    onClick={() => setSucceeded(true)}
                    className="w-full py-2.5 rounded-xl text-xs font-medium border border-emerald-500/20 bg-emerald-500/06 text-emerald-400 hover:bg-emerald-500/12 transition-colors"
                  >
                    {L('Төлбөр хийлээ ✓', 'I completed the payment ✓')}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setInvoice(null); setTimeLeft(0); }}
                    className="w-full py-2 rounded-xl text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-white/[0.04] transition-colors"
                  >
                    {L('Буцах', 'Back')}
                  </button>
                </div>

              </div>
            </motion.div>

          /* ══════════════ CHECKOUT ══════════════ */
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={cardBase}>

                {/* Header */}
                <div className="px-7 pt-7 pb-6 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3.5">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-lg shadow-[var(--accent-soft)]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-display font-bold tracking-tight text-[var(--text-primary)]">
                        {L('AiWeb-д бүртгүүлэх', 'Subscribe to AiWeb')}
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)] mt-0.5">
                        {L('Багцаа сонгоод, аргаа тохируул', 'Choose a plan and payment method')}
                      </div>
                    </div>
                  </div>
                  <TrustRow />
                </div>

                <div className="px-7 py-6 space-y-7">

                  {/* Package selector */}
                  <fieldset>
                    <legend className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-3">
                      {L('Багц сонгох', 'Choose package')}
                    </legend>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {PACKAGE_OPTIONS.map((pkg) => (
                        <PackageCard
                          key={pkg.id}
                          pkg={pkg}
                          active={packageId === pkg.id}
                          locale={locale}
                          onClick={() => setPackageId(pkg.id)}
                        />
                      ))}
                    </div>
                  </fieldset>

                  {/* Provider selector (only for paid plans) */}
                  {!selectedPackage.contactOnly && (
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
                                'relative flex flex-col items-center gap-2.5 p-4 rounded-xl border text-center transition-colors duration-200',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
                                active
                                  ? 'bg-[var(--surface-raised)] border-transparent'
                                  : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.04] hover:border-white/[0.12]',
                              ].join(' ')}
                              style={active ? { boxShadow: `0 0 0 1.5px ${p.color}, 0 0 22px ${p.color}28` } : {}}
                            >
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
                                    <CheckIcon size={8} color="white" />
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
                                <div className="text-[9px] text-[var(--text-muted)] mt-0.5 leading-tight">
                                  {p.sub[locale] ?? p.sub.mn}
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}

                  {/* Enterprise description */}
                  {selectedPackage.contactOnly && (
                    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-5">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">
                        {L('Enterprise onboarding', 'Enterprise onboarding')}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {L(
                          'Enterprise багц нь олон брэнд, custom setup, onboarding support болон team-level rollout-д зориулсан. Доорх товчоор sales-тэй холбогдоно уу.',
                          'Enterprise is for multi-brand rollouts, custom setup, onboarding support, and team-level deployments. Use the button below to reach sales.',
                        )}
                      </p>
                    </div>
                  )}

                </div>

                {/* CTA */}
                <div className="px-7 pb-7">
                  {selectedPackage.contactOnly ? (
                    <a
                      href={selectedPackage.contactHref}
                      className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-4 text-sm font-semibold text-white transition-opacity hover:opacity-95"
                      style={{
                        background: 'linear-gradient(135deg, #09090b 0%, #18181b 60%, #1c1917 100%)',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
                      }}
                    >
                      {L('Sales-тэй холбогдох', 'Contact sales')}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                      </svg>
                    </a>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={pay}
                      disabled={loading || amount < 100}
                      whileTap={{ scale: 0.985 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                      aria-label={
                        loading
                          ? L('Төлбөр үүсгэж байна', 'Creating invoice')
                          : `${selectedProvider?.name ?? ''} ${L('р төлөх', 'pay')} — ₮${fmt(amount)}`
                      }
                      className={[
                        'relative w-full overflow-hidden rounded-xl py-4 px-6',
                        'text-sm font-semibold text-white',
                        'transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40',
                        'disabled:opacity-40 disabled:cursor-not-allowed',
                      ].join(' ')}
                      style={{
                        background: loading || amount < 100
                          ? 'linear-gradient(135deg, #09090b, #18181b)'
                          : `linear-gradient(135deg, ${selectedProvider?.color ?? '#7c5cff'}cc, ${selectedProvider?.color ?? '#7c5cff'}88)`,
                        boxShadow: loading || amount < 100
                          ? 'none'
                          : `0 0 0 1px ${selectedProvider?.color ?? '#7c5cff'}40, 0 8px 32px ${selectedProvider?.color ?? '#7c5cff'}30, inset 0 1px 0 rgba(255,255,255,0.12)`,
                      }}
                    >
                      <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
                        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 70%)' }}
                      />
                      <span className="relative flex items-center justify-center gap-2.5">
                        {loading ? (
                          <>
                            <Spinner />
                            {L('Төлбөр үүсгэж байна...', 'Creating invoice...')}
                          </>
                        ) : selectedProvider ? (
                          <>
                            <selectedProvider.Icon size={18} />
                            <span>
                              {selectedProvider.name}{L('-р төлөх', ' — pay')} · ₮{fmt(amount)}
                            </span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </>
                        ) : null}
                      </span>
                    </motion.button>
                  )}
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
