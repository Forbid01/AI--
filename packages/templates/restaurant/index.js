import { schema } from './schema.js';
import Site from './Site.jsx';

export default {
  id: 'restaurant',
  name: { mn: 'Ресторан', en: 'Restaurant' },
  description: {
    mn: 'Халуун дулаан, амттай өнгө аястай — ресторан, кафе, хоолны бизнест.',
    en: 'Warm, appetizing palette — restaurants, cafes, food businesses.',
  },
  preview: '/templates/restaurant.svg',
  industries: ['restaurant', 'cafe', 'bakery', 'food'],
  defaultTheme: {
    primary: '#7c2d12',
    accent: '#d97706',
    background: '#fffbf5',
    foreground: '#1c1917',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    radius: 'lg',
  },
  schema,
  component: Site,
};
