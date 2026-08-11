'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useScreener } from './ScreenerProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import type { Band, ScoreResult } from '@/lib/scoring';

// Band → coloured word in headline
const BAND_COLORS: Record<Band, string> = {
  Low: '#2F6E7A',
  Mild: '#6B7D2C',
  Moderate: '#B26A44',
  High: '#B26A44',
  'Very High': '#B0503F',
};

// Band → ring colour on severity bar thumb
const THUMB_RING: Record<Band, string> = {
  Low: '#2F6E7A',
  Mild: '#6B7D2C',
  Moderate: '#B26A44',
  High: '#B26A44',
  'Very High': '#B0503F',
};

// Band → display text in h2
const BAND_LABEL: Record<Band, string> = {
  Low: 'minimal',
  Mild: 'mild',
  Moderate: 'moderate',
  High: 'significant',
  'Very High': 'high',
};

// Descriptive bridging message per band
const BRIDGE: Record<Band, string> = {
  Low: "These patterns tend to stay manageable. Afia's tools can help you keep it that way — catching worry early before it has a chance to build.",
  Mild: "At this level, gentle daily habits make a real difference. Afia's short practices are built for exactly where you are right now.",
  Moderate:
    "This is where structured support helps most. Afia's step-by-step programme is designed to gradually shift these patterns, one small practice at a time.",
  High: "Daily structured practice is one of the most effective ways through this. Afia gives you that structure, at your own pace, in a space only you can see.",
  'Very High':
    "At this level, self-help works best alongside professional support. Afia's programme can be part of that — a private, structured companion to your care.",
};

// Grouped question indices (0-based) for the "What stood out" insight card
const INSIGHT_GROUPS = [
  { label: 'Persistent worry', indices: [0, 4, 6, 11] },
  { label: 'Checking & reassurance', indices: [2, 7, 8] },
  { label: 'Impact on daily life', indices: [12, 13] },
] as const;

function avgScore(answers: (number | null)[], indices: readonly number[]): number {
  const vals = indices.map((i) => answers[i] ?? 0);
  return vals.reduce((s, v) => s + v, 0) / vals.length;
}

function intensityLabel(avg: number): { label: string; color: string } {
  if (avg < 0.75) return { label: 'Rarely', color: '#4F8C7B' };
  if (avg < 1.5) return { label: 'Sometimes', color: '#B98E4A' };
  if (avg < 2.5) return { label: 'Often', color: '#B26A44' };
  return { label: 'Frequently', color: '#B0503F' };
}

function barColor(avg: number): string {
  if (avg < 0.75) return '#7FBBA6';
  if (avg < 1.5) return '#E0C07E';
  if (avg < 2.5) return '#D79A76';
  return '#C86452';
}

// Severity gradient bar — thumb positioned by raw score (0-42)
const SEVERITY_GRADIENT =
  'linear-gradient(90deg, #B7D8C6 0%, #D9E3A8 34%, #EBD3A0 60%, #E3B79A 82%, #DCA394 100%)';

function thumbLeft(score: number): number {
  return Math.min(92, Math.max(8, (score / 42) * 100));
}

// ── Breathing quatrefoil (loading state) ────────────────────────────────────
function BreathingQuatrefoil() {
  const ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div className="relative w-[240px] h-[240px] mx-auto">
      {/* Halo */}
      <div
        className="absolute -inset-6 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 47%, rgba(47,110,122,0.18), rgba(47,110,122,0) 66%)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center animate-breathe motion-reduce:animate-none">
        <svg width="250" height="250" viewBox="0 0 400 400" aria-hidden="true">
          <g fill="#2F6E7A" fillOpacity="0.07" stroke="#2F6E7A" strokeOpacity="0.38" strokeWidth="2" strokeLinejoin="round">
            {ROTATIONS.map((r) => (
              <path key={r} d="M200 200 Q167 128 200 58 Q233 128 200 200 Z" transform={r ? `rotate(${r} 200 200)` : undefined} />
            ))}
          </g>
          <g transform="rotate(22.5 200 200)" fill="#2F6E7A" fillOpacity="0.10" stroke="#2F6E7A" strokeOpacity="0.30" strokeWidth="1.6" strokeLinejoin="round">
            {ROTATIONS.map((r) => (
              <path key={r} d="M200 200 Q179 158 200 108 Q221 158 200 200 Z" transform={r ? `rotate(${r} 200 200)` : undefined} />
            ))}
          </g>
          <circle cx="200" cy="200" r="7" fill="#2F6E7A" fillOpacity="0.55" />
        </svg>
      </div>
    </div>
  );
}

