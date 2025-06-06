export function getRpConfig(req: any) {
  const host = req?.headers?.get?.('host') || req?.headers?.host || '';

  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  const rpID = isLocal ? 'localhost' : process.env.NEXT_PUBLIC_RP_ID || 'password-less-authentication.vercel.app';
  const expectedOrigin = isLocal ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_RP_ORIGIN || 'https://password-less-authentication.vercel.app';

  return { rpID, expectedOrigin };
}
