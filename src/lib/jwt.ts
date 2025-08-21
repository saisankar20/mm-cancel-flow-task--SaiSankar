import jwt from 'jsonwebtoken';

export function signUserJwt(userId: string) {
  const secret = process.env.JWT_SECRET || 'super-secret-jwt-token-with-at-least-32-characters-long';
  const payload = { sub: userId, role: 'authenticated', iss: 'supabase', aud: 'authenticated' };
  return jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: '2h' });
}


