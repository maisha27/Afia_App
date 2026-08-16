import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Your progress — Afia' };

/* ─── Domain groupings (same as ResultView INSIGHT_GROUPS) ─── */
const DOMAIN_GROUPS = [
  {
    label: 'Persistent worry',
    indices: [0, 4, 6, 11] as const,
    beforeColor: '#E4C7B2',
    afterColor: '#D79A76',
    toColor: '#B26A44',
  },
  {
    label: 'Checking & reassurance',
    indices: [2, 7, 8] as const,
    beforeColor: '#E7D3A6',
    afterColor: '#E0C07E',
    toColor: '#B98E4A',
  },
  {
    label: 'Impact on daily life',
    indices: [12, 13] as const,
    beforeColor: '#A9D2BF',
    afterColor: '#7FBBA6',
    toColor: '#4F8C7B',
  },
] as const;

/* ─── Band display labels ─── */
const BAND_DISPLAY: Record<string, string> = {
  Low: 'Low',
  Mild: 'Mild',
  Moderate: 'Moderate',
  High: 'High',
  'Very High': 'Very High',
};

/* ─── Helpers ─── */
function parseAnswers(raw: unknown): number[] | null {
  if (!Array.isArray(raw) || raw.length !== 14) return null;
  if (!raw.every((v) => typeof v === 'number' && v >= 0 && v <= 3)) return null;
  return raw as number[];
}

