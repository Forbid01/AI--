'use client';

import { useRef, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

/* ─── Floating badge pill ─── */
function FloatingBadge({ children, icon, style, delay = 0, yAmp = 10 }) {
  return (
    <motion.div
      className="absolute select-none pointer-events-none z-10"
      style={style}
      animate={{ y: [0, -yAmp, 0], rotate: [0, style?.rotate ?? 0, 0] }}
      transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut', delay }}
    >
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/[0.12] bg-white/[0.06] backdrop-blur-md shadow-lg shadow-black/20 text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap">
        <span className="text-base leading-none">{icon}</span>
        {children}
      </div>
    </motion.div>
  );
}

/* ─── Particle dot ─── */
function Particle({ x, y, size, opacity, delay }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: 'var(--gradient-mid)',
        opacity,
      }}
      animate={{ opacity: [opacity, opacity * 0.2, opacity], scale: [1, 1.6, 1] }}
      transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

const PARTICLES = [
  { x: 8,  y: 20, size: 3, opacity: 0.5, delay: 0 },
  { x: 18, y: 70, size: 2, opacity: 0.35, delay: 0.7 },
  { x: 30, y: 15, size: 4, opacity: 0.4, delay: 1.4 },
  { x: 55, y: 85, size: 2, opacity: 0.3, delay: 0.3 },
  { x: 70, y: 12, size: 3, opacity: 0.45, delay: 1.8 },
  { x: 82, y: 60, size: 2, opacity: 0.4, delay: 0.9 },
  { x: 92, y: 30, size: 4, opacity: 0.35, delay: 2.2 },
  { x: 44, y: 92, size: 2, opacity: 0.3, delay: 1.1 },
  { x: 60, y: 45, size: 1.5, opacity: 0.25, delay: 3.0 },
];

export default function CtaSection({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const sectionRef = useRef(null);

  /* Smooth spotlight follow */
  const rawX = useMotionValue(50);
  const rawY = useMotionValue(50);
  const springCfg = { stiffness: 55, damping: 18 };
  const spotX = useSpring(rawX, springCfg);
  const spotY = useSpring(rawY, springCfg);

  const spotBg = useTransform(
    [spotX, spotY],
    ([x, y]) =>
      `radial-gradient(700px circle at ${x}% ${y}%, rgba(124,92,255,0.20) 0%, rgba(124,92,255,0.06) 35%, transparent 65%)`
  );
  const hardSpot = useTransform(
    [spotX, spotY],
    ([x, y]) =>
      `radial-gradient(220px circle at ${x}% ${y}%, rgba(180,140,255,0.10) 0%, transparent 70%)`
  );

  const handleMouseMove = useCallback((e) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width) * 100);
    rawY.set(((e.clientY - r.top)  / r.height) * 100);
  }, [rawX, rawY]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="border-t border-[var(--surface-border)] relative overflow-hidden"
    >
      {/* Ambient background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-b" style={{ top: '-15%', left: '8%',  width: '600px', height: '600px', opacity: 0.6 }} />
        <div className="orb orb-c" style={{ bottom: '-15%', right: '8%', width: '600px', height: '600px', opacity: 0.5 }} />
        <div className="absolute inset-0 grid-pattern opacity-[0.28]" />
      </div>

      {/* Smooth spotlight layer */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: spotBg }} />
      <motion.div className="absolute inset-0 pointer-events-none mix-blend-screen" style={{ background: hardSpot }} />

      {/* Floating particles */}
      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* Floating feature badges */}
      <FloatingBadge icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>} delay={0} yAmp={8} style={{ top: '12%', left: '6%', rotate: -4 }}>
        {L('30 хв дотор', '30 min setup')}
      </FloatingBadge>
      <FloatingBadge icon={<span className="font-mono text-[9px] font-bold leading-none">MN</span>} delay={1.2} yAmp={12} style={{ top: '18%', right: '7%', rotate: 3 }}>
        {L('Монголоор дэмжинэ', 'Mongolian supported')}
      </FloatingBadge>
      <FloatingBadge icon={<span className="font-mono text-[9px] font-bold leading-none">AI</span>} delay={0.6} yAmp={9} style={{ bottom: '20%', left: '5%', rotate: 2 }}>
        {L('GPT-4o powered', 'GPT-4o powered')}
      </FloatingBadge>
      <FloatingBadge icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>} delay={1.8} yAmp={11} style={{ bottom: '15%', right: '6%', rotate: -3 }}>
        {L('Publish in 1-click', 'Publish in 1-click')}
      </FloatingBadge>
      <FloatingBadge icon={<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>} delay={2.4} yAmp={7} style={{ top: '45%', left: '3%', rotate: -6 }}>
        QPay · SocialPay
      </FloatingBadge>

      {/* Main content */}
      <div className="relative mx-auto max-w-4xl px-6 py-28 md:py-44 text-center">
        {/* Eyebrow */}
        <motion.span
          className="eyebrow text-[var(--accent-light)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {L('Одоо эхлэх', 'Get started today')}
        </motion.span>

        {/* Headline */}
        <motion.h2
          className="mt-5 font-display text-4xl md:text-6xl lg:text-[5rem] font-black tracking-tighter leading-[1.02]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {L('Эхний вэбсайт ', 'Your first website is ')}<br />
          <span className="gradient-text">{L('хоёр минутад', 'two minutes away')}</span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          className="mt-7 text-lg text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {L(
            'AI-д бизнесийнхээ тухай хэлээрэй. Бэлэн вэбсайтаа хэдхэн минутын дараа аваарай.',
            'Tell the AI about your business. Get a ready-to-publish website in just a few minutes.',
          )}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Primary CTA — has gradient border animation */}
          <div className="relative group/btn">
            <div className="gradient-border absolute -inset-[1.5px] rounded-2xl z-0" />
            <Link
              href={`/${locale}/dashboard/sites/new`}
              className="relative z-10 flex items-center gap-2 px-8 py-4 rounded-[14px] bg-[var(--accent)] text-white font-semibold text-base shadow-xl shadow-[var(--accent-soft)] hover:bg-[var(--accent-light)] transition-colors"
            >
              {L('Үнэгүй эхлүүлэх', 'Start for free')}
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </motion.span>
            </Link>
          </div>
          <Link href={`/${locale}/signin`} className="btn btn-outline btn-lg">
            {L('Нэвтрэх', 'Sign in')}
          </Link>
        </motion.div>

        {/* Trust row */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-[var(--text-muted)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.32 }}
        >
          {[
            L('Кредит карт шаардлагагүй', 'No credit card required'),
            L('14 хоног үнэгүй', '14-day free trial'),
            L('2 минутад публиш', 'Live in 2 minutes'),
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-[var(--text-muted)] opacity-50 hidden sm:inline-block" />}
              <span className="flex items-center gap-1.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="2.8" strokeLinecap="round" strokeOpacity="0.8"><polyline points="20 6 9 17 4 12"/></svg>
                {item}
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
