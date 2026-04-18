import { schema } from './schema.js';
import Site from '../_layouts/ProServiceSite.jsx';

export default {
  id: 'phone_repair',
  name: { mn: 'Утас засвар', en: 'Phone Repair' },
  description: {
    mn: 'Техникийн, найдвартай — утас, таблет засвар, электрон бараа үйлчилгээнд.',
    en: 'Technical and reliable — phone repair, electronics, and device services.',
  },
  preview: '/templates/phone_repair.svg',
  industries: ['phone-repair', 'electronics', 'tech-service', 'computer-repair', 'device'],
  defaultTheme: {
    primary: '#0f172a',
    accent: '#0ea5e9',
    background: '#0f172a',
    foreground: '#f1f5f9',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'md',
  },
  schema,
  component: Site,
};
