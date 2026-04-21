export default function Skeleton({
  width,
  height,
  radius = 'md',
  shape = 'rect',
  className = '',
  style = {},
  ...props
}) {
  const radiusMap = {
    xs: 'var(--radius-xs)',
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    full: 'var(--radius-full)',
  };

  const baseStyle = {
    width: width ?? (shape === 'circle' ? height : '100%'),
    height: height ?? '1em',
    borderRadius: shape === 'circle' ? 'var(--radius-full)' : (radiusMap[radius] ?? radiusMap.md),
    ...style,
  };

  return (
    <div
      className={`shimmer ${className}`}
      style={{
        ...baseStyle,
        background: 'linear-gradient(90deg, var(--glass-subtle) 0%, var(--glass-medium) 50%, var(--glass-subtle) 100%)',
        backgroundSize: '200% 100%',
      }}
      role="status"
      aria-label="Уншиж байна"
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, lastWidth = '60%', className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.8em"
          width={i === lines - 1 ? lastWidth : '100%'}
          radius="sm"
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ imageHeight = 144, textLines = 2, className = '' }) {
  return (
    <div
      className={`rounded-[var(--radius-xl)] border border-[var(--surface-border)] bg-[var(--surface)] overflow-hidden ${className}`}
    >
      <Skeleton height={imageHeight} radius="xs" style={{ borderRadius: 0 }} />
      <div className="p-4 space-y-2.5">
        <Skeleton height="1em" width="70%" />
        <SkeletonText lines={textLines} lastWidth="45%" />
      </div>
    </div>
  );
}
