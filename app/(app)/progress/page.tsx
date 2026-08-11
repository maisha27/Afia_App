import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Your progress — Afia' };

const PETALS_4 = [0, 90, 180, 270];

function MiniQuatrefoil() {
  return (
    <svg width="28" height="28" viewBox="0 0 400 400" aria-hidden="true" className="flex-shrink-0">
      <g
        fill="#2F6E7A"
        fillOpacity=".14"
        stroke="#2F6E7A"
        strokeOpacity=".55"
        strokeWidth="9"
        strokeLinejoin="round"
      >
        {PETALS_4.map((deg) => (
          <path
            key={deg}
            d="M200 200 Q167 128 200 58 Q233 128 200 200 Z"
            transform={deg === 0 ? undefined : `rotate(${deg} 200 200)`}
          />
        ))}
      </g>
    </svg>
  );
}

/* ─── Stat tile ─── */
function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white border border-[#E7E2DA] rounded-[14px] px-[18px] py-4">
      <div className="font-heading text-[26px] font-semibold text-[#2F5049]">{value}</div>
      <div className="text-[12.5px] text-[#767D79] mt-0.5">{label}</div>
    </div>
  );
}

/* ─── Domain shift row ─── */
interface DomainRowProps {
  label: string;
  beforePct: number;
  afterPct: number;
  beforeColor: string;
  afterColor: string;
  fromLabel: string;
  toLabel: string;
  toColor: string;
}

function DomainRow({ label, beforePct, afterPct, beforeColor, afterColor, fromLabel, toLabel, toColor }: DomainRowProps) {
  return (
    <div className="grid items-center gap-4" style={{ gridTemplateColumns: '120px 1fr auto' }}>
      <span className="text-[14.5px] font-semibold text-[#3A403C]">{label}</span>
      <div className="h-[8px] rounded-full bg-[#EFEAE2] relative">
        <div
          className="h-full rounded-full absolute top-0 left-0"
          style={{ width: `${beforePct}%`, background: beforeColor }}
        />
        <div
          className="h-full rounded-full absolute top-0 left-0"
          style={{ width: `${afterPct}%`, background: afterColor }}
        />
      </div>
      <span className="text-[12.5px] font-semibold text-[#8A928D] whitespace-nowrap">
        {fromLabel}{' '}
        <span className="text-[#C9C3B8]">→</span>{' '}
        <span style={{ color: toColor }}>{toLabel}</span>
      </span>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <main className="relative flex-1 overflow-hidden px-6 py-9 pb-11 lg:px-10">
      <div className="relative max-w-[680px]">
        {/* ── Header ── */}
        <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
          From your weekly check-ins
        </span>
        <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29] mt-2 mb-6">
          Your progress
        </h1>

        {/* ── Trend card ── */}
        <div className="bg-white border border-[#E7E2DA] rounded-[18px] px-[26px] py-[24px] mb-5">
          <div className="flex items-start justify-between mb-[18px]">
            <div>
              <div className="font-heading text-[17px] font-semibold text-[#3A403C]">
                How you&rsquo;ve been feeling
              </div>
              <div className="text-[13px] text-[#8A928D] mt-[3px]">
                Gently easing over two weeks
              </div>
            </div>
            <span className="inline-flex items-center gap-[7px] text-[12.5px] font-semibold text-[#2F6E7A] bg-[#E3F1EE] px-3 py-1.5 rounded-full flex-shrink-0 ml-4">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2F6E7A"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 15l6-6 4 4 6-7" />
                <path d="M20 6v5h-5" />
              </svg>
              Moderate → mild
            </span>
          </div>

          {/* Area chart SVG */}
          <svg
            viewBox="0 0 640 210"
            width="100%"
            height="180"
            aria-label="Progress trend from moderate to mild"
            style={{ display: 'block' }}
          >
            <defs>
              <linearGradient id="progFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2F6E7A" stopOpacity=".22" />
                <stop offset="1" stopColor="#2F6E7A" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="30" y1="40" x2="640" y2="40" stroke="#EFEAE2" strokeWidth="1" />
            <line x1="30" y1="100" x2="640" y2="100" stroke="#EFEAE2" strokeWidth="1" />
            <line x1="30" y1="160" x2="640" y2="160" stroke="#EFEAE2" strokeWidth="1" />
            <path
              d="M70 158 C 200 150 210 120 320 118 C 430 116 470 78 590 66 L 590 185 L 70 185 Z"
              fill="url(#progFill)"
            />
            <path
              d="M70 158 C 200 150 210 120 320 118 C 430 116 470 78 590 66"
              fill="none"
              stroke="#2F6E7A"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="70" cy="158" r="6" fill="#fff" stroke="#2F6E7A" strokeWidth="3" />
            <circle cx="320" cy="118" r="6" fill="#fff" stroke="#2F6E7A" strokeWidth="3" />
            <circle cx="590" cy="66" r="7" fill="#2F6E7A" stroke="#fff" strokeWidth="3" />
          </svg>
          <div
            className="flex justify-between text-[12px] font-semibold text-[#9AA29C] pt-1.5"
            style={{ padding: '6px 40px 0 56px' }}
          >
            <span>Start</span>
            <span>Week 1</span>
            <span>Week 2</span>
          </div>
        </div>

        {/* ── Domain shifts card ── */}
        <div className="bg-white border border-[#E7E2DA] rounded-[18px] px-[26px] py-[24px] mb-5">
          <div className="font-heading text-[17px] font-semibold text-[#3A403C] mb-5">
            Where it&rsquo;s shifting
          </div>
          <div className="flex flex-col gap-5">
            <DomainRow
              label="Persistent worry"
              beforePct={74}
              afterPct={58}
              beforeColor="#E4C7B2"
              afterColor="#D79A76"
              fromLabel="Often"
              toLabel="Sometimes"
              toColor="#B26A44"
            />
            <DomainRow
              label="Restless sleep"
              beforePct={52}
              afterPct={40}
              beforeColor="#E7D3A6"
              afterColor="#E0C07E"
              fromLabel="Sometimes"
              toLabel="Rarely"
              toColor="#B98E4A"
            />
            <DomainRow
              label="Low mood"
              beforePct={28}
              afterPct={22}
              beforeColor="#A9D2BF"
              afterColor="#7FBBA6"
              fromLabel="Rarely"
              toLabel="Rarely"
              toColor="#4F8C7B"
            />
          </div>
        </div>

        {/* ── Stat tiles ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[14px] mb-[22px]">
          <StatTile value={2} label="Check-ins" />
          <StatTile value={4} label="Plan steps" />
          <StatTile value={9} label="Calm sessions" />
          <StatTile value={6} label="Journal notes" />
        </div>

        {/* ── Gentle note ── */}
        <div className="flex items-center gap-[14px] bg-[#EAF3EF] border border-[#D4E7DF] rounded-[16px] px-[22px] py-[18px]">
          <MiniQuatrefoil />
          <p className="text-[14.5px] leading-[1.55] text-[#2F5049] [text-wrap:pretty]">
            Two weeks in and worry is already easing a little. Progress like this rarely moves in a
            straight line — a flat week isn&rsquo;t a step back.
          </p>
        </div>
      </div>
    </main>
  );
}
