'use client';
import { startAuthentication } from '@simplewebauthn/browser';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Fingerprint, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setToken } from '@/actions/token.actions';

export default function WebAuthnLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    setStatus('');

    setLoading(true);
    setStatus('Starting authentication...');

    try {
      // Get authentication options from server
      const response = await fetch('/api/auth/login/begin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const options = await response.json();
      console.log('Authentication options:', options);
      if (!response.ok) {
        throw new Error(options.error || 'Failed to get authentication options');
      }

      setStatus('Please use your authenticator...');
      console.log('Authentication options:', options);
      // Start WebAuthn authentication
      const credential = await startAuthentication(options);
      console.log('Credential received:', credential);
      setStatus('Verifying authentication...');

      // Verify authentication with server
      const verifyResponse = await fetch('/api/auth/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, credential }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.verified) {
        setStatus('Login successful!');
        // Redirect or update app state
        await setToken(JSON.stringify(verifyResult.user));
        router.push('/dashboard');
      } else {
        setError(`Login failed: ${verifyResult.error}`);
      }
    } catch (error: any) {
      setError(`Login failed: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1 text-center'>
          <div className='flex justify-center mb-4'>
            <div className='p-3 bg-green-100 rounded-full'>
              <Fingerprint className='h-8 w-8 text-green-600' />
            </div>
          </div>
          <CardTitle className='text-2xl font-bold'>Welcome Back</CardTitle>
          <CardDescription>Sign in using your biometric authentication (Face ID, Touch ID, or Fingerprint)</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <div className='relative'>
                <Mail className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input id='email' type='email' placeholder='Enter your email' value={username} onChange={(e) => setUsername(e.target.value)} className='pl-10' required />
              </div>
            </div>

            {(status || error) && (
              <Alert className={error ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                {error ? <AlertCircle className='h-4 w-4 text-red-600' /> : <CheckCircle className='h-4 w-4 text-green-600' />}
                <AlertDescription className={error ? 'text-red-800' : 'text-green-800'}>{error || status}</AlertDescription>
              </Alert>
            )}

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <div className='flex items-center space-x-2'>
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <Fingerprint className='h-4 w-4' />
                  <span>Sign in with Biometric</span>
                </div>
              )}
            </Button>

            <div className='text-center text-sm text-gray-600'>
              {"Don't have an account?"}{' '}
              <Link href='/register' className='text-blue-600 hover:text-blue-500 font-medium'>
                Register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
