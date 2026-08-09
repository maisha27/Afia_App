'use client';

import { useTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signUp } from '@/lib/actions/auth';

const schema = z
  .object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v, {
      message: 'You must accept the terms to create an account.',
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

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
            ) as { score: number; band: string } | null)
          : null;

      const result = await signUp({
        email: values.email,
        password: values.password,
        score: pendingResult?.score ?? null,
        band: pendingResult?.band ?? null,
      });

      if (result && 'error' in result) {
        setFormMessage(result.error);
      } else if (result && 'success' in result) {
        sessionStorage.removeItem('afia_pending_result');
        setEmailSent(true);
      }
      // On redirect (no email confirmation), this code does not run
    });
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          <Logo variant="mark" priority />
        </div>
        <h1 className="font-heading text-xl font-semibold text-foreground">
          Check your email
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We sent a confirmation link to your inbox. Click it to activate your
          account, then come back and log in.
        </p>
        <Link
          href="/log-in"
          className="mt-6 inline-block text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Back to log in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex justify-center">
        <Logo variant="mark" priority />
      </div>

      <h1 className="font-heading text-center text-xl font-semibold text-foreground">
        Create your account
      </h1>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        Free to start. No card required.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
        </Field>

        <Field
          label="Confirm password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Repeat your password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            {...register('confirmPassword')}
          />
        </Field>

        <div className="flex items-start gap-2.5">
          <input
            id="acceptTerms"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-primary focus-visible:ring-2 focus-visible:ring-ring"
            aria-invalid={!!errors.acceptTerms}
            aria-describedby={errors.acceptTerms ? 'terms-error' : undefined}
            {...register('acceptTerms')}
          />
          <label htmlFor="acceptTerms" className="text-xs leading-relaxed text-muted-foreground">
            I agree to the{' '}
            <Link href="/terms" className="font-medium text-primary underline-offset-2 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-primary underline-offset-2 hover:underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>
        {errors.acceptTerms && (
          <p id="terms-error" className="text-xs text-destructive" role="alert">
            {errors.acceptTerms.message}
          </p>
        )}

        {formMessage && (
          <p className="rounded-md bg-destructive/10 px-3 py-2.5 text-xs text-destructive" role="alert">
            {formMessage}
          </p>
        )}

        <Button type="submit" disabled={isPending} size="lg" className="mt-1 w-full">
          {isPending ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/log-in"
          className="font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}

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
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
