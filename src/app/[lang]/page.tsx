import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';
import HomeClient from './home-client';

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <HomeClient dict={dict} lang={lang} />;
}
