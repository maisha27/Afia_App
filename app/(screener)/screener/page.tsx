import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

export const metadata: Metadata = { title: 'Health Anxiety Screener' };

export default function ScreenerIntroPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-sm text-center">

        <div className="mb-8 flex justify-center">
          <Logo variant="mark" priority />
        </div>

        {/* PLACEHOLDER: pending copy from Hasnain */}
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          [Screener intro headline — pending copy from Hasnain]
        </h1>

        {/* PLACEHOLDER: pending copy from Hasnain */}
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          [Screener intro body — pending copy from Hasnain]
        </p>

        <p className="mt-4 text-sm text-muted-foreground">
          Your answers stay on your device.
        </p>

        {/* PLACEHOLDER: pending copy from Hasnain — estimated time and item count */}
        <p className="mt-1 text-sm text-muted-foreground">
          [14 questions. Takes about 2 minutes. — confirm wording with Hasnain]
        </p>

        <Link
          href="/screener/1"
          className="mt-8 inline-flex min-h-[44px] w-full items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Start
        </Link>

        <p className="mt-6 text-xs text-muted-foreground">
          Not a diagnostic tool. If you are in distress,{' '}
          <Link
            href="/crisis-support"
            className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            find support here
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
