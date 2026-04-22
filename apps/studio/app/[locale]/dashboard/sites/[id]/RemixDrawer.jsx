'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const SECTION_OPTIONS = [
  { type: 'hero', mn: 'Нүүр хэсэг', en: 'Hero' },
  { type: 'about', mn: 'Бидний тухай', en: 'About' },
  { type: 'services', mn: 'Үйлчилгээ', en: 'Services' },
  { type: 'features', mn: 'Онцлог', en: 'Features' },
  { type: 'stats', mn: 'Тоон баримт', en: 'Stats' },
  { type: 'process', mn: 'Ажиллах зарчим', en: 'Process' },
  { type: 'gallery', mn: 'Галлерей', en: 'Gallery' },
  { type: 'testimonials', mn: 'Үйлчлүүлэгчид', en: 'Testimonials' },
  { type: 'faq', mn: 'Асуулт хариулт', en: 'FAQ' },
  { type: 'cta', mn: 'Уриалга', en: 'CTA' },
  { type: 'contact', mn: 'Холбоо барих', en: 'Contact' },
];

export default function RemixDrawer({ site, locale, variants }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(null);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  async function call(body, action) {
    setLoading(action);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Алдаа');
      setNotice(L('Амжилттай', 'Done'));
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold shadow-2xl transition-transform hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #7c5cff, #22d3ee)', color: '#fff' }}
      >
        <span>✨</span> {L('Remix', 'Remix')}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--bg-primary)] border-l border-[var(--surface-border)] z-50 overflow-y-auto"
            >
              <div className="sticky top-0 bg-[var(--bg-primary)]/90 backdrop-blur-lg border-b border-[var(--surface-border)] px-6 py-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">{L('AI Remix', 'AI Remix')}</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full border border-[var(--surface-border)] hover:bg-[var(--bg-hover)] flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Section regenerate */}
                <section>
                  <h3 className="eyebrow text-[var(--text-muted)] mb-3">
                    {L('Нэг хэсгийн текст шинэчлэх', 'Regenerate a section')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {SECTION_OPTIONS.map((s) => (
                      <button
                        key={s.type}
                        disabled={!!loading}
                        onClick={() => call({ action: 'regenerate-section', section: s.type }, `section:${s.type}`)}
                        className="px-3 py-1.5 text-sm rounded-full border border-[var(--surface-border)] hover:border-[var(--accent)] disabled:opacity-40 transition-colors"
                      >
                        {loading === `section:${s.type}` ? '...' : L(s.mn, s.en)}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Variant swap — only for ai_composed */}
                {site.mode === 'ai_composed' && variants && (
                  <section>
                    <h3 className="eyebrow text-[var(--text-muted)] mb-3">
                      {L('Variant солих', 'Swap variant')}
                    </h3>
                    <div className="space-y-3">
                      {SECTION_OPTIONS.filter((s) => variants[s.type]?.length > 1).map((s) => (
                        <div key={s.type}>
                          <div className="text-sm font-semibold mb-1.5">{L(s.mn, s.en)}</div>
                          <div className="flex flex-wrap gap-1.5">
                            {variants[s.type].map((v) => (
                              <button
                                key={v}
                                disabled={!!loading}
                                onClick={() => call({ action: 'swap-variant', section: s.type, variant: v }, `variant:${s.type}:${v}`)}
                                className="px-2.5 py-1 text-xs font-mono rounded-md border border-[var(--surface-border)] hover:border-[var(--accent)] disabled:opacity-40 transition-colors"
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Layout + theme regenerate — only for ai_composed */}
                {site.mode === 'ai_composed' && (
                  <section>
                    <h3 className="eyebrow text-[var(--text-muted)] mb-3">
                      {L('Бүх layout шинэчлэх', 'Regenerate full layout')}
                    </h3>
                    <button
                      disabled={!!loading}
                      onClick={() => call({ action: 'regenerate-layout' }, 'layout')}
                      className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-40 transition-transform hover:scale-[1.02]"
                      style={{ background: 'linear-gradient(135deg, #7c5cff, #22d3ee)' }}
                    >
                      {loading === 'layout' ? L('Үүсгэж байна...', 'Regenerating...') : L('✨ Layout + Theme', '✨ Layout + Theme')}
                    </button>
                  </section>
                )}

                {(notice || error) && (
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      error
                        ? 'bg-red-500/10 text-red-300 border border-red-500/30'
                        : 'bg-green-500/10 text-green-300 border border-green-500/30'
                    }`}
                  >
                    {error || notice}
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
