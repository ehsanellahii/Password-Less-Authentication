import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Shield, Smartphone, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-16'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <div className='flex justify-center mb-6'>
            <div className='p-4 bg-blue-600 rounded-full'>
              <Fingerprint className='h-12 w-12 text-white' />
            </div>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-6'>Passwordless Authentication</h1>
          <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
            Secure, fast, and convenient login using Face ID, Touch ID, or fingerprint authentication. No passwords to remember, no security compromises.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button asChild size='lg' className='text-lg px-8 py-3'>
              <Link href='/register'>Get Started</Link>
            </Button>
            <Button asChild variant='outline' size='lg' className='text-lg px-8 py-3'>
              <Link href='/login'>Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          <Card className='text-center'>
            <CardHeader>
              <div className='flex justify-center mb-4'>
                <Shield className='h-10 w-10 text-blue-600' />
              </div>
              <CardTitle>Ultra Secure</CardTitle>
              <CardDescription>Biometric authentication provides bank-level security that&apos;s unique to you</CardDescription>
            </CardHeader>
          </Card>

          <Card className='text-center'>
            <CardHeader>
              <div className='flex justify-center mb-4'>
                <Zap className='h-10 w-10 text-green-600' />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>Sign in instantly with just a touch or glance - no typing required</CardDescription>
            </CardHeader>
          </Card>

          <Card className='text-center'>
            <CardHeader>
              <div className='flex justify-center mb-4'>
                <Smartphone className='h-10 w-10 text-purple-600' />
              </div>
              <CardTitle>Device Native</CardTitle>
              <CardDescription>Works seamlessly with Face ID, Touch ID, and fingerprint sensors</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it Works */}
        <Card className='max-w-4xl mx-auto'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl'>How It Works</CardTitle>
            <CardDescription>Simple, secure authentication in three steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              <div className='text-center'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-blue-600 font-bold text-lg'>1</span>
                </div>
                <h3 className='font-semibold mb-2'>Register</h3>
                <p className='text-gray-600 text-sm'>Create your account and set up biometric authentication</p>
              </div>

              <div className='text-center'>
                <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-green-600 font-bold text-lg'>2</span>
                </div>
                <h3 className='font-semibold mb-2'>Authenticate</h3>
                <p className='text-gray-600 text-sm'>Use your fingerprint, Face ID, or Touch ID to verify</p>
              </div>

              <div className='text-center'>
                <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-purple-600 font-bold text-lg'>3</span>
                </div>
                <h3 className='font-semibold mb-2'>Access</h3>
                <p className='text-gray-600 text-sm'>Instantly access your secure account dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
