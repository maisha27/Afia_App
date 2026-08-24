'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { resetPassword } from '@/lib/actions/auth';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
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

export function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await resetPassword({ password: values.password });
      if (result && 'error' in result) setFormMessage(result.error);
      // On success, Server Action redirects to /log-in?reset=1
    });
  };

  return (
    <div className="flex-1 relative flex items-center justify-center px-4 py-10">
      {/* Tile background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={TILE_BG} />

      {/* Card */}
      <div
        className="relative w-full max-w-[452px] bg-white rounded-[22px] border border-[#EDE8E0] px-10 pt-10 pb-[38px]"
        style={{ boxShadow: '0 30px 60px -34px rgba(30,36,33,0.35)' }}
      >
        {/* Lock icon */}
        <div className="mx-auto mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-[15px] bg-[#E3F1EE]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2F6E7A"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        <h1 className="font-heading text-center text-[25px] font-semibold tracking-[-0.02em] text-[#262B29] mb-2">
          Choose a new password
        </h1>
        <p className="text-center text-[14.5px] text-[#767D79] leading-[1.55] mb-7">
          Pick something you&rsquo;ll remember. This replaces your old password for good.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          {/* New password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[13px] font-semibold text-[#3A403C] mb-1.5"
            >
              New password
            </label>
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

          {/* Confirm password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[13px] font-semibold text-[#3A403C] mb-1.5"
            >
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your new password"
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                className={`${inputCls(!!errors.confirmPassword)} pr-[52px]`}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[12.5px] font-semibold text-[#6E7672] hover:text-[#565D5A] transition-colors focus-visible:outline-none"
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="mt-1 text-[12px] text-[#8A6410]"
                role="alert"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Password hint */}
          <p className="text-[12px] text-[#6E7672]">
            Use at least 8 characters — a mix of letters and numbers works well.
          </p>

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
            className="mt-1 w-full font-heading text-[16px] font-semibold bg-primary text-white rounded-[12px] px-5 py-[14px] hover:bg-primary/90 disabled:bg-[#D8DED9] disabled:text-[#9AA29C] disabled:cursor-not-allowed transition-colors shadow-[0_10px_24px_-10px_rgba(47,110,122,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {isPending ? 'Updating password…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}
