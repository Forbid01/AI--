import { schema } from './schema.js';
import Site from '../_layouts/ProServiceSite.jsx';

export default {
  id: 'home_service',
  name: { mn: 'Үйлчилгээ', en: 'Home Service' },
  description: {
    mn: 'Гэр ахуйн үйлчилгээ — цэвэрлэгээ, засвар, тохижилтын бизнест.',
    en: 'Home services — cleaning, repairs, renovation, and maintenance.',
  },
  preview: '/templates/home_service.svg',
  industries: ['home-service', 'cleaning', 'renovation', 'plumbing', 'electrical', 'moving'],
  defaultTheme: {
    primary: '#1e40af',
    accent: '#0284c7',
    background: '#f8faff',
    foreground: '#0c1a2e',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'md',
  },
  schema,
  component: Site,
};
