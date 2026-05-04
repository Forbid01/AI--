'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MAX_ATTEMPTS = 12;
const REFRESH_INTERVAL_MS = 3500;

export default function AssetAutoRefresh({
  locale,
  pendingHero,
  galleryCount,
  expectedGalleryCount,
}) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  useEffect(() => {
    if (attempts >= MAX_ATTEMPTS) return undefined;

    const id = setInterval(() => {
      setAttempts((current) => current + 1);
      router.refresh();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(id);
  }, [attempts, router]);

  const galleryLabel =
    expectedGalleryCount > 0
      ? `${galleryCount}/${expectedGalleryCount}`
      : `${galleryCount}`;

  return (
    <div className="mb-4 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] px-4 py-3 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.45)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-light)]">
            <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-light)]" />
            {L('AI дүрслэл боловсруулагдаж байна', 'AI visuals are still rendering')}
          </div>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {L(
              'Зурагнууд автоматаар орж ирнэ. Энэ хуудсыг бид өөрөө шинэчилж байна.',
              'Images will appear automatically. We are refreshing this page for you.',
            )}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
          <span className="rounded-full border border-[var(--surface-border)] px-3 py-1">
            {L('Hero', 'Hero')}: {pendingHero ? L('хүлээгдэж байна', 'pending') : L('бэлэн', 'ready')}
          </span>
          <span className="rounded-full border border-[var(--surface-border)] px-3 py-1">
            Gallery: {galleryLabel}
          </span>
          <span className="rounded-full border border-[var(--surface-border)] px-3 py-1">
            {L('Шинэчлэлт', 'Refresh')} {Math.min(attempts + 1, MAX_ATTEMPTS)}/{MAX_ATTEMPTS}
          </span>
        </div>
      </div>
    </div>
  );
}
