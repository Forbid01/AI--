'use client';

import { forwardRef, useCallback, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const VARIANTS = {
  flat:     'bg-[var(--surface)] border border-[var(--surface-border)]',
  glass:    'bg-[var(--glass-medium)] border border-[var(--glass-strong)] backdrop-blur-md',
  elevated: 'bg-[var(--surface-raised)] border border-[var(--surface-border-strong)] shadow-[var(--shadow-md)]',
  gradient: 'border border-[var(--surface-border)] bg-gradient-to-br from-[var(--bg-secondary)] via-[var(--bg-tertiary)] to-[#1a102e]',
  outline:  'bg-transparent border border-[var(--surface-border-strong)]',
};

const PADDING = {
  none: 'p-0',
  sm:   'p-3',
  md:   'p-5',
  lg:   'p-7',
  xl:   'p-10',
};

const RADIUS = {
  sm: 'rounded-[var(--radius-md)]',
  md: 'rounded-[var(--radius-lg)]',
  lg: 'rounded-[var(--radius-xl)]',
  xl: 'rounded-[var(--radius-2xl)]',
};

const Card = forwardRef(function Card(
  {
    variant = 'flat',
    padding = 'md',
    radius = 'lg',
    tilt = false,
    tiltIntensity = 8,
    glow = false,
    interactive = false,
    className = '',
    style = {},
    children,
    onClick,
    ...props
  },
  ref,
) {
  const cardRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springCfg = { stiffness: 220, damping: 22 };
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [tiltIntensity, -tiltIntensity]), springCfg);
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-tiltIntensity, tiltIntensity]), springCfg);
  const glowX = useTransform(rawX, [-1, 1], [0, 100]);
  const glowY = useTransform(rawY, [-1, 1], [0, 100]);
  const specular = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.07) 0%, transparent 55%)`
  );

  const handleMove = useCallback((e) => {
    if (!tilt) return;
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  }, [rawX, rawY, tilt]);

  const handleLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  const classes = [
    VARIANTS[variant] ?? VARIANTS.flat,
    PADDING[padding] ?? PADDING.md,
    RADIUS[radius] ?? RADIUS.lg,
    'relative transition-all duration-[var(--duration-normal)] ease-[var(--ease-smooth)]',
    interactive && 'cursor-pointer hover:border-[var(--surface-border-strong)]',
    glow && 'hover:shadow-[var(--shadow-glow-accent)]',
    className,
  ].filter(Boolean).join(' ');

  if (!tilt) {
    return (
      <div ref={ref ?? cardRef} className={classes} style={style} onClick={onClick} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref ?? cardRef}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d', ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ background: specular }}
        />
      )}
      {children}
    </motion.div>
  );
});

export default Card;
