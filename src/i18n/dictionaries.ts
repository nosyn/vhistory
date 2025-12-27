import 'server-only';
import { Locale } from './config';
import viDict from './dictionaries/vi.json';
import enDict from './dictionaries/en.json';

const dictionaries = {
  vi: viDict,
  en: enDict,
};

export const getDictionary = (locale: Locale) => {
  return dictionaries[locale];
};

export type Dictionary = ReturnType<typeof getDictionary>;
