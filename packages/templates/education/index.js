import { schema } from './schema.js';
import Site from '../_layouts/ProServiceSite.jsx';

export default {
  id: 'education',
  name: { mn: 'Сургалт', en: 'Education' },
  description: {
    mn: 'Итгэлтэй, эмх цэгцтэй — сургалтын төв, дасгалжуулагч, онлайн курст.',
    en: 'Trustworthy and structured — training centers, tutors, and online courses.',
  },
  preview: '/templates/education.svg',
  industries: ['education', 'training', 'tutoring', 'language', 'online-course', 'academy'],
  defaultTheme: {
    primary: '#1e3a8a',
    accent: '#3b82f6',
    background: '#f8faff',
    foreground: '#0b1220',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'md',
  },
  schema,
  component: Site,
};
