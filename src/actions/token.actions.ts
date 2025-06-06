'use server';
import { cookies } from 'next/headers';

const TOKEN_NAME = 'userSession';

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) {
    return null;
  }
  try {
    const parsedToken = JSON.parse(token);
    return parsedToken;
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}
export async function deleteToken() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
  console.log('Token deleted successfully');
  return true;
}

export async function setToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
}
