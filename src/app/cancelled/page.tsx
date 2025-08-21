'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function CancelledPage() {
  const fallbacks = ['/employee-happy.jpg', '/chrysler.jpg', '/cancel-hero.jpg'];
  const [imgIndex, setImgIndex] = useState(0);
  const activeSrc = fallbacks[imgIndex] ?? '/window.svg';
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-700">Subscription Cancelled</h1>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="text-sm text-gray-600">Completed</span>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Your cancellation’s all sorted, mate, no more charges.</h2>

            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold">M</div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Mihailo Bozic</p>
                  <p className="text-xs text-gray-500">mihailo@migratemate.co</p>
                </div>
              </div>
              <p className="mt-4 text-gray-700">
                I’ll be reaching out soon to help with the visa side of things.
              </p>
              <p className="mt-2 text-gray-600">
                We’ve got your back, whether it’s questions, paperwork, or just figuring out your options.
              </p>
              <p className="mt-2 text-gray-600">Keep an eye on your inbox, I’ll be in touch shortly.</p>
            </div>

            <a href="/" className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 md:w-auto">Finish</a>
          </div>

          <div className="hidden md:block">
            <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image
                src={activeSrc}
                alt="Cancellation confirmation"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
                unoptimized
                onError={() => setImgIndex((i) => Math.min(i + 1, fallbacks.length - 1))}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
