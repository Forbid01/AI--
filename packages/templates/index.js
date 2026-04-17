import minimal from './minimal/index.js';
import business from './business/index.js';
import restaurant from './restaurant/index.js';
import portfolio from './portfolio/index.js';

export const templates = {
  [minimal.id]: minimal,
  [business.id]: business,
  [restaurant.id]: restaurant,
  [portfolio.id]: portfolio,
};

export const templateList = Object.values(templates).map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  preview: t.preview,
  industries: t.industries,
  defaultTheme: t.defaultTheme,
}));

export function getTemplate(id) {
  return templates[id] ?? null;
}
