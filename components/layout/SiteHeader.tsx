import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo variant="mark" priority />
        <nav aria-label="Main navigation">
          <Link
            href="/log-in"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1 py-0.5"
          >
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}
