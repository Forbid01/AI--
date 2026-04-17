'use client';

import { usePathname, useRouter } from 'next/navigation';

const LOCALES = ['mn', 'en'];

export default function LanguageToggle({ current }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale) {
    if (locale === current) return;
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    const segments = pathname.split('/');
    segments[1] = locale;
    router.push(segments.join('/') || `/${locale}`);
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex rounded-full border border-[var(--surface-border)] bg-[var(--surface)] p-0.5 text-[11px] font-mono tabular"
    >
      {LOCALES.map((l) => {
        const active = l === current;
        return (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            aria-pressed={active}
            className={`px-2.5 py-1 rounded-full uppercase tracking-[0.15em] transition-colors ${
              active
                ? 'bg-[var(--accent)] text-white'
                : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}
