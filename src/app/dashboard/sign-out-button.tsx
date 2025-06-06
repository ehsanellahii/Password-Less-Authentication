'use client';
import { useRouter } from 'next/navigation';
import { deleteToken } from '@/actions/token.actions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import React from 'react';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await deleteToken();
    router.push('/login');
  };

  return (
    <Button onClick={handleSignOut} variant='outline' className='flex items-center space-x-2'>
      <LogOut className='h-4 w-4' />
      <span>Logout</span>
    </Button>
  );
};

export default SignOutButton;
