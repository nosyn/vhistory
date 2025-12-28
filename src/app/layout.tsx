import './globals.css';
import type { Metadata } from 'next';
import { Merriweather, Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

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
  return (
    <html lang='en'>
      <body
        className={cn(
          merriweather.variable,
          inter.variable,
          'antialiased min-h-screen'
        )}
      >
        {children}
      </body>
    </html>
  );
}
