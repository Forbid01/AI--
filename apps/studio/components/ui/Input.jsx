'use client';

import { forwardRef, useId, useState } from 'react';
import Icon from './Icon.jsx';

const SIZES = {
  sm: 'h-9 text-[var(--text-sm)] px-3 rounded-[var(--radius-md)]',
  md: 'h-11 text-[var(--text-sm)] px-3.5 rounded-[var(--radius-lg)]',
  lg: 'h-12 text-[var(--text-base)] px-4 rounded-[var(--radius-lg)]',
};

const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    icon,
    iconRight,
    size = 'md',
    type = 'text',
    disabled = false,
    required = false,
    fullWidth = true,
    className = '',
    id: idProp,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const effectiveType = isPassword && showPassword ? 'text' : type;

  const containerClasses = [
    'relative flex items-center',
    'bg-[var(--glass-subtle)] border',
    focused && !error ? 'border-[var(--accent)]/60 bg-[var(--glass-medium)]' : 'border-[var(--surface-border)]',
    error ? '!border-[var(--danger)]' : '',
    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-smooth)]',
    SIZES[size] ?? SIZES.md,
    disabled && 'opacity-50 pointer-events-none',
  ].filter(Boolean).join(' ');

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[var(--text-sm)] font-medium text-[var(--text-secondary)] mb-1.5"
        >
          {label}
          {required && <span className="ml-0.5 text-[var(--danger)]">*</span>}
        </label>
      )}

      <div className={containerClasses}>
        {icon && (
          <span className="shrink-0 pl-0 pr-2 text-[var(--text-muted)]">
            <Icon name={icon} size={15} strokeWidth={2} />
          </span>
        )}

        <input
          ref={ref}
          id={id}
          type={effectiveType}
          disabled={disabled}
          required={required}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={[
            'flex-1 min-w-0 bg-transparent outline-none',
            'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
            'disabled:cursor-not-allowed',
            className,
          ].join(' ')}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="shrink-0 pl-2 pr-0 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            aria-label={showPassword ? 'Нууц үгийг нуух' : 'Нууц үг харах'}
            tabIndex={-1}
          >
            <Icon name={showPassword ? 'eyeOff' : 'eye'} size={15} strokeWidth={2} />
          </button>
        )}

        {iconRight && !isPassword && (
          <span className="shrink-0 pl-2 pr-0 text-[var(--text-muted)]">
            <Icon name={iconRight} size={15} strokeWidth={2} />
          </span>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[var(--text-xs)] text-[var(--danger)] flex items-center gap-1">
          <Icon name="alert" size={11} strokeWidth={2.5} />
          {error}
        </p>
      )}

      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[var(--text-xs)] text-[var(--text-muted)]">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
