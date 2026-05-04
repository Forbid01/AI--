import { schema } from './schema.js';
import Site from '../_layouts/LegalSite.jsx';

export default {
  id: 'legal',
  name: { mn: 'Хууль', en: 'Legal' },
  description: {
    mn: 'Харанхуй-алт эрх мэдэл — хуулийн фирм, өмгөөлөгчийн үйлчилгээнд.',
    en: 'Dark-gold authority — law firms and legal professionals.',
  },
  preview: '/templates/legal.svg',
  industries: ['legal', 'law-firm', 'attorney', 'notary', 'compliance', 'consulting'],
  defaultTheme: {
    primary: '#0c0e14',
    accent: '#c9a84c',
    background: '#08090c',
    foreground: '#e8ddc8',
    fontHeading: 'Cormorant Garamond',
    fontBody: 'Inter',
    radius: 'none',
  },
  schema,
  component: Site,
};
