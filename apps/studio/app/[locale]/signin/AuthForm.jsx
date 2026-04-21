'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Mini site preview cards for showcase panel ───────────────────────────────

const CARDS = [
  {
    domain: 'nomads-kitchen.aiweb.mn',
    style: { left: '4%', top: '36px', rotate: '-7deg', scale: 0.78, opacity: 0.55 },
    floatDelay: '0s',
    floatDuration: '7s',
    preview: () => (
      <div className="h-full flex flex-col" style={{ background: 'linear-gradient(150deg,#7c2d12,#c2410c 60%,#ea580c)' }}>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/25">
          <div className="h-1 w-1 rounded-full bg-white/60" />
          <div className="h-1 w-10 rounded bg-white/40" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-1.5 text-center px-3">
          <div className="h-5 w-5 rounded-full bg-amber-400/70 mx-auto" />
          <div className="h-2 w-20 rounded bg-white/85" />
          <div className="h-1.5 w-14 rounded bg-white/45" />
          <div className="flex gap-1.5 mt-1">
            <div className="h-4 w-12 rounded-full bg-amber-400/90" />
            <div className="h-4 w-12 rounded-full border border-white/40" />
          </div>
        </div>
        <div className="flex gap-1 px-2.5 pb-2">
          {['Хоол', 'Хүргэлт', 'Захиалга'].map(t => (
            <div key={t} className="flex-1 rounded bg-black/20 px-1 py-1">
              <div className="h-1 w-6 rounded bg-white/60 mb-0.5" />
              <div className="h-1 w-full rounded bg-white/25" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    domain: 'glow-studio.aiweb.mn',
    style: { left: '28%', top: '14px', rotate: '-1deg', scale: 0.88, opacity: 0.78 },
    floatDelay: '1.1s',
    floatDuration: '6s',
    preview: () => (
      <div className="h-full flex flex-col" style={{ background: 'linear-gradient(150deg,#4a044e,#86198f 55%,#c026d3)' }}>
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/20">
          <div className="h-1.5 w-14 rounded bg-white/65" />
          <div className="h-3 w-8 rounded-full bg-pink-400/80" />
        </div>
        <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5">
          <div className="flex-1">
            <div className="h-2 w-16 rounded bg-white/85 mb-1" />
            <div className="h-1.5 w-12 rounded bg-white/45 mb-2" />
            <div className="h-3 w-12 rounded-lg bg-white/20 border border-white/35" />
          </div>
          <div className="w-10 h-14 rounded-lg bg-white/15 border border-white/20" />
        </div>
        <div className="px-2.5 pb-2 grid grid-cols-3 gap-1">
          {['Үс', 'Маникюр', 'Нүүр'].map(s => (
            <div key={s} className="rounded bg-white/10 border border-white/20 p-1">
              <div className="h-1 w-5 rounded bg-white/60 mx-auto mb-0.5" />
              <div className="h-1 w-4 rounded bg-white/30 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    domain: 'creative-folio.aiweb.mn',
    style: { right: '4%', top: '0px', rotate: '7deg', scale: 1, opacity: 1 },
    floatDelay: '0.5s',
    floatDuration: '5.5s',
    preview: () => (
      <div className="h-full flex flex-col" style={{ background: 'linear-gradient(150deg,#0f0c29,#302b63 50%,#24243e)' }}>
        <div className="flex items-center justify-between px-2.5 py-1.5">
          <div className="h-4 w-4 rounded bg-gradient-to-br from-violet-500 to-purple-700" />
          <div className="flex gap-1.5">{[20,28,20].map((w,i)=><div key={i} className="h-1 rounded bg-white/30" style={{width:w}}/>)}</div>
        </div>
        <div className="px-2.5 pt-1 pb-1.5">
          <div className="h-3 w-28 rounded bg-gradient-to-r from-violet-400 to-cyan-400 mb-1 opacity-90" />
          <div className="h-1.5 w-22 rounded bg-white/35 mb-0.5" />
          <div className="h-1.5 w-16 rounded bg-white/20 mb-2" />
          <div className="flex gap-1.5">
            <div className="h-4 w-14 rounded bg-violet-600/80" />
            <div className="h-4 w-10 rounded border border-white/20" />
          </div>
        </div>
        <div className="px-2.5 pb-2 grid grid-cols-2 gap-1 flex-1">
          {[['#4c1d95','#6d28d9'],['#064e3b','#059669'],['#1e3a5f','#2563eb'],['#7c2d12','#ea580c']].map(([a,b],i)=>(
            <div key={i} className="rounded overflow-hidden" style={{background:`linear-gradient(135deg,${a},${b})`,minHeight:24}}>
              <div className="p-1"><div className="h-1 w-8 rounded bg-white/55 mb-0.5"/><div className="h-1 w-5 rounded bg-white/30"/></div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

// ─── Showcase panel (right side) ──────────────────────────────────────────────

function ShowcasePanel({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  const FEATURES = [
    { mn: 'Gemini 2.5 AI — контент бичдэг', en: 'Gemini 2.5 AI — writes your content' },
    { mn: '23 мэргэжлийн загвар', en: '23 professional templates' },
    { mn: 'Flux зургийн генератор', en: 'Flux AI image generator' },
    { mn: 'QPay · SocialPay · Хаан · Голомт', en: 'QPay · SocialPay · Khan · Golomt' },
    { mn: 'MN + EN хоёр хэл нэгэн зэрэг', en: 'MN + EN bilingual out of the box' },
  ];

  return (
    <div className="relative h-full flex flex-col justify-between overflow-hidden p-10 lg:p-12">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 50% at 20% 20%, rgba(124,92,255,0.22) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 70%, rgba(192,132,252,0.16) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 50% 100%, rgba(34,211,238,0.10) 0%, transparent 60%), #0a0a0f',
        }} />
        <div className="absolute inset-0 grid-pattern opacity-50" />
      </div>

      {/* Top: brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] grid place-items-center shadow-lg shadow-[var(--accent-soft)] shine">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" fillOpacity="0.95" />
            </svg>
          </div>
          <div className="leading-none">
            <div className="font-display text-base font-bold tracking-tight">AiWeb</div>
            <div className="text-[9px] font-mono text-[var(--text-muted)] tracking-widest">AI · STUDIO</div>
          </div>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-8 font-display font-bold tracking-tight leading-[1.08]"
          style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
        >
          {L('Бизнесээ тайлбарла.', 'Describe your business.')}
          <br />
          <span className="gradient-text">{L('AI вэбсайт бүтээнэ.', 'AI builds the site.')}</span>
        </motion.h2>
      </div>

      {/* Center: floating cards */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="relative w-full" style={{ height: 240 }}>
          {CARDS.map((card, i) => {
            const Preview = card.preview;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50"
                style={{
                  ...card.style,
                  width: 140,
                  height: 190,
                  animation: `float-y ${card.floatDuration} ease-in-out ${card.floatDelay} infinite`,
                  willChange: 'transform',
                }}
              >
                {/* Chrome */}
                <div className="flex items-center gap-1 px-2 py-1.5 bg-[#0d0d1a] border-b border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
                  <div className="flex-1 h-2.5 rounded bg-white/[0.06] ml-1 px-1.5 flex items-center">
                    <span className="text-[7px] font-mono text-white/25 truncate">{card.domain}</span>
                  </div>
                </div>
                {/* Preview */}
                <div className="h-full">
                  <Preview />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom: feature list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="relative z-10"
      >
        <ul className="space-y-2.5">
          {FEATURES.map((f, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.07, duration: 0.35 }}
              className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-light)] shrink-0" />
              {L(f.mn, f.en)}
            </motion.li>
          ))}
        </ul>

        {/* Mongolia badge */}
        <div className="mt-6 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <span className="font-mono text-[10px] font-bold">MN</span>
          <span>{L('Улаанбаатар хотод бүтээсэн', 'Made in Ulaanbaatar, Mongolia')}</span>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Field with glow wrapper ──────────────────────────────────────────────────

function GlowField({ children }) {
  return (
    <div className="relative group/glow">
      <div className="absolute -inset-[1.5px] rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)] opacity-0 group-focus-within/glow:opacity-35 transition-opacity duration-300 blur-[3px]" />
      <div className="relative">{children}</div>
    </div>
  );
}

// ─── Eye icon ─────────────────────────────────────────────────────────────────

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

// ─── Main AuthForm ────────────────────────────────────────────────────────────

export default function AuthForm({ locale, mode }) {
  const router = useRouter();
  const L = useCallback((mn, en) => (locale === 'mn' ? mn : en), [locale]);
  const isSignup = mode === 'signup';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [showPw, setShowPw]     = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignup) {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, locale }),
        });
        if (!res.ok) throw new Error((await res.json()).error || L('Алдаа гарлаа', 'Something went wrong'));
      }

      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) throw new Error(L('И-мэйл эсвэл нууц үг буруу', 'Invalid email or password'));

      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setShakeKey((k) => k + 1);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">

      {/* ── Left: Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-10 xl:px-16 relative">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-[var(--accent)] opacity-[0.04] blur-3xl rounded-full" />
        </div>

        <div className="w-full max-w-md relative z-10">

          {/* Mobile logo (hidden on lg) */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-lg shadow-[var(--accent-soft)]">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" fillOpacity="0.95" />
              </svg>
            </div>
            <span className="font-display text-base font-bold">AiWeb</span>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className="mb-8"
          >
            {/* Icon */}
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-lg shadow-[var(--accent-soft)] mb-5 shine">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" fillOpacity="0.9"/>
              </svg>
            </div>

            <h1 className="font-display text-2xl font-bold tracking-tight">
              {isSignup ? L('Бүртгэл үүсгэх', 'Create your account') : L('Тавтай морилно уу', 'Welcome back')}
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {isSignup
                ? L('Хэдхэн минутад AI вэбсайтаа бүтээнэ', 'Build your AI website in minutes')
                : L('Вэбсайтуудаа удирдаж үргэлжлүүлэх', 'Continue managing your websites')}
            </p>
          </motion.div>

          {/* Form card with shake on error */}
          <motion.div
            key={shakeKey}
            animate={shakeKey > 0 ? { x: [0, -7, 7, -7, 7, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.42, ease: 'easeInOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              className="rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-7 shadow-xl shadow-black/20"
            >
              <form onSubmit={submit} className="space-y-5">

                {/* Name (signup only) */}
                <AnimatePresence>
                  {isSignup && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        {L('Нэр', 'Full name')}
                      </label>
                      <GlowField>
                        <input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="field"
                          autoComplete="name"
                          placeholder={L('Таны нэр', 'Your name')}
                        />
                      </GlowField>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    {L('И-мэйл', 'Email')}
                  </label>
                  <GlowField>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="field"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                    />
                  </GlowField>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    {L('Нууц үг', 'Password')}
                  </label>
                  <GlowField>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="field pr-11"
                        autoComplete={isSignup ? 'new-password' : 'current-password'}
                        required
                        minLength={8}
                        placeholder={showPw ? L('Нууц үг оруулна уу', 'Enter password') : '--------'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1"
                        tabIndex={-1}
                        aria-label={showPw ? L('Нуух', 'Hide') : L('Харуулах', 'Show')}
                      >
                        <EyeIcon open={showPw} />
                      </button>
                    </div>
                  </GlowField>
                  {isSignup && (
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      {L('Хамгийн багадаа 8 тэмдэгт', 'At least 8 characters')}
                    </p>
                  )}
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      key="error"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-sm text-[var(--danger)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 rounded-xl px-4 py-3 flex items-center gap-2"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.01 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="btn btn-accent btn-lg w-full relative overflow-hidden shine"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                      {L('Түр хүлээнэ үү...', 'One moment...')}
                    </span>
                  ) : isSignup ? (
                    L('Бүртгэл үүсгэх', 'Create account')
                  ) : (
                    L('Нэвтрэх', 'Sign in')
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>

          {/* Toggle link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-sm text-[var(--text-tertiary)] text-center"
          >
            {isSignup ? (
              <>
                {L('Аль хэдийн бүртгэлтэй юу?', 'Already have an account?')}{' '}
                <Link href={`/${locale}/signin`} className="text-[var(--accent-light)] hover:text-[var(--accent)] font-medium transition-colors">
                  {L('Нэвтрэх', 'Sign in')}
                </Link>
              </>
            ) : (
              <>
                {L('Бүртгэлгүй юу?', 'No account yet?')}{' '}
                <Link href={`/${locale}/signup`} className="text-[var(--accent-light)] hover:text-[var(--accent)] font-medium transition-colors">
                  {L('Бүртгүүлэх', 'Sign up')}
                </Link>
              </>
            )}
          </motion.p>

          <p className="mt-3 text-xs text-[var(--text-muted)] text-center max-w-xs mx-auto">
            {L(
              'Үргэлжлүүлснээр та Нууцлалын бодлого, Үйлчилгээний нөхцлийг зөвшөөрч байна.',
              'By continuing you agree to our Terms of Service and Privacy Policy.',
            )}
          </p>
        </div>
      </div>

      {/* ── Right: Showcase (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[56%] relative border-l border-[var(--surface-border)]">
        <ShowcasePanel locale={locale} />
      </div>
    </div>
  );
}