function domainAvg(answers: number[], indices: readonly number[]): number {
  const vals = indices.map((i) => answers[i] ?? 0);
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

function intensityLabel(avg: number): { label: string; color: string } {
  if (avg < 0.75) return { label: 'Rarely', color: '#4F8C7B' };
  if (avg < 1.5) return { label: 'Sometimes', color: '#B98E4A' };
  if (avg < 2.5) return { label: 'Often', color: '#B26A44' };
  return { label: 'Frequently', color: '#B0503F' };
}

function domainPct(answers: number[], indices: readonly number[]): number {
  const avg = domainAvg(answers, indices);
  return Math.round((avg / 3) * 100);
}

function scoreToY(score: number): number {
  // Higher on screen (lower svgY) = better (lower anxiety score)
  return Math.round(40 + (score / 42) * 120);
}

function xForIndex(i: number, total: number): number {
  if (total === 1) return 330;
  return Math.round(70 + (i / (total - 1)) * 520);
}

function formatCheckInDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

/* ─── Sub-components ─── */
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
        {[0, 90, 180, 270].map((deg) => (
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

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white border border-[#E7E2DA] rounded-[14px] px-[18px] py-4">
      <div className="font-heading text-[26px] font-semibold text-[#2F5049]">{value}</div>
      <div className="text-[12.5px] text-[#767D79] mt-0.5">{label}</div>
    </div>
  );
}

interface DomainRowProps {
  label: string;
  beforePct: number | null;
  afterPct: number;
  beforeColor: string;
  afterColor: string;
  fromLabel: string | null;
  toLabel: string;
  toColor: string;
}

function DomainRow({
  label,
  beforePct,
  afterPct,
  beforeColor,
  afterColor,
  fromLabel,
  toLabel,
  toColor,
}: DomainRowProps) {
  return (
    <div className="grid items-center gap-4" style={{ gridTemplateColumns: '140px 1fr auto' }}>
      <span className="text-[14.5px] font-semibold text-[#3A403C]">{label}</span>
      <div className="h-[8px] rounded-full bg-[#EFEAE2] relative">
        {beforePct !== null && (
          <div
            className="h-full rounded-full absolute top-0 left-0"
            style={{ width: `${beforePct}%`, background: beforeColor }}
          />
        )}
        <div
          className="h-full rounded-full absolute top-0 left-0"
          style={{ width: `${Math.max(4, afterPct)}%`, background: afterColor }}
        />
      </div>
      <span className="text-[12.5px] font-semibold text-[#8A928D] whitespace-nowrap">
        {fromLabel ? (
          <>
            {fromLabel} <span className="text-[#C9C3B8]">→</span>{' '}
            <span style={{ color: toColor }}>{toLabel}</span>
          </>
        ) : (
          <span style={{ color: toColor }}>{toLabel}</span>
        )}
      </span>
    </div>
  );
}

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const [screenerRes, progressRes, calmRes, journalRes] = await Promise.all([
    supabase
      .from('screener_results')
      .select('score, band, answers, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('user_exercise_progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('calm_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('journal_entries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ]);

  const checkIns = (screenerRes.data ?? []) as {
    score: number;
    band: string;
    answers: unknown;
    created_at: string;
  }[];
  const planSteps = progressRes.count ?? 0;
  const calmCount = calmRes.count ?? 0;
  const journalCount = journalRes.count ?? 0;

  const hasCheckIns = checkIns.length > 0;
  const hasMultiple = checkIns.length >= 2;

  const firstResult = hasCheckIns ? checkIns[0] : null;
  const latestResult = hasCheckIns ? checkIns[checkIns.length - 1] : null;

  const firstAnswers = firstResult ? parseAnswers(firstResult.answers) : null;
  const latestAnswers = latestResult ? parseAnswers(latestResult.answers) : null;
  const hasAnswers = latestAnswers !== null;

  /* ─── Trend badge ─── */
  const firstBand = firstResult ? (BAND_DISPLAY[firstResult.band] ?? firstResult.band) : null;
  const latestBand = latestResult ? (BAND_DISPLAY[latestResult.band] ?? latestResult.band) : null;
  const improving = hasMultiple && firstResult!.score > latestResult!.score + 2;
  const worsening = hasMultiple && latestResult!.score > firstResult!.score + 2;

  /* ─── Trend subtitle ─── */
  const weeksApart =
    hasMultiple
      ? Math.max(1, Math.round(
          (new Date(latestResult!.created_at).getTime() - new Date(firstResult!.created_at).getTime()) /
            (7 * 24 * 60 * 60 * 1000),
        ))
      : 0;

  const weekLabel = weeksApart === 1 ? 'one week' : `${weeksApart} weeks`;

  let trendSubtitle: string;
  if (!hasCheckIns) {
    trendSubtitle = 'Complete your first check-in to start tracking';
  } else if (!hasMultiple) {
    trendSubtitle = 'Your baseline — check in again to see your trend';
  } else if (improving) {
    trendSubtitle = `Gently easing over ${weekLabel}`;
  } else if (worsening) {
    trendSubtitle = `Worth checking in on over ${weekLabel}`;
  } else {
    trendSubtitle = `Holding steady over ${weekLabel}`;
  }

  /* ─── SVG chart points ─── */
  const chartPoints = checkIns.map((ci, i) => ({
    x: xForIndex(i, checkIns.length),
    y: scoreToY(ci.score),
    date: formatCheckInDate(ci.created_at),
  }));

  let linePath = '';
  let areaPath = '';
  if (chartPoints.length === 1) {
    // No path, just the dot
  } else if (chartPoints.length >= 2) {
    linePath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
    areaPath =
      linePath +
      ` L${chartPoints[chartPoints.length - 1].x} 185 L${chartPoints[0].x} 185 Z`;
  }

  /* ─── Domain data ─── */
  const domainData = DOMAIN_GROUPS.map((domain) => {
    const currentPct = latestAnswers ? domainPct(latestAnswers, domain.indices) : 0;
    const priorPct = hasMultiple && firstAnswers ? domainPct(firstAnswers, domain.indices) : null;
    const currentIntensity = latestAnswers
      ? intensityLabel(domainAvg(latestAnswers, domain.indices))
      : null;
    const priorIntensity =
      hasMultiple && firstAnswers
        ? intensityLabel(domainAvg(firstAnswers, domain.indices))
        : null;

    return {
      ...domain,
      afterPct: currentPct,
      beforePct: priorPct,
      toLabel: currentIntensity?.label ?? '—',
      toColor: currentIntensity?.color ?? domain.toColor,
      fromLabel: priorIntensity?.label ?? null,
    };
  });

  /* ─── Gentle note text ─── */
  let gentleNote: string;
  if (!hasCheckIns) {
    gentleNote =
      'Your journey starts with one step. Complete your first check-in to see your patterns taking shape.';
  } else if (!hasMultiple) {
    gentleNote =
      "You've taken the first step — that's the hardest one. Your next check-in will show what's already beginning to shift.";
  } else if (improving) {
    gentleNote =
      "Progress like this rarely moves in a straight line — a steady direction is all you need. A flat week isn't a step back.";
  } else if (worsening) {
    gentleNote =
      "A harder week doesn't undo the work you've done. Just notice what feels different — that's insight you can use.";
  } else {
    gentleNote =
      "Staying steady is its own kind of progress. Notice what you’re doing to hold that ground — it’s already working.";
  }

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-9 pb-11 lg:px-10">
      <div className="relative max-w-[680px]">
        {/* ── Header ── */}
        <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
          From your weekly check-ins
        </span>
        <div className="flex items-end justify-between mb-6 mt-2 gap-4 flex-wrap">
          <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29]">
            Your progress
          </h1>
          <Link
            href="/screener/1"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-primary border border-primary/30 px-4 py-2 rounded-[10px] hover:bg-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex-shrink-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New check-in
          </Link>
        </div>

        {/* ── Trend card ── */}
        <div className="bg-white border border-[#E7E2DA] rounded-[18px] px-[26px] py-[24px] mb-5">
          <div className="flex items-start justify-between mb-[18px]">
            <div>
              <div className="font-heading text-[17px] font-semibold text-[#3A403C]">
                How you&rsquo;ve been feeling
              </div>
              <div className="text-[13px] text-[#8A928D] mt-[3px]">{trendSubtitle}</div>
            </div>
            {hasCheckIns && (
              <span className="inline-flex items-center gap-[7px] text-[12.5px] font-semibold text-[#2F6E7A] bg-[#E3F1EE] px-3 py-1.5 rounded-full flex-shrink-0 ml-4">
                {hasMultiple && improving && (
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
                )}
                {hasMultiple && firstBand !== latestBand
                  ? `${firstBand} → ${latestBand}`
                  : latestBand}
              </span>
            )}
          </div>

          {hasCheckIns ? (
            <>
              <svg
                viewBox="0 0 640 210"
                width="100%"
                height="180"
                aria-label="Progress trend chart"
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

                {areaPath && (
                  <path d={areaPath} fill="url(#progFill)" />
                )}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#2F6E7A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {chartPoints.map((p, i) => {
                  const isLast = i === chartPoints.length - 1;
                  return isLast ? (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="7"
                      fill="#2F6E7A"
                      stroke="#fff"
                      strokeWidth="3"
                    />
                  ) : (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="6"
                      fill="#fff"
                      stroke="#2F6E7A"
                      strokeWidth="3"
                    />
                  );
                })}
              </svg>

              <div className="flex pt-1.5" style={{ paddingLeft: 56, paddingRight: 40 }}>
                {chartPoints.map((p, i) => {
                  const isFirst = i === 0;
                  const isLast = i === chartPoints.length - 1;
                  return (
                    <span
                      key={i}
                      className="text-[12px] font-semibold text-[#9AA29C] flex-1"
                      style={{
                        textAlign: isFirst ? 'left' : isLast ? 'right' : 'center',
                      }}
                    >
                      {isFirst ? 'Start' : p.date}
                    </span>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <div
                className="w-[48px] h-[48px] rounded-full flex items-center justify-center"
                style={{ background: '#E3F1EE' }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2F6E7A"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 15l6-6 4 4 6-7" />
                  <path d="M20 6v5h-5" />
                </svg>
              </div>
              <p className="text-[14px] text-[#767D79] max-w-[280px] leading-[1.55]">
                Complete your first check-in to see your trend here.
              </p>
              <Link
                href="/screener/1"
                className="text-[13.5px] font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Start check-in →
              </Link>
            </div>
          )}
        </div>

        {/* ── Domain shifts card ── */}
        {hasCheckIns && (
          <div className="bg-white border border-[#E7E2DA] rounded-[18px] px-[26px] py-[24px] mb-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="font-heading text-[17px] font-semibold text-[#3A403C]">
                  Where it&rsquo;s shifting
                </div>
                {!hasAnswers && (
                  <p className="text-[13px] text-[#8A928D] mt-1 max-w-[380px]">
                    Domain breakdowns are available for check-ins taken within the app.
                  </p>
                )}
              </div>
              {hasMultiple && hasAnswers && (
                <span className="text-[11.5px] font-semibold text-[#8A928D] flex-shrink-0 ml-4 mt-0.5">
                  {checkIns.length} check-ins
                </span>
              )}
            </div>

            {hasAnswers ? (
              <div className="flex flex-col gap-5">
                {domainData.map((domain) => (
                  <DomainRow
                    key={domain.label}
                    label={domain.label}
                    beforePct={domain.beforePct}
                    afterPct={domain.afterPct}
                    beforeColor={domain.beforeColor}
                    afterColor={domain.afterColor}
                    fromLabel={domain.fromLabel}
                    toLabel={domain.toLabel}
                    toColor={domain.toColor}
                  />
                ))}
                {!hasMultiple && (
                  <p className="text-[12.5px] text-[#8A928D] pt-1">
                    After your next check-in you&rsquo;ll see before and after for each area.
                  </p>
                )}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-[14px] text-[#8A928D]">
                  Take a new check-in to unlock domain tracking.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Stat tiles ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[14px] mb-[22px]">
          <StatTile value={checkIns.length} label="Check-ins" />
          <StatTile value={planSteps} label="Plan steps" />
          <StatTile value={calmCount} label="Calm sessions" />
          <StatTile value={journalCount} label="Journal notes" />
        </div>

        {/* ── Gentle note ── */}
        <div className="flex items-center gap-[14px] bg-[#EAF3EF] border border-[#D4E7DF] rounded-[16px] px-[22px] py-[18px]">
          <MiniQuatrefoil />
          <p className="text-[14.5px] leading-[1.55] text-[#2F5049] [text-wrap:pretty]">
            {gentleNote}
          </p>
        </div>
      </div>
    </main>
  );
}