// ── Corner quatrefoil decoration ────────────────────────────────────────────
function CornerDecor({ className }: { className?: string }) {
  const ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      width="440"
      height="440"
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={`pointer-events-none ${className ?? ''}`}
    >
      <g fill="#2F6E7A" fillOpacity="0.05" stroke="#2F6E7A" strokeOpacity="0.28" strokeWidth="1.4" strokeLinejoin="round">
        {ROTATIONS.map((r) => (
          <path key={r} d="M200 200 Q167 128 200 58 Q233 128 200 200 Z" transform={r ? `rotate(${r} 200 200)` : undefined} />
        ))}
      </g>
    </svg>
  );
}

export function ResultView() {
  const { isComplete, getResult, answers } = useScreener();
  const router = useRouter();
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isComplete) {
      router.replace('/screener');
      return;
    }
    const computed = getResult();
    const timer = setTimeout(() => {
      setResult(computed);
      setLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [isComplete, getResult, router]);

  // ── Loading state (QST-002) ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader variant="screener" />

        <div className="relative overflow-hidden flex-1">
          {/* Tile bg with radial fade */}
          <div
            className="absolute inset-0 opacity-[0.1] pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='60'%3E%3Cpath d='M22 0Q44 0 44 30 44 60 22 60 0 60 0 30 0 0 22 0Z' fill='none' stroke='%232F6E7A' stroke-width='1.5'/%3E%3C/svg%3E\")",
              backgroundSize: '44px 60px',
              WebkitMaskImage: 'radial-gradient(circle at 50% 42%, #000, transparent 68%)',
              maskImage: 'radial-gradient(circle at 50% 42%, #000, transparent 68%)',
            }}
          />

          <div
            className="relative max-w-[560px] mx-auto px-6 py-[88px] pb-[96px] text-center"
            role="status"
            aria-live="polite"
          >
            <BreathingQuatrefoil />

            <div className="mt-10">
              <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
                Almost there
              </span>
              <h1 className="font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.025em] mt-3 mb-3.5">
                Reading your answers
              </h1>
              <p className="text-[16.5px] leading-[1.6] text-text-2 max-w-[440px] mx-auto mb-[26px] [text-wrap:pretty]">
                We're gathering your responses into one calm, honest reflection. This only takes a
                moment.
              </p>

              {/* Wave bars */}
              <div className="flex items-end justify-center gap-1.5 h-11" aria-hidden="true">
                <span className="w-2 rounded-full bg-primary animate-wave-bar" style={{ height: '18px', animationDelay: '0s' }} />
                <span className="w-2 rounded-full bg-primary animate-wave-bar" style={{ height: '30px', animationDelay: '0.16s' }} />
                <span className="w-2 rounded-full bg-primary animate-wave-bar" style={{ height: '30px', animationDelay: '0.32s' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { score, band, interpretation } = result;
  const bandColor = BAND_COLORS[band];
  const thumbRing = THUMB_RING[band];
  const label = BAND_LABEL[band];
  const bridge = BRIDGE[band];
  const left = thumbLeft(score);

  // Compute insight category data
  const insights = INSIGHT_GROUPS.map(({ label: catLabel, indices }) => {
    const avg = avgScore(answers, indices);
    const pct = Math.max(10, Math.round((avg / 3) * 100));
    const { label: intLabel, color: intColor } = intensityLabel(avg);
    const barCol = barColor(avg);
    return { label: catLabel, pct, intLabel, intColor, barCol };
  });

  const handleSeeHelp = () => {
    try {
      sessionStorage.setItem('afia_pending_result', JSON.stringify({ score, band }));
    } catch {
      // sessionStorage unavailable — sign-up still works
    }
    router.push('/sign-up');
  };

  // ── Result state (RES-001) ──────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader variant="screener" />

      <div className="relative overflow-hidden px-6 py-[56px] pb-[72px] sm:px-11">
        {/* Corner decorations */}
        <CornerDecor className="absolute top-[-186px] right-[-150px] rotate-[14deg] opacity-50" />
        <CornerDecor className="absolute bottom-[-186px] left-[-150px] rotate-[14deg] opacity-50" />

        <div className="relative max-w-[940px] mx-auto">
          <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-[1.15fr_0.85fr]">

            {/* ── Left: The reflection ───────────────────────────────── */}
            <div>
              <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
                Your reflection
              </span>
              <h1 className="font-heading text-[34px] leading-[1.16] font-semibold tracking-[-0.025em] mt-3 mb-4 [text-wrap:pretty]">
                Your answers point to{' '}
                <span style={{ color: bandColor }}>{label}</span>{' '}
                signs of anxiety.
              </h1>
              <p className="text-[16.5px] leading-[1.62] text-text-2 max-w-[480px] mb-[30px] [text-wrap:pretty]">
                {interpretation}
              </p>

              {/* Severity gradient bar */}
              <div className="mb-[34px] max-w-[480px]">
                <div className="relative h-3.5 rounded-full" style={{ background: SEVERITY_GRADIENT }}>
                  <div
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-white"
                    style={{
                      left: `${left}%`,
                      boxShadow: `0 3px 10px -2px rgba(20,24,22,0.4), 0 0 0 3px ${thumbRing}`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-3 text-[12px] font-semibold tracking-[0.02em] text-text-4">
                  <span>Minimal</span>
                  <span>Mild</span>
                  <span style={band === 'Moderate' ? { color: bandColor } : undefined}>Moderate</span>
                  <span style={band === 'High' ? { color: bandColor } : undefined}>Significant</span>
                </div>
              </div>

              {/* Bridge message */}
              <p className="text-[15px] leading-[1.6] text-text-2 max-w-[480px] mb-[30px] [text-wrap:pretty]">
                {bridge}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSeeHelp}
                  className="inline-flex items-center gap-2.5 rounded-[12px] bg-primary px-7 py-4 font-heading text-[16px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  style={{ boxShadow: '0 12px 24px -10px rgba(47,110,122,0.6)' }}
                >
                  See what could help
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
                <Link
                  href="/screener/1"
                  className="inline-flex items-center gap-2 rounded-[12px] border border-[#D9E0DA] bg-white px-[26px] py-4 font-heading text-[16px] font-semibold text-[#2F5049] hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Retake the check-in
                </Link>
              </div>
            </div>

            {/* ── Right: What stood out ──────────────────────────────── */}
            <div className="rounded-[18px] border border-[#E7E2DA] bg-white px-[26px] py-7" style={{ boxShadow: '0 20px 44px -30px rgba(20,24,22,0.35)' }}>
              <h2 className="font-heading text-[16px] font-semibold mb-1">What stood out</h2>
              <p className="text-[13.5px] leading-[1.55] text-text-3 mb-[22px]">
                The areas your answers touched most.
              </p>

              <div className="flex flex-col gap-5">
                {insights.map(({ label: catLabel, pct, intLabel, intColor, barCol }) => (
                  <div key={catLabel}>
                    <div className="flex justify-between items-baseline mb-2.5">
                      <span className="text-[14.5px] font-semibold text-text-1">{catLabel}</span>
                      <span className="text-[12.5px] font-semibold" style={{ color: intColor }}>{intLabel}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#EFEAE2] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: barCol }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer: disclaimer + crisis link */}
          <div className="mt-10 flex flex-col gap-2 border-t border-[#EFEAE2] pt-8">
            <p className="text-[12px] leading-[1.55] text-text-4">
              This is a self-reflection tool, not a medical or psychological diagnosis. Results are
              based on your self-reported responses and are intended to help you understand your
              patterns, not to confirm or rule out any condition.{' '}
              <Link href="/disclaimer" className="underline underline-offset-2 hover:text-foreground transition-colors">
                Medical disclaimer
              </Link>
            </p>
            <p className="text-[12px] text-text-4">
              If you are in distress right now,{' '}
              <Link
                href="/crisis-support"
                className="font-medium text-crisis hover:text-crisis/80 underline-offset-2 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                find support here
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
