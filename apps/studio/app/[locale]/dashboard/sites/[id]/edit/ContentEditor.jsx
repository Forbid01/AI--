'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Link from 'next/link';
import { SECTION_SCHEMAS, SECTION_ORDER } from './fieldSchemas.js';

export default function ContentEditor({ site, locale, initialContent, initialLayout }) {
  const router = useRouter();
  const L = (obj) => (locale === 'mn' ? obj.mn : obj.en);
  const isAiComposed = site.mode === 'ai_composed';

  const [targetLocale, setTargetLocale] = useState(site.defaultLocale);
  const [contentByLocale, setContentByLocale] = useState(initialContent); // { mn: {...}, en: {...} }
  const [layout, setLayout] = useState(Array.isArray(initialLayout) ? initialLayout : []);
  const [activeSection, setActiveSection] = useState(isAiComposed && layout[0]?.type || 'hero');
  const [saving, setSaving] = useState(null);
  const [savedPulse, setSavedPulse] = useState(false);
  const [error, setError] = useState(null);
  const [dirty, setDirty] = useState(false);

  const content = contentByLocale[targetLocale] ?? {};

  const visibleSections = useMemo(() => {
    if (isAiComposed && layout.length > 0) {
      return layout.map((l) => l.type).filter((t) => SECTION_SCHEMAS[t]);
    }
    return SECTION_ORDER.filter((type) => SECTION_SCHEMAS[type]);
  }, [isAiComposed, layout]);

  const setSection = useCallback((type, nextValue) => {
    setDirty(true);
    setContentByLocale((prev) => ({
      ...prev,
      [targetLocale]: { ...(prev[targetLocale] ?? {}), [type]: nextValue },
    }));
  }, [targetLocale]);

  async function persist({ sections, layout: nextLayout }) {
    setSaving('save');
    setError(null);
    try {
      const res = await fetch(`/api/sites/${site.id}/content`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: targetLocale,
          ...(sections ? { sections } : {}),
          ...(nextLayout ? { layout: nextLayout } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Хадгалахад алдаа');
      setSavedPulse(true);
      setDirty(false);
      setTimeout(() => setSavedPulse(false), 1500);
      router.refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  }

  const handleSaveSection = (type) => {
    const sections = { [type]: content[type] };
    persist({ sections });
  };

  const handleSaveAll = () => {
    persist({ sections: content });
  };

  const handleReorder = (newOrder) => {
    // newOrder is a list of section type strings — rebuild layout preserving variants
    const byType = new Map(layout.map((l) => [l.type, l]));
    const next = newOrder.map((type) => byType.get(type) ?? { type, variant: 'default' });
    setLayout(next);
    setDirty(true);
    persist({ layout: next });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Sticky toolbar */}
      <header className="sticky top-0 z-30 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--surface-border)]">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center gap-3">
          <Link
            href={`/${locale}/dashboard/sites/${site.id}`}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5"
          >
            <span aria-hidden>←</span> {L({ mn: 'Буцах', en: 'Back' })}
          </Link>
          <span className="text-sm text-[var(--text-muted)]">·</span>
          <span className="font-semibold text-sm truncate">{site.name}</span>
          {dirty && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] uppercase tracking-wider text-[var(--warn)] font-mono"
            >
              {L({ mn: 'хадгалагдаагүй', en: 'unsaved' })}
            </motion.span>
          )}

          <div className="ml-auto flex items-center gap-2">
            {/* Locale switcher */}
            <div className="flex rounded-full border border-[var(--surface-border)] overflow-hidden text-xs font-mono">
              {site.enabledLocales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setTargetLocale(loc)}
                  className={`px-3 py-1 transition-colors ${
                    targetLocale === loc
                      ? 'bg-white text-black'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveAll}
              disabled={!dirty || saving === 'save'}
              className="btn btn-accent btn-sm"
            >
              {saving === 'save' ? L({ mn: 'Хадгалж байна...', en: 'Saving...' }) :
               savedPulse ? L({ mn: '✓ Хадгалав', en: '✓ Saved' }) :
               L({ mn: 'Бүгдийг хадгалах', en: 'Save all' })}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 grid md:grid-cols-[240px_1fr] gap-8">
        {/* Section sidebar */}
        <aside>
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h2 className="eyebrow text-[var(--text-muted)]">{L({ mn: 'Хэсгүүд', en: 'Sections' })}</h2>
              {isAiComposed && (
                <span className="text-[10px] text-[var(--text-muted)] italic">
                  {L({ mn: 'Чирж дараалал өөрчлөх', en: 'Drag to reorder' })}
                </span>
              )}
            </div>
            {isAiComposed && layout.length > 0 ? (
              <Reorder.Group
                axis="y"
                values={layout.map((l) => l.type).filter((t) => SECTION_SCHEMAS[t])}
                onReorder={handleReorder}
                className="space-y-1"
              >
                {layout
                  .filter((l) => SECTION_SCHEMAS[l.type])
                  .map((l) => (
                    <Reorder.Item key={l.type} value={l.type} as="div">
                      <SectionTab
                        type={l.type}
                        variant={l.variant}
                        active={activeSection === l.type}
                        onClick={() => setActiveSection(l.type)}
                        label={L(SECTION_SCHEMAS[l.type].label)}
                        draggable
                      />
                    </Reorder.Item>
                  ))}
              </Reorder.Group>
            ) : (
              <div className="space-y-1">
                {visibleSections.map((type) => (
                  <SectionTab
                    key={type}
                    type={type}
                    active={activeSection === type}
                    onClick={() => setActiveSection(type)}
                    label={L(SECTION_SCHEMAS[type].label)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Editor panel */}
        <main className="min-w-0">
          <AnimatePresence mode="wait">
            {activeSection && SECTION_SCHEMAS[activeSection] && (
              <motion.div
                key={activeSection + ':' + targetLocale}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <SectionEditor
                  type={activeSection}
                  schema={SECTION_SCHEMAS[activeSection]}
                  value={content[activeSection]}
                  locale={locale}
                  onChange={(v) => setSection(activeSection, v)}
                  onSave={() => handleSaveSection(activeSection)}
                  saving={saving === 'save'}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-300">
              {error}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SectionTab({ type, variant, active, onClick, label, draggable }) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-[var(--accent)]/15 text-[var(--accent-light)] border border-[var(--accent)]/40'
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-transparent'
      }`}
    >
      {draggable && (
        <span className="text-[var(--text-muted)] cursor-grab select-none" aria-hidden>⋮⋮</span>
      )}
      <span className="flex-1 text-left truncate">{label}</span>
      {variant && (
        <span className="text-[9px] font-mono text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity">
          {variant}
        </span>
      )}
    </button>
  );
}

