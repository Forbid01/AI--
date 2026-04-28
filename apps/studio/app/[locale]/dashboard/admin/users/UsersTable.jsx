'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsersTable({ users, locale, initialQuery, showDeleted, currentUserId, currentUserRole }) {
  const router = useRouter();
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [q, setQ] = useState(initialQuery);
  const [pending, setPending] = useState(null); // userId of row being mutated
  const [error, setError] = useState(null);
  const isSuperadmin = currentUserRole === 'superadmin';

  function onSearch(e) {
    e.preventDefault();
    router.push(buildHref({ q, deleted: showDeleted }));
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

  async function restore(userId) {
    setPending(userId);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action: 'restore' }),
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

  async function changeRole(userId, newRole) {
    setPending(userId);
    setError(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
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

  function buildHref(params) {
    const p = new URLSearchParams();
    if (params.q) p.set('q', params.q);
    if (params.deleted) p.set('deleted', '1');
    const s = p.toString();
    return s ? `?${s}` : '?';
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

      {/* Active / Deleted toggle */}
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg-tertiary)]/50 border border-[var(--surface-border)] w-fit">
        <a
          href={buildHref({ q })}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${!showDeleted ? 'bg-[var(--accent)] text-white shadow' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
        >
          {L('Идэвхтэй', 'Active')}
        </a>
        <a
          href={buildHref({ q, deleted: true })}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${showDeleted ? 'bg-red-500/80 text-white shadow' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
        >
          {L('Устгагдсан', 'Deleted')}
        </a>
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
              <th className="text-left font-semibold p-3">
                {showDeleted ? L('Устгасан огноо', 'Deleted at') : L('Төлөв', 'Status')}
              </th>
              <th className="text-right font-semibold p-3">{L('Үйлдэл', 'Actions')}</th>
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
                    {showDeleted ? (
                      <span className="text-xs text-red-400">
                        {u.deletedAt ? new Date(u.deletedAt).toLocaleDateString() : '—'}
                      </span>
                    ) : u.emailVerified ? (
                      <span className="text-xs text-green-400">✓ {L('баталгаажсан', 'verified')}</span>
                    ) : (
                      <span className="text-xs text-amber-400">⚠ {L('баталгаажаагүй', 'unverified')}</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {showDeleted ? (
                        <button
                          onClick={() => restore(u.id)}
                          disabled={pending === u.id}
                          className="text-xs px-3 py-1 rounded-lg border border-green-500/30 text-green-300 hover:bg-green-500/10 disabled:opacity-30 transition-colors"
                        >
                          {pending === u.id ? '...' : L('Сэргээх', 'Restore')}
                        </button>
                      ) : (
                        <>
                          <RoleSelector
                            userId={u.id}
                            currentRole={u.role}
                            isSelf={u.id === currentUserId}
                            isSuperadmin={isSuperadmin}
                            disabled={pending === u.id}
                            onChange={changeRole}
                            L={L}
                          />
                          <button
                            onClick={() => softDelete(u.id)}
                            disabled={pending === u.id || u.role === 'superadmin'}
                            className="text-xs px-3 py-1 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 disabled:opacity-30 transition-colors"
                            title={u.role === 'superadmin' ? L('Superadmin устгах боломжгүй', 'Cannot delete superadmin') : ''}
                          >
                            {pending === u.id ? '...' : L('Устгах', 'Delete')}
                          </button>
                        </>
                      )}
                    </div>
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

function RoleSelector({ userId, currentRole, isSelf, isSuperadmin, disabled, onChange, L }) {
  const [open, setOpen] = useState(false);

  // Can't edit own role; admins can't touch superadmins
  const canEdit = !isSelf && (isSuperadmin || currentRole !== 'superadmin');
  if (!canEdit) return null;

  const roles = [
    { value: 'user',       label: 'User',       color: 'text-white/70' },
    { value: 'admin',      label: 'Admin',      color: 'text-violet-300' },
    ...(isSuperadmin ? [{ value: 'superadmin', label: 'Superadmin', color: 'text-red-300' }] : []),
  ];

  async function select(role) {
    setOpen(false);
    if (role === currentRole) return;
    await onChange(userId, role);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className="text-xs px-3 py-1 rounded-lg border border-violet-500/30 text-violet-300 hover:bg-violet-500/10 disabled:opacity-30 transition-colors"
        title={L('Эрх өөрчлөх', 'Change role')}
      >
        {L('Эрх', 'Role')} ▾
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 mt-1 z-10 min-w-[130px] rounded-xl border border-[var(--surface-border)] bg-[var(--bg-secondary)] shadow-xl overflow-hidden"
          >
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => select(r.value)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-2 ${r.color} ${r.value === currentRole ? 'opacity-40 cursor-default' : ''}`}
              >
                {r.value === currentRole && <span className="w-2 h-2 rounded-full bg-current inline-block" />}
                {r.value !== currentRole && <span className="w-2 h-2" />}
                {r.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
