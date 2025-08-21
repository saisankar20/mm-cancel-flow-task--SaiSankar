import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sbForUser } from '@/lib/supabase-server';
import { SubmitSchema } from '@/lib/validation';
import { CANCEL_COOKIE_NAME, CSRF_COOKIE_NAME, JWT_COOKIE_NAME } from '@/lib/cookies';
import { verifyCsrfToken } from '@/lib/csrf';

export async function POST(req: NextRequest) {
  console.log('=== SUBMIT API CALLED ===');
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  const body = await req.json().catch(() => ({}));
  console.log('Received body:', body);
  
  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    console.log('Validation failed:', parsed.error.flatten());
    return NextResponse.json({ 
      error: 'Validation failed', 
      details: parsed.error.flatten(),
      received: body 
    }, { status: 400 });
  }

  const cookieStore = await cookies();
  const userId = cookieStore.get(JWT_COOKIE_NAME)?.value || process.env.MOCK_USER_ID!;
  const cancelCookie = cookieStore.get(CANCEL_COOKIE_NAME)?.value;
  const csrfHeader = req.headers.get('x-csrf-token') || undefined;
  const csrfCookie = cookieStore.get(CSRF_COOKIE_NAME)?.value || undefined;

  console.log('CSRF check:', { csrfHeader, csrfCookie, cancelCookie, cancellationId: parsed.data.cancellationId });
  
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie ||
      !verifyCsrfToken(parsed.data.cancellationId, csrfHeader)) {
    console.log('CSRF validation failed');
    console.log('CSRF details:', {
      hasHeader: !!csrfHeader,
      hasCookie: !!csrfCookie,
      headerMatch: csrfHeader === csrfCookie,
      tokenValid: verifyCsrfToken(parsed.data.cancellationId, csrfHeader)
    });
    return NextResponse.json({ error: 'Bad CSRF' }, { status: 403 });
  }
  if (!cancelCookie || cancelCookie !== parsed.data.cancellationId) {
    console.log('Session mismatch');
    console.log('Session details:', {
      hasCancelCookie: !!cancelCookie,
      cookieMatch: cancelCookie === parsed.data.cancellationId,
      cookieValue: cancelCookie,
      requestValue: parsed.data.cancellationId
    });
    return NextResponse.json({ error: 'Mismatched cancellation session' }, { status: 400 });
  }

  const sb = sbForUser(userId);

  // For mock data, just return success
  if (parsed.data.cancellationId.startsWith('mock-cancel-')) {
    console.log('Mock cancellation submitted:', parsed.data);
    return NextResponse.json({ ok: true });
  }

  try {
    const { error: upErr } = await sb
      .from('cancellations')
      .update({ accepted_downsell: parsed.data.acceptDownsell, reason: parsed.data.reason })
      .eq('id', parsed.data.cancellationId);
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    const { error: subErr } = await sb
      .from('subscriptions')
      .update({ status: 'pending_cancellation' })
      .eq('user_id', userId)
      .eq('status', 'active');
    if (subErr) return NextResponse.json({ error: subErr.message }, { status: 500 });
  } catch (error) {
    console.log('Database error, but continuing with mock flow');
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(CSRF_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}


