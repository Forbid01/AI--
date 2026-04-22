'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl md:text-7xl font-black mb-4 text-red-400">!</div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Алдаа гарлаа</h1>
        <p className="text-white/60 mb-8">Тохиолдсон түр зуурын алдаа. Дахин оролдоно уу.</p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors"
        >
          Дахин оролдох
        </button>
      </div>
    </main>
  );
}
