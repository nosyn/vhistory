import { getDictionary } from '@/i18n/dictionaries';
import { Locale } from '@/i18n/config';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import LoginClient from './login-client';

export default async function LoginPage({
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

  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-500' />
        </div>
      }
    >
      <LoginClient dict={dict} lang={lang} returnUrl={returnUrl} />
    </Suspense>
  );
}
