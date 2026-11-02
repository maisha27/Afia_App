import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET() {
  // Admin auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .single();
  if (!adminUser) return new NextResponse('Forbidden', { status: 403 });

  const service = createServiceClient();

  // Paginate through all users (max 1000 per page)
  const allUsers: { id: string; email?: string; created_at: string; last_sign_in_at?: string | null }[] = [];
  let page = 1;
  while (true) {
    const { data: listData } = await service.auth.admin.listUsers({ page, perPage: 1000 });
    const batch = listData?.users ?? [];
    allUsers.push(...batch);
    const total = (listData as { total?: number } | null)?.total ?? 0;
    if (allUsers.length >= total || batch.length === 0) break;
    page++;
  }

  // Fetch all subscriptions
  const { data: subs } = await service
    .from('subscriptions')
    .select('user_id, status, plan, cancel_at_period_end, current_period_end');
  const subMap = Object.fromEntries(
    ((subs ?? []) as {
      user_id: string;
      status: string;
      plan: string | null;
      cancel_at_period_end: boolean | null;
      current_period_end: string | null;
    }[]).map((s) => [s.user_id, s]),
  );

  function getStatus(sub: { status: string; cancel_at_period_end: boolean | null } | undefined): string {
    if (!sub) return 'Free';
    if (sub.cancel_at_period_end || sub.status === 'canceled') return 'Cancelled';
    if (sub.status === 'trialing') return 'Trial';
    if (sub.status === 'active') return 'Subscribed';
    return 'Free';
  }

  function csvCell(val: string | null | undefined): string {
    if (val == null) return '';
    const s = String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  }

  const headers = ['Email', 'Status', 'Plan', 'Subscribed until', 'Joined', 'Last sign in', 'User ID'];
  const rows = allUsers.map((u) => {
    const sub = subMap[u.id];
    return [
      csvCell(u.email),
      csvCell(getStatus(sub)),
      csvCell(sub?.plan ?? ''),
      csvCell(sub?.current_period_end ? new Date(sub.current_period_end).toLocaleDateString('en-GB') : ''),
      csvCell(new Date(u.created_at).toLocaleDateString('en-GB')),
      csvCell(u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('en-GB') : ''),
      csvCell(u.id),
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const filename = `afia-users-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
