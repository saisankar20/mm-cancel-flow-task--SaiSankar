import crypto from 'crypto';
const secret = Buffer.from(process.env.CSRF_SECRET || 'dev');

export function createCsrfToken(sessionId: string) {
  const ts = Date.now().toString();
  const h = crypto.createHmac('sha256', secret).update(sessionId + '|' + ts).digest('hex');
  return `${ts}.${h}`;
}
export function verifyCsrfToken(sessionId: string, token?: string | null) {
  if (!token) return false;
  const [ts, h] = token.split('.');
  if (!ts || !h) return false;
  if (Date.now() - Number(ts) > 2 * 60 * 60 * 1000) return false;
  const expected = crypto.createHmac('sha256', secret).update(sessionId + '|' + ts).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(h), Buffer.from(expected));
}
