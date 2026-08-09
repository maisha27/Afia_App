'use client';

import { useTransition, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { logIn } from '@/lib/actions/auth';

const schema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Please enter your password.'),
});

type FormValues = z.infer<typeof schema>;

export function LogInForm() {
  const [isPending, startTransition] = useTransition();
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

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
    <div className="w-full max-w-sm">
      <div className="mb-6 flex justify-center">
        <Logo variant="mark" priority />
      </div>

      <h1 className="font-heading text-center text-xl font-semibold text-foreground">
        Welcome back
      </h1>

      {passwordWasReset && (
        <p className="mt-3 rounded-md bg-success-surface px-3 py-2.5 text-center text-xs text-success" role="status">
          Password updated. You can now log in with your new password.
        </p>
      )}

      {linkExpired && (
        <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2.5 text-center text-xs text-destructive" role="alert">
          That link has expired or is invalid. Please request a new one.
        </p>
      )}

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
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
        </Field>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Forgot password?
          </Link>
        </div>

        {formMessage && (
          <p className="rounded-md bg-destructive/10 px-3 py-2.5 text-xs text-destructive" role="alert">
            {formMessage}
          </p>
        )}

        <Button type="submit" disabled={isPending} size="lg" className="w-full">
          {isPending ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don't have an account?{' '}
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Sign up free
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
