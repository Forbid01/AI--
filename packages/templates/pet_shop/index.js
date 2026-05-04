import { schema } from './schema.js';
import Site from '../_layouts/WellnessSite.jsx';

export default {
  id: 'pet_shop',
  name: { mn: 'Амьтан', en: 'Pet Shop' },
  description: {
    mn: 'Найрсаг, тааламжтай — амьтны дэлгүүр, грооминг, ветеринарт.',
    en: 'Friendly and warm — pet shops, grooming, and veterinary services.',
  },
  preview: '/templates/pet_shop.svg',
  industries: ['pet-shop', 'grooming', 'veterinary', 'pet-care', 'animal-shelter'],
  defaultTheme: {
    primary: '#166534',
    accent: '#4ade80',
    background: '#f0fdf4',
    foreground: '#052e16',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    radius: 'xl',
  },
  schema,
  component: Site,
};
