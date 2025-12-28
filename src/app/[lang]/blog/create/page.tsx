import { Locale } from '@/i18n/config';
import BlogCreateClient from './blog-create-client';

export default async function BlogCreatePage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return <BlogCreateClient lang={lang} />;
}
