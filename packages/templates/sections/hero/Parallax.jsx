'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { themeToCssVars } from '../_primitives/SectionShell.jsx';
import { HeroVisualPlaceholder } from '../_primitives/VisualPlaceholders.jsx';

export default function Parallax({ content = {}, theme, assets, business }) {
  const style = themeToCssVars(theme);
  const heroUrl = assets?.hero?.url;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  return (
    <section
      ref={ref}
      style={style}
      className="relative overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="relative min-h-[92vh] flex items-end">
        <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
          {heroUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroUrl}
                alt=""
                className="w-full h-full object-cover scale-110"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/70 via-transparent to-transparent" />
            </>
        ) : (
            <HeroVisualPlaceholder
              businessName={business?.businessName}
              industry={business?.industry}
              mode="immersive"
              className="h-full w-full"
            />
        )}
      </motion.div>

        <motion.div
          style={{ y: textY }}
          className="relative w-full max-w-7xl mx-auto px-6 py-20 md:py-32"
        >
          {business?.industry && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="h-px w-12 bg-[var(--accent)]" />
              <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)]">
                {business.industry}
              </span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ fontFamily: 'var(--font-heading)' }}
            className="max-w-3xl text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]"
          >
            {content.title || business?.businessName}
          </motion.h1>

          {content.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="mt-6 max-w-xl text-lg md:text-xl text-[var(--muted)] leading-relaxed"
            >
              {content.subtitle}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-10 flex flex-wrap gap-3"
          >
            {content.ctaPrimary && (
              <motion.a
                whileHover={{ scale: 1.05, x: 4 }}
                whileTap={{ scale: 0.97 }}
                href="#contact"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-[var(--radius)] font-semibold shadow-lg"
                style={{ background: 'var(--accent)', color: 'var(--background)' }}
              >
                {content.ctaPrimary}
                <motion.span aria-hidden animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>→</motion.span>
              </motion.a>
            )}
            {content.ctaSecondary && (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#about"
                className="inline-flex items-center h-12 px-7 rounded-[var(--radius)] font-semibold border border-[var(--foreground)]/30 text-[var(--foreground)] backdrop-blur-sm"
              >
                {content.ctaSecondary}
              </motion.a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
