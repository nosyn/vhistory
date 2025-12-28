import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import RegisterClient from './register-client';

export default async function RegisterPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  const { lang } = await params;
  const { returnUrl } = await searchParams;
  const dict = await getDictionary(lang);

  // Check if user is already authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    // Redirect to return URL or home
    redirect(returnUrl || `/${lang}`);
  }

  return <RegisterClient dict={dict} lang={lang} returnUrl={returnUrl} />;
}
