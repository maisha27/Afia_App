'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScreener } from './ScreenerProvider';
import type { ScoreResult } from '@/lib/scoring';
import { cn } from '@/lib/utils';

const DISCLAIMERS = [
  'This is a self-reflection tool, not a medical or psychological diagnosis.',
  'Results are based on your self-reported responses and are intended to help you understand your patterns, not to confirm or rule out any condition.',
  'If you are in distress or crisis, please contact a healthcare professional or your local crisis service immediately.',
  'Afia is a self-help platform. It is not a substitute for professional medical or psychological care.',
] as const;

export function ResultView() {
  const { isComplete, getResult } = useScreener();
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const announcerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isComplete) {
      router.replace('/screener');
      return;
    }

    const computed = getResult();
    const timer = setTimeout(() => {
      setResult(computed);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [isComplete, getResult, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center px-4">
        <p
          ref={announcerRef}
          role="status"
          aria-live="polite"
          className="text-muted-foreground text-sm"
        >
          Reviewing your responses...
        </p>
        <div
          aria-hidden
          className="mt-4 h-8 w-8 rounded-full border-2 border-accent border-t-primary animate-spin motion-reduce:animate-none"
        />
      </main>
    );
  }

  if (!result) return null;

  return (
    <main className="mx-auto min-h-screen w-full max-w-lg px-4 py-12 sm:px-6">

      {/* Band label */}
      <div className="mb-6 flex items-center gap-2">
        <span
          className={cn(
            'inline-block rounded-full border border-accent bg-tint px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-deep',
          )}
          aria-label={`Result: ${result.band}`}
        >
          {result.band}
        </span>
      </div>

      {/* Interpretation */}
      <h1 className="font-heading text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
        Your result
      </h1>
      <p className="mt-4 text-base leading-relaxed text-foreground/90">
        {result.interpretation}
      </p>

      {/* Bridge + CTA */}
      <div className="mt-8 rounded-xl border border-accent bg-tint/50 px-5 py-5">
        {/* PLACEHOLDER: pending copy from Hasnain */}
        <p className="text-sm text-muted-foreground italic">
          [Bridge message: what Afia can help you work on, based on your pattern — pending copy from Hasnain]
        </p>
        <SignUpCta score={result.score} band={result.band} />
      </div>

      {/* Disclaimers */}
      <section aria-label="Important notes" className="mt-8">
        <h2 className="sr-only">Important notes</h2>
        <ul className="flex flex-col gap-3">
          {DISCLAIMERS.map((text) => (
            <li
              key={text}
              className="flex gap-2.5 text-xs leading-relaxed text-muted-foreground"
            >
              <span aria-hidden className="mt-0.5 shrink-0 text-mid">
                &bull;
              </span>
              {text}
            </li>
          ))}
        </ul>
      </section>

      {/* Crisis support */}
      <p className="mt-8 text-xs text-muted-foreground">
        If you are in distress right now,{' '}
        <Link
          href="/crisis-support"
          className="font-medium text-primary underline underline-offset-2 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          find support here
        </Link>
        .
      </p>
    </main>
  );
}

function SignUpCta({ score, band }: { score: number; band: string }) {
  const router = useRouter();

  const handleClick = () => {
    try {
      sessionStorage.setItem('afia_pending_result', JSON.stringify({ score, band }));
    } catch {
      // sessionStorage unavailable (private browsing, etc.) — sign-up still works, result just won't be saved automatically
    }
    router.push('/sign-up');
  };

  return (
    <button
      onClick={handleClick}
      className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-md bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex sm:w-auto"
    >
      Get started free
    </button>
  );
}
