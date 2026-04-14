'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthForm({ locale, mode }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const L = (mn, en) => (locale === 'mn' ? mn : en);
  const isSignup = mode === 'signup';

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/${isSignup ? 'signup' : 'signin'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, locale }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Алдаа');
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold">{isSignup ? L('Бүртгүүлэх', 'Sign up') : L('Нэвтрэх', 'Sign in')}</h1>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {isSignup && (
          <label className="block">
            <span className="text-sm font-medium">{L('Нэр', 'Name')}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-md border border-black/15 bg-white"
            />
          </label>
        )}
        <label className="block">
          <span className="text-sm font-medium">{L('И-мэйл', 'Email')}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-md border border-black/15 bg-white"
            required
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">{L('Нууц үг', 'Password')}</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-md border border-black/15 bg-white"
            required
            minLength={8}
          />
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2.5 rounded-md bg-black text-white font-medium disabled:opacity-50"
        >
          {loading ? '...' : isSignup ? L('Бүртгүүлэх', 'Sign up') : L('Нэвтрэх', 'Sign in')}
        </button>
      </form>

      <p className="mt-6 text-sm text-center opacity-70">
        {isSignup ? (
          <>
            {L('Аль хэдийн бүртгэлтэй юу?', 'Already have an account?')}{' '}
            <Link href={`/${locale}/signin`} className="underline">{L('Нэвтрэх', 'Sign in')}</Link>
          </>
        ) : (
          <>
            {L('Бүртгэлгүй юу?', 'No account?')}{' '}
            <Link href={`/${locale}/signup`} className="underline">{L('Бүртгүүлэх', 'Sign up')}</Link>
          </>
        )}
      </p>
    </div>
  );
}
