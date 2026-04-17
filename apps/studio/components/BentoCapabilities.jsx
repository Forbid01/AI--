'use client';

import { motion } from 'framer-motion';

// ─── Sub-visuals ────────────────────────────────────────────────────────────

function GeminiTerminal() {
  const lines = [
    { key: 'headline', value: '"Coffee from the heart of Mongolia"', color: 'text-emerald-400' },
    { key: 'tagline',  value: '"Third wave. First sip."',            color: 'text-sky-400' },
    { key: 'cta',      value: '"Explore the menu →"',                color: 'text-violet-400' },
    { key: 'about',    value: '"A cozy corner in the heart of UB…"', color: 'text-emerald-400' },
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--surface-border)] bg-[#0d0d1a]">
      {/* macOS chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--surface-border)] bg-[#09091a]">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="font-mono text-[10px] text-[var(--text-muted)] mx-auto pr-14">gemini-2.5-flash</span>
      </div>

      <div className="p-4 font-mono text-[11px] space-y-2 min-h-[148px]">
        <p className="text-[var(--text-muted)]">{'// Generating: Nomad Coffee ✦'}</p>
        {lines.map((l, i) => (
          <motion.div
            key={l.key}
            className="flex gap-2"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.22, duration: 0.4 }}
          >
            <span className="text-[var(--accent-light)]">{l.key}</span>
            <span className="text-[var(--text-muted)]">:</span>
            <span className={l.color}>{l.value}</span>
          </motion.div>
        ))}
        <motion.span
          className="inline-block w-[2px] h-[11px] bg-[var(--accent-light)] align-middle"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.45, 0.5, 0.95] }}
        />
      </div>

      {/* Progress bar */}
      <div className="px-4 pb-3">
        <div className="h-0.5 rounded-full bg-[var(--surface-border)] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)]"
            initial={{ width: '0%' }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 2.8, ease: 'easeInOut', delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
}

function FluxGrid() {
  const swatches = [
    { gradient: 'from-rose-600 via-orange-500 to-amber-400', label: 'Restaurant' },
    { gradient: 'from-violet-600 via-purple-500 to-cyan-400', label: 'Yoga' },
    { gradient: 'from-emerald-600 via-teal-500 to-indigo-400', label: 'Hotel' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 h-[148px]">
      {swatches.map((s, i) => (
        <motion.div
          key={s.label}
          className={`relative rounded-xl bg-gradient-to-br ${s.gradient} overflow-hidden cursor-default`}
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }}
          whileHover={{ scale: 1.06, zIndex: 10, transition: { duration: 0.25 } }}
        >
          {/* Grain overlay */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }}
          />
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)' }}
            animate={{ x: ['-200%', '300%'] }}
            transition={{ duration: 2.2, delay: i * 0.9, repeat: Infinity, repeatDelay: 1.8 }}
          />
          <div className="absolute bottom-2 left-2">
            <span className="text-[9px] font-mono text-white/60 uppercase tracking-wider">{s.label}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function DomainVisual() {
  return (
    <div className="h-[120px] flex items-center justify-center">
      <motion.div
        className="font-mono text-xs bg-[var(--bg-tertiary)]/70 border border-[var(--surface-border)] rounded-xl px-4 py-3 flex items-center gap-2.5"
        initial={{ scale: 0.88, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ borderColor: 'rgba(166,153,255,0.4)', scale: 1.03, transition: { duration: 0.2 } }}
      >
        <motion.span
          className="h-2 w-2 rounded-full bg-[var(--success)]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[var(--text-muted)]">_aiweb.</span>
        <span className="text-[var(--accent-light)]">yourdomain.mn</span>
        <span className="ml-1 text-[9px] bg-[var(--success)]/20 text-[var(--success)] px-1.5 py-0.5 rounded-full border border-[var(--success)]/20">
          LIVE
        </span>
      </motion.div>
    </div>
  );
}

function PaymentsVisual() {
  const providers = ['QPay', 'SocialPay', 'Khan', 'Golomt'];

  return (
    <div className="h-[120px] flex flex-wrap items-center justify-center gap-2">
      {providers.map((p, i) => (
        <motion.span
          key={p}
          className="text-[11px] font-mono px-3 py-1.5 rounded-lg border border-[var(--surface-border)] bg-[var(--bg-tertiary)]/60 text-[var(--text-secondary)] cursor-default"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
          whileHover={{ y: -2, borderColor: 'rgba(166,153,255,0.4)', color: 'var(--text-primary)', transition: { duration: 0.15 } }}
        >
          {p}
        </motion.span>
      ))}
    </div>
  );
}

function BilingualVisual() {
  return (
    <div className="h-[120px] flex items-center justify-center gap-5">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        <div className="text-3xl font-display font-black text-[var(--accent-light)]">МН</div>
        <div className="text-[9px] font-mono text-[var(--text-muted)] mt-1 tracking-widest">MONGOLIAN</div>
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, scaleY: 0 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="h-7 w-px bg-gradient-to-b from-transparent via-[var(--surface-border-strong)] to-transparent" />
        <motion.span
          className="text-[9px] font-mono text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded-full border border-[var(--surface-border)]"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        >
          sync
        </motion.span>
        <div className="h-7 w-px bg-gradient-to-b from-transparent via-[var(--surface-border-strong)] to-transparent" />
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
      >
        <div className="text-3xl font-display font-black text-[var(--accent-light)]">EN</div>
        <div className="text-[9px] font-mono text-[var(--text-muted)] mt-1 tracking-widest">ENGLISH</div>
      </motion.div>
    </div>
  );
}

function MongoliaShowcase({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <div className="relative h-64 md:h-80 overflow-hidden rounded-2xl group">
      {/* Night sky */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #02040e 0%, #0a1232 30%, #180840 65%, #1a0c18 100%)' }}
      />

      {/* Aurora borealis */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(ellipse 90% 35% at 25% 18%, rgba(16,185,129,0.28) 0%, transparent 70%), radial-gradient(ellipse 70% 25% at 72% 12%, rgba(124,92,255,0.22) 0%, transparent 65%)',
        }}
      />

      {/* Star field */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px), radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px, 44px 44px',
          backgroundPosition: '0 0, 22px 22px',
        }}
      />

      {/* Mountain silhouettes */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
          {/* Far range */}
          <path
            d="M0,105 L70,58 L130,82 L210,32 L290,68 L370,22 L450,60 L530,40 L615,78 L700,30 L785,65 L865,44 L950,80 L1030,40 L1115,72 L1200,28 L1285,62 L1380,46 L1440,58 L1440,160 L0,160 Z"
            fill="#1a1a38"
            opacity="0.92"
          />
          {/* Mid range */}
          <path
            d="M0,128 L90,80 L190,108 L310,60 L430,96 L555,50 L670,90 L790,58 L910,100 L1040,65 L1155,108 L1280,75 L1440,92 L1440,160 L0,160 Z"
            fill="#0f0f28"
          />
          {/* Ground / steppe */}
          <path
            d="M0,150 Q360,142 720,148 Q1080,154 1440,144 L1440,160 L0,160 Z"
            fill="#09091e"
          />
        </svg>
      </div>

      {/* Ger (yurt) silhouette */}
      <div className="absolute bottom-[26px] left-[8%]">
        <svg width="44" height="26" viewBox="0 0 44 26" fill="#09091e">
          <path d="M2,26 L6,14 Q22,2 38,14 L42,26 Z" />
          <rect x="15" y="17" width="14" height="9" />
          <rect x="20" y="14" width="4" height="5" />
          <circle cx="22" cy="3" r="1.5" fill="#27c93f" opacity="0.7" />
        </svg>
      </div>

      {/* Second ger — far */}
      <div className="absolute bottom-[22px] right-[12%]">
        <svg width="28" height="17" viewBox="0 0 28 17" fill="#09091e" opacity="0.7">
          <path d="M1,17 L4,9 Q14,1 24,9 L27,17 Z" />
          <rect x="9" y="11" width="10" height="6" />
        </svg>
      </div>

      {/* Text content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pb-8">
        <motion.span
          className="eyebrow mb-3"
          style={{ color: 'rgba(52,211,153,0.85)' }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {L('Монголд зориулсан', 'Built for Mongolia')}
        </motion.span>
        <motion.h3
          className="font-display text-2xl md:text-4xl font-black tracking-tighter text-white leading-[1.05]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          {L('Монгол бизнесийн ', 'Mongolian business ')}
          <span style={{ color: '#34d399' }}>{L('цифрлэл', 'going digital')}</span>
        </motion.h3>
        <motion.p
          className="mt-3 text-sm max-w-sm"
          style={{ color: 'rgba(255,255,255,0.45)' }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2 }}
        >
          {L(
            'Тал нутгийн өргөн уудамтай адил — таны бизнес дэлхийд харагддаг болог.',
            'As vast as the steppes — let your business be seen by the world.',
          )}
        </motion.p>
      </div>

      {/* Hover shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 65%)' }}
      />
    </div>
  );
}

// ─── BentoCard wrapper ───────────────────────────────────────────────────────

function BentoCard({ children, span = 'md:col-span-3', delay = 0, noPad = false }) {
  return (
    <motion.div
      className={`card ${noPad ? '' : 'p-6'} ${span} group relative overflow-hidden`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={noPad ? undefined : {
        y: -4,
        boxShadow: '0 22px 60px -20px rgba(124, 92, 255, 0.35)',
        transition: { duration: 0.3 },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function BentoCapabilities({ locale }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <section className="border-t border-[var(--surface-border)]">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">

        <motion.div
          className="flex items-end justify-between flex-wrap gap-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div>
            <span className="eyebrow text-[var(--accent-light)]">{L('Чадварууд', 'Capabilities')}</span>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-black tracking-tighter leading-[1.02]">
              {L('Эхлэлээс публиш хүртэл ', 'From prompt to production ')}
              <span className="gradient-text">{L('нэг платформ', 'on one platform')}</span>
            </h2>
          </div>
          <p className="text-sm text-[var(--text-tertiary)] max-w-sm">
            {L(
              'Hosting, домэйн, AI, төлбөр — бид бүгдийг нэгтгэсэн. Та зөвхөн бизнест анхаарлаа төвлөрүүл.',
              'Hosting, domains, AI, and payments in one place. You stay on the business, we stitch the rest.',
            )}
          </p>
        </motion.div>

        <div className="mt-14 grid md:grid-cols-6 gap-4">
          {/* Row 1 */}
          <BentoCard span="md:col-span-4" delay={0.1}>
            <GeminiTerminal />
            <div className="mt-5">
              <h3 className="font-display text-lg font-bold tracking-tight">{L('AI зохиомжтой контент', 'AI copywriting')}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {L(
                  'Gemini 2.5 Flash таны салбарт тохирсон hero, about, FAQ бичнэ. MN/EN хоёул.',
                  'Gemini 2.5 Flash writes hero, about, and FAQ copy tuned to your vertical. MN + EN.',
                )}
              </p>
            </div>
          </BentoCard>

          <BentoCard span="md:col-span-2" delay={0.15}>
            <FluxGrid />
            <div className="mt-5">
              <h3 className="font-display text-lg font-bold tracking-tight">{L('Flux зургийн генератор', 'Flux image generator')}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {L('Hero + gallery зургийг Flux schnell-ээр бүтээнэ.', 'Hero imagery rendered by Flux schnell, palette-matched.')}
              </p>
            </div>
          </BentoCard>

          {/* Row 2 */}
          <BentoCard span="md:col-span-2" delay={0.2}>
            <DomainVisual />
            <div className="mt-4">
              <h3 className="font-display text-lg font-bold tracking-tight">{L('Өөрийн домэйн', 'Custom domain')}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {L('DNS TXT-ээр баталгаажуулах, HTTPS автоматаар.', 'DNS TXT-verified, HTTPS provisioned automatically.')}
              </p>
            </div>
          </BentoCard>

          <BentoCard span="md:col-span-2" delay={0.25}>
            <PaymentsVisual />
            <div className="mt-4">
              <h3 className="font-display text-lg font-bold tracking-tight">{L('Монгол төлбөр', 'Mongolian payments')}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {L('QPay, SocialPay, Хаан, Голомт.', 'QPay, SocialPay, Khan, Golomt.')}
              </p>
            </div>
          </BentoCard>

          <BentoCard span="md:col-span-2" delay={0.3}>
            <BilingualVisual />
            <div className="mt-4">
              <h3 className="font-display text-lg font-bold tracking-tight">{L('Хоёр хэл', 'Bilingual')}</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                {L('MN/EN нэг workspace-ээс, синхрончлогддог.', 'MN / EN from a single workspace, always in sync.')}
              </p>
            </div>
          </BentoCard>

          {/* Row 3 — Mongolia showcase */}
          <BentoCard span="md:col-span-6" delay={0.38} noPad>
            <MongoliaShowcase locale={locale} />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}
