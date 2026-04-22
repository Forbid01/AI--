import { getSection, normalizeLayout } from '@aiweb/templates/sections';
import SectionReveal from './SectionReveal.jsx';
import ParticleField from './ParticleField.jsx';

/**
 * Render an AI-composed site from a layout + content JSON pair.
 *
 * Layout shape: [{ type: 'hero', variant: 'split-image' }, ...]
 * Content shape: { hero: {...}, about: {...}, services: [...], ... }
 *
 * If an unknown variant is referenced, we silently fall back to the
 * first available variant for that type (see normalizeLayout).
 */

const PARTICLE_VIBES = new Set(['tech', 'luxe', 'playful']);

export default function AiComposedSite({ layout, content = {}, theme, assets, business, locale = 'mn' }) {
  const resolved = normalizeLayout(layout);

  if (resolved.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] text-white/70 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Энэ сайт бүрэн бэлэн биш байна</h1>
          <p className="text-sm text-white/50">Дахин туршаад үзнэ үү.</p>
        </div>
      </main>
    );
  }

  const galleryAssets = Array.isArray(assets?.gallery) ? assets.gallery : [];
  const vibe = theme?.vibe;
  const showParticles = vibe && PARTICLE_VIBES.has(vibe);

  return (
    <main className="relative">
      {showParticles && (
        <div
          className="fixed inset-0 z-[40] pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
          aria-hidden="true"
        >
          <ParticleField vibe={vibe} />
        </div>
      )}

      <div className="relative z-10">
        {resolved.map(({ type, variant }, index) => {
          const Component = getSection(type, variant);
          if (!Component) return null;

          const sectionContent = content?.[type];
          const sectionAssets =
            type === 'gallery'
              ? { ...assets, gallery: galleryAssets }
              : assets;

          return (
            <SectionReveal key={`${type}-${index}`} type={type} index={index}>
              <Component
                content={sectionContent}
                theme={theme}
                assets={sectionAssets}
                business={business}
                locale={locale}
              />
            </SectionReveal>
          );
        })}
      </div>
    </main>
  );
}
