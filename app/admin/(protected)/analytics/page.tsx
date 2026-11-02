import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export const metadata: Metadata = { title: 'Analytics · Admin · Afia' };

/* ─── Helpers ─── */
function startOfMonth(offsetMonths = 0): Date {
  const d = new Date();
  d.setUTCDate(1);
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCMonth(d.getUTCMonth() + offsetMonths);
  return d;
}

function isoWeekStart(d: Date): string {
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(d);
  monday.setUTCDate(diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday.toISOString().slice(0, 10);
}

function weekLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function MetricCard({
  label,
  value,
  change,
  changeUp,
  sub,
}: {
  label: string;
  value: string;
  change: string;
  changeUp: boolean;
  sub: string;
}) {
  return (
    <div className="rounded-[14px] p-[22px]" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
      <div className="text-[12.5px] font-semibold tracking-[0.02em] mb-3" style={{ color: '#6E7672' }}>
        {label}
      </div>
      <div className="flex items-baseline gap-[10px] mb-[6px]">
        <span className="font-heading text-[34px] font-semibold tracking-[-0.02em]" style={{ color: '#26302D' }}>
          {value}
        </span>
        {change && (
          <span
            className="inline-flex items-center gap-[3px] text-[12px] font-semibold px-2 py-[3px] rounded-full"
            style={changeUp ? { color: '#276358', background: '#E3F1EE' } : { color: '#8A6410', background: '#FBF1E1' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={changeUp ? '#2F7A6D' : '#B58A2A'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {changeUp ? <path d="M6 15l6-6 6 6" /> : <path d="M18 9l-6 6-6-6" />}
            </svg>
            {change}
          </span>
        )}
      </div>
      <div className="text-[12.5px]" style={{ color: '#9AA29C' }}>{sub}</div>
    </div>
  );
}

/* ─── Bar colour scale ─── */
function barColor(heightPct: number): string {
  if (heightPct < 30) return '#CDE5DD';
  if (heightPct < 50) return '#A9D6C9';
  if (heightPct < 70) return '#7FC3B2';
  if (heightPct < 85) return '#4FA694';
  return '#2F7A6D';
}

export default async function AdminAnalyticsPage() {
  const [supabase, service] = [await createClient(), createServiceClient()];
  const { data: { user: adminUser } } = await supabase.auth.getUser();

  const thisMonthStart = startOfMonth(0).toISOString();
  const lastMonthStart = startOfMonth(-1).toISOString();
  const eightWeeksAgo = new Date(Date.now() - 56 * 86_400_000).toISOString();

  // Fetch all data in parallel — subscriptions + engagement
  const [
    allSubsRes,
    recentSubsRes,
    totalUsersRes,
    screenerTotalRes,
    screenerThisRes,
    screenerLastRes,
    exerciseTotalRes,
    exerciseThisRes,
    exerciseLastRes,
    calmTotalRes,
    calmThisRes,
    calmLastRes,
    screenerWeeklyRes,
    exerciseWeeklyRes,
    calmWeeklyRes,
  ] = await Promise.all([
    service.from('subscriptions').select('status, cancel_at_period_end, created_at'),
    service.from('subscriptions').select('created_at').gte('created_at', eightWeeksAgo).order('created_at', { ascending: true }),
    service.auth.admin.listUsers({ page: 1, perPage: 1 }),
    service.from('screener_results').select('id', { count: 'exact', head: true }),
    service.from('screener_results').select('id', { count: 'exact', head: true }).gte('created_at', thisMonthStart),
    service.from('screener_results').select('id', { count: 'exact', head: true }).gte('created_at', lastMonthStart).lt('created_at', thisMonthStart),
    service.from('user_exercise_progress').select('id', { count: 'exact', head: true }),
    service.from('user_exercise_progress').select('id', { count: 'exact', head: true }).gte('created_at', thisMonthStart),
    service.from('user_exercise_progress').select('id', { count: 'exact', head: true }).gte('created_at', lastMonthStart).lt('created_at', thisMonthStart),
    service.from('calm_sessions').select('id', { count: 'exact', head: true }),
    service.from('calm_sessions').select('id', { count: 'exact', head: true }).gte('created_at', thisMonthStart),
    service.from('calm_sessions').select('id', { count: 'exact', head: true }).gte('created_at', lastMonthStart).lt('created_at', thisMonthStart),
    service.from('screener_results').select('created_at').gte('created_at', eightWeeksAgo),
    service.from('user_exercise_progress').select('created_at').gte('created_at', eightWeeksAgo),
    service.from('calm_sessions').select('created_at').gte('created_at', eightWeeksAgo),
  ]);

  const allSubs = allSubsRes.data ?? [];
  const recentSubs = recentSubsRes.data ?? [];
  const totalUsers = (totalUsersRes.data as { total?: number } | null)?.total ?? 0;

  // Metric counts
  const activeCount = allSubs.filter((s) => s.status === 'active' && !s.cancel_at_period_end).length;
  const trialCount = allSubs.filter((s) => s.status === 'trialing').length;
  const cancelledCount = allSubs.filter((s) => s.cancel_at_period_end || s.status === 'canceled').length;

  // This month vs last month (new subscriptions)
  const thisMonthNew = allSubs.filter((s) => s.created_at >= thisMonthStart).length;
  const lastMonthNew = allSubs.filter(
    (s) => s.created_at >= lastMonthStart && s.created_at < thisMonthStart,
  ).length;
  const newSubsChange = lastMonthNew > 0
    ? `${Math.round(Math.abs(((thisMonthNew - lastMonthNew) / lastMonthNew) * 100))}%`
    : thisMonthNew > 0 ? 'New' : '-';
  const newSubsUp = thisMonthNew >= lastMonthNew;

  // Conversion: active / (active + trial)
  const conversionPct =
    activeCount + trialCount > 0
      ? Math.round((activeCount / (activeCount + trialCount)) * 100)
      : 0;

  // ── Engagement metric counts ──
  const screenerTotal  = screenerTotalRes.count  ?? 0;
  const screenerThis   = screenerThisRes.count   ?? 0;
  const screenerLast   = screenerLastRes.count   ?? 0;
  const exerciseTotal  = exerciseTotalRes.count  ?? 0;
  const exerciseThis   = exerciseThisRes.count   ?? 0;
  const exerciseLast   = exerciseLastRes.count   ?? 0;
  const calmTotal      = calmTotalRes.count      ?? 0;
  const calmThis       = calmThisRes.count       ?? 0;
  const calmLast       = calmLastRes.count       ?? 0;

  function engChange(thisMonth: number, lastMonth: number): { text: string; up: boolean } {
    if (lastMonth === 0) return { text: thisMonth > 0 ? 'New' : '', up: true };
    const pct = Math.round(Math.abs(((thisMonth - lastMonth) / lastMonth) * 100));
    return { text: `${pct}%`, up: thisMonth >= lastMonth };
  }

  const screenerChange = engChange(screenerThis, screenerLast);
  const exerciseChange = engChange(exerciseThis, exerciseLast);
  const calmChange     = engChange(calmThis, calmLast);

  // ── Weekly bars — new subscriptions ──
  const weekMap = new Map<string, number>();
  for (const sub of recentSubs) {
    const key = isoWeekStart(new Date(sub.created_at));
    weekMap.set(key, (weekMap.get(key) ?? 0) + 1);
  }

  // Build last 8 complete weeks
  const weeks: { key: string; label: string; count: number }[] = [];
  for (let i = 7; i >= 0; i--) {
    const d = new Date(Date.now() - i * 7 * 86_400_000);
    const key = isoWeekStart(d);
    if (!weeks.find((w) => w.key === key)) {
      weeks.push({ key, label: weekLabel(key), count: weekMap.get(key) ?? 0 });
    }
  }
  const maxCount = Math.max(1, ...weeks.map((w) => w.count));
  const bars = weeks.map((w) => ({
    label: w.label,
    heightPct: Math.max(4, Math.round((w.count / maxCount) * 100)),
    count: w.count,
  }));

  // ── Weekly bars — engagement activity (screener + exercises + calm) ──
  const engWeekMap = new Map<string, number>();
  for (const row of [
    ...(screenerWeeklyRes.data ?? []),
    ...(exerciseWeeklyRes.data ?? []),
    ...(calmWeeklyRes.data ?? []),
  ] as { created_at: string }[]) {
    const key = isoWeekStart(new Date(row.created_at));
    engWeekMap.set(key, (engWeekMap.get(key) ?? 0) + 1);
  }
  const engWeeks = weeks.map((w) => ({ ...w, count: engWeekMap.get(w.key) ?? 0 }));
  const engMaxCount = Math.max(1, ...engWeeks.map((w) => w.count));
  const engBars = engWeeks.map((w) => ({
    label: w.label,
    heightPct: Math.max(4, Math.round((w.count / engMaxCount) * 100)),
    count: w.count,
  }));

  const dateRange = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F6F5' }}>
      <AdminSidebar active="analytics" adminEmail={adminUser?.email} />

      <main className="flex-1 min-w-0 px-[34px] py-[30px] pb-[40px]">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="font-heading text-[24px] font-semibold tracking-[-0.02em] mb-[3px]" style={{ color: '#26302D' }}>
              Overview
            </h1>
            <div className="text-[13px]" style={{ color: '#7A827D' }}>{dateRange}</div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-3 gap-[16px] mb-[22px]">
          <MetricCard
            label="Total users"
            value={totalUsers.toLocaleString()}
            change={newSubsChange !== '-' ? newSubsChange : ''}
            changeUp={newSubsUp}
            sub={`${thisMonthNew} new this month`}
          />
          <MetricCard
            label="Active subscribers"
            value={activeCount.toLocaleString()}
            change=""
            changeUp
            sub={`${trialCount} in trial · ${cancelledCount} cancelled`}
          />
          <MetricCard
            label="Trial → paid"
            value={`${conversionPct}%`}
            change=""
            changeUp={conversionPct >= 25}
            sub={`${activeCount} of ${activeCount + trialCount} converted`}
          />
        </div>

        {/* Weekly bar chart — subscriptions */}
        <div className="rounded-[14px] px-[26px] pt-[24px] pb-[20px] mb-[22px]" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
          <div className="flex items-center justify-between mb-[22px]">
            <div className="text-[14.5px] font-semibold" style={{ color: '#3A403C' }}>
              New subscriptions &middot; last 8 weeks
            </div>
            <div className="text-[12.5px]" style={{ color: '#9AA29C' }}>Weekly</div>
          </div>

          <div
            className="flex items-end gap-[22px]"
            style={{ height: 172, paddingBottom: 26 }}
            aria-label="Bar chart: new subscriptions over last 8 weeks"
            role="img"
          >
            {bars.map(({ label, heightPct, count }) => (
              <div key={label} className="flex-1 flex flex-col items-center justify-end gap-[8px]" style={{ height: '100%' }}>
                <div
                  className="w-full rounded-t-[7px] transition-all"
                  title={`${label}: ${count}`}
                  style={{ maxWidth: 52, height: `${heightPct}%`, background: barColor(heightPct) }}
                  aria-hidden="true"
                />
                <span className="text-[11.5px]" style={{ color: '#9AA29C' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="text-[11px] font-semibold tracking-[0.06em] uppercase mb-[16px]" style={{ color: '#9AA29C' }}>
          Engagement
        </div>

        {/* Engagement metric cards */}
        <div className="grid grid-cols-3 gap-[16px] mb-[22px]">
          <MetricCard
            label="Screener completions"
            value={screenerTotal.toLocaleString()}
            change={screenerChange.text}
            changeUp={screenerChange.up}
            sub={`${screenerThis} this month`}
          />
          <MetricCard
            label="Exercise completions"
            value={exerciseTotal.toLocaleString()}
            change={exerciseChange.text}
            changeUp={exerciseChange.up}
            sub={`${exerciseThis} this month`}
          />
          <MetricCard
            label="Calm sessions"
            value={calmTotal.toLocaleString()}
            change={calmChange.text}
            changeUp={calmChange.up}
            sub={`${calmThis} this month`}
          />
        </div>

        {/* Weekly bar chart — engagement */}
        <div className="rounded-[14px] px-[26px] pt-[24px] pb-[20px]" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
          <div className="flex items-center justify-between mb-[22px]">
            <div>
              <div className="text-[14.5px] font-semibold" style={{ color: '#3A403C' }}>
                Engagement activity &middot; last 8 weeks
              </div>
              <div className="text-[12px] mt-[3px]" style={{ color: '#9AA29C' }}>
                Screener completions, exercise completions &amp; calm sessions
              </div>
            </div>
            <div className="text-[12.5px]" style={{ color: '#9AA29C' }}>Weekly</div>
          </div>

          <div
            className="flex items-end gap-[22px]"
            style={{ height: 172, paddingBottom: 26 }}
            aria-label="Bar chart: engagement activity over last 8 weeks"
            role="img"
          >
            {engBars.map(({ label, heightPct, count }) => (
              <div key={label} className="flex-1 flex flex-col items-center justify-end gap-[8px]" style={{ height: '100%' }}>
                <div
                  className="w-full rounded-t-[7px] transition-all"
                  title={`${label}: ${count} events`}
                  style={{ maxWidth: 52, height: `${heightPct}%`, background: barColor(heightPct) }}
                  aria-hidden="true"
                />
                <span className="text-[11.5px]" style={{ color: '#9AA29C' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
