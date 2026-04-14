'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SiteActions({ siteId, locale }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null);

  async function call(action) {
    setLoading(action);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, action }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.refresh();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(null);
    }
  }

  const L = (mn, en) => (locale === 'mn' ? mn : en);

  return (
    <div className="flex gap-2 text-sm">
      <button
        onClick={() => call('regenerate')}
        disabled={loading !== null}
        className="px-3 py-2 rounded-md border border-black/15 hover:bg-black/5 disabled:opacity-50"
      >
        {loading === 'regenerate' ? L('Үүсгэж байна...', 'Regenerating...') : L('Дахин үүсгэх', 'Regenerate')}
      </button>
      <button
        onClick={() => call('translate')}
        disabled={loading !== null}
        className="px-3 py-2 rounded-md border border-black/15 hover:bg-black/5 disabled:opacity-50"
      >
        {loading === 'translate' ? L('Орчуулж байна...', 'Translating...') : L('Орчуулах', 'Translate')}
      </button>
      <button
        onClick={() => call('hero-image')}
        disabled={loading !== null}
        className="px-3 py-2 rounded-md border border-black/15 hover:bg-black/5 disabled:opacity-50"
      >
        {loading === 'hero-image' ? L('Зураг...', 'Image...') : L('Зураг шинэчлэх', 'New hero image')}
      </button>
    </div>
  );
}
