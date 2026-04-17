'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@aiweb/i18n';
import TonePicker from '@/components/TonePicker.jsx';

const PHASE_CHAT = 'chat';
const PHASE_TEMPLATE = 'template';
const PHASE_TONE = 'tone';
const PHASE_REVIEW = 'review';
const PHASE_GENERATING = 'generating';

export default function AiBuilder({ locale, templates, initialPrompt }) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const L = (mn, en) => (locale === 'mn' ? mn : en);

  const [phase, setPhase] = useState(PHASE_CHAT);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [business, setBusiness] = useState({
    businessName: '',
    industry: '',
    description: '',
    services: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
  });
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? 'minimal');
  const [tone, setTone] = useState('friendly');
  const [subdomain, setSubdomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const root = process.env.NEXT_PUBLIC_PLATFORM_ROOT_DOMAIN || 'platform.mn';
  const hasInit = useRef(false);

  // Conversation flow state
  const [chatStep, setChatStep] = useState(0);
  const [typing, setTyping] = useState(false);

  const INDUSTRY_SUGGESTIONS = locale === 'mn'
    ? ['Кафе, Ресторан', 'Зөвлөх үйлчилгээ', 'Дизайн студи', 'Жижиглэн худалдаа', 'Гоо сайхан', 'Боловсрол']
    : ['Cafe, Restaurant', 'Consulting', 'Design studio', 'Retail', 'Beauty & wellness', 'Education'];

  const questions = [
    {
      ask: L('Бизнесийнхээ нэрийг хэлнэ үү?', 'What\'s the name of your business?'),
      field: 'businessName',
      hint: L('Жишээ: "Nomad Coffee"', 'e.g. "Nomad Coffee"'),
    },
    {
      ask: L('Ямар салбарт ажилладаг вэ?', 'What industry are you in?'),
      field: 'industry',
      hint: L('Жишээ: "Кафе, Ресторан"', 'e.g. "Cafe, Restaurant"'),
      suggestions: INDUSTRY_SUGGESTIONS,
    },
    {
      ask: L('Бизнесийнхээ тухай товчхон тайлбарлана уу?', 'Give a short description of your business.'),
      field: 'description',
      hint: L('2-3 өгүүлбэр', '2-3 sentences'),
    },
    {
      ask: L('Ямар үйлчилгээ / бүтээгдэхүүн санал болгодог вэ?', 'What services or products do you offer?'),
      field: 'services',
      hint: L('Таслалаар тусгаарлана уу', 'Separate with commas'),
    },
    {
      ask: L('Холбоо барих и-мэйл хаяг?', 'Contact email address?'),
      field: 'contactEmail',
      hint: L('Заавал биш', 'Optional'),
      optional: true,
    },
    {
      ask: L('Утасны дугаар?', 'Phone number?'),
      field: 'contactPhone',
      hint: L('Заавал биш', 'Optional'),
      optional: true,
    },
    {
      ask: L('Хаяг / байршил?', 'Address / location?'),
      field: 'address',
      hint: L('Заавал биш', 'Optional'),
      optional: true,
    },
  ];

  function queueAiMessage(msg, delay = 420) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, msg]);
    }, delay);
  }

  // Init greeting
  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;
    const greeting = initialPrompt
      ? L(
          `Таны оруулсан мэдээлэл: "${decodeURIComponent(initialPrompt)}". Одоо дэлгэрэнгүй мэдээлэл цуглуулъя!`,
          `Got it: "${decodeURIComponent(initialPrompt)}". Let me gather a few more details!`,
        )
      : L(
          'Сайн байна уу! Би таны AI вэбсайт туслах. Бизнесийнхээ тухай хэлээрэй — би загвар, дизайн, контент бүгдийг бэлдэнэ.',
          'Hi there! I\'m your AI website assistant. Tell me about your business — I\'ll handle templates, design, and content.',
        );

    setMessages([{ role: 'ai', text: greeting }]);

    // Auto-parse initial prompt for business description
    if (initialPrompt) {
      const decoded = decodeURIComponent(initialPrompt);
      setBusiness((b) => ({ ...b, description: decoded }));
    }

    queueAiMessage(
      { role: 'ai', text: questions[0].ask, hint: questions[0].hint, suggestions: questions[0].suggestions },
      700,
    );
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
    if (phase === PHASE_CHAT && !typing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [messages, typing, phase]);

  function submitAnswer(rawText) {
    const text = (rawText ?? '').trim();
    if (!text && !questions[chatStep]?.optional) return;

    setMessages((prev) => [...prev, { role: 'user', text: text || L('(хоосон)', '(skip)') }]);
    setInput('');

    if (chatStep >= questions.length) return;

    const field = questions[chatStep].field;
    setBusiness((b) => ({ ...b, [field]: text }));

    if (field === 'businessName' && text) {
      const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 30);
      setSubdomain(slug || 'my-site');
    }

    const nextStep = chatStep + 1;
    setChatStep(nextStep);

    if (nextStep < questions.length) {
      queueAiMessage({
        role: 'ai',
        text: questions[nextStep].ask,
        hint: questions[nextStep].hint,
        suggestions: questions[nextStep].suggestions,
      });
    } else {
      queueAiMessage(
        {
          role: 'ai',
          text: L(
            'Маш сайн! Одоо загвар сонгоорой. Таны бизнест тохирох загварыг санал болгож байна.',
            'Great! Now let\'s pick a template. I\'m suggesting options that match your business.',
          ),
        },
        600,
      );
      setTimeout(() => setPhase(PHASE_TEMPLATE), 650);
    }
  }

  function handleSend(e) {
    e.preventDefault();
    submitAnswer(input);
  }

  function handleSkip() {
    submitAnswer('');
  }

  function handleSuggestion(suggestion) {
    setInput('');
    submitAnswer(suggestion);
  }

  function selectTemplate(id) {
    setTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: `${L('Загвар:', 'Template:')} ${tpl?.name?.[locale] ?? id}` },
    ]);
    queueAiMessage({
      role: 'ai',
      text: L(
        'Гоё сонголт! Одоо сайтынхаа өнгө аясыг сонгоорой.',
        'Nice choice! Now let\'s pick the tone and style for your site.',
      ),
    });
    setTimeout(() => setPhase(PHASE_TONE), 500);
  }

  function selectTone(t) {
    setTone(t);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: `${L('Өнгө аяс:', 'Tone:')} ${dict.tones[t]}` },
    ]);
    queueAiMessage({
      role: 'ai',
      text: L(
        'Бүх мэдээлэл бэлэн боллоо! Доорх хураангуйг шалгаад "Сайт үүсгэх" товчийг дарна уу.',
        'All set! Review the summary below and hit "Generate site" when you\'re ready.',
      ),
    });
    setTimeout(() => setPhase(PHASE_REVIEW), 500);
  }

  async function submit() {
    setLoading(true);
    setError(null);
    setPhase(PHASE_GENERATING);
    setMessages((prev) => [
      ...prev,
      {
        role: 'ai',
        text: L(
          'Таны вэбсайтыг бүтээж байна... AI контент бичиж, дизайн тохируулж байна.',
          'Building your website... AI is writing content and setting up the design.',
        ),
        generating: true,
      },
    ]);

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
      if (!res.ok) throw new Error((await res.json()).error || L('Алдаа гарлаа', 'Something went wrong'));
      const data = await res.json();
      router.push(`/${locale}/dashboard/sites/${data.site.id}`);
    } catch (e) {
      setError(e.message);
      setLoading(false);
      setPhase(PHASE_REVIEW);
    }
  }

  const selectedTemplate = templates.find((t) => t.id === templateId);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:py-12 grid lg:grid-cols-12 gap-8">
      {/* Sidebar */}
      <aside className="lg:col-span-4 xl:col-span-3">
        <div className="sticky top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-lg shadow-[var(--accent-soft)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight">{L('AI Бүтээгч', 'AI Builder')}</h1>
              <p className="text-xs text-[var(--text-tertiary)]">{L('Вэбсайт туслах', 'Website assistant')}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3">
            {[
              { key: PHASE_CHAT, label: L('Бизнес мэдээлэл', 'Business info'), icon: '1' },
              { key: PHASE_TEMPLATE, label: L('Загвар сонгох', 'Choose template'), icon: '2' },
              { key: PHASE_TONE, label: L('Өнгө аяс', 'Style & tone'), icon: '3' },
              { key: PHASE_REVIEW, label: L('Үүсгэх', 'Generate'), icon: '4' },
            ].map((s) => {
              const phases = [PHASE_CHAT, PHASE_TEMPLATE, PHASE_TONE, PHASE_REVIEW, PHASE_GENERATING];
              const currentIdx = phases.indexOf(phase);
              const stepIdx = phases.indexOf(s.key);
              const done = stepIdx < currentIdx;
              const active = s.key === phase || (s.key === PHASE_REVIEW && phase === PHASE_GENERATING);

              return (
                <div key={s.key} className="flex items-center gap-3">
                  <div
                    className={`h-7 w-7 rounded-lg text-xs font-bold grid place-items-center transition-all ${
                      active
                        ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-soft)]'
                        : done
                          ? 'bg-[var(--accent-soft)] text-[var(--accent-light)]'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                    }`}
                  >
                    {done ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      s.icon
                    )}
                  </div>
                  <span className={`text-sm ${active ? 'text-[var(--text-primary)] font-medium' : done ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary while building */}
          {business.businessName && (
            <div className="mt-8 p-4 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-sm">
              <div className="eyebrow text-[var(--text-muted)] mb-3">{L('Хураангуй', 'Summary')}</div>
              <dl className="space-y-2">
                {business.businessName && <SummaryRow label={L('Нэр', 'Name')} value={business.businessName} />}
                {business.industry && <SummaryRow label={L('Салбар', 'Industry')} value={business.industry} />}
                {subdomain && <SummaryRow label={L('Домэйн', 'Domain')} value={`${subdomain}.${root}`} mono />}
              </dl>
            </div>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <section className="lg:col-span-8 xl:col-span-9">
        {/* Chat messages */}
        <div
          ref={chatRef}
          className="rounded-2xl border border-[var(--surface-border)] bg-[var(--bg-secondary)] overflow-hidden"
          style={{ maxHeight: phase === PHASE_CHAT ? '60vh' : '40vh', overflowY: 'auto' }}
        >
          <div className="p-5 space-y-4">
            {messages.map((msg, i) => {
              const isLast = i === messages.length - 1;
              return (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all ${
                        msg.role === 'user'
                          ? 'bg-[var(--accent)] text-white rounded-br-md'
                          : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--surface-border)] rounded-bl-md'
                      }`}
                    >
                      {msg.generating && (
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
                          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
                          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
                        </div>
                      )}
                      {msg.text}
                      {msg.hint && (
                        <span className="block mt-1 text-xs opacity-60">{msg.hint}</span>
                      )}
                    </div>
                    {msg.role === 'ai' && isLast && phase === PHASE_CHAT && Array.isArray(msg.suggestions) && msg.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.suggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleSuggestion(s)}
                            className="px-3 py-1.5 rounded-full border border-[var(--surface-border)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {typing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-[var(--surface)] border border-[var(--surface-border)]">
                  <div className="flex items-center gap-1.5">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--accent-light)]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat input (only during PHASE_CHAT) */}
        {phase === PHASE_CHAT && (
          <form onSubmit={handleSend} className="mt-4 flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={L('Энд бичнэ үү...', 'Type here...')}
                className="field pr-12"
                disabled={typing}
                autoFocus
              />
            </div>
            {questions[chatStep]?.optional && (
              <button
                type="button"
                onClick={handleSkip}
                disabled={typing}
                className="btn btn-ghost btn-md text-xs disabled:opacity-40"
              >
                {L('Алгасах', 'Skip')}
              </button>
            )}
            <button
              type="submit"
              disabled={typing || (!input.trim() && !questions[chatStep]?.optional)}
              className="btn btn-primary btn-md disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        )}

        {/* Template selection */}
        {phase === PHASE_TEMPLATE && (
          <div className="mt-6">
            <h3 className="font-display text-lg font-semibold tracking-tight mb-4">
              {L('Загвар сонгоорой', 'Choose a template')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {templates.map((t) => {
                const active = templateId === t.id;
                const theme = t.defaultTheme ?? {};
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => selectTemplate(t.id)}
                    aria-pressed={active}
                    className={`relative text-left rounded-xl overflow-hidden border transition-all duration-200 ${
                      active
                        ? 'border-[var(--accent)] shadow-lg shadow-[var(--accent-soft)]'
                        : 'border-[var(--surface-border)] hover:border-[var(--surface-border-strong)]'
                    }`}
                  >
                    <div
                      className="aspect-[5/3] relative"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primary ?? '#6c5ce7'} 0%, ${theme.background ?? '#0a0a0f'} 100%)`,
                      }}
                    >
                      <div className="absolute inset-5 flex flex-col justify-between text-white">
                        <span className="font-mono text-xs tabular opacity-60">{t.id}</span>
                        <span className="font-display text-xl font-bold tracking-tight">
                          {t.name[locale] ?? t.name.mn}
                        </span>
                      </div>
                      {active && (
                        <span className="absolute top-3 right-3 h-6 w-6 grid place-items-center rounded-full bg-[var(--accent)] text-white text-xs">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </span>
                      )}
                    </div>
                    <div className="p-4 bg-[var(--surface)]">
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {t.description[locale] ?? t.description.mn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tone selection */}
        {phase === PHASE_TONE && (
          <div className="mt-6">
            <h3 className="font-display text-lg font-semibold tracking-tight mb-4">
              {L('Өнгө аяс сонгоорой', 'Choose a style')}
            </h3>
            <TonePicker value={tone} onChange={selectTone} locale={locale} />
          </div>
        )}

        {/* Review & generate */}
        {(phase === PHASE_REVIEW || phase === PHASE_GENERATING) && (
          <div className="mt-6">
            <div className="card p-6">
              <h3 className="font-display text-lg font-semibold tracking-tight mb-4">
                {L('Хураангуй', 'Review')}
              </h3>
              <dl className="divide-y divide-[var(--surface-border)]">
                <ReviewRow label={L('Загвар', 'Template')} value={selectedTemplate?.name?.[locale] ?? templateId} />
                <ReviewRow label={L('Бизнес', 'Business')} value={business.businessName} />
                <ReviewRow label={L('Салбар', 'Industry')} value={business.industry} />
                <ReviewRow label={L('Тайлбар', 'Description')} value={business.description} />
                <ReviewRow label={L('Домэйн', 'Domain')} value={`${subdomain || '—'}.${root}`} mono />
                <ReviewRow label={L('Өнгө аяс', 'Tone')} value={dict.tones[tone]} />
              </dl>

              {/* Subdomain edit */}
              <div className="mt-5">
                <label className="eyebrow text-[var(--text-muted)]" htmlFor="subdomain">
                  {L('Домэйн засах', 'Edit domain')}
                </label>
                <div className="mt-2 flex items-stretch border border-[var(--surface-border)] rounded-xl bg-[var(--surface)] focus-within:border-[var(--accent)] transition-colors overflow-hidden">
                  <input
                    id="subdomain"
                    className="flex-1 bg-transparent px-4 py-2.5 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none font-mono text-sm"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="mybiz"
                  />
                  <div className="px-4 py-2.5 text-[var(--text-muted)] text-sm font-mono border-l border-[var(--surface-border)] bg-[var(--bg-tertiary)]">
                    .{root}
                  </div>
                </div>
              </div>

              {error && (
                <p className="mt-5 text-sm text-[var(--danger)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPhase(PHASE_TONE)}
                className="btn btn-ghost btn-md"
              >
                <span aria-hidden>&#8592;</span> {L('Буцах', 'Back')}
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={loading || !subdomain}
                className="btn btn-accent btn-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                    {L('Үүсгэж байна...', 'Generating...')}
                  </span>
                ) : (
                  <>
                    {L('Сайт үүсгэх', 'Generate site')}
                    <span aria-hidden>&#8594;</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function SummaryRow({ label, value, mono }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-[var(--text-muted)]">{label}</dt>
      <dd className={`text-[var(--text-primary)] text-right truncate ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</dd>
    </div>
  );
}

function ReviewRow({ label, value, mono }) {
  return (
    <div className="flex justify-between gap-6 py-3 text-sm">
      <dt className="text-[var(--text-secondary)]">{label}</dt>
      <dd className={`font-medium text-right ${mono ? 'font-mono text-xs' : ''}`}>{value || '—'}</dd>
    </div>
  );
}
