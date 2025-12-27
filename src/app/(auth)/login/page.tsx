'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authClient } from '@/lib/auth-client';
import { loginSchema } from '@/lib/validations/auth';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      if (session?.data?.session) {
        const callbackUrl = searchParams.get('callbackUrl') || '/';
        router.push(callbackUrl);
      }
    };
    checkAuth();
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate with Zod
      const validated = loginSchema.parse({ email, password });

      // Sign in with Better-Auth
      const result = await authClient.signIn.email({
        email: validated.email,
        password: validated.password,
      });

      if (result.error) {
        setError(
          result.error.message || 'Invalid email or password. Please try again.'
        );
        return;
      }

      // Redirect to callback URL or home on success
      const callbackUrl = searchParams.get('callbackUrl') || '/';
      router.push(callbackUrl);
      router.refresh();
    } catch (err: any) {
      if (err.errors) {
        setError(err.errors[0]?.message || 'Invalid email or password.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Login Card */}
      <Card className='border-sand-200 shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-serif text-terracotta-800'>
            Welcome back
          </CardTitle>
          <CardDescription className='text-sand-500'>
            Sign in to your account to contribute words and preserve heritage
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {error && (
            <Alert variant='destructive' className='bg-red-50 border-red-200'>
              <AlertDescription className='text-red-800'>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email' className='text-sand-600'>
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='your.email@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='border-sand-200 focus:border-terracotta-400 focus:ring-terracotta-100'
                disabled={isLoading}
              />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-sand-600'>
                  Password
                </Label>
                <Link
                  href='/forgot-password'
                  className='text-sm text-terracotta-600 hover:text-terracotta-700 transition-colors'
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='border-sand-200 focus:border-terracotta-400 focus:ring-terracotta-100'
                disabled={isLoading}
              />
            </div>
            <Button
              type='submit'
              className='w-full bg-terracotta-600 hover:bg-terracotta-700 text-white'
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <Separator className='w-full bg-sand-200' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white px-2 text-sand-400'>
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type='button'
            variant='outline'
            className='w-full border-sand-200 hover:bg-sand-50 hover:border-terracotta-300'
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <Icons.google className='mr-2 h-4 w-4' />
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-sm text-center text-sand-500'>
            Don't have an account?{' '}
            <Link
              href='/register'
              className='text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors'
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>

      {/* Footer Note */}
      <div className='mt-8 text-center'>
        <p className='text-xs text-sand-400'>
          By signing in, you agree to our{' '}
          <Link href='/terms' className='underline hover:text-sand-600'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='/privacy' className='underline hover:text-sand-600'>
            Privacy Policy
          </Link>
        </p>
      </div>
    </>
  );
}
