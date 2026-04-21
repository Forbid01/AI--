/**
 * Section registry
 *
 * Maps { type → { variant → Component } } for the AI layout composer.
 *
 * Usage:
 *   import { getSection, availableVariants, sections } from '@aiweb/templates/sections';
 *   const Hero = getSection('hero', 'split-image');
 *   // availableVariants.hero → ['split-image', 'centered', ...]
 */

import HeroSplitImage from './hero/SplitImage.jsx';
import HeroCentered from './hero/Centered.jsx';
import HeroParallax from './hero/Parallax.jsx';
import HeroMinimal from './hero/Minimal.jsx';
import HeroFullscreenImage from './hero/FullscreenImage.jsx';
import HeroSplitText from './hero/SplitText.jsx';

import AboutTwoCol from './about/TwoCol.jsx';
import AboutStatsFirst from './about/StatsFirst.jsx';
import AboutStory from './about/Story.jsx';

import ServicesGrid3 from './services/Grid3.jsx';
import ServicesPricingCards from './services/PricingCards.jsx';
import ServicesList from './services/List.jsx';

import FeaturesIconGrid from './features/IconGrid.jsx';
import FeaturesAlternating from './features/Alternating.jsx';

import ProcessNumberedSteps from './process/NumberedSteps.jsx';
import ProcessTimeline from './process/Timeline.jsx';

import StatsInline from './stats/Inline.jsx';
import StatsBanner from './stats/Banner.jsx';

import GalleryGrid4 from './gallery/Grid4.jsx';
import GalleryMasonry from './gallery/Masonry.jsx';

import TestimonialsGrid from './testimonials/Grid.jsx';
import TestimonialsSingleLarge from './testimonials/SingleLarge.jsx';

import FaqAccordion from './faq/Accordion.jsx';
import FaqTwoCol from './faq/TwoCol.jsx';

import CtaCentered from './cta/Centered.jsx';
import CtaSplit from './cta/Split.jsx';

import ContactCentered from './contact/Centered.jsx';
import ContactInfoCards from './contact/InfoCards.jsx';

import FooterMinimal from './footer/Minimal.jsx';
import FooterColumns from './footer/Columns.jsx';

import NavSticky from './nav/Sticky.jsx';
import NavTransparent from './nav/Transparent.jsx';

export const sections = {
  nav: {
    'sticky':      NavSticky,
    'transparent': NavTransparent,
  },
  hero: {
    'split-image':      HeroSplitImage,
    'centered':         HeroCentered,
    'parallax':         HeroParallax,
    'minimal':          HeroMinimal,
    'fullscreen-image': HeroFullscreenImage,
    'split-text':       HeroSplitText,
  },
  about: {
    'two-col':     AboutTwoCol,
    'stats-first': AboutStatsFirst,
    'story':       AboutStory,
  },
  services: {
    'grid-3':         ServicesGrid3,
    'pricing-cards':  ServicesPricingCards,
    'list':           ServicesList,
  },
  features: {
    'icon-grid':   FeaturesIconGrid,
    'alternating': FeaturesAlternating,
  },
  process: {
    'numbered-steps': ProcessNumberedSteps,
    'timeline':       ProcessTimeline,
  },
  stats: {
    'inline': StatsInline,
    'banner': StatsBanner,
  },
  gallery: {
    'grid-4':  GalleryGrid4,
    'masonry': GalleryMasonry,
  },
  testimonials: {
    'grid':         TestimonialsGrid,
    'single-large': TestimonialsSingleLarge,
  },
  faq: {
    'accordion': FaqAccordion,
    'two-col':   FaqTwoCol,
  },
  cta: {
    'centered': CtaCentered,
    'split':    CtaSplit,
  },
  contact: {
    'centered':   ContactCentered,
    'info-cards': ContactInfoCards,
  },
  footer: {
    'minimal': FooterMinimal,
    'columns': FooterColumns,
  },
};

export const availableVariants = Object.fromEntries(
  Object.entries(sections).map(([type, variants]) => [type, Object.keys(variants)]),
);

export const sectionTypes = Object.keys(sections);

/**
 * Resolve a section component. Falls back to the first variant of the type
 * if the requested variant is unknown. Returns null if the type is unknown.
 */
export function getSection(type, variant) {
  const pool = sections[type];
  if (!pool) return null;
  return pool[variant] ?? pool[Object.keys(pool)[0]];
}

/**
 * Validate that a layout array references only known types + variants.
 * Unknown items are dropped. Returns a cleaned layout array.
 */
export function normalizeLayout(layout) {
  if (!Array.isArray(layout)) return [];
  return layout
    .map((item) => {
      if (!item?.type) return null;
      if (!sections[item.type]) return null;
      const variants = availableVariants[item.type];
      const variant = variants.includes(item.variant) ? item.variant : variants[0];
      return { type: item.type, variant };
    })
    .filter(Boolean);
}
