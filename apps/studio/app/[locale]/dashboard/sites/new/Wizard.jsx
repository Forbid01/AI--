'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@aiweb/i18n';
import TonePicker from '@/components/TonePicker.jsx';

export default function Wizard({ locale, templates }) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? 'minimal');
  const [business, setBusiness] = useState({
    businessName: '',
    industry: '',
    description: '',
    services: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  });
  const [tone, setTone] = useState('friendly');
  const [subdomain, setSubdomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function setField(k, v) {
    setBusiness((b) => ({ ...b, [k]: v }));
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          tone,
          defaultLocale: locale,
          subdomain,
          business: {
            ...business,
            services: business.services.split(',').map((s) => s.trim()).filter(Boolean),
          },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Алдаа гарлаа');
      const data = await res.json();
      router.push(`/${locale}/dashboard/sites/${data.site.id}`);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Stepper step={step} locale={locale} />

      {step === 1 && (
        <Step title={dict.wizard.step1.title} desc={dict.wizard.step1.desc}>
          <div className="grid sm:grid-cols-2 gap-4">
            {templates.map((t) => {
              const active = templateId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplateId(t.id)}
                  className={`p-5 rounded-xl border text-left transition ${
                    active ? 'border-black ring-2 ring-black' : 'border-black/10 hover:border-black/30'
                  }`}
                >
                  <div className="aspect-video rounded-md bg-black/5 mb-3 grid place-items-center opacity-60 text-sm">
                    {t.name[locale] ?? t.name.mn}
                  </div>
                  <div className="font-semibold">{t.name[locale] ?? t.name.mn}</div>
                  <div className="text-sm opacity-70 mt-1">{t.description[locale] ?? t.description.mn}</div>
                </button>
              );
            })}
          </div>
        </Step>
      )}

      {step === 2 && (
        <Step title={dict.wizard.step2.title} desc={dict.wizard.step2.desc}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label={dict.wizard.fields.businessName} value={business.businessName} onChange={(v) => setField('businessName', v)} required />
            <Field label={dict.wizard.fields.industry} value={business.industry} onChange={(v) => setField('industry', v)} />
            <Field label={dict.wizard.fields.description} value={business.description} onChange={(v) => setField('description', v)} textarea span2 />
            <Field label={dict.wizard.fields.services} value={business.services} onChange={(v) => setField('services', v)} span2 />
            <Field label={dict.wizard.fields.contactEmail} value={business.contactEmail} onChange={(v) => setField('contactEmail', v)} type="email" />
            <Field label={dict.wizard.fields.contactPhone} value={business.contactPhone} onChange={(v) => setField('contactPhone', v)} />
            <Field label={dict.wizard.fields.address} value={business.address} onChange={(v) => setField('address', v)} span2 />
            <Field
              label={locale === 'mn' ? 'Subdomain (жишээ: mybiz)' : 'Subdomain (e.g. mybiz)'}
              value={subdomain}
              onChange={(v) => setSubdomain(v.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              span2
              required
            />
          </div>
        </Step>
      )}

      {step === 3 && (
        <Step title={dict.wizard.step3.title} desc={dict.wizard.step3.desc}>
          <TonePicker value={tone} onChange={setTone} locale={locale} />
        </Step>
      )}

      {step === 4 && (
        <Step title={dict.wizard.step4.title} desc={dict.wizard.step4.desc}>
          <div className="rounded-xl border border-black/10 p-6 bg-black/[0.02]">
            <dl className="space-y-2 text-sm">
              <Row label={locale === 'mn' ? 'Загвар' : 'Template'} value={templateId} />
              <Row label={locale === 'mn' ? 'Бизнес' : 'Business'} value={business.businessName} />
              <Row label="Subdomain" value={`${subdomain}.platform.mn`} />
              <Row label={locale === 'mn' ? 'Өнгө аяс' : 'Tone'} value={dict.tones[tone]} />
            </dl>
          </div>
          {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
        </Step>
      )}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="px-4 py-2 rounded-md border border-black/15 disabled:opacity-30"
        >
          {dict.common.back}
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="px-5 py-2 rounded-md bg-black text-white font-medium"
          >
            {dict.common.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="px-5 py-2 rounded-md bg-black text-white font-medium disabled:opacity-50"
          >
            {loading ? dict.common.generating : (locale === 'mn' ? 'Үүсгэх' : 'Generate')}
          </button>
        )}
      </div>
    </div>
  );
}

function Stepper({ step, locale }) {
  const labels = locale === 'mn'
    ? ['Загвар', 'Мэдээлэл', 'Өнгө аяс', 'Үүсгэх']
    : ['Template', 'Details', 'Tone', 'Generate'];
  return (
    <div className="flex items-center gap-2 mb-8">
      {labels.map((l, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <div key={l} className="flex items-center gap-2 flex-1">
            <div className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold ${
              active ? 'bg-black text-white' : done ? 'bg-emerald-500 text-white' : 'bg-black/10'
            }`}>{n}</div>
            <div className={`text-sm ${active ? 'font-medium' : 'opacity-60'}`}>{l}</div>
            {n < labels.length && <div className="h-px bg-black/10 flex-1" />}
          </div>
        );
      })}
    </div>
  );
}

function Step({ title, desc, children }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-1 opacity-70">{desc}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, textarea, type = 'text', span2, required }) {
  const cls = `w-full px-3 py-2 rounded-md border border-black/15 focus:outline-none focus:border-black bg-white`;
  return (
    <label className={`block ${span2 ? 'sm:col-span-2' : ''}`}>
      <span className="text-sm font-medium">{label}{required && <span className="text-red-500"> *</span>}</span>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`mt-1 ${cls}`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`mt-1 ${cls}`} required={required} />
      )}
    </label>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <dt className="opacity-60">{label}</dt>
      <dd className="font-medium">{value || '—'}</dd>
    </div>
  );
}
