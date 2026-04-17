'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function UserMenu({ locale }) {
  const { data, status } = useSession();
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  if (status === 'loading') {
    return <div className="h-7 w-20 rounded-full bg-[var(--surface-border)] animate-pulse" aria-hidden />;
  }

  if (!data?.user) {
    return (
      <Link
        href={`/${locale}/signin`}
        className="btn btn-outline btn-sm"
      >
        {L('Нэвтрэх', 'Sign in')}
      </Link>
    );
  }

  const email = data.user.email ?? '';
  const initial = (data.user.name?.[0] ?? email[0] ?? '?').toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--surface-border)] bg-[var(--surface)] pl-1 pr-3 py-1 hover:border-[var(--surface-border-strong)] transition-colors"
      >
        <span className="h-6 w-6 rounded-full bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] text-white grid place-items-center text-[11px] font-semibold">
          {initial}
        </span>
        <span className="text-xs text-[var(--text-secondary)] max-w-[140px] truncate">{email}</span>
        <span className="text-[var(--text-muted)] text-[10px]" aria-hidden>&#9662;</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.5)] p-1 text-sm z-50"
        >
          <div className="px-3 py-2.5 border-b border-[var(--surface-border)]">
            <div className="eyebrow text-[var(--text-muted)]">{L('Нэвтэрсэн', 'Signed in')}</div>
            <div className="mt-1 truncate text-[var(--text-primary)]">{email}</div>
          </div>
          <Link
            href={`/${locale}/dashboard`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {L('Хяналтын самбар', 'Dashboard')}
          </Link>
          <Link
            href={`/${locale}/dashboard/billing`}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {L('Төлбөр', 'Billing')}
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: `/${locale}` });
            }}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-t border-[var(--surface-border)] mt-1 transition-colors"
          >
            {L('Гарах', 'Sign out')}
          </button>
        </div>
      )}
    </div>
  );
}
