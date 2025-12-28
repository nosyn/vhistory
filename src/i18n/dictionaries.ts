import 'server-only';
import type { Locale } from './config';
import { i18n } from './config';

type DictionaryLoader = () => Promise<any>;

const dictionaries: Record<Locale, DictionaryLoader> = {
  vi: () => import('./dictionaries/vi.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale | string) => {
  // Validate locale and fallback to default if invalid
  const validLocale = i18n.locales.includes(locale as Locale)
    ? (locale as Locale)
    : i18n.defaultLocale;

  const loader = dictionaries[validLocale];
  if (!loader) {
    // This should never happen, but fallback to default locale
    console.warn(
      `Dictionary not found for locale: ${locale}, falling back to ${i18n.defaultLocale}`
    );
    return await dictionaries[i18n.defaultLocale]();
  }
  return await loader();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
