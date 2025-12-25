'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, authClient } from '@/lib/auth-client';

export function UserMenu() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  };

  if (!session) {
    return (
      <Button
        asChild
        variant='outline'
        size='sm'
        className='border-sand-200 hover:bg-sand-100 hover:border-terracotta-300'
      >
        <Link href='/login'>Sign In</Link>
      </Button>
    );
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0]?.toUpperCase() || '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='relative h-8 w-8 rounded-full hover:bg-sand-100'
        >
          <Avatar className='h-8 w-8'>
            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
            <AvatarFallback className='bg-terracotta-100 text-terracotta-700'>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-56 border-sand-200'
        align='end'
        forceMount
      >
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none text-terracotta-800'>
              {user.name}
            </p>
            <p className='text-xs leading-none text-sand-500'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='bg-sand-200' />
        <DropdownMenuItem asChild>
          <Link href='/profile' className='cursor-pointer'>
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/settings' className='cursor-pointer'>
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className='bg-sand-200' />
        <DropdownMenuItem
          onClick={handleSignOut}
          className='cursor-pointer text-red-600 focus:text-red-600'
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
