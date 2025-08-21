'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CancelLayout from './components/CancelLayout';
import { ProgressDots } from './components/ProgressDots';
import { Step1, Step2, Step3, Success } from './components/Steps';

type Variant = 'A'|'B';

export default function Client() {
  const [step, setStep] = useState<1|2|3|4>(1);
  const [variant, setVariant] = useState<Variant>('A');
  const [baseCents, setBaseCents] = useState<number>(2900);
  const [cancellationId, setCancelId] = useState<string>('');
  const [csrf, setCsrf] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [acceptedDownsell, setAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/cancel/session', { cache: 'no-store' });
        const data = await r.json();
        console.log('Session data received:', data);
        
        setVariant(data.variant);
        setBaseCents(data.subscription?.price_cents ?? 2900);
        setCancelId(data.cancellationId);
        setCsrf(data.csrfToken);
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize session:', error);
        setLoading(false);
      }
    })();
  }, []);

  async function finalize(reason: string, acceptDownsell: boolean) {
    console.log('Submitting with:', { cancellationId, acceptDownsell, reason });
    console.log('CSRF token:', csrf);
    console.log('Current state:', { step, variant, baseCents, cancellationId, csrf, reason, acceptedDownsell });

    // Fire-and-forget: attempt API but always route to /cancelled
    try {
      const payload = { cancellationId, acceptDownsell, reason };
      console.log('Payload:', payload);
      const res = await fetch('/api/cancel/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrf },
        body: JSON.stringify(payload),
      });
      console.log('Response status:', res.status);
      if (!res.ok) {
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));
        console.log('Response status text:', res.statusText);
        try {
          const errorData = await res.json();
          console.error('API Error (parsed):', errorData);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          const textError = await res.text();
          console.error('Raw error response:', textError);
        }
      }
    } catch (e) {
      console.error('Submit failed, continuing to cancelled page', e);
    } finally {
      router.push('/cancelled');
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <CancelLayout title="Subscription Cancellation" subtitle={`Step ${Math.min(step,3)} of 3`}>
      <div className="mb-4 flex items-center justify-end">
        <ProgressDots step={Math.min(step,3)} total={3} />
      </div>

      {step === 1 && <Step1 onNext={() => setStep(2)} />}
      {step === 2 && <Step2 onNext={() => setStep(3)} />}
      {step === 3 && (
        <Step3
          baseCents={baseCents}
          variant={variant}
          onSubmit={({ reason, acceptDownsell }) => finalize(reason, acceptDownsell)}
        />
      )}
      {step === 4 && <Success />}
    </CancelLayout>
  );
}


