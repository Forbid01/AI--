import { schema } from './schema.js';
import Site from './Site.jsx';

export default {
  id: 'portfolio',
  name: { mn: 'Портфолио', en: 'Portfolio' },
  description: {
    mn: 'Харанхуй, дизайнерлаг — бүтээлч мэргэжилтэн, хувь хүний брэндэд.',
    en: 'Dark, design-forward — for creatives and personal brands.',
  },
  preview: '/templates/portfolio.svg',
  industries: ['design', 'photography', 'art', 'personal'],
  defaultTheme: {
    primary: '#fafafa',
    accent: '#f97316',
    background: '#0a0a0a',
    foreground: '#fafafa',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'none',
  },
  schema,
  component: Site,
};
