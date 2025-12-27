import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';
import LoginClient from './login-client';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dict = getDictionary(lang);

  return <LoginClient dict={dict} lang={lang} />;
}
