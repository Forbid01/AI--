'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SiteActions({ site, locale }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const published = site.status === 'published';
  const isAiComposed = site.mode === 'ai_composed';

  useEffect(() => {
    if (!notice && !error) return;
    const id = setTimeout(() => {
      setNotice(null);
      setError(null);
    }, 4000);
    return () => clearTimeout(id);
  }, [notice, error]);

  async function ai(action) {
    setLoading(action);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId: site.id, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || L('Алдаа гарлаа', 'Something went wrong'));
      const label = {
        regenerate: L('Контент шинэчлэгдлээ', 'Copy regenerated'),
        translate: L('Орчуулга бэлэн', 'Translation ready'),
        'hero-image': L('Шинэ зураг үүсгэгдлээ', 'New image generated'),
        'regenerate-layout': L('Layout шинэчлэгдлээ', 'Layout regenerated'),
      }[action];
      setNotice(label || L('Амжилттай', 'Done'));
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  async function togglePublish() {
    setLoading('publish');
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/sites/${site.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: !published }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || L('Алдаа гарлаа', 'Something went wrong'));
      setNotice(
        !published
          ? L('Сайт нийтлэгдлээ', 'Site published')
          : L('Сайт ноорог болсон', 'Site unpublished'),
      );
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  const busy = loading !== null;

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex rounded-xl border border-[var(--surface-border)] overflow-hidden bg-[var(--surface)]">
          <button
            onClick={() => ai('regenerate')}
            disabled={busy}
            className="px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-40 border-r border-[var(--surface-border)] transition-colors"
            title={L('Текстийг дахин үүсгэх', 'Regenerate copy')}
          >
            {loading === 'regenerate' ? (
              <span className="flex gap-1"><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /></span>
            ) : L('Дахин зохиох', 'Redraft')}
          </button>
          <button
            onClick={() => ai('translate')}
            disabled={busy}
            className="px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-40 border-r border-[var(--surface-border)] transition-colors"
            title={L('Нөгөө хэл рүү', 'Translate')}
          >
            {loading === 'translate' ? (
              <span className="flex gap-1"><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /></span>
            ) : L('Орчуулах', 'Translate')}
          </button>
          <button
            onClick={() => ai('hero-image')}
            disabled={busy}
            className={`px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-40 transition-colors ${isAiComposed ? 'border-r border-[var(--surface-border)]' : ''}`}
            title={L('Нүүр зургийг дахин үүсгэх', 'Regenerate hero image')}
          >
            {loading === 'hero-image' ? (
              <span className="flex gap-1"><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /></span>
            ) : L('Зураг', 'New image')}
          </button>
          {isAiComposed && (
            <button
              onClick={() => ai('regenerate-layout')}
              disabled={busy}
              className="px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] disabled:opacity-40 transition-colors"
              title={L('Сайтын бүтцийг дахин үүсгэх', 'Regenerate layout')}
            >
              {loading === 'regenerate-layout' ? (
                <span className="flex gap-1"><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /><span className="typing-dot h-1 w-1 rounded-full bg-[var(--accent-light)]" /></span>
              ) : (
                <span className="inline-flex items-center gap-1.5">✨ {L('Layout', 'Layout')}</span>
              )}
            </button>
          )}
        </div>
        <button
          onClick={togglePublish}
          disabled={busy}
          className={published ? 'btn btn-outline btn-md' : 'btn btn-accent btn-md'}
        >
          {loading === 'publish' ? (
            <span className="flex gap-1"><span className="typing-dot h-1 w-1 rounded-full bg-white" /><span className="typing-dot h-1 w-1 rounded-full bg-white" /><span className="typing-dot h-1 w-1 rounded-full bg-white" /></span>
          ) : published ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
              {L('Нийтлэгдсэн', 'Live')}
            </>
          ) : (
            <>{L('Нийтлэх', 'Publish')} <span aria-hidden>&#8599;</span></>
          )}
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="text-xs text-[var(--danger)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 rounded-xl px-3 py-2 max-w-xs"
        >
          {error}
        </p>
      )}
      {notice && !error && (
        <p className="text-xs text-[var(--success)] border border-[var(--success)]/25 bg-[var(--success)]/10 rounded-xl px-3 py-2">
          {notice}
        </p>
      )}
    </div>
  );
}
