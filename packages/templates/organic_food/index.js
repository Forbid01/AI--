import { schema } from './schema.js';
import Site from '../_layouts/ArtisanSite.jsx';

export default {
  id: 'organic_food',
  name: { mn: 'Органик', en: 'Organic' },
  description: {
    mn: 'Байгалийн, ногоон — органик хүнс, фермерийн дэлгүүр, эрүүл хоолны бизнест.',
    en: 'Natural and green — organic food, farm stores, and healthy food businesses.',
  },
  preview: '/templates/organic_food.svg',
  industries: ['organic', 'farm', 'health-food', 'grocery', 'vegan', 'nutrition'],
  defaultTheme: {
    primary: '#14532d',
    accent: '#65a30d',
    background: '#f7fff0',
    foreground: '#0a2010',
    fontHeading: 'Fraunces',
    fontBody: 'Inter',
    radius: 'lg',
  },
  schema,
  component: Site,
};
