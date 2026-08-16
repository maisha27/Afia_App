'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ReaderError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center"
      style={{ background: '#FAF8F5' }}
    >
      <span className="flex w-[52px] h-[52px] rounded-[15px] bg-[#F3EEE6] items-center justify-center mb-5">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B26A44"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" />
        </svg>
      </span>

      <h2 className="font-heading text-[26px] font-semibold tracking-[-0.02em] text-[#262B29] mb-3">
        Couldn&rsquo;t load this page.
      </h2>
      <p className="text-[15px] leading-[1.6] text-[#565D5A] max-w-[340px] mb-8 [text-wrap:pretty]">
        Your data is safe. Try refreshing, or head back to your plan.
      </p>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 font-heading text-[15px] font-semibold px-6 py-[13px] rounded-[11px] bg-[#2F5049] text-white hover:bg-[#263F38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Try again
        </button>
        <Link
          href="/exercises"
          className="text-[14px] font-medium text-[#5F6863] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-3 py-2"
        >
          Back to my plan
        </Link>
      </div>
    </div>
  );
}
