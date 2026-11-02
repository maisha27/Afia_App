import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { UserActionsClient } from './UserActionsClient';

export const metadata: Metadata = { title: 'User · Admin · Afia' };

/* ─── Status helpers (mirrors the list page) ─── */
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

function getStatus(sub: { status: string; cancel_at_period_end: boolean | null } | null): Status {
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

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/* ─── Small UI components ─── */
function StatusPill({ status }: { status: Status }) {
  const { pill, dot } = STATUS_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-[6px] text-[12px] font-semibold px-[9px] py-[4px] rounded-full ${pill}`}>
      <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: dot }} aria-hidden="true" />
      {status}
    </span>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between py-[11px]" style={{ borderBottom: '1px solid #F4F5F3' }}>
      <span className="text-[12.5px] font-semibold flex-shrink-0 mr-4" style={{ color: '#767D79' }}>{label}</span>
      <span
        className={`text-[13px] text-right break-all ${mono ? 'font-mono text-[11.5px]' : ''}`}
        style={{ color: '#2E3330' }}
      >
        {value}
      </span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[12px] px-[20px] py-[18px]" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
      <div className="font-heading text-[30px] font-semibold tracking-[-0.025em] mb-[3px]" style={{ color: '#26302D' }}>
        {value}
      </div>
      <div className="text-[12px] font-semibold" style={{ color: '#7A827D' }}>{label}</div>
    </div>
  );
}

/* ─── Page ─── */
export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [supabase, service] = [await createClient(), createServiceClient()];
  const { data: { user: adminUser } } = await supabase.auth.getUser();

  // All data fetched in parallel
  const [userRes, subRes, screenerRes, profileRes, progressRes, journalRes, calmRes] = await Promise.all([
    service.auth.admin.getUserById(id),
    service
      .from('subscriptions')
      .select('id, user_id, status, plan, cancel_at_period_end, stripe_customer_id, stripe_subscription_id, current_period_end, created_at')
      .eq('user_id', id)
      .maybeSingle(),
    service
      .from('screener_results')
      .select('id, score, band, created_at')
      .eq('user_id', id)
      .order('created_at', { ascending: false }),
    service
      .from('profiles')
      .select('last_active_at')
      .eq('id', id)
      .maybeSingle(),
    service
      .from('user_exercise_progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', id),
    service
      .from('journal_entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', id),
    service
      .from('calm_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', id),
  ]);

  if (userRes.error || !userRes.data.user) notFound();

  const user      = userRes.data.user;
  const sub       = subRes.data ?? null;
  const screener  = screenerRes.data ?? [];
  const lastActiveAt = (profileRes.data as { last_active_at: string | null } | null)?.last_active_at ?? null;
  const exerciseCount = progressRes.count ?? 0;
  const journalCount  = journalRes.count  ?? 0;
  const calmCount     = calmRes.count     ?? 0;

  const status   = getStatus(sub);
  const email    = user.email ?? '(no email)';
  const initials = emailInitials(email);
  const latestBand = screener[0]?.band ?? null;
  const isSuspended = !!(user.banned_until && new Date(user.banned_until) > new Date());

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F6F5' }}>
      <AdminSidebar active="users" adminEmail={adminUser?.email} />

      <main className="flex-1 min-w-0 px-[34px] py-[30px] pb-[48px]">

        {/* Back link */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-[6px] text-[13px] mb-[22px] hover:opacity-70 transition-opacity"
          style={{ color: '#5F6863' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back to users
        </Link>

        {/* User header card */}
        <div
          className="rounded-[14px] px-[26px] py-[22px] mb-[18px] flex items-center gap-[18px]"
          style={{ background: '#fff', border: '1px solid #E4E6E2' }}
        >
          <span
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center font-heading font-semibold text-[19px] flex-shrink-0 text-white"
            style={{ background: AVATAR_BG[status] }}
            aria-hidden="true"
          >
            {initials}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-[10px] flex-wrap mb-[5px]">
              <h1
                className="font-heading text-[20px] font-semibold tracking-[-0.02em] truncate"
                style={{ color: '#26302D' }}
              >
                {email}
              </h1>
              <StatusPill status={status} />
              {latestBand && (
                <span
                  className="text-[11px] font-semibold px-[8px] py-[3px] rounded-full"
                  style={{ background: '#F5F6F5', color: '#5F6863', border: '1px solid #E4E6E2' }}
                >
                  {latestBand} anxiety
                </span>
              )}
            </div>
            <p className="font-mono text-[11.5px]" style={{ color: '#9AA29C' }}>{user.id}</p>
          </div>
        </div>

        {/* Activity stats */}
        <div className="grid grid-cols-3 gap-[14px] mb-[18px]">
          <StatCard label="Exercises completed" value={exerciseCount} />
          <StatCard label="Journal entries"      value={journalCount} />
          <StatCard label="Calm sessions"         value={calmCount} />
        </div>

        {/* Subscription + Account cards side by side */}
        <div className="grid grid-cols-2 gap-[16px] mb-[16px]">

          {/* Subscription */}
          <div className="rounded-[14px] px-[22px] pt-[18px] pb-[6px]" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
            <h2 className="text-[11px] font-semibold tracking-[0.06em] uppercase mb-[2px]" style={{ color: '#9AA29C' }}>
              Subscription
            </h2>
            <DetailRow label="Status"           value={status} />
            <DetailRow label="Plan"             value={sub?.plan ? (sub.plan === 'monthly' ? 'Monthly' : 'Yearly') : '—'} />
            <DetailRow label="Period ends"      value={formatDate(sub?.current_period_end)} />
            <DetailRow label="Cancelling"       value={sub?.cancel_at_period_end ? 'Yes — at period end' : 'No'} />
            <DetailRow label="Subscribed since" value={formatDate(sub?.created_at)} />
            <DetailRow label="Stripe customer"  value={sub?.stripe_customer_id ?? '—'} mono />
            <DetailRow label="Stripe sub ID"    value={sub?.stripe_subscription_id ?? '—'} mono />
          </div>

          {/* Account */}
          <div className="rounded-[14px] px-[22px] pt-[18px] pb-[6px]" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
            <h2 className="text-[11px] font-semibold tracking-[0.06em] uppercase mb-[2px]" style={{ color: '#9AA29C' }}>
              Account
            </h2>
            <DetailRow label="Email"           value={email} />
            <DetailRow label="Email confirmed" value={user.email_confirmed_at ? formatDate(user.email_confirmed_at) : 'Not confirmed'} />
            <DetailRow label="Joined"          value={formatDate(user.created_at)} />
            <DetailRow label="Last active"     value={formatDate(lastActiveAt)} />
            <DetailRow label="Last sign in"    value={formatDate(user.last_sign_in_at)} />
            <DetailRow label="User ID"         value={user.id} mono />
          </div>
        </div>

        {/* Screener history */}
        <div className="rounded-[14px] px-[22px] py-[18px] mb-[16px]" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
          <h2 className="text-[11px] font-semibold tracking-[0.06em] uppercase mb-[14px]" style={{ color: '#9AA29C' }}>
            Screener history &middot; {screener.length} {screener.length === 1 ? 'completion' : 'completions'}
          </h2>

          {screener.length === 0 ? (
            <p className="text-[13px]" style={{ color: '#9AA29C' }}>No screener completions yet.</p>
          ) : (
            <>
              {/* Column headers */}
              <div className="flex items-center pb-[8px] mb-[4px]" style={{ borderBottom: '1px solid #E9EBE7' }}>
                <div className="flex-1 text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: '#9AA29C' }}>Band</div>
                <div className="w-[80px] text-[11px] font-semibold tracking-[0.06em] uppercase text-right" style={{ color: '#9AA29C' }}>Score</div>
                <div className="w-[120px] text-[11px] font-semibold tracking-[0.06em] uppercase text-right" style={{ color: '#9AA29C' }}>Date</div>
              </div>
              {screener.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center py-[11px]"
                  style={i < screener.length - 1 ? { borderBottom: '1px solid #F4F5F3' } : undefined}
                >
                  <div className="flex-1 text-[13px] font-semibold" style={{ color: '#2E3330' }}>{r.band}</div>
                  <div className="w-[80px] text-[13px] text-right font-mono" style={{ color: '#5F6863' }}>{r.score}</div>
                  <div className="w-[120px] text-[12.5px] text-right" style={{ color: '#767D79' }}>{formatDate(r.created_at)}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Account actions */}
        <UserActionsClient
          userId={user.id}
          email={email}
          stripeSubscriptionId={sub?.stripe_subscription_id ?? null}
          isSuspended={isSuspended}
          isTrial={status === 'Trial'}
        />

      </main>
    </div>
  );
}
