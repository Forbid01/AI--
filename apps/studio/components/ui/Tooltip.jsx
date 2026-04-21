'use client';

import { useState, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SIDES = {
  top:    'bottom-full mb-2 left-1/2 -translate-x-1/2',
  bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
  left:   'right-full mr-2 top-1/2 -translate-y-1/2',
  right:  'left-full ml-2 top-1/2 -translate-y-1/2',
};

const INITIAL = {
  top:    { y: 4, opacity: 0 },
  bottom: { y: -4, opacity: 0 },
  left:   { x: 4, opacity: 0 },
  right:  { x: -4, opacity: 0 },
};

export default function Tooltip({ content, side = 'top', shortcut, delay = 400, children }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const id = useId();

  function show() {
    timer.current = setTimeout(() => setOpen(true), delay);
  }
  function hide() {
    clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      <AnimatePresence>
        {open && content && (
          <motion.span
            id={id}
            role="tooltip"
            initial={INITIAL[side]}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={INITIAL[side]}
            transition={{ duration: 0.14, ease: [0.2, 0.8, 0.2, 1] }}
            className={[
              'absolute z-[var(--z-tooltip)] pointer-events-none',
              'px-2.5 py-1.5 rounded-[var(--radius-md)]',
              'bg-[var(--bg-elevated)] border border-[var(--surface-border-strong)]',
              'text-[var(--text-xs)] text-[var(--text-primary)] font-medium whitespace-nowrap',
              'shadow-[var(--shadow-lg)] flex items-center gap-2',
              SIDES[side] ?? SIDES.top,
            ].join(' ')}
          >
            {content}
            {shortcut && (
              <kbd className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--glass-subtle)] border border-[var(--surface-border)] px-1 rounded">
                {shortcut}
              </kbd>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
