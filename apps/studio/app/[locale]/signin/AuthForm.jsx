'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

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
      if (isSignup) {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, locale }),
        });
        if (!res.ok) throw new Error((await res.json()).error || L('Алдаа', 'Error'));
      }
      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) throw new Error(L('И-мэйл эсвэл нууц үг буруу', 'Invalid email or password'));
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-mid)] grid place-items-center shadow-lg shadow-[var(--accent-soft)] mb-5">
            <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" fill="white" fillOpacity="0.9"/>
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {isSignup
              ? L('Бүртгэл үүсгэх', 'Create your account')
              : L('Тавтай морилно уу', 'Welcome back')}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {isSignup
              ? L('Хэдхэн минутад AI вэбсайтаа бүтээнэ', 'Build your AI website in minutes')
              : L('Вэбсайтуудаа удирдаж үргэлжлүүлэх', 'Continue managing your websites')}
          </p>
        </div>

        {/* Form card */}
        <div className="card p-7">
          <form onSubmit={submit} className="space-y-5">
            {isSignup && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{L('Нэр', 'Name')}</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                  autoComplete="name"
                  placeholder={L('Таны нэр', 'Your name')}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{L('И-мэйл', 'Email')}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field"
                autoComplete="email"
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{L('Нууц үг', 'Password')}</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
                minLength={8}
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
              />
              {isSignup && (
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  {L('8-аас дээш тэмдэгт', 'At least 8 characters')}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-[var(--danger)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent btn-lg w-full"
            >
              {loading
                ? <span className="flex items-center gap-2">
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                    <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white" />
                    {L('Түр хүлээнэ үү...', 'One moment...')}
                  </span>
                : isSignup
                  ? L('Бүртгэл үүсгэх', 'Create account')
                  : L('Нэвтрэх', 'Sign in')}
            </button>
          </form>
        </div>

        <p className="mt-6 text-sm text-[var(--text-tertiary)] text-center">
          {isSignup ? (
            <>
              {L('Аль хэдийн бүртгэлтэй юу?', 'Already have an account?')}{' '}
              <Link href={`/${locale}/signin`} className="text-[var(--accent-light)] hover:text-[var(--accent)] transition-colors">{L('Нэвтрэх', 'Sign in')}</Link>
            </>
          ) : (
            <>
              {L('Бүртгэлгүй юу?', 'No account?')}{' '}
              <Link href={`/${locale}/signup`} className="text-[var(--accent-light)] hover:text-[var(--accent)] transition-colors">{L('Бүртгүүлэх', 'Sign up')}</Link>
            </>
          )}
        </p>
        <p className="mt-3 text-xs text-[var(--text-muted)] text-center max-w-sm mx-auto">
          {L(
            'Үргэлжлүүлснээр та Нууцлалын бодлого, Үйлчилгээний нөхцлийг зөвшөөрч байна.',
            'By continuing you agree to our Terms and Privacy Policy.',
          )}
        </p>
      </div>
    </div>
  );
}
