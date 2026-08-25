import Image from 'next/image';
import Link from 'next/link';
import { MobileNav } from './MobileNav';

interface SiteHeaderProps {
  /**
   * 'screener' — crisis support link only (ONB/QST/RES/SIG/PAY screens)
   * 'legal'    — crisis support (in crisis colour) + log in link
   * 'landing'  — full marketing nav with CTA button
   */
  variant?: 'screener' | 'legal' | 'landing';
}

export function SiteHeader({ variant = 'screener' }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#EFEAE2] bg-background">
      <div className="flex items-center justify-between px-6 py-3 sm:px-11">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <Image
            src="/Images/Official_Logo.png"
            alt="Afia"
            width={45}
            height={45}
            className="h-[45px] w-auto object-contain"
            priority
          />
          <div className="flex flex-col leading-none gap-[3px]">
            <span className="font-heading text-[24px] font-semibold text-primary tracking-[-0.01em]">
              afia
            </span>
            <span className="text-[8px] font-semibold tracking-[0.22em] uppercase text-[#577169]">
              calm in mind
            </span>
          </div>
        </Link>

        {variant === 'landing' ? (
          <nav aria-label="Header navigation" className="flex items-center gap-3 md:gap-7">
            <div className="hidden md:flex items-center gap-7">
              <a
                href="#how-it-helps"
                className="text-[14px] text-text-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                How it helps
              </a>
              <a
                href="#approach"
                className="text-[14px] text-text-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Our Approach
              </a>
              <Link
                href="/crisis-support"
                className="text-[14px] text-text-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Crisis support
              </Link>
              <Link
                href="/log-in"
                className="text-[14px] text-text-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Log in
              </Link>
            </div>
            <Link
              href="/screener"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-[18px] py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Take the free test
            </Link>
            <MobileNav />
          </nav>
        ) : (
          <nav aria-label="Header navigation" className="flex items-center gap-6">
            <Link
              href="/crisis-support"
              className={
                variant === 'legal'
                  ? 'text-sm font-semibold text-crisis hover:text-crisis/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm'
                  : 'text-sm text-text-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm'
              }
            >
              Crisis support
            </Link>
            {variant === 'legal' && (
              <Link
                href="/log-in"
                className="text-sm text-text-2 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Log in
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
