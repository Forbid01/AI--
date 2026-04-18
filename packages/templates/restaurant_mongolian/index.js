import { schema } from './schema.js';
import Site from '../_layouts/CreativeSite.jsx';

export default {
  id: 'restaurant_mongolian',
  name: { mn: 'Ресторан', en: 'Restaurant' },
  description: {
    mn: 'Монгол уламжлал, орчин үеийн дизайн — ресторан, хоолны газарт.',
    en: 'Mongolian tradition meets modern design — restaurants and eateries.',
  },
  preview: '/templates/restaurant_mongolian.svg',
  industries: ['restaurant', 'mongolian-food', 'eatery', 'dining', 'catering'],
  defaultTheme: {
    primary: '#1a0505',
    accent: '#d97706',
    background: '#0d0000',
    foreground: '#faf5e4',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    radius: 'none',
  },
  schema,
  component: Site,
};
