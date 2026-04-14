import mn from './locales/mn.js';
import en from './locales/en.js';

export const locales = ['mn', 'en'];
export const defaultLocale = 'mn';

const dictionaries = { mn, en };

export function getDictionary(locale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

export function t(locale, key, vars) {
  const dict = getDictionary(locale);
  const value = key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), dict);
  if (typeof value !== 'string') return key;
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}
