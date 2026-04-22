'use client';

import { motion } from 'framer-motion';

/**
 * Mini-preview of an AI-composed layout proposal.
 * Renders a 200px tall thumbnail with theme colors + section types.
 */
export default function VariantPreview({ layout = [], theme = {}, selected, onSelect, label }) {
  const primary = theme.primary || '#0f172a';
  const accent = theme.accent || '#7c5cff';
  const background = theme.background || '#ffffff';
  const foreground = theme.foreground || '#0f172a';

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full text-left rounded-2xl overflow-hidden border-2 transition-all ${
        selected ? 'border-white shadow-2xl shadow-white/20' : 'border-white/10 hover:border-white/30'
      }`}
    >
      {/* Thumbnail canvas */}
      <div className="relative h-[200px] overflow-hidden" style={{ background }}>
        {layout.map((section, i) => (
          <SectionBand
            key={`${section.type}-${i}`}
            section={section}
            index={i}
            total={layout.length}
            primary={primary}
            accent={accent}
            background={background}
            foreground={foreground}
          />
        ))}
      </div>

      {/* Metadata strip */}
      <div className="bg-black/70 backdrop-blur-sm px-4 py-3 border-t border-white/10">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-sm font-semibold text-white">{label}</span>
          <div className="flex gap-1">
            <Swatch color={primary} />
            <Swatch color={accent} />
            <Swatch color={background} />
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {layout.slice(0, 8).map((s, i) => (
            <span key={i} className="text-[10px] font-mono text-white/50 uppercase">
              {s.type}
              {i < Math.min(layout.length, 8) - 1 ? '·' : ''}
            </span>
          ))}
        </div>
      </div>

      {selected && (
        <motion.div
          layoutId="variant-check"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold shadow-lg"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}

function Swatch({ color }) {
  return <span className="w-3 h-3 rounded-full ring-1 ring-white/20" style={{ background: color }} />;
}

function SectionBand({ section, index, total, primary, accent, background, foreground }) {
  const height = heightForType(section.type);
  const top = cumulativeTop(index);

  switch (section.type) {
    case 'nav':
      return <div className="absolute left-0 right-0 flex items-center px-2 gap-1" style={{ top, height, background, borderBottom: `1px solid ${foreground}22` }}>
        <div className="w-4 h-1 rounded-full" style={{ background: foreground }} />
        <div className="ml-auto flex gap-1">
          <div className="w-3 h-0.5 rounded-full" style={{ background: foreground, opacity: 0.5 }} />
          <div className="w-3 h-0.5 rounded-full" style={{ background: foreground, opacity: 0.5 }} />
        </div>
      </div>;
    case 'hero':
      return <div className="absolute left-0 right-0 flex items-center px-3" style={{ top, height, background: `linear-gradient(115deg, ${primary}, ${accent})` }}>
        <div className="space-y-1">
          <div className="h-1.5 w-20 rounded-full" style={{ background: '#fff', opacity: 0.9 }} />
          <div className="h-1 w-16 rounded-full" style={{ background: '#fff', opacity: 0.6 }} />
        </div>
      </div>;
    case 'cta':
      return <div className="absolute left-0 right-0 flex items-center justify-center" style={{ top, height, background: accent }}>
        <div className="h-2 w-12 rounded-full" style={{ background: '#fff' }} />
      </div>;
    case 'footer':
      return <div className="absolute left-0 right-0" style={{ top, height, background: foreground, opacity: 0.85 }} />;
    case 'gallery':
      return <div className="absolute left-0 right-0 grid grid-cols-4 gap-0.5" style={{ top, height, background }}>
        {[0,1,2,3].map((i) => (
          <div key={i} style={{ background: accent, opacity: 0.6 - i * 0.1 }} />
        ))}
      </div>;
    default:
      return <div className="absolute left-0 right-0 flex items-center px-3" style={{ top, height, background, borderBottom: `1px solid ${foreground}11` }}>
        <div className="space-y-1">
          <div className="h-1 w-24 rounded-full" style={{ background: foreground, opacity: 0.8 }} />
          <div className="h-0.5 w-20 rounded-full" style={{ background: foreground, opacity: 0.4 }} />
          <div className="h-0.5 w-14 rounded-full" style={{ background: foreground, opacity: 0.4 }} />
        </div>
      </div>;
  }

  function cumulativeTop() {
    // placeholder — caller supplies index; use index * average
    return (index / total) * 200;
  }
}

function heightForType(type) {
  const h = {
    nav: 14,
    hero: 56,
    about: 28,
    services: 26,
    features: 24,
    stats: 20,
    process: 22,
    gallery: 28,
    testimonials: 24,
    faq: 22,
    cta: 24,
    contact: 26,
    footer: 20,
  };
  return h[type] ?? 22;
}
