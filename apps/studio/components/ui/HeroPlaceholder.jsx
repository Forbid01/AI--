'use client';

import { useEffect, useState } from 'react';
import Skeleton from './Skeleton.jsx';

function hashGradient(name = '') {
  const palettes = [
    ['#7c5cff', '#c084fc'],
    ['#ec4899', '#8b5cf6'],
    ['#10b981', '#06b6d4'],
    ['#f59e0b', '#ef4444'],
    ['#3b82f6', '#6366f1'],
  ];
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

/**
 * Smart hero placeholder for site cards.
 *
 * - If `heroUrl` exists → render image.
 * - If `generating` → show shimmer overlay on gradient background.
 * - Otherwise → branded gradient + letter monogram + glass strip.
 *
 * Auto-triggers `onRequestGenerate` once when mounted with no image + no ongoing generation,
 * but only after a short grace period (so cards that already queued a job don't double-trigger).
 */
export default function HeroPlaceholder({
  name = '',
  heroUrl,
  generating = false,
  onRequestGenerate,
  autoGenerate = true,
  className = '',
}) {
  const [g1, g2] = hashGradient(name);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!autoGenerate || triggered || generating || heroUrl) return;
    if (typeof onRequestGenerate !== 'function') return;
    const t = setTimeout(() => {
      setTriggered(true);
      onRequestGenerate();
    }, 1200);
    return () => clearTimeout(t);
  }, [autoGenerate, triggered, generating, heroUrl, onRequestGenerate]);

  if (heroUrl) {
    return (
      <div className={`relative w-full h-full overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroUrl} alt={name} className="absolute inset-0 w-full h-full object-cover" />
      </div>
    );
  }

  const letter = (name || '?')[0].toUpperCase();

  return (
    <div
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${g1} 0%, ${g2} 100%)` }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundSize: '120px',
        }}
      />

      <span
        className="absolute inset-0 grid place-items-center font-display text-7xl font-black select-none"
        style={{
          color: 'transparent',
          backgroundImage:
            'linear-gradient(145deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.35) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
        }}
      >
        {letter}
      </span>

      <div className="absolute bottom-3 left-3 right-3 h-8 rounded-lg backdrop-blur-md bg-white/[0.08] border border-white/[0.12] flex items-center px-3 gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
        <div className="h-1.5 flex-1 rounded-full bg-white/20" />
        <div className="h-1.5 w-8 rounded-full bg-white/30" />
      </div>

      {generating && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 backdrop-blur-[1px] bg-black/20" />
          <Skeleton
            className="absolute inset-0 !bg-transparent"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
            }}
          />
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-[11px] font-medium text-white/90">
            <span className="flex gap-0.5">
              <span className="typing-dot h-1 w-1 rounded-full bg-white" />
              <span className="typing-dot h-1 w-1 rounded-full bg-white" />
              <span className="typing-dot h-1 w-1 rounded-full bg-white" />
            </span>
            Зураг үүсгэж байна…
          </div>
        </div>
      )}
    </div>
  );
}
