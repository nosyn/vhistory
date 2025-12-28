import 'server-only';
import type { Locale } from './config';

type DictionaryLoader = () => Promise<any>;

const dictionaries: Record<Locale, DictionaryLoader> = {
  vi: () => import('./dictionaries/vi.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const loader = dictionaries[locale];
  if (!loader) {
    throw new Error(`Dictionary not found for locale: ${locale}`);
  }
  return await loader();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
