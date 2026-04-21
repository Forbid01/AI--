'use client';

import { createContext, useContext, useId, useState } from 'react';
import { motion } from 'framer-motion';

const TabsCtx = createContext(null);

export function Tabs({ defaultValue, value, onValueChange, children, className = '' }) {
  const [internal, setInternal] = useState(defaultValue);
  const v = value ?? internal;
  const setV = (next) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  const baseId = useId();
  return (
    <TabsCtx.Provider value={{ value: v, setValue: setV, baseId }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabList({ children, className = '' }) {
  return (
    <div
      role="tablist"
      className={[
        'inline-flex items-center gap-1 p-1 rounded-[var(--radius-xl)]',
        'bg-[var(--surface)] border border-[var(--surface-border)]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

export function Tab({ value, children, icon: _iconIgnored, disabled = false }) {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error('Tab must be a child of Tabs');
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      disabled={disabled}
      id={`${ctx.baseId}-tab-${value}`}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      onClick={() => ctx.setValue(value)}
      className={[
        'relative px-3.5 h-8 rounded-[var(--radius-md)] text-[var(--text-sm)] font-medium',
        'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-smooth)]',
        disabled && 'opacity-50 pointer-events-none',
        active
          ? 'text-white'
          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]',
      ].filter(Boolean).join(' ')}
    >
      {active && (
        <motion.span
          layoutId={`${ctx.baseId}-tab-indicator`}
          className="absolute inset-0 bg-[var(--accent)] rounded-[var(--radius-md)] -z-0"
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function TabPanel({ value, children, className = '' }) {
  const ctx = useContext(TabsCtx);
  if (!ctx) throw new Error('TabPanel must be a child of Tabs');
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      className={className}
    >
      {children}
    </div>
  );
}
