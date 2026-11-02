import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export const metadata: Metadata = { title: 'Users · Admin · Afia' };

const PAGE_SIZE = 20;

type Status = 'Subscribed' | 'Trial' | 'Free' | 'Cancelled';

const STATUS_STYLES: Record<Status, { pill: string; dot: string }> = {
  Subscribed: { pill: 'bg-[#E3F1EE] border border-[#CBE6DE] text-[#276358]', dot: '#2F7A6D' },
  Trial:      { pill: 'bg-[#FBF1E1] border border-[#EFE0C2] text-[#8A6410]', dot: '#C79A32' },
  Free:       { pill: 'bg-[#EFEDEA] border border-[#E1DED8] text-[#6C726E]', dot: '#A8ADA6' },
  Cancelled:  { pill: 'bg-[#F5EBE8] border border-[#E8D8D2] text-[#9A6A5C]', dot: '#BD8B7E' },
};

const AVATAR_BG: Record<Status, string> = {
  Subscribed: '#2F7A6D',
  Trial:      '#B8853A',
  Free:       '#7E8A86',
  Cancelled:  '#9A6A5C',
};

function getStatus(sub: { status: string; cancel_at_period_end: boolean } | null): Status {
  if (!sub) return 'Free';
  if (sub.cancel_at_period_end || sub.status === 'canceled') return 'Cancelled';
  if (sub.status === 'trialing') return 'Trial';
  if (sub.status === 'active') return 'Subscribed';
  return 'Free';
}

function emailInitials(email: string): string {
  const local = email.split('@')[0];
  const parts = local.split(/[._-]/);
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

function formatRelativeDate(isoDate: string | null): string {
  if (!isoDate) return 'Never';
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 60) return '1 month ago';
  return `${Math.floor(days / 30)} months ago`;
}

function formatJoinDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatusPill({ status }: { status: Status }) {
  const { pill, dot } = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-[6px] text-[12px] font-semibold px-[9px] py-[4px] rounded-full ${pill}`}>
      <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: dot }} aria-hidden="true" />
      {status}
    </span>
  );
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; s?: string }>;
}) {
  const { page: pageStr, q: rawQ, s: rawS } = await searchParams;
  const q = rawQ?.trim() ?? '';
  const statusFilter = rawS?.trim() ?? '';
  const isSearching = q.length > 0;
  const isFiltering = isSearching || (statusFilter !== '' && statusFilter !== 'All');
  const currentPage = isFiltering ? 1 : Math.max(1, parseInt(pageStr ?? '1', 10));

  const [supabase, service] = [await createClient(), createServiceClient()];
  const { data: { user: adminUser } } = await supabase.auth.getUser();

  // When filtering: fetch a large batch — Supabase Admin API lacks server-side email/status search
  const { data: listData, error } = await service.auth.admin.listUsers({
    page: isFiltering ? 1 : currentPage,
    perPage: isFiltering ? 500 : PAGE_SIZE,
  });

  const allFetched = listData?.users ?? [];

  // Fetch subscriptions, profiles, and summary counts in parallel — use allFetched so status filter has full data
  const fetchIds = allFetched.map((u) => u.id);
  const [subsRes, profilesRes, allSubsRes] = await Promise.all([
    fetchIds.length
      ? service.from('subscriptions').select('user_id, status, cancel_at_period_end').in('user_id', fetchIds)
      : Promise.resolve({ data: [] }),
    fetchIds.length
      ? service.from('profiles').select('id, last_active_at').in('id', fetchIds)
      : Promise.resolve({ data: [] }),
    service.from('subscriptions').select('status, cancel_at_period_end'),
  ]);

  const subMap = Object.fromEntries(
    ((subsRes.data ?? []) as { user_id: string; status: string; cancel_at_period_end: boolean }[])
      .map((s) => [s.user_id, s]),
  );

  const profileMap = Object.fromEntries(
    ((profilesRes.data ?? []) as { id: string; last_active_at: string | null }[])
      .map((p) => [p.id, p.last_active_at]),
  );

  const allSubs = allSubsRes.data ?? [];
  const subscribedCount = allSubs.filter(
    (s) => s.status === 'active' && !s.cancel_at_period_end,
  ).length;
  const trialCount = allSubs.filter((s) => s.status === 'trialing').length;

  const allRows = allFetched.map((u) => {
    const sub = subMap[u.id] ?? null;
    const status = getStatus(sub);
    const lastActive = profileMap[u.id] ?? u.last_sign_in_at ?? null;
    return {
      id: u.id,
      email: u.email ?? '(no email)',
      initials: emailInitials(u.email ?? 'XX'),
      status,
      joined: formatJoinDate(u.created_at),
      lastActive: formatRelativeDate(lastActive),
    };
  });

  const rows = isFiltering
    ? allRows
        .filter((r) => !isSearching || r.email.toLowerCase().includes(q.toLowerCase()))
        .filter((r) => !statusFilter || statusFilter === 'All' || r.status === statusFilter)
    : allRows;

  const total = isFiltering ? rows.length : ((listData as { total?: number })?.total ?? 0);
  const totalPages = isFiltering ? 1 : Math.ceil(total / PAGE_SIZE);

  if (error) {
    return (
      <div className="flex min-h-screen" style={{ background: '#F5F6F5' }}>
        <AdminSidebar active="users" adminEmail={adminUser?.email} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[14px]" style={{ color: '#767D79' }}>
            Could not load users. Check service role key.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F6F5' }}>
      <AdminSidebar active="users" adminEmail={adminUser?.email} />

      <main className="flex-1 min-w-0 px-[34px] py-[30px]">
        {/* Header */}
        <div className="flex items-start justify-between mb-[22px] gap-[16px]">
          <div className="flex-shrink-0">
            <h1 className="font-heading text-[24px] font-semibold tracking-[-0.02em] mb-[3px]" style={{ color: '#26302D' }}>
              Users
            </h1>
            <div className="text-[13px]" style={{ color: '#7A827D' }}>
              {isFiltering
                ? `${rows.length} result${rows.length !== 1 ? 's' : ''}${isSearching ? ` for "${q}"` : ''}${statusFilter && statusFilter !== 'All' ? ` · ${statusFilter}` : ''}`
                : `${total.toLocaleString()} total · ${subscribedCount} subscribed · ${trialCount} in trial`}
            </div>
          </div>

          <div className="flex items-center gap-[10px]">
            {/* Search */}
            <form method="GET" action="/admin/users" className="relative">
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search by email…"
                className="rounded-[10px] pl-[36px] pr-[12px] py-[8px] text-[13.5px] outline-none transition-colors w-[230px]"
                style={{ background: '#fff', border: '1.5px solid #E4E6E2', color: '#2E3330' }}
                onFocus={undefined}
              />
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9AA29C"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="absolute left-[11px] top-[50%] -translate-y-[50%] pointer-events-none"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              {isSearching && (
                <a
                  href="/admin/users"
                  className="absolute right-[9px] top-[50%] -translate-y-[50%] text-[16px] leading-none hover:opacity-60 transition-opacity"
                  style={{ color: '#9AA29C' }}
                  aria-label="Clear search"
                >
                  ×
                </a>
              )}
            </form>

            {/* Export CSV */}
            <a
              href="/admin/users/export"
              className="inline-flex items-center gap-[6px] text-[13px] font-semibold px-[13px] py-[8px] rounded-[9px] transition-colors hover:opacity-80 flex-shrink-0"
              style={{ background: '#F5F6F5', color: '#3A403C', border: '1px solid #E4E6E2' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </a>
          </div>
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-[8px] mb-[16px] flex-wrap">
          {(['All', 'Subscribed', 'Trial', 'Free', 'Cancelled'] as const).map((s) => {
            const isActive = s === 'All'
              ? !statusFilter || statusFilter === 'All' || statusFilter === ''
              : statusFilter === s;
            const params = new URLSearchParams();
            if (q) params.set('q', q);
            if (s !== 'All') params.set('s', s);
            const href = `/admin/users${params.toString() ? `?${params.toString()}` : ''}`;
            return (
              <a
                key={s}
                href={href}
                className="text-[13px] font-semibold px-[13px] py-[6px] rounded-[8px] transition-colors"
                style={isActive
                  ? { background: '#2F7A6D', color: '#EAF3EF' }
                  : { background: '#fff', color: '#5F6863', border: '1px solid #E4E6E2' }
                }
              >
                {s}
              </a>
            );
          })}
        </div>

        {/* Table */}
        <div className="rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
          {/* Header row */}
          <div className="flex items-center px-[20px] py-[12px]" style={{ background: '#FAFBFA', borderBottom: '1px solid #E9EBE7' }}>
            <div className="flex-[2.4] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>User</div>
            <div className="flex-[1.5] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>Status</div>
            <div className="flex-[1.1] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>Joined</div>
            <div className="flex-[1.1] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>Last active</div>
            <div className="w-[20px] flex-shrink-0" aria-hidden="true" />
          </div>

          {rows.length === 0 ? (
            <div className="px-[20px] py-[40px] text-center text-[13px]" style={{ color: '#9AA29C' }}>
              No users yet.
            </div>
          ) : (
            rows.map((row, i) => (
              <Link
                key={row.id}
                href={`/admin/users/${row.id}`}
                className="flex items-center px-[20px] py-[14px] hover:bg-[#F6FAF8] transition-colors"
                style={i < rows.length - 1 ? { borderBottom: '1px solid #F0F2EE' } : undefined}
              >
                <div className="flex-[2.4] flex items-center gap-[11px] min-w-0 pr-4">
                  <span
                    className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-heading font-semibold text-[12px] flex-shrink-0 text-white"
                    style={{ background: AVATAR_BG[row.status] }}
                    aria-hidden="true"
                  >
                    {row.initials}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-medium truncate" style={{ color: '#2E3330' }}>
                      {row.email}
                    </div>
                  </div>
                </div>
                <div className="flex-[1.5]">
                  <StatusPill status={row.status} />
                </div>
                <div className="flex-[1.1] text-[13px]" style={{ color: '#5F6863' }}>
                  {row.joined}
                </div>
                <div className="flex-[1.1] text-[13px]" style={{ color: '#5F6863' }}>
                  {row.lastActive}
                </div>
                <div className="w-[20px] flex-shrink-0 flex items-center justify-end">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C4C9C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-[16px]">
            <span className="text-[13px]" style={{ color: '#6E7672' }}>
              Page {currentPage} of {totalPages} &middot; {total.toLocaleString()} users
            </span>
            <div className="flex items-center gap-[6px]">
              {currentPage > 1 && (
                <a
                  href={`?page=${currentPage - 1}`}
                  className="w-[30px] h-[30px] flex items-center justify-center rounded-[8px] transition-colors hover:bg-[#F0F2EE]"
                  style={{ border: '1px solid #DDE0DC', color: '#5F6863' }}
                  aria-label="Previous page"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
                </a>
              )}
              {currentPage < totalPages && (
                <a
                  href={`?page=${currentPage + 1}`}
                  className="w-[30px] h-[30px] flex items-center justify-center rounded-[8px] transition-colors hover:bg-[#F0F2EE]"
                  style={{ border: '1px solid #DDE0DC', color: '#5F6863' }}
                  aria-label="Next page"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
                </a>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
