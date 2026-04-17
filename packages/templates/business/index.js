import { schema } from './schema.js';
import Site from './Site.jsx';

export default {
  id: 'business',
  name: { mn: 'Бизнес', en: 'Business' },
  description: {
    mn: 'Корпорат байдлаар харагдах, итгэл төрүүлэхүйц цэнхэр өнгийн загвар.',
    en: 'Corporate, trustworthy design with a confident blue palette.',
  },
  preview: '/templates/business.svg',
  industries: ['consulting', 'finance', 'legal', 'b2b'],
  defaultTheme: {
    primary: '#1e40af',
    accent: '#0891b2',
    background: '#ffffff',
    foreground: '#0f172a',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'sm',
  },
  schema,
  component: Site,
};
