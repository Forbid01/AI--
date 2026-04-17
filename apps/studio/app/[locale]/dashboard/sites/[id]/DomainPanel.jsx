'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DomainPanel({ site, locale }) {
  const router = useRouter();
  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const [domain, setDomain] = useState(site.customDomain ?? '');
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [instructions, setInstructions] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function save() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/sites/${site.id}/domain`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInstructions(data.instructions ?? null);
      setMessage(
        domain
          ? L('Домэйн хадгалагдлаа. DNS бичлэгийг нэмнэ үү.', 'Domain saved. Add the DNS records below.')
          : L('Домэйн салгасан.', 'Domain removed.'),
      );
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function verify() {
    setVerifying(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/sites/${site.id}/domain/verify`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.verified) throw new Error(data.error || L('Шалгалт амжилтгүй', 'Verification failed'));
      setMessage(L('Домэйн баталгаажлаа', 'Domain verified'));
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setVerifying(false);
    }
  }

  const verified = site.customDomainVerified;
  const txtName = site.customDomain ? `_aiweb.${site.customDomain}` : null;

  // Routing DNS record: save action-аас state ирээгүй бол site өгөгдлөөс тооцно
  const derivedRouting = site.customDomain
    ? computeRouting(site.customDomain)
    : null;
  const routing = instructions?.routing ?? derivedRouting;

  return (
    <section className="mt-14">
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <p className="eyebrow text-[var(--accent-light)]">{L('Домэйн', 'Domain')}</p>
          <h2 className="mt-4 font-display text-3xl tracking-[-0.03em] leading-tight">
            {L('Өөрийн ', 'Bring your ')}<span className="italic">{L('домэйнтой', 'own domain')}</span>.
          </h2>
          <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            {L(
              'www.mybiz.mn, shop.brand.mn гэх мэт өөрийн домэйнд сайтаа байршуулах. DNS-г баталгаажуулснаар идэвхжинэ.',
              'Serve your site from www.mybiz.mn or shop.brand.mn. Add the DNS records we generate to verify ownership.',
            )}
          </p>
        </div>

        <div className="md:col-span-8 border border-[var(--surface-border)] rounded-xl bg-[var(--surface)] p-6 md:p-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <div className="eyebrow text-[var(--text-tertiary)]">{L('Одоогийн домэйн', 'Current domain')}</div>
              <div className="mt-2 font-mono text-sm truncate">
                {site.customDomain || L('тохируулаагүй', 'not set')}
              </div>
            </div>
            {site.customDomain && (
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                  ${verified
                    ? 'bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20'
                    : 'bg-[var(--warn)]/10 text-[var(--warn)] border border-[var(--warn)]/20'}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${verified ? 'bg-[var(--success)]' : 'bg-[var(--warn)]'}`} />
                {verified ? L('Баталгаажсан', 'Verified') : L('Шалгагдаагүй', 'Unverified')}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <input
              value={domain}
              onChange={(e) => setDomain(e.target.value.trim())}
              placeholder="www.example.mn"
              className="field flex-1 min-w-[220px] font-mono text-sm"
            />
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
              {saving ? '...' : L('Хадгалах', 'Save')}
            </button>
            {site.customDomain && !verified && (
              <button onClick={verify} disabled={verifying} className="btn btn-outline btn-md">
                {verifying ? '...' : L('Баталгаажуулах', 'Verify')}
              </button>
            )}
          </div>

          {message && (
            <p className="mt-4 text-sm text-[var(--success)] border border-[var(--success)]/20 bg-[var(--success)]/5 rounded-xl px-3 py-2">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-4 text-sm text-[var(--danger)] border border-[var(--danger)]/30 bg-[var(--danger)]/5 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          {site.customDomain && !verified && site.domainVerificationToken && (
            <div className="mt-8 border-t border-[var(--surface-border)] pt-6">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow text-[var(--text-tertiary)]">{L('DNS бичлэгүүд', 'DNS records')}</p>
                <span className="font-mono text-[10px] tabular text-[var(--text-tertiary)]">{L('Хуулж тавина уу', 'Copy & paste')}</span>
              </div>
              <div className="mt-4 space-y-3">
                <DnsRow label="TXT" name={txtName} value={site.domainVerificationToken} />
                {routing && (
                  <DnsRow
                    label={routing.type}
                    name={
                      routing.name === '@'
                        ? site.customDomain
                        : `${routing.name}.${site.customDomain.split('.').slice(-2).join('.')}`
                    }
                    value={routing.value}
                  />
                )}
              </div>
              <p className="mt-4 text-xs text-[var(--text-tertiary)]">
                {L(
                  'DNS тархахад 5–60 минут зарцуулж болно. Дараа нь "Баталгаажуулах" дарна уу.',
                  'DNS can take 5–60 min to propagate. Then click Verify.',
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function computeRouting(domain) {
  if (!domain) return null;
  const isApex = domain.split('.').length === 2;
  return isApex
    ? { type: 'A', name: '@', value: '76.76.21.21' }
    : { type: 'CNAME', name: domain.split('.')[0], value: 'cname.platform.mn' };
}

function DnsRow({ label, name, value }) {
  return (
    <div className="grid grid-cols-[52px_1fr] md:grid-cols-[52px_minmax(0,1fr)_minmax(0,1.5fr)] gap-3 items-center">
      <div className="text-[10px] tabular font-semibold uppercase tracking-wider bg-[var(--text-primary)] text-[var(--bg-primary)] px-2 py-1 rounded w-fit">
        {label}
      </div>
      <code className="text-xs font-mono bg-[var(--bg-primary)] border border-[var(--surface-border)] rounded px-2.5 py-1.5 truncate" title={name}>
        {name}
      </code>
      <code className="text-xs font-mono bg-[var(--bg-primary)] border border-[var(--surface-border)] rounded px-2.5 py-1.5 truncate md:col-span-1 col-span-2" title={value}>
        {value}
      </code>
    </div>
  );
}