function SectionEditor({ type, schema, value, locale, onChange, onSave, saving }) {
  const L = (obj) => (locale === 'mn' ? obj.mn : obj.en);

  return (
    <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            {L(schema.label)}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {schema.kind === 'array'
              ? L({ mn: 'Бичлэгүүдийг нэмэх/устгах боломжтой', en: 'Add or remove entries' })
              : L({ mn: 'Талбаруудаа засаж "Хадгалах" дар', en: 'Edit fields then click "Save"' })}
          </p>
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="btn btn-ghost btn-sm whitespace-nowrap"
        >
          {saving ? L({ mn: 'Хадгалж байна...', en: 'Saving...' }) : L({ mn: '✓ Хэсгийг хадгалах', en: '✓ Save section' })}
        </button>
      </div>

      {schema.kind === 'object' ? (
        <ObjectEditor schema={schema} value={value ?? {}} onChange={onChange} locale={locale} />
      ) : (
        <ArrayEditor schema={schema} value={Array.isArray(value) ? value : []} onChange={onChange} locale={locale} />
      )}
    </div>
  );
}

function ObjectEditor({ schema, value, onChange, locale }) {
  const update = (id, v) => onChange({ ...value, [id]: v });
  return (
    <div className="space-y-5">
      {schema.fields.map((field) => (
        <FieldInput key={field.id} field={field} value={value?.[field.id] ?? ''} onChange={(v) => update(field.id, v)} locale={locale} />
      ))}
    </div>
  );
}

function ArrayEditor({ schema, value, onChange, locale }) {
  const L = (obj) => (locale === 'mn' ? obj.mn : obj.en);

  const addItem = () => {
    if (value.length >= (schema.max ?? 20)) return;
    const blank = Object.fromEntries(schema.fields.map((f) => [f.id, '']));
    onChange([...value, blank]);
  };
  const removeItem = (i) => onChange(value.filter((_, j) => j !== i));
  const updateItem = (i, next) => onChange(value.map((item, j) => (j === i ? next : item)));
  const moveItem = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {value.map((item, i) => (
        <div
          key={i}
          className="relative p-4 md:p-5 rounded-xl border border-[var(--surface-border)] bg-[var(--bg-tertiary)]/40"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-[var(--text-muted)]">
              #{String(i + 1).padStart(2, '0')} · {L(schema.itemLabel)}
            </span>
            <div className="flex gap-1">
              <IconBtn onClick={() => moveItem(i, -1)} disabled={i === 0} title="↑">↑</IconBtn>
              <IconBtn onClick={() => moveItem(i, 1)} disabled={i === value.length - 1} title="↓">↓</IconBtn>
              <IconBtn onClick={() => removeItem(i)} danger title="×">×</IconBtn>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {schema.fields.map((field) => (
              <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <FieldInput
                  field={field}
                  value={item?.[field.id] ?? ''}
                  onChange={(v) => updateItem(i, { ...item, [field.id]: v })}
                  locale={locale}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {value.length < (schema.max ?? 20) && (
        <button
          onClick={addItem}
          className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--surface-border)] text-sm font-semibold text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent-light)] transition-colors"
        >
          + {L({ mn: 'Нэмэх', en: 'Add' })} {L(schema.itemLabel)}
        </button>
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange, locale, compact }) {
  const L = (obj) => (locale === 'mn' ? obj.mn : obj.en);
  const common =
    'w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--surface-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)] transition-colors';
  return (
    <div>
      <label className={`block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 ${compact ? '' : 'uppercase tracking-wider'}`}>
        {L(field.label)}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          rows={compact ? 3 : 4}
          maxLength={field.max}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={`${common} resize-none font-mono text-xs leading-relaxed`}
        />
      ) : (
        <input
          type="text"
          maxLength={field.max}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={common}
        />
      )}
    </div>
  );
}

function IconBtn({ onClick, disabled, danger, title, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`w-7 h-7 rounded-md border text-xs font-bold transition-colors disabled:opacity-30 ${
        danger
          ? 'border-red-500/30 text-red-300 hover:bg-red-500/10'
          : 'border-[var(--surface-border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
      }`}
    >
      {children}
    </button>
  );
}
