import type { Metadata } from 'next';
import { Merriweather, Inter } from 'next/font/google';

const merriweather = Merriweather({
  variable: '--font-serif',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '700', '900'],
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'vietnamese'],
});

export const metadata: Metadata = {
  title: 'vhistory - Vietnamese Dialect Dictionary',
  description: 'Preserving the heritage of Vietnamese language.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
