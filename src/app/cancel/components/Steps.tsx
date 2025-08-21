'use client';
import { useState } from 'react';

type NextHandler = (v: Record<string, unknown>) => void;

export function Step1({ onNext }:{onNext:NextHandler}) {
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onNext({});}} className="grid gap-6 md:grid-cols-2">
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Congrats on the new role! 🎉</h2>
        <div className="space-y-4">
          <div>
            <label className="text-base font-semibold text-gray-900 block mb-2">Did you find this job with MigrateMate?</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="radio" name="found" value="yes" className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500" required/>
                <span className="text-gray-700 font-medium">Yes</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="radio" name="found" value="no" className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500" required/>
                <span className="text-gray-700 font-medium">No</span>
              </label>
            </div>
          </div>
          {['How many roles did you apply for through Migrate Mate?','How many companies did you email directly?','How many different companies did you interview with?'].map((q,i)=>(
            <div key={i} className="space-y-3">
              <label className="text-base font-semibold text-gray-900 block">{q}</label>
              <div className="grid grid-cols-2 gap-3">
                {['0','1–5','6–20','20+'].map(v=>(
                  <label key={v} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <input type="radio" name={`q${i}`} value={v} className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500" required/>
                    <span className="text-gray-700 font-medium">{v}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-semibold text-base transition-colors">Continue</button>
      </div>
      <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl md:mt-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-sm font-medium">Job Offer</div>
        </div>
      </div>
    </form>
  );
}

export function Step2({ onNext }:{onNext:NextHandler}) {
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onNext({});}} className="grid gap-6 md:grid-cols-2">
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold text-gray-900">We helped you land the job, now let's help you secure your visa.</h2>
        <div className="space-y-4">
          <div>
            <label className="text-base font-semibold text-gray-900 block mb-2">Is your company providing immigration/legal help to support your visa?</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="radio" name="help" value="yes" className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500" required/>
                <span className="text-gray-700 font-medium">Yes</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input type="radio" name="help" value="no" className="w-4 h-4 text-blue-600 border-2 border-gray-300 focus:ring-blue-500" required/>
                <span className="text-gray-700 font-medium">No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="text-base font-semibold text-gray-900 block mb-2">What visa are you applying for?</label>
            <input name="visa" className="w-full rounded-lg border-2 border-gray-300 p-3 text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="(Optional) e.g., H1B, O1, etc." />
          </div>
        </div>
        <button className="mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-semibold text-base transition-colors">Continue</button>
      </div>
      <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl md:mt-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-sm font-medium">Job Offer</div>
        </div>
      </div>
    </form>
  );
}

export function Step3({ baseCents, variant, onSubmit }:{
  baseCents:number; variant:'A'|'B'; onSubmit:(v:{reason:string; acceptDownsell:boolean})=>void
}) {
  const discounted = variant === 'B' ? baseCents - 1000 : baseCents;
  const [selectedReason, setSelectedReason] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) {
      alert('Please select a reason for cancellation');
      return;
    }
    onSubmit({ reason: selectedReason, acceptDownsell: false });
  };

  const handleDownsell = () => {
    if (!selectedReason) {
      alert('Please select a reason for cancellation first');
      return;
    }
    onSubmit({ reason: selectedReason, acceptDownsell: true });
  };
  
  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold text-gray-900">What's the main reason for cancelling?</h2>
        <div className="space-y-4">
          {['Too expensive','Platform not helpful','Not enough relevant jobs','Decided not to move','Other'].map(v=>(
            <label key={v} className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <input 
                type="radio" 
                name="reason" 
                value={v} 
                checked={selectedReason === v}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500" 
                required
              />
              <span className="text-gray-700 font-medium text-base">{v}</span>
            </label>
          ))}
        </div>

        {variant === 'B' ? (
          <button 
            type="button"
            onClick={handleDownsell}
            className="mt-4 rounded-lg bg-green-600 hover:bg-green-700 px-6 py-3 font-semibold text-white text-base transition-colors w-full"
          >
            Get $10 off — ${ (discounted/100).toFixed(0) } <span className="ml-1 text-white/90 line-through">${ (baseCents/100).toFixed(0) }</span>
          </button>
        ) : (
          <div className="mt-4 rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-600 font-medium bg-gray-50">No special offer available</div>
        )}

        <button type="submit" className="mt-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 px-6 py-3 text-gray-700 font-semibold text-base transition-colors">Complete cancellation</button>
      </div>
      <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl md:mt-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-sm font-medium">Job Offer</div>
        </div>
      </div>
    </form>
  );
}

export function Success() {
  return (
    <div className="grid place-items-center gap-4 p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-2xl">✓</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Cancellation scheduled</h2>
      <p className="max-w-sm text-base text-gray-600">You'll keep access until the end of the current period.</p>
    </div>
  );
}


