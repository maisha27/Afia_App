'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { forgotPassword } from '@/lib/actions/auth';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
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

export function ForgotPasswordForm() {
  const reduced = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      await forgotPassword(values);
      setSubmittedEmail(values.email);
      setSent(true);
    });
  };

  const handleResend = () => {
    setSent(false);
  };

  return (
    <div className="flex-1 relative flex items-center justify-center px-4 py-10">
      {/* Tile background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={TILE_BG} />

      <AnimatePresence mode="wait">
      {sent ? (
        /* ── Success state ── */
        <motion.div
          key="sent"
          className="relative w-full max-w-[392px] bg-white rounded-[22px] border border-[#EDE8E0] px-[34px] py-[36px] text-center"
          style={{ boxShadow: '0 30px 60px -34px rgba(30,36,33,0.32)' }}
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -10 }}
          transition={{ duration: 0.38, ease: [0.25, 0, 0.15, 1] }}
        >
          <div className="mx-auto mb-5 flex h-[50px] w-[50px] items-center justify-center rounded-[14px] bg-[#E3F1EE]">
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
            If an account exists for{' '}
            <span className="font-medium text-[#3A403C]">{submittedEmail}</span>, we&rsquo;ve sent
            a link to reset your password. It may take a minute to arrive.
          </p>

          <a
            href="mailto:"
            className="mb-4 inline-flex w-full items-center justify-center rounded-[12px] bg-[#F1EEE9] px-5 py-[13px] font-heading text-[15px] font-semibold text-[#3F463F] hover:bg-[#E8E4DE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open your email app
          </a>

          <button
            type="button"
            onClick={handleResend}
            className="text-[13px] font-semibold text-[#5F6863] hover:text-[#3A403C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Didn&rsquo;t get it? Send again
          </button>
        </motion.div>
      ) : (
        /* ── Input state ── */
        <motion.div
          key="form"
          className="relative w-full max-w-[392px] bg-white rounded-[22px] border border-[#EDE8E0] px-[34px] py-[36px]"
          style={{ boxShadow: '0 30px 60px -34px rgba(30,36,33,0.32)' }}
          initial={{ opacity: 0, y: reduced ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : -10 }}
          transition={{ duration: 0.45, ease: [0.25, 0, 0.15, 1] }}
        >
          <div className="mb-5 flex h-[50px] w-[50px] items-center justify-center rounded-[14px] bg-[#E3F1EE]">
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          </div>

          <h2 className="font-heading text-[23px] font-semibold tracking-[-0.02em] text-[#262B29] mb-2">
            Reset your password
          </h2>
          <p className="text-[14px] text-[#767D79] leading-[1.6] mb-6">
            Enter your email and we&rsquo;ll send you a link to set a new one.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full font-heading text-[16px] font-semibold bg-primary text-white rounded-[12px] px-5 py-[14px] hover:bg-primary/90 disabled:bg-[#D8DED9] disabled:text-[#9AA29C] disabled:cursor-not-allowed transition-colors shadow-[0_10px_24px_-10px_rgba(47,110,122,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isPending ? 'Sending…' : 'Send reset link'}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href="/log-in"
              className="text-[13.5px] font-semibold text-[#5F6863] hover:text-[#3A403C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Back to log in
            </Link>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
