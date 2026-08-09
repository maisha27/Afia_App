import type { ReactNode } from 'react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6">
        {children}
      </div>
      <footer className="py-4 text-center">
        <Link
          href="/crisis-support"
          className="text-xs text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Need support? Find crisis resources here
        </Link>
      </footer>
    </div>
  );
}
