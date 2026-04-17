'use client';

import { tones, tonePresetIds } from '@aiweb/ai/tones';

const HINTS = {
  formal: { mn: 'Банк, хууль, B2B', en: 'Banks, law, B2B' },
  friendly: { mn: 'Кафе, дэлгүүр, гэр бүл', en: 'Cafés, retail, family' },
  premium: { mn: 'Галлерей, зочид буудал, брэнд', en: 'Galleries, hotels, brands' },
  sales: { mn: 'Урамшуулал, бөөний', en: 'Promos, wholesale' },
};

export default function TonePicker({ value, onChange, locale = 'mn' }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {tonePresetIds.map((id, i) => {
        const tone = tones[id];
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
            className={`relative text-left p-6 rounded-xl border transition-all duration-200
              ${active
                ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-lg shadow-[var(--accent-soft)]'
                : 'border-[var(--surface-border)] bg-[var(--surface)] hover:border-[var(--surface-border-strong)] hover:bg-[var(--surface-raised)]'}`}
          >
            <div className="flex items-start justify-between">
              <span className={`font-mono text-xs tabular ${active ? 'text-[var(--accent-light)]' : 'text-[var(--text-muted)]'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              {active && <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />}
            </div>
            <div className={`mt-5 font-display text-xl font-semibold tracking-tight ${active ? 'text-[var(--text-primary)]' : ''}`}>
              {tone.label[locale] ?? tone.label.mn}
            </div>
            <div className={`mt-2 text-xs ${active ? 'text-[var(--accent-light)]' : 'text-[var(--text-tertiary)]'}`}>
              {HINTS[id]?.[locale] ?? id}
            </div>
          </button>
        );
      })}
    </div>
  );
}
