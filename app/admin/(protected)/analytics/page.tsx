import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = { title: 'Analytics — Admin · Afia' };

const BARS: { label: string; heightPct: number; color: string }[] = [
  { label: '2 Jun', heightPct: 44, color: '#CDE5DD' },
  { label: '9 Jun', heightPct: 52, color: '#CDE5DD' },
  { label: '16 Jun', heightPct: 48, color: '#CDE5DD' },
  { label: '23 Jun', heightPct: 63, color: '#A9D6C9' },
  { label: '30 Jun', heightPct: 58, color: '#A9D6C9' },
  { label: '7 Jul', heightPct: 71, color: '#7FC3B2' },
  { label: '14 Jul', heightPct: 82, color: '#4FA694' },
  { label: '21 Jul', heightPct: 94, color: '#2F7A6D' },
];

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
    <div
      className="rounded-[14px] p-[22px]"
      style={{ background: '#fff', border: '1px solid #E4E6E2' }}
    >
      <div
        className="text-[12.5px] font-semibold tracking-[0.02em] mb-3"
        style={{ color: '#8A928D' }}
      >
        {label}
      </div>
      <div className="flex items-baseline gap-[10px] mb-[6px]">
        <span
          className="font-heading text-[34px] font-semibold tracking-[-0.02em]"
          style={{ color: '#26302D' }}
        >
          {value}
        </span>
        <span
          className="inline-flex items-center gap-[3px] text-[12px] font-semibold px-2 py-[3px] rounded-full"
          style={
            changeUp
              ? { color: '#276358', background: '#E3F1EE' }
              : { color: '#8A6410', background: '#FBF1E1' }
          }
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke={changeUp ? '#2F7A6D' : '#B58A2A'}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {changeUp ? <path d="M6 15l6-6 6 6" /> : <path d="M18 9l-6 6-6-6" />}
          </svg>
          {change}
        </span>
      </div>
      <div className="text-[12.5px]" style={{ color: '#9AA29C' }}>
        {sub}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <div className="flex min-h-screen" style={{ background: '#F5F6F5' }}>
      <AdminSidebar active="analytics" />

      <main className="flex-1 min-w-0 px-[34px] py-[30px] pb-[40px]">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1
              className="font-heading text-[24px] font-semibold tracking-[-0.02em] mb-[3px]"
              style={{ color: '#26302D' }}
            >
              Overview
            </h1>
            <div className="text-[13px]" style={{ color: '#7A827D' }}>
              1–31 July 2026
            </div>
          </div>
          {/* Date range picker */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-[9px] px-[13px] py-[9px] text-[13.5px] font-semibold hover:bg-[#F5F6F5] transition-colors"
            style={{ background: '#fff', border: '1px solid #DDE0DC', color: '#4A514C' }}
          >
            This month
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8A928D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* Three metric cards */}
        <div className="grid grid-cols-3 gap-[16px] mb-[22px]">
          <MetricCard
            label="New signups"
            value="214"
            change="18%"
            changeUp
            sub="vs 181 last month"
          />
          <MetricCard
            label="Active users · 30-day"
            value="892"
            change="6%"
            changeUp
            sub="vs 841 last month"
          />
          <MetricCard
            label="Trial → paid conversion"
            value="27%"
            change="2 pts"
            changeUp={false}
            sub="58 of 214 trials converted"
          />
        </div>

        {/* Signup trend bar chart */}
        <div
          className="rounded-[14px] px-[26px] pt-[24px] pb-[20px]"
          style={{ background: '#fff', border: '1px solid #E4E6E2' }}
        >
          <div className="flex items-center justify-between mb-[22px]">
            <div className="text-[14.5px] font-semibold" style={{ color: '#3A403C' }}>
              New signups &middot; last 8 weeks
            </div>
            <div className="text-[12.5px]" style={{ color: '#9AA29C' }}>
              Weekly
            </div>
          </div>

          <div
            className="flex items-end gap-[22px]"
            style={{ height: 172, paddingBottom: 26, position: 'relative' }}
            aria-label="Bar chart: new signups over last 8 weeks"
            role="img"
          >
            {BARS.map(({ label, heightPct, color }) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center justify-end gap-[8px]"
                style={{ height: '100%' }}
              >
                <div
                  className="w-full rounded-t-[7px]"
                  style={{ maxWidth: 52, height: `${heightPct}%`, background: color }}
                  aria-hidden="true"
                />
                <span className="text-[11.5px]" style={{ color: '#9AA29C' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
