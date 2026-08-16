import Link from 'next/link';
import { adminSignOut } from '@/lib/actions/admin';

export type AdminPage = 'users' | 'content' | 'analytics';

const NAV = [
  {
    id: 'users' as AdminPage,
    href: '/admin/users',
    label: 'Users',
    icon: (active: boolean) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={active ? '#7FB3A6' : '#7E938C'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 6.5a3 3 0 0 1 0 5.6M20.5 20a5 5 0 0 0-3.5-4.8" />
      </svg>
    ),
  },
  {
    id: 'content' as AdminPage,
    href: '/admin/content',
    label: 'Content',
    icon: (active: boolean) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={active ? '#7FB3A6' : '#7E938C'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="2.5" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    id: 'analytics' as AdminPage,
    href: '/admin/analytics',
    label: 'Analytics',
    icon: (active: boolean) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={active ? '#7FB3A6' : '#7E938C'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19V5M4 19h16" />
        <path d="M8 15l3-4 3 2 4-6" />
      </svg>
    ),
  },
];

function emailInitials(email: string): string {
  const local = email.split('@')[0];
  const parts = local.split(/[._-]/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

export function AdminSidebar({
  active,
  adminEmail,
}: {
  active: AdminPage;
  adminEmail?: string;
}) {
  const initials = adminEmail ? emailInitials(adminEmail) : '?';
  const displayEmail = adminEmail ? adminEmail.split('@')[0] : 'Admin';

  return (
    <aside className="w-[224px] flex-shrink-0 flex flex-col" style={{ background: '#1F2A27', padding: '22px 16px' }}>
      {/* Logo + Admin badge */}
      <div className="flex items-center justify-between px-[6px] mb-7">
        <span className="font-heading text-[17px] font-semibold tracking-[-0.01em]" style={{ color: '#EAF3EF' }}>
          afia
        </span>
        <span
          className="text-[9px] font-semibold tracking-[0.13em] uppercase rounded-[5px] px-[7px] py-[4px]"
          style={{ color: '#7FB3A6', background: 'rgba(47,122,109,.2)', border: '1px solid #35544C' }}
        >
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-[3px]">
        {NAV.map(({ id, href, label, icon }) => {
          const isActive = active === id;
          return (
            <Link
              key={id}
              href={href}
              className="flex items-center gap-[11px] px-3 py-[10px] rounded-[9px] text-[14px] transition-colors"
              style={isActive ? { background: '#2C3A36', color: '#EAF3EF', fontWeight: 600 } : { color: '#9DB3AC', fontWeight: 500 }}
            >
              {icon(isActive)}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + sign out */}
      <div className="mt-auto flex items-center gap-[10px] px-2 py-[10px]" style={{ borderTop: '1px solid #33413D' }}>
        <span
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center font-heading font-semibold text-[13px] flex-shrink-0"
          style={{ background: '#2F7A6D', color: '#EAF3EF' }}
          aria-hidden="true"
        >
          {initials}
        </span>
        <div className="flex-1 leading-[1.2] min-w-0">
          <div className="text-[13px] font-semibold truncate" style={{ color: '#DCE7E2' }}>
            {displayEmail}
          </div>
          <form action={adminSignOut}>
            <button
              type="submit"
              className="text-[11px] hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 rounded-sm"
              style={{ color: '#7E938C' }}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
