import { createClient } from '@supabase/supabase-js';
import { signUserJwt } from './jwt';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function sbForUser(userId: string) {
  const token = signUserJwt(userId);
  return createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}


