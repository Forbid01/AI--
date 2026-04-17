'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const DEMO_PROMPTS = {
  mn: [
    'Улаанбаатарын орчин үеийн кофе шоп',
    'Хуучны барилга сэргээн засварлах компани',
    'Йога студи — Зайсан хорооллын',
    'Монгол хоолны ресторан, аялал жуулчлалын',
    'Гэрийн барилгын дизайн студи',
  ],
  en: [
    'A modern coffee shop in Ulaanbaatar',
    'A heritage building restoration studio',
    'A boutique yoga studio in Zaisan',
    'Mongolian cuisine restaurant for travellers',
    'A residential architecture studio',
  ],
};

export default function LandingHero({ locale }) {
  const router = useRouter();
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const list = DEMO_PROMPTS[locale] ?? DEMO_PROMPTS.en;

  const [value, setValue] = useState('');
  const [typed, setTyped] = useState('');
  const [focused, setFocused] = useState(false);
  const typingRef = useRef({ promptIndex: 0, charIndex: 0, mode: 'typing' });
  const focusedRef = useRef(false);

  useEffect(() => {
    focusedRef.current = focused || value.length > 0;
  }, [focused, value]);

  useEffect(() => {
    let cancelled = false;

    const loop = async () => {
      while (!cancelled) {
        if (focusedRef.current) {
          await wait(250);
          continue;
        }
        const s = typingRef.current;
        const current = list[s.promptIndex];

        if (s.mode === 'typing') {
          s.charIndex += 1;
          setTyped(current.slice(0, s.charIndex));
          if (s.charIndex >= current.length) {
            s.mode = 'hold';
            await wait(1800);
            s.mode = 'deleting';
          } else {
            await wait(35 + Math.random() * 45);
          }
        } else if (s.mode === 'deleting') {
          s.charIndex -= 2;
          if (s.charIndex <= 0) {
            s.charIndex = 0;
            s.promptIndex = (s.promptIndex + 1) % list.length;
            s.mode = 'typing';
            await wait(250);
          } else {
            setTyped(current.slice(0, s.charIndex));
            await wait(22);
          }
        }
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, [list]);

  function handleSubmit(e) {
    e.preventDefault();
    const prompt = (value || typed).trim();
    if (prompt) {
      router.push(`/${locale}/dashboard/sites/new?prompt=${encodeURIComponent(prompt)}`);
    } else {
      router.push(`/${locale}/dashboard/sites/new`);
    }
  }

  const shownPlaceholder = useMemo(() => (focused || value ? '' : typed), [focused, typed, value]);

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="orb orb-a"
          style={{ top: '-10%', left: '-8%', width: '480px', height: '480px' }}
        />
        <div
          className="orb orb-b"
          style={{ top: '30%', right: '-10%', width: '520px', height: '520px' }}
        />
        <div
          className="orb orb-c"
          style={{ bottom: '-20%', left: '30%', width: '420px', height: '420px' }}
        />
        <div className="absolute inset-0 grid-pattern opacity-70" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-28 md:pt-36 md:pb-40 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border-strong)] bg-[var(--surface)]/70 backdrop-blur px-4 py-1.5 text-xs text-[var(--text-secondary)] mb-8 reveal">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-70 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
          </span>
          <span className="font-mono">{L('AI · Gemini 2.5 · Cloudflare Flux', 'AI · Gemini 2.5 · Cloudflare Flux')}</span>
          <span className="text-[var(--text-muted)]">·</span>
          <span>{L('Шинэ хувилбар', 'New release')}</span>
        </div>

        <h1 className="font-display text-[42px] leading-[1.04] sm:text-[60px] md:text-[78px] lg:text-[92px] font-bold tracking-[-0.03em] reveal reveal-delay-1">
          {L('Бизнесээ тайлбарла.', 'Describe your business.')}
          <br />
          <span className="gradient-text">
            {L('AI вэбсайт бүтээнэ.', 'AI builds the website.')}
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed reveal reveal-delay-2">
          {L(
            'Хэдхэн өгүүлбэрээр бизнесийнхээ тухай хэл. Gemini контент бичиж, Flux зураг үүсгэж, орчин үеийн загвар сонгоно — хэдхэн минутад публиш хийж болно.',
            'Tell us about your business in a sentence. Gemini writes the copy, Flux paints the imagery, and a modern template comes together — live in minutes.',
          )}
        </p>

        <form onSubmit={handleSubmit} className="mt-10 max-w-2xl mx-auto reveal reveal-delay-3">
          <div className="relative group">
            <div className="absolute -inset-[2px] bg-gradient-to-r from-[var(--gradient-start)] via-[var(--gradient-mid)] to-[var(--gradient-end)] rounded-2xl opacity-40 group-hover:opacity-60 group-focus-within:opacity-80 transition-opacity blur-[6px]" />
            <div className="relative flex items-center bg-[var(--bg-secondary)]/90 backdrop-blur-xl border border-[var(--surface-border-strong)] rounded-2xl overflow-hidden">
              <div className="pl-5 text-[var(--accent-light)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder={shownPlaceholder || L('Бизнесийнхээ тухай бичнэ үү...', 'Describe your business...')}
                className="flex-1 bg-transparent px-4 py-5 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none text-base"
                aria-label={L('Бизнесийн тайлбар', 'Business description')}
              />
              <button
                type="submit"
                className="m-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-mid)] text-white font-semibold text-sm hover:brightness-110 transition-all shadow-lg shadow-[var(--accent-soft)] shine"
              >
                {L('Эхлэх', 'Generate')}
                <span className="ml-1.5" aria-hidden>&rarr;</span>
              </button>
            </div>
          </div>

          {/* Suggestion chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {(locale === 'mn'
              ? ['Кофе шоп', 'Йога студи', 'Хуулийн фирм', 'Зочид буудал']
              : ['Coffee shop', 'Yoga studio', 'Law firm', 'Boutique hotel']
            ).map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setValue(chip);
                }}
                className="text-xs px-3 py-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--surface)]/60 text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-all"
              >
                {chip}
              </button>
            ))}
          </div>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--text-muted)] reveal reveal-delay-4">
          <span>{L('Кредит карт шаардлагагүй', 'No credit card required')}</span>
          <span className="hidden sm:inline">·</span>
          <span>{L('14 хоног үнэгүй', '14-day free trial')}</span>
          <span className="hidden sm:inline">·</span>
          <span>{L('2 минутад публиш', 'Live in 2 minutes')}</span>
        </div>
      </div>
    </section>
  );
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
