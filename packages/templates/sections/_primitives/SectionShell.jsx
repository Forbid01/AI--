/**
 * SectionShell — common wrapper for all section variants.
 * Applies theme CSS variables + consistent padding/max-width.
 */

export function themeToCssVars(theme = {}) {
  return {
    '--primary': theme.primary ?? '#0f172a',
    '--accent': theme.accent ?? '#7c5cff',
    '--background': theme.background ?? '#ffffff',
    '--foreground': theme.foreground ?? '#0f172a',
    '--muted': `color-mix(in srgb, ${theme.foreground ?? '#0f172a'} 55%, transparent)`,
    '--hairline': `color-mix(in srgb, ${theme.foreground ?? '#0f172a'} 12%, transparent)`,
    '--font-heading': theme.fontHeading
      ? `${theme.fontHeading}, ui-sans-serif, system-ui, sans-serif`
      : 'ui-sans-serif, system-ui, sans-serif',
    '--font-body': theme.fontBody
      ? `${theme.fontBody}, ui-sans-serif, system-ui, sans-serif`
      : 'ui-sans-serif, system-ui, sans-serif',
    '--radius': radiusValue(theme.radius),
  };
}

function radiusValue(key) {
  const map = { none: '0', sm: '4px', md: '8px', lg: '14px', xl: '20px', '2xl': '28px', full: '9999px' };
  return map[key] ?? map.md;
}

export default function SectionShell({
  as: Tag = 'section',
  id,
  size = 'md',
  background = 'transparent',
  className = '',
  style = {},
  children,
}) {
  const maxW = {
    sm: 'max-w-4xl',
    md: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-none',
  }[size] ?? 'max-w-6xl';

  const padY = {
    sm: 'py-12 md:py-16',
    md: 'py-16 md:py-24',
    lg: 'py-20 md:py-32',
    full: '',
  }[size] ?? 'py-16 md:py-24';

  return (
    <Tag
      id={id}
      style={style}
      className={[
        'relative',
        background !== 'transparent' && `bg-[${background}]`,
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className={`${maxW} mx-auto px-6 ${padY}`}>{children}</div>
    </Tag>
  );
}

export function L(locale, mn, en) {
  return locale === 'mn' ? mn : en;
}
