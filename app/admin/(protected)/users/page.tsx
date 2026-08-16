import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export const metadata: Metadata = { title: 'Users — Admin · Afia' };

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
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageStr } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageStr ?? '1', 10));

  const [supabase, service] = [await createClient(), createServiceClient()];
  const { data: { user: adminUser } } = await supabase.auth.getUser();

  const { data: listData, error } = await service.auth.admin.listUsers({
    page: currentPage,
    perPage: PAGE_SIZE,
  });

  const users = listData?.users ?? [];
  const total = (listData as { total?: number })?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Fetch subscriptions for this page's users
  const userIds = users.map((u) => u.id);
  const { data: subs } = userIds.length
    ? await service.from('subscriptions')
        .select('user_id, status, cancel_at_period_end')
        .in('user_id', userIds)
    : { data: [] };

  const subMap = Object.fromEntries(
    (subs ?? []).map((s) => [s.user_id, s as { status: string; cancel_at_period_end: boolean }]),
  );

  // Summary counts across all subscriptions
  const { data: allSubs } = await service
    .from('subscriptions')
    .select('status, cancel_at_period_end');
  const subscribedCount = (allSubs ?? []).filter(
    (s) => s.status === 'active' && !s.cancel_at_period_end,
  ).length;
  const trialCount = (allSubs ?? []).filter((s) => s.status === 'trialing').length;

  const rows = users.map((u) => {
    const sub = subMap[u.id] ?? null;
    const status = getStatus(sub);
    return {
      id: u.id,
      email: u.email ?? '(no email)',
      initials: emailInitials(u.email ?? 'XX'),
      status,
      joined: formatJoinDate(u.created_at),
      lastActive: formatRelativeDate(u.last_sign_in_at ?? null),
    };
  });

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
        <div className="flex items-end justify-between mb-[22px]">
          <div>
            <h1 className="font-heading text-[24px] font-semibold tracking-[-0.02em] mb-[3px]" style={{ color: '#26302D' }}>
              Users
            </h1>
            <div className="text-[13px]" style={{ color: '#7A827D' }}>
              {total.toLocaleString()} total &middot; {subscribedCount} subscribed &middot; {trialCount} in trial
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-[14px] overflow-hidden" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
          {/* Header row */}
          <div className="flex items-center px-[20px] py-[12px]" style={{ background: '#FAFBFA', borderBottom: '1px solid #E9EBE7' }}>
            <div className="flex-[2.4] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>User</div>
            <div className="flex-[1.5] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>Status</div>
            <div className="flex-[1.1] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>Joined</div>
            <div className="flex-[1.1] text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>Last active</div>
          </div>

          {rows.length === 0 ? (
            <div className="px-[20px] py-[40px] text-center text-[13px]" style={{ color: '#9AA29C' }}>
              No users yet.
            </div>
          ) : (
            rows.map((row, i) => (
              <div
                key={row.id}
                className="flex items-center px-[20px] py-[14px]"
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
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-[16px]">
            <span className="text-[13px]" style={{ color: '#8A928D' }}>
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
