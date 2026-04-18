import { schema } from './schema.js';
import Site from '../_layouts/CreativeSite.jsx';

export default {
  id: 'fashion_store',
  name: { mn: 'Фэшн', en: 'Fashion' },
  description: {
    mn: 'Хувцасны дэлгүүр, брэнд — орчин үеийн, загварлаг харагдах.',
    en: 'Clothing stores and fashion brands — sleek, modern, editorial feel.',
  },
  preview: '/templates/fashion_store.svg',
  industries: ['fashion', 'clothing', 'boutique', 'brand', 'accessories', 'shoes'],
  defaultTheme: {
    primary: '#18181b',
    accent: '#d4d4d8',
    background: '#fafafa',
    foreground: '#18181b',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'none',
  },
  schema,
  component: Site,
};
