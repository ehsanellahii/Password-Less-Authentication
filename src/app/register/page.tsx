'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// 6. Frontend Registration Component - components/WebAuthnRegister.tsx
import { startRegistration } from '@simplewebauthn/browser';
import { AlertCircle, CheckCircle, Fingerprint, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WebAuthnRegister() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    setStatus('');
    setLoading(true);
    setStatus('Starting registration...');

    try {
      // Get registration options from server
      const response = await fetch('/api/auth/register/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName: name }),
      });

      const options = await response.json();

      if (!response.ok) {
        console.log('Failed to get registration options:', await response.json());
        throw new Error(options.error || 'Failed to get registration options');
      }

      setStatus('Please use your authenticator...');

      // Start WebAuthn registration
      const credential = await startRegistration(options);

      setStatus('Verifying registration...');

      // Verify registration with server
      const verifyResponse = await fetch('/api/auth/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName: name, credential }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.verified) {
        setStatus('Registration successful! You can now log in.');
        router.push('/login');
      } else {
        setError(`Registration failed: ${verifyResult.error}`);
      }
    } catch (error: any) {
      console.log('Registration error:', error);
      setError(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1 text-center'>
          <div className='flex justify-center mb-4'>
            <div className='p-3 bg-blue-100 rounded-full'>
              <Fingerprint className='h-8 w-8 text-blue-600' />
            </div>
          </div>
          <CardTitle className='text-2xl font-bold'>Create Account</CardTitle>
          <CardDescription>Register with your biometric authentication (Face ID, Touch ID, or Fingerprint)</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className='space-y-4'
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <div className='relative'>
                <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input id='name' type='text' placeholder='Enter your full name' value={name} onChange={(e) => setName(e.target.value)} className='pl-10' required />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input id='email' type='email' placeholder='Enter your email' value={username} onChange={(e) => setUsername(e.target.value)} className='pl-10' required />
              </div>
            </div>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <div className='flex items-center space-x-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  <span>Setting up biometric...</span>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <Fingerprint className='h-4 w-4' />
                  <span>Register with Biometric</span>
                </div>
              )}
            </Button>
            {(status || error) && (
              <Alert className={error ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                {error ? <AlertCircle className='h-4 w-4 text-red-600' /> : <CheckCircle className='h-4 w-4 text-green-600' />}
                <AlertDescription className={error ? 'text-red-800' : 'text-green-800'}>{error || status}</AlertDescription>
              </Alert>
            )}
            <div className='text-center text-sm text-gray-600'>
              Already have an account?{' '}
              <Link href='/login' className='text-blue-600 hover:text-blue-500 font-medium'>
                Sign in here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
