import { schema } from './schema.js';
import Site from '../_layouts/ProServiceSite.jsx';

export default {
  id: 'auto_repair',
  name: { mn: 'Авто засвар', en: 'Auto' },
  description: {
    mn: 'Бат бөх, тодорхой — автомашины засвар, техникийн үйлчилгээнд.',
    en: 'Strong and straightforward — auto repair shops and vehicle services.',
  },
  preview: '/templates/auto_repair.svg',
  industries: ['auto-repair', 'car-service', 'mechanic', 'garage', 'auto-parts'],
  defaultTheme: {
    primary: '#1c1917',
    accent: '#ea580c',
    background: '#0d0b09',
    foreground: '#f5f5f4',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'sm',
  },
  schema,
  component: Site,
};
