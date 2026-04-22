'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsersTable({ users, locale, initialQuery }) {
  const router = useRouter();
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [q, setQ] = useState(initialQuery);
  const [pending, setPending] = useState(null);
  const [error, setError] = useState(null);

  function onSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    router.push(`?${params.toString()}`);
  }

  async function softDelete(userId) {
    if (!confirm(L('Хэрэглэгчийг устгах уу? (Soft delete — 30 хоногт сэргээж болно)', 'Soft-delete this user? (30-day grace period)'))) return;
    setPending(userId);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Алдаа');
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight">{L('Хэрэглэгчид', 'Users')}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">
            {users.length} {L('хэрэглэгч харагдаж байна', 'shown')}
          </p>
        </div>
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={L('И-мэйлээр хайх...', 'Search by email...')}
            className="w-64 px-3 py-2 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
          />
          <button type="submit" className="btn btn-ghost btn-sm">
            {L('Хайх', 'Search')}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-[var(--surface-border)] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--bg-tertiary)]/50 text-[var(--text-muted)] text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left font-semibold p-3">{L('И-мэйл', 'Email')}</th>
              <th className="text-left font-semibold p-3 hidden md:table-cell">{L('Нэр', 'Name')}</th>
              <th className="text-left font-semibold p-3">Role</th>
              <th className="text-left font-semibold p-3 hidden md:table-cell">{L('Бүртгэсэн', 'Joined')}</th>
              <th className="text-center font-semibold p-3">Sites</th>
              <th className="text-left font-semibold p-3">{L('Төлөв', 'Status')}</th>
              <th className="text-right font-semibold p-3" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map((u) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="border-t border-[var(--surface-border)] hover:bg-[var(--bg-hover)]/50"
                >
                  <td className="p-3 font-mono text-xs truncate max-w-[240px]">{u.email}</td>
                  <td className="p-3 hidden md:table-cell truncate max-w-[160px]">{u.name ?? '—'}</td>
                  <td className="p-3">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs text-[var(--text-muted)]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center font-mono">{u._count.sites}</td>
                  <td className="p-3">
                    {u.emailVerified ? (
                      <span className="text-xs text-green-400">✓ {L('баталгаажсан', 'verified')}</span>
                    ) : (
                      <span className="text-xs text-amber-400">⚠ {L('баталгаажаагүй', 'unverified')}</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => softDelete(u.id)}
                      disabled={pending === u.id || u.role === 'superadmin'}
                      className="text-xs px-3 py-1 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 disabled:opacity-30 transition-colors"
                      title={u.role === 'superadmin' ? L('Superadmin устгах боломжгүй', 'Cannot delete superadmin') : ''}
                    >
                      {pending === u.id ? '...' : L('Устгах', 'Delete')}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {users.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">
                  {L('Хэрэглэгч олдсонгүй', 'No users found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const colors = {
    user: 'bg-white/5 text-white/70 border-white/10',
    admin: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    superadmin: 'bg-red-500/15 text-red-300 border-red-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${colors[role] ?? colors.user}`}>
      {role}
    </span>
  );
}
