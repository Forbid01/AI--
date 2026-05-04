'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import AiCustomerAvatar from './AiCustomerAvatar.jsx';

const TESTIMONIALS = [
  {
    mn: 'Маркетингийн баггүй байсан ч меню, зураг, англи хуудастай сайтаа нэг өдөрт гаргасан.',
    en: 'Without a marketing team, we launched a menu, imagery, and English pages in one afternoon.',
    author: 'Нараа — Nomad Coffee',
    metric: { mn: '1 өдөрт live', en: 'Live in 1 day' },
  },
  {
    mn: 'Hero зураг, үйлчилгээний текстээ AI-аар гаргаад Instagram-аас ирсэн захиалга шууд нэмэгдсэн.',
    en: 'AI-generated hero images and service copy helped turn Instagram traffic into bookings.',
    author: 'Батаа — Zaisan Yoga',
    metric: { mn: '+18% захиалга', en: '+18% bookings' },
  },
  {
    mn: 'Монгол, англи контент зэрэг бэлэн болсон. Гадаад зочид өрөөний мэдээллээ өөрсдөө олдог болсон.',
    en: 'MN and EN content shipped together. Foreign guests now find room details without calling.',
    author: 'Оюу — Gobi Boutique Hotel',
    metric: { mn: 'MN/EN бэлэн', en: 'MN/EN ready' },
  },
  {
    mn: 'Бэлэн template-ээс эхэлсэн ч брэндийн өнгө, зурагтайгаа яг манайх шиг харагдсан.',
    en: 'We started from a template, but the palette and imagery made it feel completely ours.',
    author: 'Sukhee — Atelier UB',
    metric: { mn: '23 template', en: '23 templates' },
  },
  {
    mn: 'QPay, SocialPay flow бэлэн байсан болохоор checkout дээр дахиж хөгжүүлэлт хийх шаардлагагүй болсон.',
    en: 'QPay and SocialPay were already there, so we did not spend another sprint on checkout.',
    author: 'Tuul — Khuree Studio',
    metric: { mn: 'Local pay ready', en: 'Local pay ready' },
  },
];

export default function TestimonialsMarquee({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const trackRef = useRef(null);

  const pauseMarquee = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused';
  };
  const resumeMarquee = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running';
  };

  return (
    <section className="border-t border-[var(--surface-border)]">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="eyebrow text-[var(--accent-light)]">{L('Хэрэглэгчид', 'Loved by teams')}</span>
          <h2 className="mt-4 font-display text-2xl md:text-3xl font-black tracking-tighter">
            {L('Монголын жижиг бизнест зориулсан', 'Built for Mongolian small businesses')}
          </h2>
        </motion.div>
      </div>

      {/* Marquee — hover to pause */}
      <div
        className="marquee py-6"
        onMouseEnter={pauseMarquee}
        onMouseLeave={resumeMarquee}
      >
        <div ref={trackRef} className="marquee-track">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <figure
              key={i}
              className="w-[340px] shrink-0 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-[var(--accent-light)]/25 hover:bg-[var(--surface-raised)] hover:shadow-xl hover:shadow-black/20"
            >
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 1l1.2 3.7H11L8.1 6.9l1.2 3.7L6 8.5l-3.3 2.1 1.2-3.7L1 4.7h3.8z"
                      fill="var(--accent-light)"
                      opacity="0.8"
                    />
                  </svg>
                ))}
                <span className="ml-auto rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-emerald-300">
                  {t.metric?.[locale] ?? t.metric?.en}
                </span>
              </div>
              <blockquote className="text-sm leading-relaxed text-[var(--text-primary)]">
                &ldquo;{t[locale] ?? t.en}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <AiCustomerAvatar
                  index={i}
                  size="h-9 w-9"
                  className="border border-white/10 shadow-lg shadow-black/20"
                  label={L('AI-аар үүсгэсэн хэрэглэгчийн зураг', 'AI-generated customer portrait')}
                />
                <span className="text-xs text-[var(--text-tertiary)] font-mono">
                  — {t.author}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
