'use client';
import Image from 'next/image';
import { PropsWithChildren } from 'react';

export default function CancelLayout({ children, title, subtitle }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <div className="min-h-dvh bg-neutral-50">
      <div className="mx-auto max-w-screen-md p-4 md:py-8">
        <header className="mb-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h1>
            {subtitle && <p className="text-base font-medium text-gray-600">{subtitle}</p>}
          </div>
        </header>
        <main className="rounded-2xl border bg-white p-4 shadow-sm md:p-6">{children}</main>
      </div>
    </div>
  );
}


