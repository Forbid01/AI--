import { schema } from './schema.js';
import Site from '../_layouts/ProServiceSite.jsx';

export default {
  id: 'clinic',
  name: { mn: 'Эмнэлэг', en: 'Clinic' },
  description: {
    mn: 'Цэвэр, найдвартай — эмнэлэг, клиник, эрүүл мэндийн үйлчилгээнд.',
    en: 'Clean and reassuring — clinics, health centers, and medical practices.',
  },
  preview: '/templates/clinic.svg',
  industries: ['clinic', 'medical', 'dentist', 'health', 'pharmacy', 'therapy'],
  defaultTheme: {
    primary: '#0e7490',
    accent: '#10b981',
    background: '#f0fafe',
    foreground: '#0c1a1f',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'lg',
  },
  schema,
  component: Site,
};
