import { Locale } from '@/i18n/config';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import BlogCreateClient from './blog-create-client';

export default async function BlogCreatePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    // Redirect to login with return URL
    redirect(`/${lang}/login?returnUrl=${encodeURIComponent(`/${lang}/blog/create`)}`);
  }

  return <BlogCreateClient lang={lang} />;
}
