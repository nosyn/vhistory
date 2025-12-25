'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { Checkbox } from '@/components/ui/checkbox';
import { authClient } from '@/lib/auth-client';
import { registerSchema } from '@/lib/validations/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      setIsLoading(false);
      return;
    }

    try {
      // Validate with Zod
      const validated = registerSchema.parse({
        name,
        email,
        password,
        confirmPassword,
      });

      // Sign up with Better-Auth
      const result = await authClient.signUp.email({
        email: validated.email,
        password: validated.password,
        name: validated.name,
      });

      if (result.error) {
        setError(
          result.error.message || 'Registration failed. Please try again.'
        );
        return;
      }

      // Redirect to home on success
      router.push('/');
      router.refresh();
    } catch (err: any) {
      if (err.errors) {
        setError(err.errors[0]?.message || 'Registration failed.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');

    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err) {
      setError('Failed to sign up with Google. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Registration Card */}
      <Card className='border-sand-200 shadow-lg'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-serif text-terracotta-800'>
            Create an account
          </CardTitle>
          <CardDescription className='text-sand-500'>
            Join us in preserving Vietnamese dialect heritage
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
              <Label htmlFor='name' className='text-sand-600'>
                Full Name
              </Label>
              <Input
                id='name'
                type='text'
                placeholder='Nguyen Van A'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='border-sand-200 focus:border-terracotta-400 focus:ring-terracotta-100'
                disabled={isLoading}
              />
            </div>
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
              <Label htmlFor='password' className='text-sand-600'>
                Password
              </Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className='border-sand-200 focus:border-terracotta-400 focus:ring-terracotta-100'
                disabled={isLoading}
              />
              <p className='text-xs text-sand-400'>
                Must be at least 8 characters
              </p>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword' className='text-sand-600'>
                Confirm Password
              </Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className='border-sand-200 focus:border-terracotta-400 focus:ring-terracotta-100'
                disabled={isLoading}
              />
            </div>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='terms'
                checked={agreeToTerms}
                onCheckedChange={(checked) =>
                  setAgreeToTerms(checked as boolean)
                }
                disabled={isLoading}
              />
              <label
                htmlFor='terms'
                className='text-sm text-sand-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                I agree to the{' '}
                <Link
                  href='/terms'
                  className='text-terracotta-600 hover:text-terracotta-700 underline'
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy'
                  className='text-terracotta-600 hover:text-terracotta-700 underline'
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            <Button
              type='submit'
              className='w-full bg-terracotta-600 hover:bg-terracotta-700 text-white'
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
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
            onClick={handleGoogleSignup}
            disabled={isLoading}
          >
            <Icons.google className='mr-2 h-4 w-4' />
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-sm text-center text-sand-500'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-terracotta-600 hover:text-terracotta-700 font-medium transition-colors'
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
