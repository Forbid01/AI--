'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { themeToCssVars } from '../_primitives/SectionShell.jsx';
import { HeroVisualPlaceholder } from '../_primitives/VisualPlaceholders.jsx';

export default function FullscreenImage({ content = {}, theme, assets, business }) {
  const style = themeToCssVars(theme);
  const heroUrl = assets?.hero?.url;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      style={style}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
    >
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        {heroUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroUrl}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[var(--background)]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />
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
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 text-center px-6 max-w-5xl"
      >
        {business?.industry && (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="inline-block text-xs font-semibold tracking-[0.3em] uppercase mb-8 text-[var(--foreground)]/80"
          >
            {business.industry}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 40, letterSpacing: '-0.05em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '-0.04em' }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ fontFamily: 'var(--font-heading)' }}
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] drop-shadow-2xl"
        >
          {content.title || business?.businessName}
        </motion.h1>

        {content.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-8 text-lg md:text-2xl text-[var(--foreground)]/90 max-w-2xl mx-auto leading-relaxed"
          >
            {content.subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-12 flex flex-wrap gap-4 justify-center"
        >
          {content.ctaPrimary && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="#contact"
              className="inline-flex items-center justify-center h-14 px-8 rounded-[var(--radius)] text-lg font-semibold shadow-2xl"
              style={{ background: 'var(--accent)', color: 'var(--background)' }}
            >
              {content.ctaPrimary}
            </motion.a>
          )}
          {content.ctaSecondary && (
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="#about"
              className="inline-flex items-center justify-center h-14 px-8 rounded-[var(--radius)] text-lg font-semibold border border-[var(--foreground)]/40 text-[var(--foreground)] backdrop-blur-sm"
            >
              {content.ctaSecondary}
            </motion.a>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--foreground)]/60">Scroll</span>
        <div className="h-8 w-px bg-[var(--foreground)]/30" />
      </motion.div>
    </section>
  );
}
