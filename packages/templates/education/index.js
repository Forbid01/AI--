import { schema } from './schema.js';
import Site from '../_layouts/EducationSite.jsx';

export default {
  id: 'education',
  name: { mn: 'Сургалт', en: 'Education' },
  description: {
    mn: 'Glassmorphism · Дашборд мэдрэмж — сургалтын төв, онлайн курс, академид.',
    en: 'Glassmorphism dashboard feel — training centers, online courses, academies.',
  },
  preview: '/templates/education/cover.png',
  industries: ['education', 'training', 'tutoring', 'language', 'online-course', 'academy'],
  defaultTheme: {
    primary: '#1d4ed8',
    accent: '#38bdf8',
    background: '#0a0f1e',
    foreground: '#e8f4ff',
    fontHeading: 'Sora',
    fontBody: 'Inter',
    radius: 'lg',
  },
  schema,
  component: Site,
};
