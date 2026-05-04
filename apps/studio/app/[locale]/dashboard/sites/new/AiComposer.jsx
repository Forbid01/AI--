'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { formatSiteValidationError } from '@/lib/siteValidation.js';

const VIBES = [
  { id: 'minimal',   label: 'Минимал',     desc: 'Цэвэрхэн, цагаан орон зайтай', swatch: ['#0f172a', '#7c5cff', '#ffffff'] },
  { id: 'bold',      label: 'Хурц',        desc: 'Өндөр контраст, энерги',        swatch: ['#000000', '#facc15', '#ef4444'] },
  { id: 'elegant',   label: 'Элегант',     desc: 'Сонгодог, сэтгүүл-шиг',          swatch: ['#3f1d38', '#a16207', '#f5f0e6'] },
  { id: 'playful',   label: 'Хөгжилтэй',   desc: 'Хөөрхөн, найрсаг',               swatch: ['#ec4899', '#22c55e', '#fef3c7'] },
  { id: 'luxe',      label: 'Тансаг',      desc: 'Шампанск + нүүрс, премиум',     swatch: ['#0a0a0a', '#d4af37', '#1f1f1f'] },
  { id: 'tech',      label: 'Технологи',   desc: 'Электрик цэнхэр, grid',          swatch: ['#020617', '#22d3ee', '#7c3aed'] },
  { id: 'organic',   label: 'Байгалийн',   desc: 'Ногоон, шорооны өнгө',          swatch: ['#365314', '#ca8a04', '#fef3c7'] },
  { id: 'editorial', label: 'Сэтгүүлийн', desc: 'Типограф тод, сонгодог',         swatch: ['#1e293b', '#dc2626', '#fafaf9'] },
];

const INDUSTRY_CHIPS = [
  'Кафе', 'Ресторан', 'Йога', 'Фитнесс', 'Зочид буудал', 'Салон',
  'Хуулийн фирм', 'Барилга дизайн', 'Онлайн дэлгүүр', 'Консалтинг',
];

const TONES = [
  { id: 'friendly', label: 'Найрсаг' },
  { id: 'formal',   label: 'Албан ёсны' },
  { id: 'premium',  label: 'Премиум' },
  { id: 'sales',    label: 'Борлуулалтын' },
];

