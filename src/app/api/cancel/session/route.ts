import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sbForUser } from '@/lib/supabase-server';
import { pickVariant } from '@/lib/ab';
import { CANCEL_COOKIE_NAME, CSRF_COOKIE_NAME, JWT_COOKIE_NAME } from '@/lib/cookies';
import { createCsrfToken } from '@/lib/csrf';

export async function GET() {
  console.log('=== SESSION API CALLED ===');
  const cookieStore = await cookies();
  console.log('Available cookies:', cookieStore.getAll().map(c => ({ name: c.name, value: c.value })));
  console.log('JWT cookie value:', cookieStore.get(JWT_COOKIE_NAME)?.value);
  console.log('MOCK_USER_ID env var:', process.env.MOCK_USER_ID);
  
  const userId = cookieStore.get(JWT_COOKIE_NAME)?.value || process.env.MOCK_USER_ID || '550e8400-e29b-41d4-a716-446655440001';
  console.log('Final User ID:', userId);
  const sb = sbForUser(userId);

  // For now, return mock data if database is not set up
  const mockSubscription = {
    id: 'mock-sub-id',
    monthly_price: 2900,
    status: 'active'
  };

  try {
    const { data: sub, error: subErr } = await sb
      .from('subscriptions')
      .select('id, monthly_price, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    
    if (subErr) {
      console.log('Database error, using mock data:', subErr.message);
      // Return mock data instead of error
    } else if (sub) {
      mockSubscription.id = sub.id;
      mockSubscription.monthly_price = sub.monthly_price;
      mockSubscription.status = sub.status;
    }
  } catch (error) {
    console.log('Database connection failed, using mock data');
  }

  let cancelId = cookieStore.get(CANCEL_COOKIE_NAME)?.value || null;
  let variant: 'A' | 'B' | null = null;

  // Generate a mock cancellation ID if database is not available
  if (!cancelId) {
    variant = pickVariant();
    cancelId = `mock-cancel-${Date.now()}`;
  } else {
    // Try to get variant from database, fallback to mock
    try {
      const { data } = await sb.from('cancellations').select('id, downsell_variant').eq('id', cancelId).maybeSingle();
      if (data) variant = data.downsell_variant as 'A' | 'B';
      else variant = pickVariant();
    } catch (error) {
      variant = pickVariant();
    }
  }

  if (!cancelId) {
    return NextResponse.json({ error: 'Failed to initialize cancellation session' }, { status: 500 });
  }
  const csrf = createCsrfToken(cancelId);
  console.log('Setting cookies:', { cancelId, csrf });
  
  const res = NextResponse.json({
    cancellationId: cancelId,
    variant,
    subscription: { price_cents: mockSubscription.monthly_price },
    csrfToken: csrf,
  });
  
  res.cookies.set(CANCEL_COOKIE_NAME, cancelId, { httpOnly: true, sameSite: 'lax', path: '/' });
  res.cookies.set(CSRF_COOKIE_NAME, csrf, { httpOnly: false, sameSite: 'lax', path: '/' });
  
  console.log('Response cookies set:', {
    cancel: res.cookies.get(CANCEL_COOKIE_NAME)?.value,
    csrf: res.cookies.get(CSRF_COOKIE_NAME)?.value
  });
  
  return res;
}


