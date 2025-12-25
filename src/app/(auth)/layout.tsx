import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className='min-h-[calc(100vh-9rem)] flex items-center justify-center bg-sand-50 px-4 py-12'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <Link href='/' className='inline-block'>
            <h1 className='font-serif text-4xl font-bold text-terracotta-700 mb-2'>
              vhistory
            </h1>
          </Link>
          <p className='text-sand-500'>
            Preserving Heritage, One Word at a Time
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
