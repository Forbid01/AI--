import minimal from './minimal/index.js';

export const templates = {
  [minimal.id]: minimal,
};

export const templateList = Object.values(templates).map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  preview: t.preview,
  industries: t.industries,
}));

export function getTemplate(id) {
  return templates[id] ?? null;
}
