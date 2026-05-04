'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteSiteButton({ siteId, siteName, locale }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  async function onDelete() {
    const ok = confirm(
      L(
        `"${siteName}" сайтыг устгах уу? Энэ нь soft delete хийгдэнэ.`,
        `Soft-delete "${siteName}"?`,
      ),
    );
    if (!ok) return;

    setPending(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/sites/${siteId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || L('Алдаа гарлаа', 'Something went wrong'));
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={onDelete}
        disabled={pending}
        className="text-xs px-3 py-1 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 disabled:opacity-30 transition-colors"
      >
        {pending ? '...' : L('Устгах', 'Delete')}
      </button>
      {error && (
        <p className="max-w-[220px] text-right text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
