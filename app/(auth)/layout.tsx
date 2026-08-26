import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      <div className="flex flex-1 flex-col">
        {children}
      </div>
      <footer className="border-t border-[#EDE8E0] py-3.5 px-4 flex items-center justify-center gap-6 flex-wrap">
        <Link
          href="/"
          className="text-[12px] text-[#6E7672] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          ← Back to home
        </Link>
        <Link
          href="/crisis-support"
          className="text-[12px] text-[#6E7672] hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Need support? Find crisis resources
        </Link>
      </footer>
    </div>
  );
}
