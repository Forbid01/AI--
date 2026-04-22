import Link from 'next/link';
import { prisma } from '@aiweb/db';
import { getTemplate } from '@aiweb/templates';
import { getSection, normalizeLayout, availableVariants } from '@aiweb/templates/sections';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth.js';
import SiteActions from './SiteActions.jsx';
import DomainPanel from './DomainPanel.jsx';
import RemixDrawer from './RemixDrawer.jsx';

export default async function SitePage({ params }) {
  const { id, locale } = params;
  const user = await requireUser();
  const site = await prisma.site.findFirst({
    where: { id, userId: user.id },
    include: { content: true, theme: true, assets: true },
  });
  if (!site) notFound();

  const isAiComposed = site.mode === 'ai_composed';
  const tpl = isAiComposed ? null : getTemplate(site.templateId);
  const siteContentRow = site.content.find((c) => c.locale === site.defaultLocale);
  const content = siteContentRow?.sections;
  const layout = siteContentRow?.layout;
  const hero = site.assets.find((a) => a.kind === 'hero');
  const gallery = site.assets.filter((a) => a.kind === 'gallery');
  const SiteComponent = tpl?.component;
  const vibe = isAiComposed && site.templateId?.startsWith('ai-')
    ? site.templateId.slice(3)
    : null;
  const resolvedLayout = isAiComposed ? normalizeLayout(layout) : [];

  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const root = process.env.PLATFORM_ROOT_DOMAIN || 'platform.mn';
  const displayDomain = site.customDomain && site.customDomainVerified
    ? site.customDomain
    : `${site.subdomain}.${root}`;
  const publicUrl = `https://${displayDomain}`;

  const statusConfig = {
    draft: { label: L('Ноорог', 'Draft'), color: 'var(--warn)', bg: 'rgba(245, 158, 11, 0.15)' },
    published: { label: L('Нийтлэгдсэн', 'Live'), color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.15)' },
    archived: { label: L('Архивласан', 'Archived'), color: 'var(--text-tertiary)', bg: 'rgba(255,255,255,0.08)' },
  }[site.status] || { label: site.status, color: 'var(--text-tertiary)', bg: 'rgba(255,255,255,0.08)' };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
      {/* Breadcrumb */}
      <Link
        href={`/${locale}/dashboard`}
        className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-2 transition-colors"
      >
        <span aria-hidden>&#8592;</span> {L('Хяналтын самбар', 'Dashboard')}
      </Link>

      {/* Masthead */}
      <div className="mt-6 flex items-start justify-between flex-wrap gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: statusConfig.bg, color: statusConfig.color }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusConfig.color }} />
              {statusConfig.label}
            </span>
            {isAiComposed ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(95deg, rgba(124,92,255,0.22), rgba(34,211,238,0.22))',
                  color: '#c4b5fd',
                }}
              >
                <span>✨</span>
                {L('AI-composed', 'AI-composed')}
                {vibe && <span className="font-mono text-[9px] opacity-70">· {vibe}</span>}
              </span>
            ) : (
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {L('Template:', 'Template:')} {site.templateId}
              </span>
            )}
          </div>
          <h1 className="mt-4 font-display text-3xl md:text-4xl font-bold tracking-tight truncate">
            {site.name}
          </h1>
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 font-mono text-sm text-[var(--accent-light)] hover:text-[var(--accent)] transition-colors"
          >
            {displayDomain} <span aria-hidden>&#8599;</span>
          </a>
          <div className="mt-4">
            <Link
              href={`/${locale}/dashboard/sites/${site.id}/edit`}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              <span aria-hidden>✎</span>
              {L('Контент засах', 'Edit content')}
            </Link>
          </div>
        </div>
        <SiteActions site={site} locale={locale} />
      </div>

      {/* Preview */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <span className="eyebrow text-[var(--text-muted)]">{L('Урьдчилан үзэх', 'Preview')}</span>
          <span className="font-mono text-xs text-[var(--text-muted)] tabular">{site.defaultLocale.toUpperCase()}</span>
        </div>
        <div className="rounded-2xl overflow-hidden border border-[var(--surface-border)] bg-[var(--surface)] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--surface-border)] bg-[var(--bg-tertiary)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-border-strong)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-border-strong)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-border-strong)]" />
            <span className="ml-3 text-xs font-mono text-[var(--text-muted)] truncate">{displayDomain}</span>
          </div>
          <div className="bg-white">
            {isAiComposed && resolvedLayout.length > 0 && content ? (
              <AiComposedPreview
                layout={resolvedLayout}
                content={content}
                theme={{ ...site.theme, vibe }}
                assets={{ hero, gallery }}
                business={site.business}
                locale={site.defaultLocale}
              />
            ) : SiteComponent && content ? (
              <SiteComponent
                content={content}
                theme={site.theme}
                assets={{ hero, gallery }}
                business={site.business}
                locale={site.defaultLocale}
              />
            ) : (
              <div className="p-20 text-center bg-[var(--bg-secondary)]">
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-light)]" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-light)]" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-[var(--accent-light)]" />
                </div>
                <p className="font-display text-xl font-semibold tracking-tight text-[var(--text-secondary)]">
                  {L('Контент үүсгэгдэж байна...', 'Content is being generated...')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Domain panel */}
      <DomainPanel site={site} locale={locale} />

      {/* AI remix chat drawer */}
      <RemixDrawer site={site} locale={locale} variants={availableVariants} />
    </div>
  );
}

function AiComposedPreview({ layout, content, theme, assets, business, locale }) {
  const galleryAssets = Array.isArray(assets?.gallery) ? assets.gallery : [];
  return (
    <>
      {layout.map(({ type, variant }, index) => {
        const Component = getSection(type, variant);
        if (!Component) return null;
        const sectionAssets =
          type === 'gallery' ? { ...assets, gallery: galleryAssets } : assets;
        return (
          <Component
            key={`${type}-${index}`}
            content={content?.[type]}
            theme={theme}
            assets={sectionAssets}
            business={business}
            locale={locale}
          />
        );
      })}
    </>
  );
}
