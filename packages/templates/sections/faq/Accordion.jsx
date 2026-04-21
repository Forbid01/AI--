'use client';

import { useState } from 'react';
import { themeToCssVars, L } from '../_primitives/SectionShell.jsx';

export default function Accordion({ content = [], theme, locale = 'mn' }) {
  const style = themeToCssVars(theme);
  const items = Array.isArray(content) ? content : (content?.items ?? []);
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section
      id="faq"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-3xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-12">
          <span className="inline-block text-[11px] font-semibold tracking-[0.22em] uppercase text-[var(--accent)] mb-3">
            FAQ
          </span>
          <h2
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-3xl md:text-5xl font-black tracking-tight"
          >
            {L(locale, 'Түгээмэл асуулт', 'Frequently asked')}
          </h2>
        </div>

        <ul className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
          {items.map((q, i) => {
            const isOpen = openIdx === i;
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="w-full py-5 flex items-center justify-between gap-4 text-left group"
                >
                  <span
                    style={{ fontFamily: 'var(--font-heading)' }}
                    className="text-base md:text-lg font-semibold group-hover:text-[var(--accent)] transition-colors pr-4"
                  >
                    {q.question}
                  </span>
                  <span
                    className={`shrink-0 h-8 w-8 rounded-full border border-[var(--hairline)] grid place-items-center transition-transform text-sm ${isOpen ? 'rotate-45 border-[var(--accent)] text-[var(--accent)]' : ''}`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all"
                  style={{
                    maxHeight: isOpen ? '500px' : '0',
                    opacity: isOpen ? 1 : 0,
                    transitionDuration: '0.3s',
                    transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                  }}
                >
                  <p className="pb-5 text-[var(--muted)] leading-relaxed">
                    {q.answer}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
