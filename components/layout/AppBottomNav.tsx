'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const TABS = [
  {
    label: 'Home',
    href: '/home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
  },
  {
    label: 'Plan',
    href: '/exercises',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 6h11M9 12h11M9 18h11" />
        <circle cx="4.5" cy="6" r="1.3" />
        <circle cx="4.5" cy="12" r="1.3" />
        <circle cx="4.5" cy="18" r="1.3" />
      </svg>
    ),
  },
  {
    label: 'Calm',
    href: '/calm-tool',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="2.3" />
        <path d="M7.4 12a4.6 4.6 0 0 1 9.2 0" />
        <path d="M3.5 12a8.5 8.5 0 0 1 17 0" />
      </svg>
    ),
  },
  {
    label: 'Progress',
    href: '/progress',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19V5M4 19h16" />
        <path d="M8 15l3-4 3 2 4-6" />
      </svg>
    ),
  },
  {
    label: 'Journal',
    href: '/journal',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
];

/**
 * Bottom tab bar — visible on mobile, hidden on lg+ (where AppSidebar shows).
 */
export function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="App navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex bg-white border-t border-[#EFEAE2] pb-safe"
    >
      {TABS.map(({ label, href, icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-3 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active ? 'text-primary' : 'text-[#5F6863]'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <div className="relative flex items-center justify-center">
              {icon(active)}
              {active && (
                <motion.div
                  layoutId="bottom-tab-dot"
                  className="absolute -bottom-[6px] w-[5px] h-[5px] rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