export default function AiComposer({ locale = 'mn' }) {
  const router = useRouter();
  const [step, setStep] = useState('describe');
  const [description, setDescription] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [tone, setTone] = useState('friendly');
  const [vibe, setVibe] = useState('minimal');
  const [subdomain, setSubdomain] = useState('');
  const [error, setError] = useState(null);
  const root = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || 'platform.mn';

  const cleanSubdomain = useMemo(
    () =>
      subdomain
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 30),
    [subdomain],
  );

  const canProceedFromDescribe = description.trim().length >= 10 && businessName.trim().length > 0;
  const canGenerate = cleanSubdomain.length >= 3;

  async function handleGenerate() {
    setStep('generating');
    setError(null);
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'ai_composed',
          vibe,
          tone,
          defaultLocale: locale,
          subdomain: cleanSubdomain,
          business: {
            businessName: businessName.trim(),
            industry: industry || (locale === 'mn' ? 'Бизнес' : 'Business'),
            description: description.trim(),
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(formatSiteValidationError(data, locale));
      setStep('done');
      setTimeout(() => {
        router.push(`/${locale}/dashboard/sites/${data.site.id}`);
      }, 1600);
    } catch (e) {
      setError(e.message || String(e));
      setStep('subdomain');
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f] text-white">
      <BackgroundOrbs />

      <div className="relative max-w-3xl mx-auto px-6 py-12 md:py-20">
        <StepIndicator step={step} />

        <AnimatePresence mode="wait">
          {step === 'describe' && (
            <Stage key="describe">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                Танай бизнесийн тухай хэдхэн өгүүлбэрээр
              </h1>
              <p className="text-white/60 mb-8">
                AI энэхүү тайлбараас layout, өнгө, content бүгдийг үүсгэнэ.
              </p>

              <label className="block text-sm font-semibold text-white/80 mb-2">Бизнесийн нэр</label>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Жишээ: Bluemoon Cafe"
                className="w-full px-4 py-3 mb-6 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#7c5cff] transition-colors"
              />

              <label className="block text-sm font-semibold text-white/80 mb-2">Юу хийдэг вэ?</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Жишээ: Зайсанд байрлах, мэргэжлийн barista-тай, үйлчилгээний найрсаг кофе шоп. Амттан, өглөөний хоол бий."
                rows={5}
                className="w-full px-4 py-3 mb-6 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#7c5cff] transition-colors resize-none"
              />

              <label className="block text-sm font-semibold text-white/80 mb-3">Салбар (сонголт)</label>
              <div className="flex flex-wrap gap-2 mb-8">
                {INDUSTRY_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setIndustry(industry === chip ? '' : chip)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                      industry === chip
                        ? 'bg-[#7c5cff] border-[#7c5cff] text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <PrimaryButton disabled={!canProceedFromDescribe} onClick={() => setStep('vibe')}>
                Дараах →
              </PrimaryButton>
            </Stage>
          )}

          {step === 'vibe' && (
            <Stage key="vibe">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                Сайтын зан чанар
              </h1>
              <p className="text-white/60 mb-8">
                AI энэ vibe-д тохирсон өнгө, фонт, section layout сонгоно.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {VIBES.map((v) => (
                  <VibeCard
                    key={v.id}
                    vibe={v}
                    selected={vibe === v.id}
                    onSelect={() => setVibe(v.id)}
                  />
                ))}
              </div>

              <label className="block text-sm font-semibold text-white/80 mb-3">Өгүүлэмжийн өнгө аяс</label>
              <div className="flex flex-wrap gap-2 mb-8">
                {TONES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`px-4 py-2 text-sm rounded-full border transition-all ${
                      tone === t.id
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <SecondaryButton onClick={() => setStep('describe')}>← Буцах</SecondaryButton>
                <PrimaryButton onClick={() => setStep('subdomain')}>Дараах →</PrimaryButton>
              </div>
            </Stage>
          )}

          {step === 'subdomain' && (
            <Stage key="subdomain">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                Сайтын хаяг
              </h1>
              <p className="text-white/60 mb-8">
                Нийтэд гарах subdomain сонгоно уу.
              </p>

              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-[#7c5cff] transition-colors mb-6">
                <input
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="bluemoon-cafe"
                  className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/30 focus:outline-none"
                  autoFocus
                />
                <span className="px-4 py-3 text-white/40 border-l border-white/10 font-mono text-sm">
                  .{root}
                </span>
              </div>

              {subdomain && cleanSubdomain !== subdomain && (
                <p className="text-xs text-white/50 mb-4">
                  Цэвэрлэсэн: <span className="font-mono text-[#22d3ee]">{cleanSubdomain || '—'}</span>
                </p>
              )}

              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <SecondaryButton onClick={() => setStep('vibe')}>← Буцах</SecondaryButton>
                <PrimaryButton disabled={!canGenerate} onClick={handleGenerate}>
                  ✨ AI-аар үүсгэх
                </PrimaryButton>
              </div>
            </Stage>
          )}

          {step === 'generating' && (
            <Stage key="generating">
              <GeneratingView vibe={vibe} />
            </Stage>
          )}

          {step === 'done' && (
            <Stage key="done">
              <DoneView />
            </Stage>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Shared UI primitives ────────────────────────────────────────────────────

function Stage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function StepIndicator({ step }) {
  const labels = ['Тайлбар', 'Vibe', 'Хаяг'];
  const activeIdx = { describe: 0, vibe: 1, subdomain: 2, generating: 2, done: 2 }[step] ?? 0;
  const isWorking = step === 'generating' || step === 'done';

  return (
    <div className="flex items-center gap-3 mb-10 text-sm">
      {labels.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors ${
              i < activeIdx || (i === activeIdx && isWorking)
                ? 'bg-[#7c5cff] text-white'
                : i === activeIdx
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-white/40'
            }`}
          >
            {i + 1}
          </div>
          <span className={i === activeIdx ? 'text-white font-medium' : 'text-white/40'}>{label}</span>
          {i < labels.length - 1 && <span className="text-white/20 mx-1">→</span>}
        </div>
      ))}
    </div>
  );
}

