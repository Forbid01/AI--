'use client';

import { motion } from 'framer-motion';

const STEP_ICONS = [
  <svg key="chat" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>,
  <svg key="layout" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>,
  <svg key="bolt" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>,
];

export default function HowItWorks({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  const steps = [
    {
      step: '01',
      icon: STEP_ICONS[0],
      title: L('AI-д хэл', 'Prompt the AI'),
      desc: L(
        'Бизнесийнхээ тухай хэдэн үг бичих — AI тодруулах асуулт асууна.',
        'Describe your business in one line — the AI follows up to sharpen the brief.',
      ),
      detail: L('Таны салбарыг ойлгоно', 'Understands your niche'),
    },
    {
      step: '02',
      icon: STEP_ICONS[1],
      title: L('Санал авах', 'Get a draft'),
      desc: L(
        'AI агуулга, hero зураг, template + палитр санал болгоно.',
        'AI writes the copy, renders a hero image, and a curated template locks it in.',
      ),
      detail: L('Секундэд бэлэн болно', 'Ready in seconds'),
    },
    {
      step: '03',
      icon: STEP_ICONS[2],
      title: L('Публиш хийх', 'Publish it'),
      desc: L(
        'Өөрийн домэйн эсвэл subdomain-аар нэг товчлуур дарж публиш.',
        'One click to push live — on a subdomain or your own custom domain.',
      ),
      detail: L('HTTPS автоматаар', 'HTTPS auto-provisioned'),
    },
  ];

  return (
    <section className="relative">
      <div className="absolute inset-0 pointer-events-none opacity-50 dot-pattern" />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">

        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="eyebrow text-[var(--accent-light)]">{L('Хэрхэн ажилладаг', 'How it works')}</span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl font-black tracking-tighter leading-[1.02]">
            {L('Гурван ', 'Three ')}
            <span className="gradient-text">{L('нарийн алхам', 'careful steps')}</span>
          </h2>
        </motion.div>

        <div className="mt-16 relative">
          {/* Animated connector line — desktop only */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+32px)] right-[calc(16.67%+32px)] h-px overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)]"
              style={{ originX: 0 }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-8">
            {steps.map((s, i) => (
              <motion.article
                key={s.step}
                className="card p-8 group relative"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                whileHover={{ y: -5, boxShadow: '0 22px 60px -20px rgba(124, 92, 255, 0.35)', transition: { duration: 0.3 } }}
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    className="h-[52px] w-[52px] rounded-xl bg-gradient-to-br from-[var(--accent-soft)] to-transparent border border-[var(--surface-border)] text-[var(--accent-light)] grid place-items-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {s.icon}
                  </motion.div>
                  <span className="font-mono text-xs text-[var(--text-muted)] tabular">{s.step}</span>
                </div>

                <h3 className="font-display text-xl font-bold tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{s.desc}</p>

                <div className="mt-6 pt-5 border-t border-[var(--surface-border)] flex items-center gap-2">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-[var(--success)]"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
                  />
                  <span className="text-xs text-[var(--text-muted)] font-mono">{s.detail}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
