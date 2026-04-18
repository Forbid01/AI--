import { schema } from './schema.js';
import Site from '../_layouts/ProServiceSite.jsx';

export default {
  id: 'legal',
  name: { mn: 'Хууль', en: 'Legal' },
  description: {
    mn: 'Эрх мэдэлтэй, итгэл төрүүлэхүйц — хуулийн фирм, өмгөөлөгчийн үйлчилгээнд.',
    en: 'Authoritative and trustworthy — law firms and legal professionals.',
  },
  preview: '/templates/legal.svg',
  industries: ['legal', 'law-firm', 'attorney', 'notary', 'compliance', 'consulting'],
  defaultTheme: {
    primary: '#1e293b',
    accent: '#64748b',
    background: '#f8fafc',
    foreground: '#0f172a',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'sm',
  },
  schema,
  component: Site,
};
