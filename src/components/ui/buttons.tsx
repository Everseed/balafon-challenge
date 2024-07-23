'use client';
import React from 'react';
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icons } from '../icons';
import { Button } from './button';
import { cn } from '@/lib/utils';

export const LoginButton = () => {
  const router = useRouter();

  const isActive: (pathname: string) => boolean = (pathname) => false;

  return (
    <Button variant="outline" className="flex gap-2 px-4">
      <Link href="/api/auth/signin">
        Log in
        {/* <a data-active={isActive('/signup')}></a> */}
      </Link>
    </Button>
  );
};

export const LogoutButton = () => {
  return <Button onClick={() => signOut()}>Sign Out</Button>;
};

const CloseButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      type="button"
      className={cn(
        'w-6 h-6 relative hover:bg-monochrome-with-bg-opacity bg-opacity-10',
        className
      )}
      ref={ref}
      {...props}
    >
      <i className="absolute w-full h-[0.1rem] bg-monochrome left-0 top-1/2 -translate-y-1/2 rotate-[50deg]" />
      <i className="absolute w-full h-[0.1rem] bg-monochrome left-0 top-1/2 -translate-y-1/2 rotate-[-50deg]" />
    </button>
  );
});

CloseButton.displayName = 'CloseButton';

export { CloseButton };
