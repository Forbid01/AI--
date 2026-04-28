'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPasswordPage({ params }) {
  const { locale } = params;
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const router = useRouter();

  // step: 'input' → 'otp' → 'password' → 'done'
  const [step, setStep] = useState('input');
  const [target, setTarget] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCooldown]);

  async function sendOtp() {
    if (!target.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', target: target.trim(), locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || L('Алдаа гарлаа', 'Something went wrong'));
      setStep('otp');
      setResendCooldown(60);
      setTimeout(() => otpRefs[0].current?.focus(), 100);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    const code = otp.join('');
    if (code.length !== 6) return;
    if (newPassword.length < 8) {
      setError(L('Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой', 'Password must be at least 8 characters'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(L('Нууц үг таарахгүй байна', 'Passwords do not match'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', target: target.trim(), code, newPassword, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || L('Алдаа гарлаа', 'Something went wrong'));
      setStep('done');
    } catch (e) {
      setError(e.message);
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs[0].current?.focus(), 50);
    } finally {
      setLoading(false);
    }
  }

  function handleOtpInput(index, value) {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs[index + 1].current?.focus();
  }

  function handleOtpKeyDown(index, e) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) otpRefs[index - 1].current?.focus();
    if (e.key === 'ArrowRight' && index < 5) otpRefs[index + 1].current?.focus();
  }

  function handleOtpPaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = ['', '', '', '', '', ''];
    text.split('').forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    const lastFilled = Math.min(text.length, 5);
    otpRefs[lastFilled].current?.focus();
  }

  const card = (
    <div
      className="w-full max-w-md relative rounded-2xl p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
      style={{
        background: 'linear-gradient(160deg, rgba(24,24,32,0.92) 0%, rgba(12,12,18,0.95) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <AnimatePresence mode="wait">

        {/* ── Step: input ── */}
        {step === 'input' && (
          <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <h1 className="font-display text-2xl font-black tracking-tight mb-2">
              {L('Нууц үгээ сэргээх', 'Reset your password')}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {L(
                'И-мэйл хаяг эсвэл утасны дугаараа оруул. Бид таньд 6 оронтой нэг удаагийн код илгээнэ.',
                'Enter your email or phone number. We will send you a 6-digit one-time code.',
              )}
            </p>

            <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  {L('И-мэйл эсвэл утасны дугаар', 'Email or phone number')}
                </label>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="field"
                  placeholder={L('you@example.com эсвэл +97699...', 'you@example.com or +97699...')}
                  autoFocus
                  required
                />
              </div>

              {error && <ErrorBanner message={error} />}

              <button
                type="submit"
                disabled={loading || !target.trim()}
                className="relative w-full h-12 rounded-xl font-semibold text-white text-sm overflow-hidden disabled:opacity-50"
                style={{ background: 'linear-gradient(95deg, #7c5cff 0%, #c084fc 50%, #22d3ee 100%)' }}
              >
                {loading ? <Dots /> : L('Код илгээх', 'Send code')}
              </button>
            </form>
          </motion.div>
        )}

        {/* ── Step: OTP + new password ── */}
        {step === 'otp' && (
          <motion.div key="otp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
<h1 className="font-display text-2xl font-black tracking-tight mb-2">
              {L('Код оруулах', 'Enter the code')}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mb-1">
              {L('Таны ', 'We sent a 6-digit code to ')}
              <span className="font-mono text-white font-semibold">{target}</span>
              {L('-д 6 оронтой код илгээлээ.', '.')}
            </p>
            <p className="text-xs text-[var(--text-muted)] mb-6">
              {L('Хэрэв хүлээж аваагүй бол спам хавтсаа шалгана уу.', 'Check your spam folder if you do not see it.')}
            </p>

            <form onSubmit={(e) => { e.preventDefault(); verifyOtp(); }} className="space-y-5">
              {/* 6-digit OTP boxes */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                  {L('Нэг удаагийн код', 'One-time code')}
                </label>
                <div className="flex gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 rounded-xl text-center text-xl font-black font-mono bg-[var(--surface)] border border-[var(--surface-border)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/50 transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  {L('Шинэ нууц үг', 'New password')}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="field pr-11"
                    placeholder="--------"
                    minLength={8}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors p-1"
                    tabIndex={-1}
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  {L('Нууц үг давтах', 'Confirm password')}
                </label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="field"
                  placeholder="--------"
                  minLength={8}
                  required
                />
              </div>

              {error && <ErrorBanner message={error} />}

              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6 || !newPassword || !confirmPassword}
                className="relative w-full h-12 rounded-xl font-semibold text-white text-sm overflow-hidden disabled:opacity-50"
                style={{ background: 'linear-gradient(95deg, #7c5cff 0%, #c084fc 50%, #22d3ee 100%)' }}
              >
                {loading ? <Dots /> : L('Нууц үг шинэчлэх', 'Reset password')}
              </button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setStep('input'); setOtp(['', '', '', '', '', '']); setError(null); }}
                  className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                >
                  ← {L('Буцах', 'Back')}
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={sendOtp}
                  className="text-[var(--accent-light)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {resendCooldown > 0
                    ? L(`Дахин илгээх (${resendCooldown}с)`, `Resend (${resendCooldown}s)`)
                    : L('Дахин илгээх', 'Resend code')}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* ── Step: done ── */}
        {step === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className="font-display text-2xl font-black mb-2">{L('Амжилттай!', 'Password updated!')}</h1>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
              {L('Таны нууц үг амжилттай шинэчлэгдлээ. Одоо шинэ нууц үгээрээ нэвтэрч болно.', 'Your password has been updated. You can now sign in with your new password.')}
            </p>
            <Link
              href={`/${locale}/signin`}
              className="inline-block px-6 py-3 rounded-xl font-semibold text-white text-sm"
              style={{ background: 'linear-gradient(95deg, #7c5cff, #22d3ee)' }}
            >
              {L('Нэвтрэх', 'Sign in')}
            </Link>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.25), transparent 70%)' }} />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center gap-2">
          <Link href={`/${locale}/signin`} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors flex items-center gap-1">
            ← {L('Нэвтрэх рүү буцах', 'Back to sign in')}
          </Link>
        </div>
        {card}
      </div>
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-sm text-red-300 border border-red-500/30 bg-red-500/10 rounded-xl px-4 py-3 flex items-center gap-2"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {message}
    </motion.p>
  );
}

function Dots() {
  return (
    <span className="flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-white"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}
