'use client';

import { tones, tonePresetIds } from '@aiweb/ai/tones';

export default function TonePicker({ value, onChange, locale = 'mn' }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {tonePresetIds.map((id) => {
        const tone = tones[id];
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`text-left p-4 rounded-lg border transition ${
              active ? 'border-black bg-black text-white' : 'border-black/10 hover:border-black/30'
            }`}
          >
            <div className="font-semibold">{tone.label[locale] ?? tone.label.mn}</div>
            <div className={`text-xs mt-1 ${active ? 'opacity-80' : 'opacity-60'}`}>{id}</div>
          </button>
        );
      })}
    </div>
  );
}
