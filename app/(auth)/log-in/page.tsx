import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LogInForm } from './LogInForm';

export const metadata: Metadata = { title: 'Log in' };

export default function LogInPage() {
  return (
    // Suspense required because LogInForm reads useSearchParams()
    <Suspense>
      <LogInForm />
    </Suspense>
  );
}
