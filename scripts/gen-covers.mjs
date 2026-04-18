/**
 * gen-covers.mjs
 * Generates SVG thumbnail previews for all templates.
 * Output: apps/studio/public/templates/<id>.svg
 *
 * Usage: node scripts/gen-covers.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'apps/studio/public/templates');

mkdirSync(OUT, { recursive: true });

// All template definitions (mirrors packages/templates/*/index.js defaultTheme)
const templates = [
  // ── Original 4 ──────────────────────────────────────────────────────────
  {
    id: 'minimal',
    layout: 'editorial',
    theme: {
      primary: '#0f0e0b', accent: '#d14e22',
      background: '#faf8f2', foreground: '#1a1915',
    },
  },
  {
    id: 'business',
    layout: 'corporate',
    theme: {
      primary: '#1e40af', accent: '#0891b2',
      background: '#ffffff', foreground: '#0f172a',
    },
  },
  {
    id: 'restaurant',
    layout: 'warm',
    theme: {
      primary: '#7c2d12', accent: '#d97706',
      background: '#fffbf5', foreground: '#1c1917',
    },
  },
  {
    id: 'portfolio',
    layout: 'dark',
    theme: {
      primary: '#fafafa', accent: '#f97316',
      background: '#0a0a0a', foreground: '#fafafa',
    },
  },

  // ── 19 New Templates ─────────────────────────────────────────────────────
  {
    id: 'beauty_salon',
    layout: 'wellness',
    theme: {
      primary: '#be185d', accent: '#f9a8d4',
      background: '#fff0f6', foreground: '#4a0020',
    },
  },
  {
    id: 'fitness',
    layout: 'dark',
    theme: {
      primary: '#0d0d0d', accent: '#22d3ee',
      background: '#050505', foreground: '#f5f5f5',
    },
  },
  {
    id: 'restaurant_mongolian',
    layout: 'creative-dark',
    theme: {
      primary: '#09090b', accent: '#d97706',
      background: '#09090b', foreground: '#fafafa',
    },
  },
  {
    id: 'crafts',
    layout: 'artisan',
    theme: {
      primary: '#78350f', accent: '#b45309',
      background: '#fffbf0', foreground: '#3b1f05',
    },
  },
  {
    id: 'education',
    layout: 'proservice',
    theme: {
      primary: '#1e3a8a', accent: '#3b82f6',
      background: '#f8faff', foreground: '#0f172a',
    },
  },
  {
    id: 'clinic',
    layout: 'proservice',
    theme: {
      primary: '#0e7490', accent: '#06b6d4',
      background: '#f0fbff', foreground: '#0c4a6e',
    },
  },
  {
    id: 'auto_repair',
    layout: 'proservice',
    theme: {
      primary: '#1c1917', accent: '#f59e0b',
      background: '#fafaf9', foreground: '#1c1917',
    },
  },
  {
    id: 'fashion_store',
    layout: 'creative-dark',
    theme: {
      primary: '#09090b', accent: '#ec4899',
      background: '#09090b', foreground: '#fafafa',
    },
  },
  {
    id: 'home_service',
    layout: 'proservice',
    theme: {
      primary: '#14532d', accent: '#22c55e',
      background: '#f0fdf4', foreground: '#14532d',
    },
  },
  {
    id: 'sales_rep',
    layout: 'proservice',
    theme: {
      primary: '#7c3aed', accent: '#a78bfa',
      background: '#faf5ff', foreground: '#2e1065',
    },
  },
  {
    id: 'photography',
    layout: 'creative-dark',
    theme: {
      primary: '#09090b', accent: '#d97706',
      background: '#09090b', foreground: '#fafafa',
    },
  },
  {
    id: 'travel',
    layout: 'creative-dark',
    theme: {
      primary: '#09090b', accent: '#0ea5e9',
      background: '#09090b', foreground: '#fafafa',
    },
  },
  {
    id: 'legal',
    layout: 'proservice',
    theme: {
      primary: '#1e293b', accent: '#64748b',
      background: '#f8fafc', foreground: '#0f172a',
    },
  },
  {
    id: 'furniture',
    layout: 'artisan',
    theme: {
      primary: '#44403c', accent: '#a16207',
      background: '#fafaf9', foreground: '#1c1917',
    },
  },
  {
    id: 'pet_shop',
    layout: 'wellness',
    theme: {
      primary: '#15803d', accent: '#86efac',
      background: '#f0fdf4', foreground: '#14532d',
    },
  },
  {
    id: 'gifts',
    layout: 'artisan',
    theme: {
      primary: '#9f1239', accent: '#f43f5e',
      background: '#fff1f2', foreground: '#4c0519',
    },
  },
  {
    id: 'phone_repair',
    layout: 'proservice',
    theme: {
      primary: '#0f172a', accent: '#38bdf8',
      background: '#f0f9ff', foreground: '#0f172a',
    },
  },
  {
    id: 'music_school',
    layout: 'creative-dark',
    theme: {
      primary: '#2e1065', accent: '#a855f7',
      background: '#0a0012', foreground: '#faf5ff',
    },
  },
  {
    id: 'organic_food',
    layout: 'artisan',
    theme: {
      primary: '#14532d', accent: '#65a30d',
      background: '#f7fff0', foreground: '#0a2010',
    },
  },
];

