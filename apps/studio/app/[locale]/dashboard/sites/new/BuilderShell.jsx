'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AiBuilder from './AiBuilder.jsx';
import AiComposer from './AiComposer.jsx';

const TRACKS = [
  {
    id: 'template',
    label: { mn: 'Template сонгох', en: 'Template guided' },
    desc: {
      mn: '23 бэлэн template-аас сонгон AI-гаар контент үүсгэнэ',
      en: 'Pick from 23 ready-made templates and let AI generate the content.',
    },
    badge: { mn: 'Стандарт', en: 'Standard' },
  },
  {
    id: 'ai',
    label: { mn: 'AI-аар бүрэн хийлгэх', en: 'AI composed' },
    desc: {
      mn: 'Vibe сонгоод AI өөрөө layout, өнгө, контент үүсгэнэ',
      en: 'Choose a vibe and let AI generate the layout, palette, and content.',
    },
    badge: { mn: 'Шинэ', en: 'New' },
  },
];

export default function BuilderShell({ locale, templates, initialPrompt, initialTemplate, initialTrack = 'template' }) {
  const [track, setTrack] = useState(initialTrack);

  return (
    <div className="relative">
      <TrackPicker locale={locale} track={track} onChange={setTrack} />

      {track === 'ai' ? (
        <AiComposer locale={locale} />
      ) : (
        <AiBuilder
          locale={locale}
          templates={templates}
          initialPrompt={initialPrompt}
          initialTemplate={initialTemplate}
        />
      )}
    </div>
  );
}

function TrackPicker({ locale, track, onChange }) {
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <div className="sticky top-0 z-40 border-b border-white/5 bg-[#07080d]/78 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
              {L('Workflow', 'Workflow')}
            </p>
            <h2 className="text-sm md:text-base font-semibold tracking-tight text-white/92 mt-1">
              {L('Вэбсайтаа үүсгэх аргаа сонгоно уу', 'Choose how you want to create your website')}
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {L('AI assisted workflow', 'AI assisted workflow')}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="relative overflow-hidden rounded-2xl border text-left transition-all duration-250"
              style={{
                borderColor: track === t.id ? 'rgba(124,92,255,0.4)' : 'rgba(255,255,255,0.08)',
                background: track === t.id
                  ? 'linear-gradient(135deg, rgba(124,92,255,0.18), rgba(34,211,238,0.08))'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                boxShadow: track === t.id
                  ? '0 0 0 1px rgba(124,92,255,0.18), 0 18px 40px -24px rgba(124,92,255,0.55)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.02)',
              }}
            >
              {track === t.id && (
                <motion.div
                  layoutId="track-sheen"
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent 55%)',
                  }}
                  transition={{ type: 'spring', stiffness: 360, damping: 34 }}
                />
              )}

              <div className="relative p-4 md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                      style={{
                        borderColor: track === t.id ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.08)',
                        background: track === t.id
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))'
                          : 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <TrackIcon trackId={t.id} active={track === t.id} />
                    </div>

                    <div className="min-w-0">
                      <div className={`text-sm font-semibold tracking-tight ${track === t.id ? 'text-white' : 'text-white/82'}`}>
                        {t.label[locale] ?? t.label.mn}
                      </div>
                      <p className={`mt-1 text-xs leading-relaxed ${track === t.id ? 'text-white/72' : 'text-white/50'}`}>
                        {t.desc[locale] ?? t.desc.mn}
                      </p>
                    </div>
                  </div>

                  <span
                    className="shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                    style={{
                      borderColor: t.id === 'ai' ? 'rgba(124,92,255,0.28)' : 'rgba(255,255,255,0.08)',
                      color: t.id === 'ai' ? '#c4b5fd' : 'rgba(255,255,255,0.52)',
                      background: t.id === 'ai' ? 'rgba(124,92,255,0.08)' : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    {t.badge[locale] ?? t.badge.mn}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TrackIcon({ trackId, active }) {
  const stroke = active ? '#ffffff' : 'rgba(255,255,255,0.72)';

  if (trackId === 'ai') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 3v4" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M5.64 6.64l2.83 2.83" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M3 12h4" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0Z" stroke={stroke} strokeWidth="1.9" />
        <path d="M18.36 6.64l-2.83 2.83" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M17 12h4" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M15.53 15.53l2.83 2.83" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M12 17v4" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
        <path d="M8.47 15.53l-2.83 2.83" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" stroke={stroke} strokeWidth="1.9" />
      <path d="M8 3.75v3.5" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
      <path d="M16 3.75v3.5" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
      <path d="M3.5 9.5h17" stroke={stroke} strokeWidth="1.9" />
      <path d="M7 13h4" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
      <path d="M7 16h7" stroke={stroke} strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
