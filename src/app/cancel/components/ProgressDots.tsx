export function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className={`h-2 w-2 rounded-full ${i < step ? 'bg-emerald-600' : 'bg-neutral-300'}`} />
      ))}
    </div>
  );
}


