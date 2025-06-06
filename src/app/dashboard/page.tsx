import { getToken } from '@/actions/token.actions';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge, Calendar, Fingerprint, Mail, Shield, User } from 'lucide-react';
import React from 'react';
import SignOutButton from './sign-out-button';

const DashboardPage = async () => {
  const user = await getToken();
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center space-x-4'>
              <div className='p-2 bg-blue-100 rounded-full'>
                <Fingerprint className='h-6 w-6 text-blue-600' />
              </div>
              <h1 className='text-2xl font-bold text-gray-900'>Dashboard</h1>
            </div>
            <SignOutButton />
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {/* User Profile Card */}
            <Card className='col-span-1 md:col-span-2'>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <User className='h-5 w-5' />
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>Your account details and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center space-x-4 mb-6'>
                  <Avatar className='h-16 w-16'>
                    <AvatarFallback className='text-lg font-semibold'>{user?.displayName}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className='text-xl font-semibold text-gray-900'>{}</h3>
                    <p className='text-gray-600'>{user?.name}</p>
                  </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Mail className='h-5 w-5 text-gray-500' />
                    <div>
                      <p className='text-sm font-medium text-gray-900'>Email</p>
                      <p className='text-sm text-gray-600'>{user?.email ?? 'N/A'}</p>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <Calendar className='h-5 w-5 text-gray-500' />
                    <div>
                      <p className='text-sm font-medium text-gray-900'>Joined</p>
                      <p className='text-sm text-gray-600'>{user?.joinedAt ?? 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Shield className='h-5 w-5' />
                  <span>Security</span>
                </CardTitle>
                <CardDescription>Your account security status</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Biometric Auth</span>
                  <Badge className='bg-green-100 text-green-800'>Active</Badge>
                </div>

                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Account Status</span>
                  <Badge className='bg-blue-100 text-blue-800'>Verified</Badge>
                </div>

                <div className='pt-4 border-t'>
                  <div className='flex items-center space-x-2 text-sm text-gray-600'>
                    <Fingerprint className='h-4 w-4' />
                    <span>Protected by biometric authentication</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Welcome Message Card */}
            <Card className='col-span-1 md:col-span-2 lg:col-span-3'>
              <CardContent className='pt-6'>
                <div className='text-center'>
                  <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome back</h2>
                  <p className='text-gray-600 mb-4'>
                    Your account is secured with passwordless biometric authentication. You can access your account using Face ID, Touch ID, or fingerprint
                    authentication.
                  </p>
                  <div className='flex justify-center space-x-4'>
                    <div className='flex items-center space-x-2 text-sm text-gray-500'>
                      <Shield className='h-4 w-4' />
                      <span>Secure</span>
                    </div>
                    <div className='flex items-center space-x-2 text-sm text-gray-500'>
                      <Fingerprint className='h-4 w-4' />
                      <span>Passwordless</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
