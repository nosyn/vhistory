import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';
import RegisterClient from './register-client';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return <RegisterClient dict={dict} lang={lang} />;
}
