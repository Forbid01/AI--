import { schema } from './schema.js';
import Site from '../_layouts/ArtisanSite.jsx';

export default {
  id: 'crafts',
  name: { mn: 'Гар урлал', en: 'Crafts' },
  description: {
    mn: 'Дулаахан, гар урлалын — гар бүтээгдэхүүн, уран бүтээлд.',
    en: 'Warm and handcrafted — artisan products and creative makers.',
  },
  preview: '/templates/crafts.svg',
  industries: ['crafts', 'handmade', 'artisan', 'pottery', 'jewelry', 'textile'],
  defaultTheme: {
    primary: '#78350f',
    accent: '#b45309',
    background: '#fffbf0',
    foreground: '#1c1208',
    fontHeading: 'Fraunces',
    fontBody: 'Inter',
    radius: 'lg',
  },
  schema,
  component: Site,
};
