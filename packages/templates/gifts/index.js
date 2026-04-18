import { schema } from './schema.js';
import Site from '../_layouts/ArtisanSite.jsx';

export default {
  id: 'gifts',
  name: { mn: 'Бэлэг', en: 'Gifts' },
  description: {
    mn: 'Тоглоомлог, дулаахан — бэлгийн дэлгүүр, онцгой зүйлийн бизнест.',
    en: 'Playful and warm — gift shops and specialty boutiques.',
  },
  preview: '/templates/gifts.svg',
  industries: ['gifts', 'gift-shop', 'souvenirs', 'specialty', 'florist', 'stationery'],
  defaultTheme: {
    primary: '#831843',
    accent: '#db2777',
    background: '#fdf4ff',
    foreground: '#2d0020',
    fontHeading: 'Fraunces',
    fontBody: 'Inter',
    radius: 'xl',
  },
  schema,
  component: Site,
};
