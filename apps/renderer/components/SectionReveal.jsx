'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PRESETS = {
  up:    { hidden: { opacity: 0, y: 48 },        show: { opacity: 1, y: 0 } },
  fade:  { hidden: { opacity: 0 },                show: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.965 }, show: { opacity: 1, scale: 1 } },
  left:  { hidden: { opacity: 0, x: -60 },       show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 60 },        show: { opacity: 1, x: 0 } },
};

const TYPE_VARIANT = {
  hero: 'fade',
  nav: 'fade',
  about: 'up',
  stats: 'scale',
  services: 'up',
  features: 'up',
  process: 'left',
  testimonials: 'scale',
  gallery: 'up',
  faq: 'up',
  cta: 'scale',
  contact: 'up',
  footer: 'fade',
};

export default function SectionReveal({ children, type, index = 0 }) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '0px 0px -8% 0px',
    initialInView: index === 0,
  });

  const variantKey = TYPE_VARIANT[type] ?? 'up';
  const preset = PRESETS[variantKey];

  if (reduced) {
    return <div ref={ref}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      variants={preset}
      transition={{
        duration: 0.85,
        delay: Math.min(index * 0.05, 0.2),
        ease: [0.2, 0.8, 0.2, 1],
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
