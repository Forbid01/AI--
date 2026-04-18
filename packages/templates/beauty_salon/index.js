import { schema } from './schema.js';
import Site from '../_layouts/WellnessSite.jsx';

export default {
  id: 'beauty_salon',
  name: { mn: 'Гоо сайхан', en: 'Beauty' },
  description: {
    mn: 'Нарийн, эелдэг — гоо сайхны салон, барбер, спа үйлчилгээнд.',
    en: 'Elegant and soft — beauty salons, barbers, and spa services.',
  },
  preview: '/templates/beauty_salon.svg',
  industries: ['beauty', 'salon', 'spa', 'barber', 'nail', 'makeup'],
  defaultTheme: {
    primary: '#be185d',
    accent: '#f9a8d4',
    background: '#fff0f6',
    foreground: '#1c0010',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    radius: 'xl',
  },
  schema,
  component: Site,
};
