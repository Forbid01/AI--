import { schema } from './schema.js';
import Site from '../_layouts/CreativeSite.jsx';

export default {
  id: 'travel',
  name: { mn: 'Аялал', en: 'Travel' },
  description: {
    mn: 'Тэнгэр цэнхэр, аялалын уур амьсгал — туристик агентлаг, аялалын бизнест.',
    en: 'Sky blue and adventurous — travel agencies and tour operators.',
  },
  preview: '/templates/travel.svg',
  industries: ['travel', 'tourism', 'tour-operator', 'adventure', 'hospitality'],
  defaultTheme: {
    primary: '#0c4a6e',
    accent: '#06b6d4',
    background: '#080f16',
    foreground: '#f0f9ff',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'lg',
  },
  schema,
  component: Site,
};
