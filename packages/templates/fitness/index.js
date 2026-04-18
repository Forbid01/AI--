import { schema } from './schema.js';
import Site from '../_layouts/FitnessSite.jsx';

export default {
  id: 'fitness',
  name: { mn: 'Фитнес', en: 'Fitness' },
  description: {
    mn: 'Тэсвэртэй, харанхуй, энергитэй — фитнес заал, спорт клубд.',
    en: 'Bold, dark, and high-energy — gyms, sport clubs, and training studios.',
  },
  preview: '/templates/fitness.svg',
  industries: ['fitness', 'gym', 'sport', 'yoga', 'martial-arts', 'crossfit'],
  defaultTheme: {
    primary: '#0d0d0d',
    accent: '#22d3ee',
    background: '#050505',
    foreground: '#f5f5f5',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'sm',
  },
  schema,
  component: Site,
};
