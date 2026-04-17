'use client';

import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CtaSection({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const sectionRef = useRef(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="border-t border-[var(--surface-border)] relative overflow-hidden"
    >
      {/* Interactive mouse glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-200"
        style={{
          background: `radial-gradient(800px circle at ${glow.x}% ${glow.y}%, rgba(124, 92, 255, 0.13), transparent 55%)`,
        }}
      />

      {/* Static ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-b" style={{ top: '-20%', left: '12%', width: '520px', height: '520px' }} />
        <div className="orb orb-c" style={{ bottom: '-20%', right: '12%', width: '520px', height: '520px' }} />
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-28 md:py-40 text-center">
        <motion.span
          className="eyebrow text-[var(--accent-light)]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {L('Одоо эхлэх', 'Get started')}
        </motion.span>

        <motion.h2
          className="mt-5 font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {L('Эхний вэбсайт ', 'Your first website is ')}
          <span className="gradient-text">{L('хоёр минутад', 'two minutes away')}</span>
        </motion.h2>

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

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Link href={`/${locale}/dashboard/sites/new`} className="btn btn-accent btn-lg shine">
            {L('Үнэгүй эхлүүлэх', 'Start for free')}
            <span aria-hidden>&rarr;</span>
          </Link>
          <Link href={`/${locale}/signin`} className="btn btn-outline btn-lg">
            {L('Нэвтрэх', 'Sign in')}
          </Link>
        </motion.div>

        {/* Social proof row */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--text-muted)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span>{L('Кредит карт шаардлагагүй', 'No credit card required')}</span>
          <span className="hidden sm:inline h-1 w-1 rounded-full bg-[var(--text-muted)]" />
          <span>{L('14 хоног үнэгүй', '14-day free trial')}</span>
          <span className="hidden sm:inline h-1 w-1 rounded-full bg-[var(--text-muted)]" />
          <span>{L('2 минутад публиш', 'Live in 2 minutes')}</span>
        </motion.div>
      </div>
    </section>
  );
}
