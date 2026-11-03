'use client';

import { useTransition, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Logo } from '@/components/brand/Logo';
import { logIn } from '@/lib/actions/auth';
import { createClient } from '@/lib/supabase/client';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
});

type FormValues = z.infer<typeof schema>;

const TILE_BG = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='60'%3E%3Cpath d='M22 0Q44 0 44 30 44 60 22 60 0 60 0 30 0 0 22 0Z' fill='none' stroke='%232F6E7A' stroke-width='1.5'/%3E%3C/svg%3E\")",
  backgroundSize: '44px 60px',
};

function inputCls(hasError: boolean) {
  return `w-full bg-[#FBFAF7] border-[1.5px] ${
    hasError ? 'border-[#C99A46]' : 'border-[#E4DFD6]'
  } rounded-[12px] px-[15px] py-[13px] text-[14.5px] text-[#262B29] placeholder:text-[#9AA29C] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors`;
}

export function LogInForm() {
  const reduced = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const searchParams = useSearchParams();

  const handleGoogleSignIn = async () => {
    setGooglePending(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/plan`,
      },
    });
  };

  const passwordWasReset = searchParams.get('reset') === '1';
  const linkExpired = searchParams.get('error') === 'link-expired';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await logIn(values);
      if (result && 'error' in result) setFormMessage(result.error);
    });
  };

  return (
    <div className="flex-1 relative flex items-center justify-center px-4 py-10">
      {/* Tile background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={TILE_BG} />

      {/* Card */}
      <motion.div
        className="relative w-full max-w-[452px] bg-white rounded-[22px] border border-[#EDE8E0] px-10 pt-10 pb-[34px]"
        style={{ boxShadow: '0 30px 60px -34px rgba(30,36,33,0.35)' }}
        initial={{ opacity: 0, y: reduced ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0, 0.15, 1] }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Logo variant="mark" href="/" priority />
        </div>

        <h1 className="font-heading text-center text-[25px] font-semibold tracking-[-0.02em] text-[#262B29] mb-1.5">
          Welcome back
        </h1>
        <p className="text-center text-[14.5px] text-[#767D79] leading-[1.55] mb-6">
          Your plan and everything you&rsquo;ve written are right where you left them.
        </p>

        {/* Status banners */}
        {passwordWasReset && (
          <div
            className="mb-5 rounded-[10px] border border-[#C3DFC9] bg-[#EAF4EC] px-3.5 py-2.5 text-center text-[12.5px] text-[#2E6B40]"
            role="status"
          >
            Password updated. You can now log in with your new password.
          </div>
        )}
        {linkExpired && (
          <div
            className="mb-5 rounded-[10px] border border-[#F0D0CE] bg-[#FBEAE9] px-3.5 py-2.5 text-center text-[12.5px] text-[#8A2F2D]"
            role="alert"
          >
            That link has expired or is invalid. Please request a new one.
          </div>
        )}

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googlePending || isPending}
          aria-label="Continue with Google"
          className="w-full flex items-center justify-center gap-2 border border-[#D9E0DA] rounded-[11px] py-[13px] mb-4 font-heading text-[15px] font-semibold text-[#262B29] hover:bg-[#F7F5F2] disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {googlePending ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#E7E2DA]" />
          <span className="text-[12.5px] text-[#6E7672]">or use email</span>
          <div className="flex-1 h-px bg-[#E7E2DA]" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[13px] font-semibold text-[#3A403C] mb-1.5"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={inputCls(!!errors.email)}
              {...register('email')}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-[12px] text-[#8A6410]" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password + show toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-[13px] font-semibold text-[#3A403C] mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Your password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                className={`${inputCls(!!errors.password)} pr-[52px]`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[12.5px] font-semibold text-[#6E7672] hover:text-[#565D5A] transition-colors focus-visible:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1 text-[12px] text-[#8A6410]" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="flex justify-end -mt-1">
            <Link
              href="/forgot-password"
              className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Forgot password?
            </Link>
          </div>

          {/* Form-level error */}
          {formMessage && (
            <div
              className="rounded-[10px] border border-[#F0D0CE] bg-[#FBEAE9] px-3.5 py-2.5 text-[12.5px] text-[#8A2F2D]"
              role="alert"
            >
              {formMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full font-heading text-[16px] font-semibold bg-primary text-white rounded-[12px] px-5 py-[14px] hover:bg-primary/90 disabled:bg-[#D8DED9] disabled:text-[#9AA29C] disabled:cursor-not-allowed transition-colors shadow-[0_10px_24px_-10px_rgba(47,110,122,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isPending ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-5 text-center text-[13.5px] text-[#6E7672]">
          New to Afia?{' '}
          <Link
            href="/screener"
            className="font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Take the free test
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
