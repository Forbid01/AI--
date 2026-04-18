import { schema } from './schema.js';
import Site from '../_layouts/CreativeSite.jsx';

export default {
  id: 'music_school',
  name: { mn: 'Хөгжим', en: 'Music' },
  description: {
    mn: 'Уран сайхны, нилэн — хөгжмийн сургууль, студи, дасгалжуулагчдад.',
    en: 'Artistic and expressive — music schools, studios, and instructors.',
  },
  preview: '/templates/music_school.svg',
  industries: ['music', 'music-school', 'studio', 'instrument', 'dance', 'performance'],
  defaultTheme: {
    primary: '#2e1065',
    accent: '#a855f7',
    background: '#0a0012',
    foreground: '#faf5ff',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'lg',
  },
  schema,
  component: Site,
};
