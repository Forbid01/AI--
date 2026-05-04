/**
 * AiCustomerAvatar
 *
 * CSS-only gradient avatars — zero network requests, instant render.
 * Previously used a 2 MB PNG sprite which caused visible load lag on the landing page.
 * Each index maps to a unique gradient + silhouette colour so avatars feel distinct.
 */

const PALETTES = [
  {
    bg:      'linear-gradient(145deg, #2e1065 0%, #7c3aed 45%, #a855f7 75%, #c4b5fd 100%)',
    skin:    '#fde8a8',
    hair:    '#1e0a3c',
    shadow:  'rgba(124,58,237,0.55)',
  },
  {
    bg:      'linear-gradient(145deg, #082f49 0%, #0891b2 45%, #22d3ee 75%, #a5f3fc 100%)',
    skin:    '#fcd34d',
    hair:    '#0c1a2e',
    shadow:  'rgba(8,145,178,0.55)',
  },
  {
    bg:      'linear-gradient(145deg, #4a044e 0%, #be185d 45%, #ec4899 75%, #fbcfe8 100%)',
    skin:    '#fef9c3',
    hair:    '#3b0764',
    shadow:  'rgba(190,24,93,0.55)',
  },
  {
    bg:      'linear-gradient(145deg, #431407 0%, #b45309 45%, #f59e0b 75%, #fef08a 100%)',
    skin:    '#fef3c7',
    hair:    '#1c0a03',
    shadow:  'rgba(180,83,9,0.55)',
  },
  {
    bg:      'linear-gradient(145deg, #0f172a 0%, #1d4ed8 45%, #3b82f6 75%, #bfdbfe 100%)',
    skin:    '#fef9c3',
    hair:    '#0f172a',
    shadow:  'rgba(29,78,216,0.55)',
  },
];

// Simple human silhouette: head + shoulders, scales to any size via viewBox
function Silhouette({ skin, hair }) {
  return (
    <svg
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      {/* Hair / top of head */}
      <ellipse cx="20" cy="13.5" rx="8.5" ry="9" fill={hair} />
      {/* Face */}
      <ellipse cx="20" cy="15" rx="7" ry="7.8" fill={skin} />
      {/* Neck */}
      <rect x="17.5" y="21" width="5" height="4" rx="1" fill={skin} />
      {/* Shoulders */}
      <path d="M6 40 Q8 28 20 27 Q32 28 34 40 Z" fill={hair} opacity="0.85" />
    </svg>
  );
}

export default function AiCustomerAvatar({
  index    = 0,
  size     = 'h-8 w-8',
  className = '',
  label    = 'AI-generated customer portrait',
  // priority is accepted for API compatibility but has no effect (CSS renders instantly)
  // eslint-disable-next-line no-unused-vars
  priority,
}) {
  const p = PALETTES[Math.abs(index) % PALETTES.length];

  return (
    <span
      role="img"
      aria-label={label}
      className={`${size} shrink-0 rounded-full overflow-hidden relative inline-block ${className}`}
      style={{
        background:  p.bg,
        boxShadow:   `0 2px 12px ${p.shadow}`,
        flexShrink:  0,
      }}
    >
      <Silhouette skin={p.skin} hair={p.hair} />
    </span>
  );
}
