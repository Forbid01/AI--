import Icon from './Icon.jsx';

const TONES = {
  accent:  { solid: 'bg-[var(--accent)] text-white',             soft: 'bg-[var(--accent-soft)] text-[var(--accent-light)]',       outline: 'border-[var(--accent)] text-[var(--accent-light)]',          dot: 'var(--accent)' },
  success: { solid: 'bg-[var(--success)] text-white',            soft: 'bg-[rgba(16,185,129,0.15)] text-[var(--success)]',          outline: 'border-[var(--success)] text-[var(--success)]',               dot: 'var(--success)' },
  warn:    { solid: 'bg-[var(--warn)] text-white',               soft: 'bg-[rgba(245,158,11,0.15)] text-[var(--warn)]',             outline: 'border-[var(--warn)] text-[var(--warn)]',                     dot: 'var(--warn)' },
  danger:  { solid: 'bg-[var(--danger)] text-white',             soft: 'bg-[rgba(239,68,68,0.15)] text-[var(--danger)]',            outline: 'border-[var(--danger)] text-[var(--danger)]',                 dot: 'var(--danger)' },
  neutral: { solid: 'bg-[var(--surface-raised)] text-[var(--text-secondary)]', soft: 'bg-[var(--glass-subtle)] text-[var(--text-tertiary)]', outline: 'border-[var(--surface-border-strong)] text-[var(--text-secondary)]', dot: 'var(--text-muted)' },
};

const SIZES = {
  xs: 'text-[10px] px-1.5 py-0.5 gap-1 rounded-full',
  sm: 'text-[11px] px-2 py-0.5 gap-1 rounded-full',
  md: 'text-[12px] px-2.5 py-1 gap-1.5 rounded-full',
};

export default function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  size = 'sm',
  icon,
  dot = false,
  uppercase = true,
  className = '',
  ...props
}) {
  const t = TONES[tone] ?? TONES.neutral;
  const s = SIZES[size] ?? SIZES.sm;
  const variantClass = variant === 'outline' ? `border bg-transparent ${t.outline}` : t[variant];

  return (
    <span
      className={[
        'inline-flex items-center font-semibold tracking-wider whitespace-nowrap',
        uppercase && 'uppercase',
        variantClass,
        s,
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full shrink-0"
          style={{ background: t.dot }}
          aria-hidden
        />
      )}
      {icon && <Icon name={icon} size={11} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
