'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/home',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    label: 'My plan',
    href: '/exercises',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 6h11M9 12h11M9 18h11" />
        <circle cx="4.5" cy="6" r="1.3" />
        <circle cx="4.5" cy="12" r="1.3" />
        <circle cx="4.5" cy="18" r="1.3" />
      </svg>
    ),
  },
  {
    label: 'Calm tools',
    href: '/calm-tool',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="2.3" />
        <path d="M7.4 12a4.6 4.6 0 0 1 9.2 0" />
        <path d="M3.5 12a8.5 8.5 0 0 1 17 0" />
      </svg>
    ),
  },
  {
    label: 'Journal',
    href: '/journal',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 4C11 5 6 10 5 19l3-3c6-1 10-5 12-12Z" />
        <path d="M8.5 15.5c2.6-2.6 4.6-4.8 6.5-8" />
      </svg>
    ),
  },
  {
    label: 'Progress',
    href: '/progress',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19V5M4 19h16" />
        <path d="M8 15l3-4 3 2 4-6" />
      </svg>
    ),
  },
];

interface AppSidebarNavProps {
  displayName: string;
  displayInitial: string;
}

export function AppSidebarNav({ displayName, displayInitial }: AppSidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Primary nav */}
      <nav aria-label="App navigation" className="flex flex-col gap-[3px]">
        {NAV_ITEMS.map(({ label, href, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-[11px] rounded-[10px] text-[14.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active
                  ? 'bg-secondary text-secondary-foreground font-semibold'
                  : 'text-[#5F6863] font-medium hover:bg-secondary/50 hover:text-secondary-foreground'
              )}
            >
              <span className={active ? 'text-secondary-foreground' : 'text-[#8A928D]'}>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: crisis support + user */}
      <div className="mt-auto flex flex-col gap-3">
        <Link
          href="/crisis-support"
          className="flex items-center gap-2.5 px-3.5 py-3 rounded-[11px] bg-crisis-surface border border-crisis-border text-crisis text-[13.5px] font-semibold hover:bg-crisis-surface/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7Z" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          Crisis support
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-2.5 py-1 text-[13.5px] font-medium text-[#5F6863] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <span
            className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-heading font-semibold text-[13px]"
            aria-hidden="true"
          >
            {displayInitial}
          </span>
          <span className="truncate">{displayName}</span>
        </Link>
      </div>
    </>
  );
}
