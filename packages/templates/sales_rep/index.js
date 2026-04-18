import { schema } from './schema.js';
import Site from '../_layouts/ProServiceSite.jsx';

export default {
  id: 'sales_rep',
  name: { mn: 'Худалдаа', en: 'Sales' },
  description: {
    mn: 'Худалдаа, борлуулалт — итгэл татах, үр дүнд чиглэсэн загвар.',
    en: 'Sales and commerce — conversion-focused, results-driven design.',
  },
  preview: '/templates/sales_rep.svg',
  industries: ['sales', 'retail', 'wholesale', 'distribution', 'b2b-sales', 'ecommerce'],
  defaultTheme: {
    primary: '#4f46e5',
    accent: '#7c3aed',
    background: '#fafafe',
    foreground: '#0f0c29',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    radius: 'md',
  },
  schema,
  component: Site,
};
