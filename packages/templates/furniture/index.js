import { schema } from './schema.js';
import Site from '../_layouts/ArtisanSite.jsx';

export default {
  id: 'furniture',
  name: { mn: 'Тавилга', en: 'Furniture' },
  description: {
    mn: 'Дулаан, зэрлэг тансаг — тавилга, интерьер дизайн, гэр тохижилтод.',
    en: 'Warm and refined — furniture makers, interior design, and home decor.',
  },
  preview: '/templates/furniture.svg',
  industries: ['furniture', 'interior-design', 'home-decor', 'woodworking', 'upholstery'],
  defaultTheme: {
    primary: '#292524',
    accent: '#92400e',
    background: '#faf9f7',
    foreground: '#1c1a18',
    fontHeading: 'Fraunces',
    fontBody: 'Inter',
    radius: 'md',
  },
  schema,
  component: Site,
};