function VibeCard({ vibe, selected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`relative text-left p-4 rounded-2xl border transition-all overflow-hidden ${
        selected
          ? 'bg-white text-black border-white shadow-lg shadow-white/20'
          : 'bg-white/5 border-white/10 text-white hover:border-white/30'
      }`}
    >
      <div className="flex gap-1 mb-3">
        {vibe.swatch.map((c, i) => (
          <div key={i} className="w-5 h-5 rounded-full ring-1 ring-black/10" style={{ background: c }} />
        ))}
      </div>
      <div className="text-sm font-bold mb-1">{vibe.label}</div>
      <div className={`text-xs ${selected ? 'text-black/60' : 'text-white/50'}`}>{vibe.desc}</div>
      {selected && (
        <motion.div
          layoutId="vibe-check"
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]"
        >
          ✓
        </motion.div>
      )}
    </button>
  );
}

function PrimaryButton({ children, disabled, onClick }) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center h-12 px-6 rounded-xl font-semibold transition-all ${
        disabled
          ? 'bg-white/10 text-white/30 cursor-not-allowed'
          : 'bg-white text-black hover:bg-white/90'
      }`}
    >
      {children}
    </motion.button>
  );
}

function SecondaryButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center h-12 px-5 rounded-xl font-semibold border border-white/15 text-white/80 hover:bg-white/5 transition-all"
    >
      {children}
    </button>
  );
}

function BackgroundOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="orb orb-a" style={{ background: '#7c5cff', width: 500, height: 500, top: -100, left: -100 }} />
      <div className="orb orb-b" style={{ background: '#22d3ee', width: 400, height: 400, bottom: -100, right: -100 }} />
    </div>
  );
}

// ─── Generating view ────────────────────────────────────────────────────────

const GEN_STEPS = [
  { text: 'Бизнесийн контекст шинжлэгдэж байна...',  color: '#22d3ee', delay: 0 },
  { text: 'Vibe-д тохирсон layout сонгож байна...',  color: '#a699ff', delay: 900 },
  { text: 'Өнгө, фонт, typography зохиогдлоо...',    color: '#c084fc', delay: 1900 },
  { text: 'AI текст үүсгэж байна...',                color: '#a699ff', delay: 3000 },
  { text: 'Hero зураг төсөөлж байна...',             color: '#ec4899', delay: 4400 },
];

function GeneratingView({ vibe }) {
  return (
    <div className="py-12 relative">
      {/* Sparkle orb — framer-motion premium loader */}
      <div className="relative w-28 h-28 mx-auto mb-10">
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.4), transparent 70%)' }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{
            background: 'conic-gradient(from 0deg, #7c5cff, #22d3ee, #a855f7, #7c5cff)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-6 rounded-full"
          style={{ background: 'linear-gradient(135deg, #7c5cff, #22d3ee)' }}
          animate={{ scale: [0.85, 1, 0.85] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <motion.span
            animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="text-2xl"
          >
            ✨
          </motion.span>
        </div>
        {/* Floating dots */}
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/80"
            style={{
              top: '50%',
              left: '50%',
              marginLeft: -4,
              marginTop: -4,
            }}
            animate={{
              x: [0, Math.cos((i * Math.PI) / 2) * 55, 0],
              y: [0, Math.sin((i * Math.PI) / 2) * 55, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-center mb-2"
      >
        Таны <span className="bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] bg-clip-text text-transparent">{vibe}</span> сайт бэлдэж байна
      </motion.h2>
      <p className="text-white/50 text-center mb-10 text-sm">
        Ихэвчлэн 30-60 секунд шаардана
      </p>

      <div className="max-w-md mx-auto space-y-2 font-mono text-xs">
        {GEN_STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: step.delay / 1000 }}
            className="flex items-center gap-2"
            style={{ color: step.color }}
          >
            <span className="text-white/30">{'>'}</span>
            <span>{step.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DoneView() {
  return (
    <div className="py-16 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#7c5cff] to-[#22d3ee] flex items-center justify-center text-4xl"
      >
        ✓
      </motion.div>
      <h2 className="text-3xl md:text-4xl font-black mb-3">Бэлэн боллоо!</h2>
      <p className="text-white/60">Dashboard руу чиглүүлж байна...</p>
    </div>
  );
}