// ─── SVG generators per layout archetype ─────────────────────────────────────

function hex(color) {
  return color;
}

function alpha(hex, opacity) {
  // Convert hex to rgba
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

function buildSVG(id, layout, theme) {
  const W = 600;
  const H = 400;

  switch (layout) {
    case 'editorial':     return svgEditorial(W, H, theme, id);
    case 'corporate':     return svgCorporate(W, H, theme, id);
    case 'warm':          return svgWarm(W, H, theme, id);
    case 'dark':          return svgDark(W, H, theme, id);
    case 'wellness':      return svgWellness(W, H, theme, id);
    case 'artisan':       return svgArtisan(W, H, theme, id);
    case 'proservice':    return svgProService(W, H, theme, id);
    case 'creative-dark': return svgCreativeDark(W, H, theme, id);
    default:              return svgEditorial(W, H, theme, id);
  }
}

// ── Editorial (minimal) ───────────────────────────────────────────────────────
function svgEditorial(W, H, t, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${t.background}"/>
  <!-- Nav -->
  <rect x="0" y="0" width="${W}" height="44" fill="${t.background}"/>
  <rect x="32" y="16" width="80" height="10" rx="2" fill="${t.primary}" opacity="0.9"/>
  <rect x="${W-140}" y="18" width="50" height="7" rx="2" fill="${t.primary}" opacity="0.3"/>
  <rect x="${W-80}" y="16" width="60" height="12" rx="2" fill="${t.accent}"/>
  <line x1="0" y1="44" x2="${W}" y2="44" stroke="${t.primary}" stroke-width="0.5" opacity="0.15"/>
  <!-- Hero: large headline blocks -->
  <rect x="32" y="72" width="340" height="28" rx="2" fill="${t.primary}" opacity="0.9"/>
  <rect x="32" y="110" width="260" height="20" rx="2" fill="${t.primary}" opacity="0.5"/>
  <rect x="32" y="148" width="180" height="14" rx="2" fill="${t.primary}" opacity="0.25"/>
  <!-- CTA -->
  <rect x="32" y="178" width="120" height="36" rx="4" fill="${t.accent}"/>
  <rect x="164" y="184" width="80" height="12" rx="2" fill="${t.primary}" opacity="0.25"/>
  <!-- Right: image placeholder -->
  <rect x="420" y="56" width="152" height="200" rx="4" fill="${t.primary}" opacity="0.08"/>
  <rect x="436" y="80" width="120" height="8" rx="2" fill="${t.accent}" opacity="0.4"/>
  <rect x="436" y="100" width="100" height="6" rx="2" fill="${t.primary}" opacity="0.2"/>
  <rect x="436" y="116" width="110" height="6" rx="2" fill="${t.primary}" opacity="0.15"/>
  <!-- Stats strip -->
  <rect x="0" y="280" width="${W}" height="60" fill="${t.primary}" opacity="0.06"/>
  <rect x="56" y="298" width="60" height="10" rx="2" fill="${t.accent}" opacity="0.8"/>
  <rect x="56" y="316" width="44" height="7" rx="2" fill="${t.primary}" opacity="0.3"/>
  <rect x="220" y="298" width="60" height="10" rx="2" fill="${t.accent}" opacity="0.8"/>
  <rect x="220" y="316" width="44" height="7" rx="2" fill="${t.primary}" opacity="0.3"/>
  <rect x="384" y="298" width="60" height="10" rx="2" fill="${t.accent}" opacity="0.8"/>
  <rect x="384" y="316" width="44" height="7" rx="2" fill="${t.primary}" opacity="0.3"/>
  <!-- Cards row -->
  <rect x="32" y="356" width="160" height="28" rx="4" fill="${t.primary}" opacity="0.06"/>
  <rect x="212" y="356" width="160" height="28" rx="4" fill="${t.primary}" opacity="0.06"/>
  <rect x="392" y="356" width="160" height="28" rx="4" fill="${t.primary}" opacity="0.06"/>
</svg>`;
}

// ── Corporate (business) ──────────────────────────────────────────────────────
function svgCorporate(W, H, t, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${t.background}"/>
  <!-- Nav solid white -->
  <rect x="0" y="0" width="${W}" height="48" fill="#ffffff"/>
  <rect x="0" y="47" width="${W}" height="1" fill="${t.primary}" opacity="0.1"/>
  <rect x="32" y="17" width="72" height="11" rx="2" fill="${t.primary}"/>
  <rect x="200" y="20" width="44" height="7" rx="2" fill="${t.primary}" opacity="0.3"/>
  <rect x="260" y="20" width="44" height="7" rx="2" fill="${t.primary}" opacity="0.3"/>
  <rect x="320" y="20" width="44" height="7" rx="2" fill="${t.primary}" opacity="0.3"/>
  <rect x="${W-120}" y="16" width="88" height="16" rx="3" fill="${t.accent}"/>
  <!-- Hero blue band -->
  <rect x="0" y="48" width="${W}" height="180" fill="${t.primary}"/>
  <rect x="32" y="76" width="24" height="8" rx="2" fill="${t.accent}" opacity="0.7"/>
  <rect x="32" y="94" width="300" height="24" rx="2" fill="white" opacity="0.95"/>
  <rect x="32" y="128" width="220" height="16" rx="2" fill="white" opacity="0.5"/>
  <rect x="32" y="154" width="160" height="12" rx="2" fill="white" opacity="0.3"/>
  <rect x="32" y="180" width="120" height="32" rx="3" fill="${t.accent}"/>
  <rect x="164" y="188" width="80" height="14" rx="2" fill="white" opacity="0.2"/>
  <!-- Trust badges -->
  <rect x="${W-180}" y="80" width="148" height="120" rx="6" fill="white" opacity="0.1"/>
  <rect x="${W-164}" y="96" width="116" height="10" rx="2" fill="white" opacity="0.6"/>
  <rect x="${W-164}" y="116" width="96" height="8" rx="2" fill="white" opacity="0.35"/>
  <rect x="${W-164}" y="132" width="106" height="8" rx="2" fill="white" opacity="0.35"/>
  <rect x="${W-164}" y="148" width="86" height="8" rx="2" fill="white" opacity="0.35"/>
  <!-- Stats -->
  <rect x="0" y="228" width="${W}" height="60" fill="${t.accent}" opacity="0.1"/>
  <rect x="56" y="245" width="56" height="12" rx="2" fill="${t.primary}" opacity="0.7"/>
  <rect x="56" y="264" width="44" height="8" rx="2" fill="${t.primary}" opacity="0.3"/>
  <rect x="220" y="245" width="56" height="12" rx="2" fill="${t.primary}" opacity="0.7"/>
  <rect x="220" y="264" width="44" height="8" rx="2" fill="${t.primary}" opacity="0.3"/>
  <rect x="384" y="245" width="56" height="12" rx="2" fill="${t.primary}" opacity="0.7"/>
  <rect x="384" y="264" width="44" height="8" rx="2" fill="${t.primary}" opacity="0.3"/>
  <!-- Services grid -->
  <rect x="32" y="308" width="166" height="72" rx="4" fill="${t.primary}" opacity="0.05"/>
  <rect x="48" y="320" width="60" height="8" rx="2" fill="${t.accent}" opacity="0.6"/>
  <rect x="48" y="336" width="120" height="6" rx="2" fill="${t.primary}" opacity="0.2"/>
  <rect x="48" y="350" width="100" height="6" rx="2" fill="${t.primary}" opacity="0.15"/>
  <rect x="216" y="308" width="166" height="72" rx="4" fill="${t.primary}" opacity="0.05"/>
  <rect x="232" y="320" width="60" height="8" rx="2" fill="${t.accent}" opacity="0.6"/>
  <rect x="232" y="336" width="120" height="6" rx="2" fill="${t.primary}" opacity="0.2"/>
  <rect x="232" y="350" width="100" height="6" rx="2" fill="${t.primary}" opacity="0.15"/>
  <rect x="400" y="308" width="166" height="72" rx="4" fill="${t.primary}" opacity="0.05"/>
  <rect x="416" y="320" width="60" height="8" rx="2" fill="${t.accent}" opacity="0.6"/>
  <rect x="416" y="336" width="120" height="6" rx="2" fill="${t.primary}" opacity="0.2"/>
  <rect x="416" y="350" width="100" height="6" rx="2" fill="${t.primary}" opacity="0.15"/>
</svg>`;
}

// ── Warm (restaurant) ─────────────────────────────────────────────────────────
function svgWarm(W, H, t, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${t.background}"/>
  <!-- Full hero image placeholder -->
  <rect x="0" y="0" width="${W}" height="220" fill="${t.primary}" opacity="0.15"/>
  <rect x="0" y="0" width="${W}" height="220" fill="url(#grad-warm)"/>
  <defs>
    <linearGradient id="grad-warm" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="${t.primary}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="${t.primary}" stop-opacity="0.1"/>
    </linearGradient>
  </defs>
  <!-- Nav overlay -->
  <rect x="32" y="16" width="72" height="10" rx="2" fill="white" opacity="0.9"/>
  <rect x="${W-140}" y="18" width="44" height="7" rx="2" fill="white" opacity="0.5"/>
  <rect x="${W-84}" y="14" width="60" height="14" rx="3" fill="${t.accent}"/>
  <!-- Hero text -->
  <rect x="32" y="100" width="320" height="28" rx="2" fill="white" opacity="0.95"/>
  <rect x="32" y="138" width="220" height="16" rx="2" fill="white" opacity="0.6"/>
  <rect x="32" y="164" width="110" height="30" rx="3" fill="${t.accent}"/>
  <!-- Menu section -->
  <rect x="0" y="220" width="${W}" height="12" fill="${t.accent}" opacity="0.9"/>
  <!-- Cards -->
  <rect x="24" y="248" width="168" height="120" rx="6" fill="${t.primary}" opacity="0.06"/>
  <rect x="36" y="260" width="144" height="56" rx="4" fill="${t.accent}" opacity="0.2"/>
  <rect x="36" y="324" width="100" height="8" rx="2" fill="${t.primary}" opacity="0.5"/>
  <rect x="36" y="340" width="60" height="8" rx="2" fill="${t.accent}" opacity="0.7"/>
  <rect x="208" y="248" width="168" height="120" rx="6" fill="${t.primary}" opacity="0.06"/>
  <rect x="220" y="260" width="144" height="56" rx="4" fill="${t.accent}" opacity="0.2"/>
  <rect x="220" y="324" width="100" height="8" rx="2" fill="${t.primary}" opacity="0.5"/>
  <rect x="220" y="340" width="60" height="8" rx="2" fill="${t.accent}" opacity="0.7"/>
  <rect x="392" y="248" width="180" height="120" rx="6" fill="${t.primary}" opacity="0.06"/>
  <rect x="404" y="260" width="156" height="56" rx="4" fill="${t.accent}" opacity="0.2"/>
  <rect x="404" y="324" width="100" height="8" rx="2" fill="${t.primary}" opacity="0.5"/>
  <rect x="404" y="340" width="60" height="8" rx="2" fill="${t.accent}" opacity="0.7"/>
</svg>`;
}

// ── Dark (portfolio / fitness) ────────────────────────────────────────────────
function svgDark(W, H, t, id) {
  const isFitness = id === 'fitness';
  const accentUsed = isFitness ? t.accent : t.accent;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${t.background}"/>
  <!-- Nav -->
  <rect x="32" y="18" width="68" height="10" rx="2" fill="${t.foreground}" opacity="0.9"/>
  <rect x="${W-140}" y="20" width="44" height="7" rx="2" fill="${t.foreground}" opacity="0.3"/>
  <rect x="${W-84}" y="16" width="60" height="14" rx="3" fill="${accentUsed}"/>
  <!-- Full-screen hero -->
  <rect x="0" y="0" width="${W}" height="H" fill="${t.background}"/>
  <!-- Accent diagonal / gradient block -->
  <rect x="0" y="180" width="${W}" height="4" fill="${accentUsed}" opacity="0.6"/>
  <rect x="0" y="56" width="${W/2}" height="124" fill="${accentUsed}" opacity="${isFitness ? '0.07' : '0.05'}"/>
  <!-- Hero text bottom-left -->
  <rect x="32" y="120" width="280" height="30" rx="2" fill="${t.foreground}" opacity="0.9"/>
  <rect x="32" y="162" width="200" height="16" rx="2" fill="${t.foreground}" opacity="0.4"/>
  <rect x="32" y="188" width="100" height="28" rx="3" fill="${accentUsed}"/>
  <!-- Right side image grid -->
  <rect x="340" y="56" width="228" height="124" rx="4" fill="${t.foreground}" opacity="0.06"/>
  <rect x="356" y="72" width="90" height="90" rx="3" fill="${accentUsed}" opacity="0.15"/>
  <rect x="460" y="72" width="90" height="40" rx="3" fill="${t.foreground}" opacity="0.08"/>
  <rect x="460" y="120" width="90" height="40" rx="3" fill="${accentUsed}" opacity="0.1"/>
  <!-- Stats strip -->
  <rect x="0" y="228" width="${W}" height="56" fill="${accentUsed}" opacity="${isFitness ? '0.15' : '0.08'}"/>
  <rect x="48" y="244" width="60" height="12" rx="2" fill="${accentUsed}" opacity="0.9"/>
  <rect x="48" y="262" width="44" height="7" rx="2" fill="${t.foreground}" opacity="0.4"/>
  <rect x="220" y="244" width="60" height="12" rx="2" fill="${accentUsed}" opacity="0.9"/>
  <rect x="220" y="262" width="44" height="7" rx="2" fill="${t.foreground}" opacity="0.4"/>
  <rect x="392" y="244" width="60" height="12" rx="2" fill="${accentUsed}" opacity="0.9"/>
  <rect x="392" y="262" width="44" height="7" rx="2" fill="${t.foreground}" opacity="0.4"/>
  <!-- Work / program cards -->
  <rect x="32" y="302" width="264" height="80" rx="4" fill="${t.foreground}" opacity="0.05"/>
  <rect x="48" y="314" width="32" height="32" rx="2" fill="${accentUsed}" opacity="0.25"/>
  <rect x="92" y="316" width="140" height="10" rx="2" fill="${t.foreground}" opacity="0.6"/>
  <rect x="92" y="334" width="100" height="7" rx="2" fill="${t.foreground}" opacity="0.25"/>
  <rect x="92" y="348" width="80" height="7" rx="2" fill="${t.foreground}" opacity="0.2"/>
  <rect x="308" y="302" width="260" height="80" rx="4" fill="${t.foreground}" opacity="0.05"/>
  <rect x="324" y="314" width="32" height="32" rx="2" fill="${accentUsed}" opacity="0.25"/>
  <rect x="368" y="316" width="140" height="10" rx="2" fill="${t.foreground}" opacity="0.6"/>
  <rect x="368" y="334" width="100" height="7" rx="2" fill="${t.foreground}" opacity="0.25"/>
  <rect x="368" y="348" width="80" height="7" rx="2" fill="${t.foreground}" opacity="0.2"/>
</svg>`;
}

// ── Wellness (beauty_salon, pet_shop) ─────────────────────────────────────────
function svgWellness(W, H, t, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="wgrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${t.background}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${t.background}"/>
  <rect width="${W}" height="${H}" fill="url(#wgrad)"/>
  <!-- Nav -->
  <rect x="0" y="0" width="${W}" height="48" fill="${t.background}" opacity="0.95"/>
  <rect x="0" y="47" width="${W}" height="1" fill="${t.primary}" opacity="0.08"/>
  <rect x="32" y="16" width="80" height="12" rx="2" fill="${t.primary}" opacity="0.8"/>
  <rect x="${W-130}" y="18" width="44" height="8" rx="2" fill="${t.primary}" opacity="0.25"/>
  <rect x="${W-76}" y="15" width="56" height="16" rx="8" fill="${t.primary}"/>
  <!-- Split hero: left text, right image -->
  <rect x="32" y="72" width="240" height="24" rx="2" fill="${t.primary}" opacity="0.85"/>
  <rect x="32" y="106" width="180" height="16" rx="2" fill="${t.primary}" opacity="0.4"/>
  <rect x="32" y="130" width="140" height="12" rx="2" fill="${t.primary}" opacity="0.25"/>
  <rect x="32" y="158" width="120" height="34" rx="17" fill="${t.primary}"/>
  <rect x="164" y="164" width="70" height="12" rx="2" fill="${t.primary}" opacity="0.15"/>
  <!-- Right: image + floating badge -->
  <rect x="320" y="56" width="256" height="180" rx="12" fill="${t.accent}" opacity="0.15"/>
  <rect x="340" y="76" width="216" height="140" rx="8" fill="${t.primary}" opacity="0.08"/>
  <!-- Floating badge -->
  <rect x="400" y="196" width="100" height="44" rx="8" fill="${t.background}"/>
  <rect x="412" y="208" width="76" height="8" rx="2" fill="${t.primary}" opacity="0.5"/>
  <rect x="412" y="222" width="50" height="8" rx="2" fill="${t.accent}" opacity="0.9"/>
  <!-- Stats strip -->
  <rect x="0" y="258" width="${W}" height="56" fill="${t.primary}" opacity="0.06"/>
  <rect x="56" y="274" width="56" height="10" rx="2" fill="${t.primary}" opacity="0.6"/>
  <rect x="56" y="290" width="44" height="7" rx="2" fill="${t.primary}" opacity="0.25"/>
  <rect x="232" y="274" width="56" height="10" rx="2" fill="${t.primary}" opacity="0.6"/>
  <rect x="232" y="290" width="44" height="7" rx="2" fill="${t.primary}" opacity="0.25"/>
  <rect x="408" y="274" width="56" height="10" rx="2" fill="${t.primary}" opacity="0.6"/>
  <rect x="408" y="290" width="44" height="7" rx="2" fill="${t.primary}" opacity="0.25"/>
  <!-- Service cards -->
  <rect x="24" y="330" width="172" height="56" rx="8" fill="${t.primary}" opacity="0.06"/>
  <rect x="40" y="342" width="80" height="8" rx="2" fill="${t.accent}" opacity="0.7"/>
  <rect x="40" y="356" width="120" height="6" rx="2" fill="${t.primary}" opacity="0.2"/>
  <rect x="208" y="330" width="172" height="56" rx="8" fill="${t.primary}" opacity="0.06"/>
  <rect x="224" y="342" width="80" height="8" rx="2" fill="${t.accent}" opacity="0.7"/>
  <rect x="224" y="356" width="120" height="6" rx="2" fill="${t.primary}" opacity="0.2"/>
  <rect x="392" y="330" width="172" height="56" rx="8" fill="${t.primary}" opacity="0.06"/>
  <rect x="408" y="342" width="80" height="8" rx="2" fill="${t.accent}" opacity="0.7"/>
  <rect x="408" y="356" width="120" height="6" rx="2" fill="${t.primary}" opacity="0.2"/>
</svg>`;
}

// ── Artisan (crafts, furniture, gifts, organic_food) ──────────────────────────
function svgArtisan(W, H, t, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="agrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${t.background}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${t.background}"/>
  <rect width="${W}" height="${H}" fill="url(#agrad)"/>
  <!-- Transparent nav -->
  <rect x="32" y="14" width="72" height="12" rx="2" fill="${t.primary}" opacity="0.85"/>
  <rect x="${W-140}" y="16" width="44" height="8" rx="2" fill="${t.primary}" opacity="0.3"/>
  <rect x="${W-84}" y="12" width="60" height="16" rx="3" fill="${t.accent}"/>
  <!-- Split hero -->
  <rect x="32" y="56" width="260" height="32" rx="2" fill="${t.primary}" opacity="0.88"/>
  <rect x="32" y="100" width="200" height="18" rx="2" fill="${t.primary}" opacity="0.4"/>
  <rect x="32" y="128" width="150" height="12" rx="2" fill="${t.primary}" opacity="0.25"/>
  <!-- Floating artisan badge -->
  <rect x="32" y="156" width="90" height="26" rx="13" fill="${t.accent}"/>
  <rect x="134" y="160" width="80" height="16" rx="3" fill="${t.primary}" opacity="0.15"/>
  <!-- Right hero image -->
  <rect x="320" y="40" width="256" height="200" rx="8" fill="${t.accent}" opacity="0.12"/>
  <rect x="340" y="60" width="100" height="100" rx="4" fill="${t.primary}" opacity="0.08"/>
  <rect x="452" y="60" width="100" height="44" rx="4" fill="${t.accent}" opacity="0.15"/>
  <rect x="452" y="114" width="100" height="44" rx="4" fill="${t.primary}" opacity="0.06"/>
  <!-- Story strip (2 col) -->
  <rect x="0" y="264" width="${W}" height="4" fill="${t.accent}" opacity="0.4"/>
  <rect x="32" y="280" width="260" height="100" rx="4" fill="${t.primary}" opacity="0.04"/>
  <rect x="48" y="296" width="180" height="12" rx="2" fill="${t.primary}" opacity="0.5"/>
  <rect x="48" y="316" width="220" height="8" rx="2" fill="${t.primary}" opacity="0.2"/>
  <rect x="48" y="332" width="200" height="8" rx="2" fill="${t.primary}" opacity="0.15"/>
  <rect x="48" y="348" width="170" height="8" rx="2" fill="${t.primary}" opacity="0.15"/>
  <!-- Product grid -->
  <rect x="308" y="280" width="124" height="100" rx="6" fill="${t.accent}" opacity="0.1"/>
  <rect x="320" y="292" width="100" height="60" rx="4" fill="${t.accent}" opacity="0.2"/>
  <rect x="320" y="358" width="80" height="8" rx="2" fill="${t.primary}" opacity="0.35"/>
  <rect x="444" y="280" width="124" height="100" rx="6" fill="${t.accent}" opacity="0.08"/>
  <rect x="456" y="292" width="100" height="60" rx="4" fill="${t.primary}" opacity="0.08"/>
  <rect x="456" y="358" width="80" height="8" rx="2" fill="${t.primary}" opacity="0.35"/>
</svg>`;
}

// ── ProService (education, clinic, auto, home, sales, legal, phone) ───────────
function svgProService(W, H, t, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${t.background}"/>
  <!-- White nav with shadow line -->
  <rect x="0" y="0" width="${W}" height="52" fill="white"/>
  <rect x="0" y="51" width="${W}" height="1" fill="${t.primary}" opacity="0.08"/>
  <rect x="32" y="18" width="76" height="14" rx="2" fill="${t.primary}"/>
  <rect x="196" y="21" width="40" height="8" rx="2" fill="${t.primary}" opacity="0.25"/>
  <rect x="252" y="21" width="40" height="8" rx="2" fill="${t.primary}" opacity="0.25"/>
  <rect x="308" y="21" width="40" height="8" rx="2" fill="${t.primary}" opacity="0.25"/>
  <rect x="${W-120}" y="18" width="88" height="16" rx="3" fill="${t.accent}"/>
  <!-- Hero: primary bg left side -->
  <rect x="0" y="52" width="280" height="180" fill="${t.primary}"/>
  <!-- Hero badge -->
  <rect x="32" y="76" width="60" height="16" rx="8" fill="${t.accent}" opacity="0.8"/>
  <rect x="32" y="104" width="220" height="22" rx="2" fill="white" opacity="0.95"/>
  <rect x="32" y="136" width="180" height="14" rx="2" fill="white" opacity="0.45"/>
  <rect x="32" y="158" width="140" height="12" rx="2" fill="white" opacity="0.3"/>
  <rect x="32" y="186" width="110" height="30" rx="3" fill="${t.accent}"/>
  <!-- Hero right image -->
  <rect x="280" y="52" width="320" height="180" fill="${t.accent}" opacity="0.1"/>
  <rect x="300" y="72" width="280" height="140" rx="4" fill="${t.primary}" opacity="0.07"/>
  <!-- Stats on primary -->
  <rect x="0" y="232" width="${W}" height="56" fill="${t.primary}"/>
  <rect x="48" y="248" width="60" height="12" rx="2" fill="white" opacity="0.9"/>
  <rect x="48" y="266" width="44" height="7" rx="2" fill="white" opacity="0.4"/>
  <rect x="228" y="248" width="60" height="12" rx="2" fill="white" opacity="0.9"/>
  <rect x="228" y="266" width="44" height="7" rx="2" fill="white" opacity="0.4"/>
  <rect x="408" y="248" width="60" height="12" rx="2" fill="white" opacity="0.9"/>
  <rect x="408" y="266" width="44" height="7" rx="2" fill="white" opacity="0.4"/>
  <!-- Services grid 3 col -->
  <rect x="24" y="306" width="176" height="78" rx="4" fill="${t.primary}" opacity="0.05"/>
  <rect x="36" y="318" width="28" height="28" rx="2" fill="${t.accent}" opacity="0.3"/>
  <rect x="72" y="320" width="110" height="9" rx="2" fill="${t.primary}" opacity="0.55"/>
  <rect x="72" y="336" width="120" height="6" rx="2" fill="${t.primary}" opacity="0.2"/>
  <rect x="72" y="350" width="90" height="6" rx="2" fill="${t.primary}" opacity="0.15"/>
  <rect x="212" y="306" width="176" height="78" rx="4" fill="${t.primary}" opacity="0.05"/>
  <rect x="224" y="318" width="28" height="28" rx="2" fill="${t.accent}" opacity="0.3"/>
  <rect x="260" y="320" width="110" height="9" rx="2" fill="${t.primary}" opacity="0.55"/>
  <rect x="260" y="336" width="120" height="6" rx="2" fill="${t.primary}" opacity="0.2"/>
  <rect x="260" y="350" width="90" height="6" rx="2" fill="${t.primary}" opacity="0.15"/>
  <rect x="400" y="306" width="176" height="78" rx="4" fill="${t.primary}" opacity="0.05"/>
  <rect x="412" y="318" width="28" height="28" rx="2" fill="${t.accent}" opacity="0.3"/>
  <rect x="448" y="320" width="110" height="9" rx="2" fill="${t.primary}" opacity="0.55"/>
  <rect x="448" y="336" width="120" height="6" rx="2" fill="${t.primary}" opacity="0.2"/>
  <rect x="448" y="350" width="90" height="6" rx="2" fill="${t.primary}" opacity="0.15"/>
</svg>`;
}

// ── Creative Dark (photography, music, travel, fashion, restaurant_mn) ─────────
function svgCreativeDark(W, H, t, id) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="cgrad" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="${t.accent}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${t.background}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${t.background}"/>
  <rect width="${W}" height="${H}" fill="url(#cgrad)"/>
  <!-- Absolute nav -->
  <rect x="32" y="18" width="72" height="10" rx="2" fill="${t.foreground}" opacity="0.8"/>
  <rect x="${W-200}" y="20" width="36" height="7" rx="2" fill="${t.foreground}" opacity="0.3"/>
  <rect x="${W-152}" y="20" width="36" height="7" rx="2" fill="${t.foreground}" opacity="0.3"/>
  <rect x="${W-104}" y="20" width="36" height="7" rx="2" fill="${t.foreground}" opacity="0.3"/>
  <rect x="${W-56}" y="16" width="40" height="14" rx="2" fill="${t.accent}"/>
  <!-- Full-screen hero text bottom-left -->
  <rect x="32" y="140" width="360" height="36" rx="2" fill="${t.foreground}" opacity="0.92"/>
  <rect x="32" y="188" width="260" height="18" rx="2" fill="${t.foreground}" opacity="0.35"/>
  <rect x="32" y="218" width="100" height="28" rx="3" fill="${t.accent}"/>
  <!-- Accent accent line -->
  <rect x="0" y="256" width="${W}" height="3" fill="${t.accent}" opacity="0.5"/>
  <!-- Stats strip -->
  <rect x="0" y="259" width="${W}" height="52" fill="${t.foreground}" opacity="0.04"/>
  <rect x="40" y="275" width="60" height="10" rx="2" fill="${t.accent}" opacity="0.85"/>
  <rect x="40" y="291" width="50" height="7" rx="2" fill="${t.foreground}" opacity="0.3"/>
  <rect x="220" y="275" width="60" height="10" rx="2" fill="${t.accent}" opacity="0.85"/>
  <rect x="220" y="291" width="50" height="7" rx="2" fill="${t.foreground}" opacity="0.3"/>
  <rect x="400" y="275" width="60" height="10" rx="2" fill="${t.accent}" opacity="0.85"/>
  <rect x="400" y="291" width="50" height="7" rx="2" fill="${t.foreground}" opacity="0.3"/>
  <!-- Work list (magazine rows) -->
  <rect x="32" y="328" width="${W - 64}" height="1" fill="${t.foreground}" opacity="0.12"/>
  <rect x="32" y="340" width="200" height="10" rx="2" fill="${t.foreground}" opacity="0.7"/>
  <rect x="32" y="356" width="140" height="7" rx="2" fill="${t.foreground}" opacity="0.25"/>
  <rect x="${W-120}" y="335" width="88" height="26" rx="3" fill="${t.accent}" opacity="0.2"/>
  <!-- Second row -->
  <rect x="32" y="386" width="${W - 64}" height="1" fill="${t.foreground}" opacity="0.08"/>
  <rect x="32" y="396" width="160" height="10" rx="2" fill="${t.foreground}" opacity="0.5"/>
  <!-- Gallery: top-right mosaic -->
  <rect x="360" y="40" width="108" height="80" rx="4" fill="${t.accent}" opacity="0.12"/>
  <rect x="480" y="40" width="88" height="36" rx="4" fill="${t.foreground}" opacity="0.07"/>
  <rect x="480" y="84" width="88" height="36" rx="4" fill="${t.accent}" opacity="0.1"/>
  <rect x="360" y="130" width="208" height="36" rx="4" fill="${t.foreground}" opacity="0.05"/>
</svg>`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

let written = 0;
for (const tpl of templates) {
  const svg = buildSVG(tpl.id, tpl.layout, tpl.theme);
  const outPath = join(OUT, `${tpl.id}.svg`);
  writeFileSync(outPath, svg, 'utf8');
  written++;
  process.stdout.write(`  ✓ ${tpl.id}.svg\n`);
}

console.log(`\nDone — ${written} SVG covers written to apps/studio/public/templates/`);
