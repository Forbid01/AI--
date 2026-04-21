'use client';

import { useState } from 'react';
import { themeToCssVars } from '../_primitives/SectionShell.jsx';

export default function SingleLarge({ content = [], theme }) {
  const style = themeToCssVars(theme);
  const items = Array.isArray(content) ? content : (content?.items ?? []);
  const [idx, setIdx] = useState(0);

  if (items.length === 0) return null;
  const t = items[idx] ?? items[0];

  return (
    <section
      id="testimonials"
      style={style}
      className="bg-[var(--background)] text-[var(--foreground)]"
    >
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        <span
          className="text-[var(--accent)] font-black block mx-auto"
          style={{ fontSize: '6rem', lineHeight: 0.5, fontFamily: 'var(--font-heading)' }}
          aria-hidden
        >
          "
        </span>

        <blockquote className="mt-8">
          <p
            style={{ fontFamily: 'var(--font-heading)' }}
            className="text-2xl md:text-3xl lg:text-4xl font-light leading-snug tracking-tight"
          >
            {t.quote}
          </p>
          <footer className="mt-10 flex items-center justify-center gap-4">
            <div
              className="h-12 w-12 rounded-full grid place-items-center text-base font-bold"
              style={{ background: 'var(--accent)', color: 'var(--background)' }}
            >
              {(t.author ?? '?')[0].toUpperCase()}
            </div>
            <div className="text-left">
              <cite className="not-italic font-semibold block">{t.author}</cite>
              {t.role && <span className="text-sm text-[var(--muted)]">{t.role}</span>}
            </div>
          </footer>
        </blockquote>

        {items.length > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Сэтгэгдэл ${i + 1}`}
                className={[
                  'h-1.5 rounded-full transition-all',
                  i === idx ? 'w-8 bg-[var(--accent)]' : 'w-1.5 bg-[var(--hairline)]',
                ].join(' ')}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
