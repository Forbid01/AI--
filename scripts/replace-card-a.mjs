import fs from 'node:fs';
import path from 'node:path';

const p = path.resolve('apps/studio/components/LandingHero.jsx');
let s = fs.readFileSync(p, 'utf8');

const OLD_START = '// ─── Typewriter for Card A headline ─';
const OLD_END_MARKER = '// ─── Card B: Color Palette ─';

const i = s.indexOf(OLD_START);
const j = s.indexOf(OLD_END_MARKER);
if (i < 0 || j < 0) {
  console.error('markers not found', i, j);
  process.exit(1);
}

const NEW_BLOCK = `// ─── Card A sites — three rotating businesses ───────────────────────────────

const SITES = [
  {
    domain: 'silkhotel.aiweb.mn',
    brand: 'SILK',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80&fit=crop',
    tier: 'gold',
    accent: '#fde68a',
    accent2: '#d4af37',
    dark: '#0c0a09',
    nav: ['Home', 'About', 'Suites', 'Contact'],
    eyebrow: '— Boutique Hotel · Ulaanbaatar',
    title: 'The Heritage Hotel of Ulaanbaatar',
    sub: 'Өв соёлт 42 өрөөтэй, зүрхнүүдийн нэг — 100 жилийн уламжлалт зочломхой буудал.',
    ctaPrimary: 'Өрөө захиалах →',
    ctaSecondary: 'Тоймыг үзэх',
    ctaShort: 'Book',
    stats: [
      { v: '4.9', l: 'Rating' },
      { v: '42', l: 'Suites' },
      { v: '1924', l: 'Since' },
    ],
    grading: 'linear-gradient(135deg, rgba(12,10,9,0.72) 0%, rgba(217,119,6,0.10) 45%, rgba(12,10,9,0.82) 100%)',
  },
  {
    domain: 'nova-ev.aiweb.mn',
    brand: 'NOVA',
    img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&q=80&fit=crop',
    tier: 'accent',
    accent: '#22d3ee',
    accent2: '#7c3aed',
    dark: '#020617',
    nav: ['Home', 'Models', 'Tech', 'Contact'],
    eyebrow: '— Electric · Performance',
    title: 'Дараагийн үеийн цахим машин',
    sub: '0 → 100 км/ц 2.6 секундэд. 600+ км ширхэг. Ухаалаг driver assist.',
    ctaPrimary: 'Тест жолоо →',
    ctaSecondary: 'Моделүүд',
    ctaShort: 'Drive',
    stats: [
      { v: '600', l: 'km range' },
      { v: '2.6s', l: '0-100' },
      { v: '800V', l: 'Arch' },
    ],
    grading: 'linear-gradient(135deg, rgba(2,6,23,0.75) 0%, rgba(34,211,238,0.08) 50%, rgba(2,6,23,0.85) 100%)',
  },
  {
    domain: 'verse-music.aiweb.mn',
    brand: 'VERSE',
    img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&q=80&fit=crop',
    tier: 'accent',
    accent: '#ec4899',
    accent2: '#8b5cf6',
    dark: '#0f0a1a',
    nav: ['Home', 'Charts', 'Live', 'Pricing'],
    eyebrow: '— Streaming · Discover',
    title: 'Дуу чинь дуртай хүмүүст хүрнэ',
    sub: 'Өдөрт 50 сая хэрэглэгч. Подкаст, амьд эфир, lossless чанар.',
    ctaPrimary: 'Сонсож эхлэх →',
    ctaSecondary: 'Тарифууд',
    ctaShort: 'Play',
    stats: [
      { v: '50M', l: 'Daily' },
      { v: '120M', l: 'Tracks' },
      { v: '180', l: 'Countries' },
    ],
    grading: 'linear-gradient(135deg, rgba(15,10,26,0.75) 0%, rgba(236,72,153,0.12) 45%, rgba(15,10,26,0.85) 100%)',
  },
];

function HeroTypewriter({ assembled, text, accent }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!assembled) { setShown(0); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= text.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [assembled, text]);

  return (
    <span
      className="font-display font-black text-white leading-[1.05] tracking-tight block"
      style={{ fontSize: '13px', letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.6)' }}
    >
      {text.slice(0, shown)}
      {assembled && shown < text.length && (
        <span className="opacity-60" style={{ color: accent }}>|</span>
      )}
    </span>
  );
}

// ─── Card A: Hero Preview (auto-rotating through 3 sites) ───────────────────

function CardHeroPreview({ assembled }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!assembled) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % SITES.length), 5200);
    return () => clearInterval(id);
  }, [assembled]);

  const site = SITES[index];
  const isGold = site.tier === 'gold';
  const coinGrad = isGold
    ? 'conic-gradient(from 45deg, #fde68a, #d4af37, #92400e, #fde68a)'
    : \`conic-gradient(from 45deg, \${site.accent}, \${site.accent2}, \${site.accent})\`;
  const ctaBgGrad = \`linear-gradient(135deg, \${site.accent}, \${site.accent2})\`;
  const ctaTextColor = isGold ? site.dark : '#ffffff';
  const eyebrowColor = isGold ? \`\${site.accent}cc\` : site.accent;

  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/[0.08] relative flex flex-col"
      style={{
        gridRow: 'span 2',
        background: 'rgba(10,10,20,0.90)',
        backdropFilter: 'blur(24px)',
        minHeight: 272,
      }}
    >
      {!assembled ? (
        <div className="p-3 flex flex-col gap-2.5 h-full">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
            <Skel className="w-5 h-5 rounded-md" />
            <Skel className="w-24 h-2.5" />
            <div className="flex-1" />
            <Skel className="w-14 h-5 rounded-full" />
          </div>
          <Skel className="flex-1 rounded-xl" style={{ minHeight: 130 }} />
          <Skel className="w-5/6 h-2.5" />
          <Skel className="w-3/5 h-2.5" />
          <Skel className="w-2/5 h-7 rounded-xl" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
          className="flex flex-col h-full"
        >
          {/* Premium URL bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.08] shrink-0" style={{ background: 'linear-gradient(180deg, #0e0e1a 0%, #08080f 100%)' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <AnimatePresence mode="wait">
              <motion.span
                key={site.domain}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[8.5px] font-mono text-white/50 truncate tracking-tight"
              >
                {site.domain}
              </motion.span>
            </AnimatePresence>
            <div className="ml-auto flex items-center gap-1 text-[8px] text-[#10b981] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Live
            </div>
          </div>

          {/* Rotating site body */}
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={site.domain}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-0"
              >
                {/* Photo */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={site.img}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover scale-105"
                  aria-hidden="true"
                />
                <div className="absolute inset-0" style={{ background: site.grading }} />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 110%, rgba(0,0,0,0.75), transparent 60%)' }} />
                <div className="absolute inset-x-0 top-0 h-1/3 pointer-events-none" style={{ background: 'linear-gradient(165deg, rgba(255,255,255,0.08), transparent 70%)' }} />
              </motion.div>
            </AnimatePresence>

            {/* Navbar */}
            <div
              className="absolute top-0 inset-x-0 flex items-center justify-between px-3 py-2 z-10"
              style={{ background: 'linear-gradient(to bottom, rgba(8,6,4,0.72) 0%, transparent 100%)', backdropFilter: 'blur(3px)' }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={\`brand-\${site.brand}\`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-1.5 text-[9px] font-black text-white tracking-widest uppercase"
                >
                  <span className="relative inline-block" style={{ width: 10, height: 10 }}>
                    <span className="absolute inset-0 rounded-full" style={{ background: coinGrad }} />
                    <span className="absolute inset-[1.5px] rounded-full" style={{ background: site.dark }} />
                    <span className="absolute inset-[3px] rounded-full" style={{ background: ctaBgGrad }} />
                  </span>
                  {site.brand}
                </motion.span>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={\`nav-\${site.brand}\`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  {site.nav.map((item, i) => (
                    <span
                      key={item}
                      className="text-[7.5px] font-semibold tracking-wider select-none"
                      style={{ color: i === 0 ? site.accent : 'rgba(255,255,255,0.55)' }}
                    >
                      {item}
                    </span>
                  ))}
                  <span
                    className="ml-1 inline-flex items-center h-4 px-1.5 rounded-full text-[7px] font-bold"
                    style={{ background: ctaBgGrad, color: ctaTextColor }}
                  >
                    {site.ctaShort}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Center hero */}
            <AnimatePresence mode="wait">
              <motion.div
                key={\`hero-\${site.brand}\`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-0 flex flex-col justify-center px-4 z-10"
              >
                <p
                  className="text-[6.5px] font-mono uppercase tracking-[0.3em] mb-1.5"
                  style={{ color: eyebrowColor }}
                >
                  {site.eyebrow}
                </p>
                <HeroTypewriter key={\`tw-\${site.domain}\`} assembled={assembled} text={site.title} accent={site.accent} />
                <p className="text-[7px] text-white/70 mt-2 max-w-[85%] leading-snug">
                  {site.sub}
                </p>
                <div className="mt-3 flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 h-5 px-2 rounded-full text-[7px] font-bold"
                    style={{ background: ctaBgGrad, color: ctaTextColor, boxShadow: \`0 4px 12px -2px \${site.accent2}55\` }}
                  >
                    {site.ctaPrimary}
                  </span>
                  <span className="inline-flex items-center h-5 px-2 rounded-full text-[7px] font-semibold text-white/80 border border-white/25 backdrop-blur-sm">
                    {site.ctaSecondary}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stats bar */}
            <AnimatePresence mode="wait">
              <motion.div
                key={\`stats-\${site.brand}\`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="absolute bottom-0 inset-x-0 px-3 py-1.5 flex items-center justify-between z-10"
                style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.95), rgba(8,6,4,0.4))' }}
              >
                <div className="flex items-center gap-2.5">
                  {site.stats.map((s) => (
                    <div key={s.l} className="flex items-center gap-1">
                      <span className="text-[8px] font-black tabular-nums" style={{ color: site.accent }}>{s.v}</span>
                      <span className="text-[6px] font-mono uppercase tracking-wider text-white/40">{s.l}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[6px] font-mono text-white/35">© {site.brand.toLowerCase()}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}

`;

s = s.slice(0, i) + NEW_BLOCK + s.slice(j);
fs.writeFileSync(p, s, 'utf8');
console.log('ok length', s.length);
