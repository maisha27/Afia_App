import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = { title: 'Users — Admin · Afia' };

type Status = 'Subscribed' | 'Trial' | 'Free' | 'Cancelled';

const STATUS_STYLES: Record<Status, { pill: string; dot: string }> = {
  Subscribed: {
    pill: 'bg-[#E3F1EE] border border-[#CBE6DE] text-[#276358]',
    dot: '#2F7A6D',
  },
  Trial: {
    pill: 'bg-[#FBF1E1] border border-[#EFE0C2] text-[#8A6410]',
    dot: '#C79A32',
  },
  Free: {
    pill: 'bg-[#EFEDEA] border border-[#E1DED8] text-[#6C726E]',
    dot: '#A8ADA6',
  },
  Cancelled: {
    pill: 'bg-[#F5EBE8] border border-[#E8D8D2] text-[#9A6A5C]',
    dot: '#BD8B7E',
  },
};

const AVATAR_BG: Record<Status, string> = {
  Subscribed: '#2F7A6D',
  Trial: '#B8853A',
  Free: '#7E8A86',
  Cancelled: '#9A6A5C',
};

const USERS: {
  initials: string;
  name: string;
  email: string;
  status: Status;
  joined: string;
  active: string;
}[] = [
  { initials: 'AK', name: 'Amira Khalil', email: 'amira@example.com', status: 'Subscribed', joined: '2 Mar 2026', active: 'Today' },
  { initials: 'TM', name: 'Tom McAllister', email: 'tom@example.com', status: 'Trial', joined: '20 Jul 2026', active: 'Yesterday' },
  { initials: 'SL', name: 'Sarah Liu', email: 'sarah@example.com', status: 'Subscribed', joined: '15 Jan 2026', active: '3 days ago' },
  { initials: 'JO', name: 'James Okafor', email: 'james@example.com', status: 'Free', joined: '8 May 2026', active: '2 weeks ago' },
  { initials: 'FA', name: 'Fatima Al-Rashid', email: 'fatima@example.com', status: 'Subscribed', joined: '10 Feb 2026', active: 'Today' },
  { initials: 'BW', name: 'Ben Wright', email: 'ben@example.com', status: 'Cancelled', joined: '1 Apr 2026', active: '1 month ago' },
  { initials: 'YN', name: 'Yuki Nakamura', email: 'yuki@example.com', status: 'Trial', joined: '22 Jul 2026', active: 'Today' },
];

function StatusPill({ status }: { status: Status }) {
  const { pill, dot } = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-[6px] text-[12px] font-semibold px-[9px] py-[4px] rounded-full ${pill}`}>
      <span
        className="w-[6px] h-[6px] rounded-full flex-shrink-0"
        style={{ background: dot }}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

export default function AdminUsersPage() {
  return (
    <div className="flex min-h-screen" style={{ background: '#F5F6F5' }}>
      <AdminSidebar active="users" />

      <main className="flex-1 min-w-0 px-[34px] py-[30px]">
        {/* Header */}
        <div className="flex items-end justify-between mb-[22px]">
          <div>
            <h1
              className="font-heading text-[24px] font-semibold tracking-[-0.02em] mb-[3px]"
              style={{ color: '#26302D' }}
            >
              Users
            </h1>
            <div className="text-[13px]" style={{ color: '#7A827D' }}>
              1,284 total &middot; 342 subscribed &middot; 118 in trial
            </div>
          </div>
          {/* Search + filter */}
          <div className="flex items-center gap-[10px]">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9AA29C"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="search"
                placeholder="Search users…"
                className="pl-[34px] pr-[12px] py-[8px] text-[13.5px] rounded-[9px] outline-none w-[230px] placeholder:text-[#A8ADA6]"
                style={{
                  background: '#fff',
                  border: '1px solid #DDE0DC',
                  color: '#3A403C',
                }}
              />
            </div>
            <select
              className="px-[12px] py-[8px] text-[13.5px] rounded-[9px] outline-none appearance-none pr-[32px] cursor-pointer"
              style={{
                background: '#fff',
                border: '1px solid #DDE0DC',
                color: '#4A514C',
              }}
            >
              <option>All plans</option>
              <option>Subscribed</option>
              <option>Trial</option>
              <option>Free</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div
          className="rounded-[14px] overflow-hidden"
          style={{ background: '#fff', border: '1px solid #E4E6E2' }}
        >
          {/* Table header */}
          <div
            className="flex items-center px-[20px] py-[12px]"
            style={{ background: '#FAFBFA', borderBottom: '1px solid #E9EBE7' }}
          >
            <div className="flex-[2.4] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>
              User
            </div>
            <div className="flex-[1.5] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>
              Subscription
            </div>
            <div className="flex-[1.1] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>
              Joined
            </div>
            <div className="flex-[1.1] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>
              Last active
            </div>
            <div className="w-[70px] text-right text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>
              Actions
            </div>
          </div>

          {/* User rows */}
          {USERS.map((user, i) => (
            <div
              key={user.email}
              className="flex items-center px-[20px] py-[14px] hover:bg-[#FCFCFB] transition-colors"
              style={i < USERS.length - 1 ? { borderBottom: '1px solid #F0F2EE' } : undefined}
            >
              {/* User cell */}
              <div className="flex-[2.4] flex items-center gap-[11px] min-w-0 pr-4">
                <span
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-heading font-semibold text-[12px] flex-shrink-0 text-white"
                  style={{ background: AVATAR_BG[user.status] }}
                  aria-hidden="true"
                >
                  {user.initials}
                </span>
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold truncate" style={{ color: '#2E3330' }}>
                    {user.name}
                  </div>
                  <div className="text-[12.5px] truncate" style={{ color: '#8A928D' }}>
                    {user.email}
                  </div>
                </div>
              </div>
              {/* Subscription */}
              <div className="flex-[1.5]">
                <StatusPill status={user.status} />
              </div>
              {/* Joined */}
              <div className="flex-[1.1] text-[13px]" style={{ color: '#5F6863' }}>
                {user.joined}
              </div>
              {/* Last active */}
              <div className="flex-[1.1] text-[13px]" style={{ color: '#5F6863' }}>
                {user.active}
              </div>
              {/* Actions */}
              <div className="w-[70px] text-right">
                <button
                  type="button"
                  className="text-[13px] font-semibold hover:opacity-70 transition-opacity"
                  style={{ color: '#2F7A6D' }}
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-[16px]">
          <span className="text-[13px]" style={{ color: '#8A928D' }}>
            Showing 1–7 of 1,284
          </span>
          <div className="flex items-center gap-[6px]">
            <button
              type="button"
              className="w-[30px] h-[30px] flex items-center justify-center rounded-[8px] transition-colors hover:bg-[#F0F2EE]"
              style={{ border: '1px solid #DDE0DC', color: '#5F6863' }}
              aria-label="Previous page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <button
              type="button"
              className="w-[30px] h-[30px] flex items-center justify-center rounded-[8px] transition-colors hover:bg-[#F0F2EE]"
              style={{ border: '1px solid #DDE0DC', color: '#5F6863' }}
              aria-label="Next page"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
