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
    <div className="inline-flex border border-black/10 rounded-md overflow-hidden text-xs">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          className={`px-3 py-1.5 uppercase ${l === current ? 'bg-black text-white' : 'hover:bg-black/5'}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
