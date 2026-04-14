import { schema } from './schema.js';
import Site from './Site.jsx';

export default {
  id: 'minimal',
  name: { mn: 'Минимал', en: 'Minimal' },
  description: {
    mn: 'Цэвэрхэн, цагаан дэвсгэртэй, ямар ч салбарт тохирох уянгалаг загвар.',
    en: 'Clean, white-based, versatile design that fits any industry.',
  },
  preview: '/templates/minimal.svg',
  industries: ['all'],
  schema,
  component: Site,
};
