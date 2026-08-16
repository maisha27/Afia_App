'use client';

import { useState, useTransition } from 'react';
import { adminLogin } from '@/lib/actions/admin';

export function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await adminLogin({ email, password });
      if (result?.error) setError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]" noValidate>
      <div className="flex flex-col gap-[7px]">
        <label htmlFor="admin-email" className="text-[12.5px] font-semibold" style={{ color: '#7FB3A6' }}>
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@afia.me"
          autoComplete="email"
          required
          disabled={isPending}
          className="rounded-[10px] px-[14px] py-[12px] text-[14.5px] outline-none transition-colors placeholder:text-[#4E5E59] focus:border-[#4A786E] disabled:opacity-60"
          style={{ background: '#1B2523', border: '1.5px solid #38463F', color: '#EAF3EF' }}
        />
      </div>

      <div className="flex flex-col gap-[7px]">
        <label htmlFor="admin-password" className="text-[12.5px] font-semibold" style={{ color: '#7FB3A6' }}>
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          required
          disabled={isPending}
          className="rounded-[10px] px-[14px] py-[12px] text-[14.5px] outline-none transition-colors placeholder:text-[#4E5E59] focus:border-[#4A786E] disabled:opacity-60"
          style={{ background: '#1B2523', border: '1.5px solid #38463F', color: '#EAF3EF' }}
        />
      </div>

      {error && (
        <div
          className="rounded-[9px] px-[12px] py-[10px] text-[13px]"
          style={{ background: 'rgba(176,80,63,.15)', border: '1px solid rgba(176,80,63,.35)', color: '#E8A898' }}
          role="alert"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="font-heading text-[15.5px] font-semibold text-white rounded-[10px] py-[14px] mt-[4px] transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        style={{ background: '#2F7A6D' }}
      >
        {isPending ? 'Signing in…' : 'Log in'}
      </button>
    </form>
  );
}
