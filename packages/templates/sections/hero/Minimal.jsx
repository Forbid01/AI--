'use client';

import { motion } from 'framer-motion';
import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function Minimal({ content = {}, theme, business }) {
  const style = themeToCssVars(theme);
  const title = content.title || business?.businessName || '';
  const words = title.split(/\s+/).filter(Boolean);

  return (
    <section
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-40">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            {business?.industry && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="block text-[11px] font-mono text-[var(--muted)] mb-8"
              >
                — {business.industry}
              </motion.span>
            )}
            <h1
              style={{ fontFamily: 'var(--font-heading)' }}
              className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05]"
            >
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
                  className="inline-block mr-[0.25em]"
                >
                  {w}
                </motion.span>
              ))}
            </h1>
          </div>

          {content.subtitle && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 + words.length * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
              className="md:col-span-4"
            >
              <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed border-l border-[var(--hairline)] pl-5">
                {content.subtitle}
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.4 + words.length * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
          style={{ transformOrigin: 'left' }}
          className="mt-16 h-px bg-[var(--hairline)]"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 + words.length * 0.06 }}
          className="mt-8 flex items-center gap-6"
        >
          {content.ctaPrimary && (
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors group"
            >
              {content.ctaPrimary}
              <span
                aria-hidden
                className="inline-block transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          )}
          {content.ctaSecondary && (
            <a
              href="#services"
              className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {content.ctaSecondary}
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}
