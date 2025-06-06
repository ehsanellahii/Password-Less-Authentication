// lib/sessionOptions.js
export const sessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD!, // Must be 32+ characters
  cookieName: process.env.IRON_SESSION_COOKIE || 'mednext_iron_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/', // 👈 ensures it's sent for all routes
  },
};
