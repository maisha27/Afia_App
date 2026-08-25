'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [open]);

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        aria-controls="mobile-nav-menu"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        )}
      </button>

      {open && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-label="Navigation menu"
          className="absolute right-0 top-[calc(100%+10px)] w-[210px] rounded-[14px] border border-[#EFEAE2] bg-background py-2 shadow-[0_16px_48px_-12px_rgba(20,24,22,0.2)]"
        >
          <a
            href="#how-it-helps"
            onClick={() => setOpen(false)}
            className="flex px-4 py-2.5 text-[14px] text-text-2 hover:text-foreground hover:bg-[#F4F0EA] transition-colors"
          >
            How it helps
          </a>
          <a
            href="#approach"
            onClick={() => setOpen(false)}
            className="flex px-4 py-2.5 text-[14px] text-text-2 hover:text-foreground hover:bg-[#F4F0EA] transition-colors"
          >
            Our approach
          </a>
          <div className="my-1.5 border-t border-[#EFEAE2]" />
          <Link
            href="/crisis-support"
            onClick={() => setOpen(false)}
            className="flex px-4 py-2.5 text-[14px] font-medium text-crisis hover:bg-[#F4F0EA] transition-colors"
          >
            Crisis support
          </Link>
          <Link
            href="/log-in"
            onClick={() => setOpen(false)}
            className="flex px-4 py-2.5 text-[14px] text-text-2 hover:text-foreground hover:bg-[#F4F0EA] transition-colors"
          >
            Log in
          </Link>
          <div className="px-3 pb-2 pt-1.5">
            <Link
              href="/screener"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-[13.5px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Take the free test
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
