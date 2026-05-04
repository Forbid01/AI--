'use client';

import { motion } from 'framer-motion';
import { themeToCssVars } from '../_primitives/SectionShell.jsx';
import { HeroVisualPlaceholder } from '../_primitives/VisualPlaceholders.jsx';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.2, 0.8, 0.2, 1] } },
};
const image = {
  hidden: { opacity: 0, x: 40, scale: 0.96 },
  show: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } },
};

export default function SplitImage({ content = {}, theme, assets, business, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const heroUrl = assets?.hero?.url;

  return (
    <section
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center"
      >
        <div className="order-2 md:order-1">
          {business?.industry && (
            <motion.span
              variants={item}
              className="inline-block text-[11px] font-semibold tracking-[0.18em] uppercase text-[var(--accent)] mb-4"
            >
              {business.industry}
            </motion.span>
          )}
          <motion.h1
            variants={item}
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05]"
          >
            {content.title || business?.businessName}
          </motion.h1>
          {content.subtitle && (
            <motion.p
              variants={item}
              className="mt-5 text-lg text-[var(--muted)] leading-relaxed max-w-xl"
            >
              {content.subtitle}
            </motion.p>
          )}
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            {content.ctaPrimary && (
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="#contact"
                className="inline-flex items-center justify-center h-12 px-6 rounded-[var(--radius)] font-semibold"
                style={{ background: 'var(--accent)', color: 'var(--background)' }}
              >
                {content.ctaPrimary}
              </motion.a>
            )}
            {content.ctaSecondary && (
              <motion.a
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                href="#services"
                className="inline-flex items-center justify-center h-12 px-6 rounded-[var(--radius)] font-semibold border border-[var(--hairline)] text-[var(--foreground)]"
              >
                {content.ctaSecondary}
              </motion.a>
            )}
          </motion.div>
        </div>

        <motion.div variants={image} className="order-1 md:order-2 relative">
          <div
            className="relative aspect-[4/5] rounded-[var(--radius)] overflow-hidden"
            style={{ background: `linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, var(--background)))` }}
          >
            {heroUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <motion.img
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
                src={heroUrl}
                alt={business?.businessName ?? ''}
                className="w-full h-full object-cover"
              />
            ) : (
              <HeroVisualPlaceholder
                businessName={business?.businessName}
                industry={business?.industry}
                className="absolute inset-0"
              />
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-[var(--foreground)]/10 rounded-[inherit] pointer-events-none" />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
            whileInView={{ opacity: 0.15, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute -bottom-6 -left-6 w-24 h-24 rounded-[var(--radius)] border border-[var(--hairline)] hidden md:block"
            style={{ background: 'var(--accent)' }}
            aria-hidden
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
