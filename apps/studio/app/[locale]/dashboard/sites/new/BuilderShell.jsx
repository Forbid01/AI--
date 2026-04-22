'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AiBuilder from './AiBuilder.jsx';
import AiComposer from './AiComposer.jsx';

const TRACKS = [
  {
    id: 'template',
    label: 'Template сонгох',
    desc: '23 бэлэн template-аас сонгон AI-гаар content үүсгэнэ',
    badge: 'Тогтсон',
    emoji: '📐',
  },
  {
    id: 'ai',
    label: 'AI-аар бүрэн хийлгэх',
    desc: 'Vibe сонгоод AI өөрөө layout, өнгө, content үүсгэнэ',
    badge: 'Шинэ',
    emoji: '✨',
  },
];

export default function BuilderShell({ locale, templates, initialPrompt, initialTemplate, initialTrack = 'template' }) {
  const [track, setTrack] = useState(initialTrack);

  return (
    <div className="relative">
      <TrackPicker track={track} onChange={setTrack} />

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

function TrackPicker({ track, onChange }) {
  return (
    <div className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-2">
        <span className="hidden md:block text-xs uppercase tracking-wider text-white/40 mr-2">
          Track
        </span>
        <div className="flex gap-2 p-1 bg-white/5 rounded-full border border-white/10">
          {TRACKS.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors z-10"
            >
              {track === t.id && (
                <motion.div
                  layoutId="track-pill"
                  className="absolute inset-0 bg-white rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className={`relative flex items-center gap-2 ${track === t.id ? 'text-black' : 'text-white/70'}`}>
                <span>{t.emoji}</span>
                <span>{t.label}</span>
                {t.badge === 'Шинэ' && track !== t.id && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#7c5cff] text-white">
                    Шинэ
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
