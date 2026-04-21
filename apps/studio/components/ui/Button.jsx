'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Icon from './Icon.jsx';

const VARIANTS = {
  accent: {
    base: 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-[var(--shadow-glow-accent)]',
    hover: 'hover:bg-[var(--accent-light)] hover:border-[var(--accent-light)]',
  },
  ghost: {
    base: 'bg-transparent text-[var(--text-secondary)] border-transparent',
    hover: 'hover:bg-[var(--surface)] hover:text-[var(--text-primary)]',
  },
  outline: {
    base: 'bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--surface-border)]',
    hover: 'hover:bg-[var(--surface-raised)] hover:border-[var(--surface-border-strong)] hover:text-[var(--text-primary)]',
  },
  soft: {
    base: 'bg-[var(--accent-soft)] text-[var(--accent-light)] border-transparent',
    hover: 'hover:bg-[var(--accent-soft)] hover:brightness-125',
  },
  destructive: {
    base: 'bg-[var(--danger)] text-white border-[var(--danger)]',
    hover: 'hover:brightness-110',
  },
  gradient: {
    base: 'text-white border-transparent bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)] shadow-[var(--shadow-glow-accent)]',
    hover: 'hover:brightness-110',
  },
};

const SIZES = {
  xs: 'h-7 px-2.5 text-[var(--text-xs)] gap-1 rounded-[var(--radius-md)]',
  sm: 'h-9 px-3.5 text-[var(--text-sm)] gap-1.5 rounded-[var(--radius-md)]',
  md: 'h-10 px-4 text-[var(--text-sm)] gap-2 rounded-[var(--radius-lg)]',
  lg: 'h-12 px-5 text-[var(--text-base)] gap-2 rounded-[var(--radius-lg)]',
  xl: 'h-14 px-6 text-[var(--text-md)] gap-2.5 rounded-[var(--radius-xl)]',
};

const ICON_SIZE = { xs: 11, sm: 13, md: 14, lg: 16, xl: 18 };

const Button = forwardRef(function Button(
  {
    variant = 'accent',
    size = 'md',
    icon,
    iconRight,
    loading = false,
    disabled = false,
    fullWidth = false,
    as = 'button',
    className = '',
    children,
    ...props
  },
  ref,
) {
  const v = VARIANTS[variant] ?? VARIANTS.accent;
  const s = SIZES[size] ?? SIZES.md;
  const isDisabled = disabled || loading;

  const classes = [
    'inline-flex items-center justify-center font-semibold border',
    'transition-all duration-[var(--duration-fast)] ease-[var(--ease-smooth)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]',
    v.base,
    !isDisabled && v.hover,
    s,
    fullWidth && 'w-full',
    isDisabled && 'opacity-50 pointer-events-none',
    className,
  ].filter(Boolean).join(' ');

  const ButtonEl = as === 'a' ? motion.a : motion.button;
  const iconPx = ICON_SIZE[size] ?? 14;

  return (
    <ButtonEl
      ref={ref}
      whileTap={isDisabled ? {} : { scale: 0.97 }}
      className={classes}
      disabled={as === 'button' ? isDisabled : undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span className="flex gap-0.5" aria-hidden>
          <span className="typing-dot h-1 w-1 rounded-full bg-current" />
          <span className="typing-dot h-1 w-1 rounded-full bg-current" />
          <span className="typing-dot h-1 w-1 rounded-full bg-current" />
        </span>
      ) : (
        <>
          {icon && <Icon name={icon} size={iconPx} strokeWidth={2} />}
          {children}
          {iconRight && <Icon name={iconRight} size={iconPx} strokeWidth={2} />}
        </>
      )}
    </ButtonEl>
  );
});

export default Button;
