'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { signUp } from '@/lib/actions/auth';

const schema = z
  .object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

/* ─── Decorative single-ring quatrefoil (outer petals only) ─── */
function CornerQuatrefoil() {
  const size = 440;
  const cx = size / 2;
  const cy = size / 2;
  const R = 148;
  const r = 74;

  function petalPath(angleDeg: number) {
    const a = (angleDeg * Math.PI) / 180;
    const ox = cx + R * Math.cos(a);
    const oy = cy + R * Math.sin(a);
    const a1 = a - Math.PI / 2;
    const a2 = a + Math.PI / 2;
    const c1x = ox + r * Math.cos(a1);
    const c1y = oy + r * Math.sin(a1);
    const c2x = ox + r * Math.cos(a2);
    const c2y = oy + r * Math.sin(a2);
    return `M ${cx} ${cy} Q ${c1x} ${c1y} ${ox} ${oy} Q ${c2x} ${c2y} ${cx} ${cy} Z`;
  }

  const angles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" aria-hidden="true">
      <g stroke="#2F6E7A" strokeWidth="1.2" fill="none">
        {angles.map((a) => (
          <path key={a} d={petalPath(a)} />
        ))}
      </g>
    </svg>
  );
}

/* ─── Decorative reflection-card preview (left column) ─── */
function ReflectionPreview() {
  return (
    <div className="relative mt-8 select-none" aria-hidden="true">
      <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-[18px] bg-white border border-[#E7E2DA] opacity-25" />
      <div className="absolute inset-0 translate-x-1 translate-y-1.5 rounded-[18px] bg-white border border-[#E7E2DA] opacity-50" />
      <div className="relative rounded-[18px] bg-white border border-[#E7E2DA] shadow-[0_16px_40px_-20px_rgba(20,24,22,.18)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.08em] text-[#B26A44]">
            Moderate
          </span>
          <span className="text-[12px] text-[#8A928D]">· 28 / 42</span>
        </div>
        <div
          className="relative h-[6px] rounded-full mb-5 overflow-visible"
          style={{
            background:
              'linear-gradient(90deg, #B7D8C6 0%, #D9E3A8 34%, #EBD3A0 60%, #E3B79A 82%, #DCA394 100%)',
          }}
        >
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-[2.5px] border-[#B26A44] shadow-sm"
            style={{ left: 'calc(68% - 7px)' }}
          />
        </div>
        <p className="text-[13px] text-[#767D79] leading-[1.55]">
          &ldquo;Checking symptoms and seeking reassurance came up most often this week. The worry
          loop is real, but so is your progress.&rdquo;
        </p>
        <div className="mt-4 pt-3.5 border-t border-[#EEE9E1] flex items-center gap-2">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8A928D"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          <span className="text-[12px] text-[#8A928D]">Reflection saved</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Field wrapper ─── */
function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-[#3A403C]">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-[12px] text-[#8A6410]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full bg-[#FBFAF7] border-[1.5px] ${
    hasError ? 'border-[#C99A46]' : 'border-[#E4DFD6]'
  } rounded-[12px] px-[15px] py-[13px] text-[14.5px] text-[#262B29] placeholder:text-[#9AA29C] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors`;
}

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const pendingResult =
        typeof window !== 'undefined'
          ? (JSON.parse(
              sessionStorage.getItem('afia_pending_result') ?? 'null',
            ) as { score: number; band: string; answers?: number[] } | null)
          : null;

      const result = await signUp({
        email: values.email,
        password: values.password,
        score: pendingResult?.score ?? null,
        band: pendingResult?.band ?? null,
        answers: pendingResult?.answers ?? null,
      });

      if (result && 'error' in result) {
        setFormMessage(result.error);
      } else if (result && 'success' in result) {
        sessionStorage.removeItem('afia_pending_result');
        setEmailSent(true);
      }
    });
  };

  /* ── Email-sent success state ── */
  if (emailSent) {
    return (
      <div className="flex-1 relative flex items-center justify-center px-4 py-10">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='60'%3E%3Cpath d='M22 0Q44 0 44 30 44 60 22 60 0 60 0 30 0 0 22 0Z' fill='none' stroke='%232F6E7A' stroke-width='1.5'/%3E%3C/svg%3E\")",
            backgroundSize: '44px 60px',
          }}
        />
        <div className="relative w-full max-w-[392px] bg-white rounded-[22px] border border-[#EDE8E0] shadow-[0_30px_60px_-34px_rgba(30,36,33,0.32)] px-[34px] py-[36px] text-center">
          <div className="mx-auto mb-5 w-[50px] h-[50px] rounded-[14px] bg-[#E3F1EE] flex items-center justify-center">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2F6E7A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2 className="font-heading text-[23px] font-semibold tracking-[-0.02em] text-[#262B29] mb-2">
            Check your email
          </h2>
          <p className="text-[14px] text-[#767D79] leading-[1.6] mb-7">
            We sent a confirmation link to your inbox. Click it to activate your account — your
            private space will be ready.
          </p>
          <Link
            href="/log-in"
            className="text-[13.5px] font-semibold text-[#5F6863] hover:text-[#3A403C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  /* ── Main sign-up layout ── */
  return (
    <div className="flex-1 relative flex flex-col overflow-hidden">
      {/* Corner quatrefoils */}
      <div
        className="pointer-events-none absolute z-0"
        style={{ top: -190, left: -158, transform: 'rotate(-12deg)', opacity: 0.5 }}
        aria-hidden="true"
      >
        <CornerQuatrefoil />
      </div>
      <div
        className="pointer-events-none absolute z-0"
        style={{ bottom: -190, right: -158, transform: 'rotate(-12deg)', opacity: 0.5 }}
        aria-hidden="true"
      >
        <CornerQuatrefoil />
      </div>

      <SiteHeader variant="screener" />

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-[940px] grid grid-cols-1 lg:grid-cols-2 gap-[52px] items-center">

          {/* Left column — reflection preview */}
          <div className="hidden lg:block">
            <p className="text-[13.5px] italic text-[#767D79] mb-3">Keep this with you</p>
            <h2 className="font-heading text-[32px] font-semibold tracking-[-0.025em] text-[#262B29] leading-[1.18] mb-4">
              A private space,<br />just for your mind.
            </h2>
            <p className="text-[14.5px] text-[#565D5A] leading-[1.65]">
              Save today&rsquo;s reflection and pick up the gentle steps that help — all in a space
              only you can see.
            </p>
            <ReflectionPreview />
          </div>

          {/* Right column — form card */}
          <div
            className="w-full bg-white rounded-[20px] border border-[#E7E2DA] px-[32px] py-[34px]"
            style={{ boxShadow: '0 24px 50px -32px rgba(20,24,22,.4)' }}
          >
            {/* Social buttons (visual-only) */}
            <div className="flex gap-2.5 mb-5">
              <button
                type="button"
                aria-label="Continue with Google (coming soon)"
                className="flex-1 flex items-center justify-center gap-2 border border-[#D9E0DA] rounded-[11px] py-[13px] font-heading text-[15px] font-semibold text-[#262B29] hover:bg-[#F7F5F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                aria-label="Continue with Apple (coming soon)"
                className="flex-1 flex items-center justify-center gap-2 border border-[#D9E0DA] rounded-[11px] py-[13px] font-heading text-[15px] font-semibold text-[#262B29] hover:bg-[#F7F5F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Apple
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-[#E7E2DA]" />
              <span className="text-[12.5px] text-[#8A928D]">or use email</span>
              <div className="flex-1 h-px bg-[#E7E2DA]" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              <Field label="Email address" htmlFor="email" error={errors.email?.message}>
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
              </Field>

              <Field label="Password" htmlFor="password" error={errors.password?.message}>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    className={`${inputCls(!!errors.password)} pr-[52px]`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[12.5px] font-semibold text-[#8A928D] hover:text-[#565D5A] transition-colors focus-visible:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </Field>

              <Field
                label="Confirm password"
                htmlFor="confirmPassword"
                error={errors.confirmPassword?.message}
              >
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    className={`${inputCls(!!errors.confirmPassword)} pr-[52px]`}
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[12.5px] font-semibold text-[#8A928D] hover:text-[#565D5A] transition-colors focus-visible:outline-none"
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
              </Field>

              {formMessage && (
                <div
                  className="rounded-[10px] border border-[#EAD8B4] bg-[#FBF1E1] px-3.5 py-2.5 text-[12.5px] text-[#8A5A17]"
                  role="alert"
                >
                  {formMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="mt-1 w-full font-heading text-[16px] font-semibold bg-primary text-white rounded-[12px] px-5 py-[14px] hover:bg-primary/90 disabled:bg-[#D8DED9] disabled:text-[#9AA29C] disabled:cursor-not-allowed transition-colors shadow-[0_10px_24px_-10px_rgba(47,110,122,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isPending ? 'Creating your space…' : 'Create my private space'}
              </button>
            </form>

            <p className="mt-3 text-center text-[12px] text-[#8A928D] leading-[1.55]">
              By creating an account you agree to our{' '}
              <Link
                href="/terms"
                className="underline underline-offset-2 hover:text-[#565D5A] transition-colors"
              >
                Terms
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy"
                className="underline underline-offset-2 hover:text-[#565D5A] transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>

            <p className="mt-3.5 text-center text-[13.5px] text-[#8A928D]">
              Already have a space?{' '}
              <Link
                href="/log-in"
                className="font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
