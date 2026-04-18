import { schema } from './schema.js';
import Site from '../_layouts/CreativeSite.jsx';

export default {
  id: 'photography',
  name: { mn: 'Фото', en: 'Photography' },
  description: {
    mn: 'Харанхуй, дүрслэлийн — зурагчин, студио, визуаль бүтээлчдэд.',
    en: 'Dark and visual-first — photographers, studios, and visual creatives.',
  },
  preview: '/templates/photography.svg',
  industries: ['photography', 'studio', 'videography', 'film', 'visual-art'],
  defaultTheme: {
    primary: '#09090b',
    accent: '#d97706',
    background: '#09090b',
    foreground: '#fafafa',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'none',
  },
  schema,
  component: Site,
};
