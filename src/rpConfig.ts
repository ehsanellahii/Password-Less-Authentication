export function getRpConfig(req: any) {
  const host = req?.headers?.get?.('host') || req?.headers?.host || '';

  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  const rpID = isLocal ? 'localhost' : 'password-less-auth.vercel.app';
  const expectedOrigin = isLocal ? 'http://localhost:3000' : 'https://password-less-auth.vercel.app';

  return { rpID, expectedOrigin };
}
