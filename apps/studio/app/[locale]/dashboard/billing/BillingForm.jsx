'use client';

import { useState } from 'react';
import { getDictionary } from '@aiweb/i18n';

const PROVIDERS = ['qpay', 'socialpay', 'khanbank', 'golomt'];

export default function BillingForm({ locale }) {
  const dict = getDictionary(locale);
  const [provider, setProvider] = useState('qpay');
  const [amount, setAmount] = useState(29000);
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function pay() {
    setLoading(true);
    setError(null);
    setInvoice(null);
    try {
      const res = await fetch(`/api/payments/${provider}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description: 'AiWeb Pro', plan: 'pro' }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setInvoice(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-semibold">{dict.payments.selectMethod}</h1>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {PROVIDERS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setProvider(p)}
            className={`p-4 rounded-lg border text-left ${
              provider === p ? 'border-black ring-2 ring-black' : 'border-black/10 hover:border-black/30'
            }`}
          >
            <div className="font-semibold">{dict.payments[p]}</div>
            <div className="text-xs opacity-60 mt-1">{p.toUpperCase()}</div>
          </button>
        ))}
      </div>

      <label className="block mt-6">
        <span className="text-sm font-medium">{dict.payments.amount} (₮)</span>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-1 w-full px-3 py-2 rounded-md border border-black/15 bg-white"
          min={100}
          step={100}
        />
      </label>

      <button
        onClick={pay}
        disabled={loading}
        className="mt-6 w-full px-4 py-3 rounded-md bg-black text-white font-medium disabled:opacity-50"
      >
        {loading ? dict.common.generating : `${dict.payments.pay} — ${amount.toLocaleString('mn-MN')}₮`}
      </button>

      {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

      {invoice && (
        <div className="mt-8 p-6 rounded-xl border border-black/10 bg-black/[0.03]">
          <div className="text-sm opacity-70">Invoice ID</div>
          <div className="font-mono text-sm break-all">{invoice.invoiceId}</div>
          {invoice.qrImage && (
            <img src={invoice.qrImage} alt="QR" className="mt-4 mx-auto max-w-xs rounded bg-white p-2" />
          )}
          {invoice.payUrl && (
            <a
              href={invoice.payUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block underline text-sm"
            >
              {locale === 'mn' ? 'Төлбөрийн хуудас нээх' : 'Open payment page'}
            </a>
          )}
          {Array.isArray(invoice.deeplinks) && invoice.deeplinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {invoice.deeplinks.map((d, i) => (
                <a key={i} href={d.link} className="text-xs px-3 py-1.5 rounded border border-black/15 hover:bg-black/5">
                  {d.name}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
