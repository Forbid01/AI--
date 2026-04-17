'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    mn: 'Бидэнд маркетингийн баг байгаагүй. AiWeb нэг өдрийн дотор вэбсайт бэлдэж өгсөн.',
    en: 'We didn\u2019t have a marketing team. AiWeb spun up a site for us in an afternoon.',
    author: 'Нараа — Nomad Coffee',
  },
  {
    mn: 'Хамгийн гоё нь зураг бэлэн үүсгэгддэг. Flux-ийн чанар үнэхээр өндөр.',
    en: 'The best part: imagery is generated on the fly. Flux quality is surprisingly high.',
    author: 'Батаа — Zaisan Yoga',
  },
  {
    mn: 'Монгол + англи контент зэрэг бэлдсэн. Гадаад зочдод маш таалагдсан.',
    en: 'Content came out in both MN and EN. Foreign guests love it.',
    author: 'Оюу — Gobi Boutique Hotel',
  },
  {
    mn: 'Дизайн нь үнэхээр орчин үеийн. Бусад platform-оос илүү гэж хэлж чадна.',
    en: 'The design feels properly modern. Ahead of most other builders.',
    author: 'Sukhee — Atelier UB',
  },
  {
    mn: 'QPay, SocialPay гэх мэт төлбөр бэлэн холбогдсон — бидэнд цаг хэмнэсэн.',
    en: 'QPay and SocialPay hookups are wired in — saved us a full sprint.',
    author: 'Tuul — Khuree Studio',
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
              </div>
              <blockquote className="text-sm leading-relaxed text-[var(--text-primary)]">
                &ldquo;{t[locale] ?? t.en}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-xs text-[var(--text-tertiary)] font-mono">
                — {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
