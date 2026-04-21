'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon.jsx';

const WIDTHS = {
  sm:   'max-w-md',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

export default function Dialog({
  open,
  onClose,
  title,
  description,
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  footer,
  children,
  className = '',
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, closeOnEscape]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const handleOverlayClick = useCallback((e) => {
    if (!closeOnOverlay) return;
    if (e.target === e.currentTarget) onClose?.();
  }, [onClose, closeOnOverlay]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[var(--z-dialog)] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 4 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className={[
              'relative w-full',
              WIDTHS[size] ?? WIDTHS.md,
              'bg-[var(--surface-raised)] border border-[var(--surface-border-strong)]',
              'rounded-[var(--radius-2xl)] shadow-[var(--shadow-2xl)]',
              'max-h-[calc(100vh-4rem)] flex flex-col',
              className,
            ].join(' ')}
            tabIndex={-1}
          >
            {(title || showClose) && (
              <div className="flex items-start justify-between gap-4 p-6 border-b border-[var(--surface-border)]">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h2 className="font-display text-[var(--text-xl)] font-bold tracking-tight truncate">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-[var(--text-sm)] text-[var(--text-secondary)]">
                      {description}
                    </p>
                  )}
                </div>
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Хаах"
                    className="shrink-0 h-8 w-8 rounded-[var(--radius-md)] grid place-items-center text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Icon name="x" size={16} strokeWidth={2} />
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-6">{children}</div>

            {footer && (
              <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--surface-border)] bg-[var(--bg-secondary)]/40 rounded-b-[var(--radius-2xl)]">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
