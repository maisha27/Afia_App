'use client';

import { useEffect, useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { useScreener } from './ScreenerProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { AnimatedQuatrefoil } from '@/components/brand/AnimatedQuatrefoil';
import { saveScreenerResult } from '@/lib/actions/auth';
import type { Band, ScoreResult } from '@/lib/scoring';

// ── Band display maps ────────────────────────────────────────────────────────

const BAND_COLORS: Record<Band, string> = {
  Low: '#2F6E7A',
  Mild: '#6B7D2C',
  Moderate: '#B26A44',
  High: '#B26A44',
  'Very High': '#B0503F',
};

const THUMB_RING: Record<Band, string> = {
  Low: '#2F6E7A',
  Mild: '#6B7D2C',
  Moderate: '#B26A44',
  High: '#B26A44',
  'Very High': '#B0503F',
};

const BAND_LABEL: Record<Band, string> = {
  Low: 'minimal',
  Mild: 'mild',
  Moderate: 'moderate',
  High: 'significant',
  'Very High': 'high',
};

const BRIDGE: Record<Band, string> = {
  Low: "These patterns tend to stay manageable. Afia's tools can help you keep it that way — catching worry early before it has a chance to build.",
  Mild: "At this level, gentle daily habits make a real difference. Afia's short practices are built for exactly where you are right now.",
  Moderate:
    "This is where structured support helps most. Afia's step-by-step programme is designed to gradually shift these patterns, one small practice at a time.",
  High: "Daily structured practice is one of the most effective ways through this. Afia gives you that structure, at your own pace, in a space only you can see.",
  'Very High':
    "At this level, self-help works best alongside professional support. Afia's programme can be part of that — a private, structured companion to your care.",
};

// ── Insight groups ───────────────────────────────────────────────────────────

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

// ── Severity bar ─────────────────────────────────────────────────────────────

const SEVERITY_GRADIENT =
  'linear-gradient(90deg, #B7D8C6 0%, #D9E3A8 34%, #EBD3A0 60%, #E3B79A 82%, #DCA394 100%)';

function thumbLeft(score: number): number {
  return Math.min(92, Math.max(8, (score / 42) * 100));
}

// ── Corner decoration ────────────────────────────────────────────────────────

function CornerDecor({ className }: { className?: string }) {
  const ROTS = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      width="440"
      height="440"
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={`pointer-events-none ${className ?? ''}`}
    >
      <g
        fill="#2F6E7A"
        fillOpacity="0.05"
        stroke="#2F6E7A"
        strokeOpacity="0.28"
        strokeWidth="1.4"
        strokeLinejoin="round"
      >
        {ROTS.map((r) => (
          <path
            key={r}
            d="M200 200 Q167 128 200 58 Q233 128 200 200 Z"
            transform={r ? `rotate(${r} 200 200)` : undefined}
          />
        ))}
      </g>
    </svg>
  );
}

// ── Easing constant ──────────────────────────────────────────────────────────
const EASE_CALM: [number, number, number, number] = [0.25, 0, 0.15, 1];
const EASE_SPRING: [number, number, number, number] = [0.34, 1.0, 0.64, 1.0];

// ── ResultView ───────────────────────────────────────────────────────────────

export function ResultView({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const { isComplete, getResult, answers } = useScreener();
  const router = useRouter();

  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [thumbPos, setThumbPos] = useState(0);
  const [barsReady, setBarsReady] = useState(false);
  const [isPending, startTransition] = useTransition();

  const rafRef = useRef<number | null>(null);

  // ── Drive the loading counter ──────────────────────────────────────────────
  useEffect(() => {
    if (!isComplete) {
      router.replace('/screener');
      return;
    }

    const computed = getResult();
    const START = performance.now();
    const DURATION_MS = 1750;
    let lastPct = -1;

    const tick = (now: number) => {
      const elapsed = now - START;
      const pct = Math.min(100, Math.round((elapsed / DURATION_MS) * 100));

      if (pct !== lastPct) {
        lastPct = pct;
        setProgress(pct);
      }

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setResult(computed);
          setLoading(false);
        }, 220);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isComplete, getResult, router]);

  // ── Animate severity thumb + insight bars once result arrives ──────────────
  useEffect(() => {
    if (!result) return;
    const t1 = setTimeout(() => setThumbPos(thumbLeft(result.score)), 130);
    const t2 = setTimeout(() => setBarsReady(true), 280);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [result]);

  // ── CTA handler ───────────────────────────────────────────────────────────
  const handleSeeHelp = () => {
    if (!result) return;
    const { score, band } = result;
    if (isLoggedIn) {
      startTransition(async () => {
        await saveScreenerResult({ score, band, answers: answers.map((a) => a ?? 0) });
        router.push('/progress');
      });
      return;
    }
    try {
      sessionStorage.setItem(
        'afia_pending_result',
        JSON.stringify({ score, band, answers: answers.map((a) => a ?? 0) }),
      );
    } catch {
      // sessionStorage unavailable — sign-up still works
    }
    router.push('/sign-up');
  };

  // ── Shared page shell (header never re-mounts) ────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader variant="screener" />

      <AnimatePresence mode="wait">
        {/* ── Loading screen ── */}
        {loading && (
          <motion.div
            key="loading"
            className="relative overflow-hidden flex-1"
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
          >
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
              {/* Sequential petal bloom */}
              <div className="flex justify-center mb-10">
                <AnimatedQuatrefoil
                  size={240}
                  withHalo
                  haloColor="47,110,122"
                />
              </div>

              <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
                Almost there
              </span>
              <h1 className="font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.025em] mt-3 mb-3">
                Reading your answers
              </h1>
              <p className="text-[16.5px] leading-[1.6] text-text-2 max-w-[440px] mx-auto mb-[28px] [text-wrap:pretty]">
                We&rsquo;re gathering your responses into one calm, honest reflection.
              </p>

              {/* Progress bar + percentage */}
              <div className="max-w-[440px] mx-auto">
                <div className="h-[3px] w-full rounded-full bg-[#E7E2DA] overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${progress}%`,
                      transition: 'width 80ms linear',
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12.5px] text-text-3">Analysing your patterns</span>
                  <span className="font-heading text-[14px] font-semibold text-primary tabular-nums">
                    {progress}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Result screen ── */}
        {!loading && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.38, ease: EASE_CALM }}
            className="relative overflow-hidden px-6 py-[56px] pb-[72px] sm:px-11"
          >
            {/* Corner decorations */}
            <CornerDecor className="absolute top-[-186px] right-[-150px] rotate-[14deg] opacity-50" />
            <CornerDecor className="absolute bottom-[-186px] left-[-150px] rotate-[14deg] opacity-50" />

            <div className="relative max-w-[940px] mx-auto">
              <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-[1.15fr_0.85fr]">

                {/* ── Left: The reflection ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.52, delay: 0.06, ease: EASE_CALM }}
                >
                  <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
                    Your reflection
                  </span>
                  <h1 className="font-heading text-[34px] leading-[1.16] font-semibold tracking-[-0.025em] mt-3 mb-4 [text-wrap:pretty]">
                    Your answers point to{' '}
                    <span style={{ color: BAND_COLORS[result.band] }}>{BAND_LABEL[result.band]}</span>{' '}
                    signs of anxiety.
                  </h1>
                  <p className="text-[16.5px] leading-[1.62] text-text-2 max-w-[480px] mb-[30px] [text-wrap:pretty]">
                    {result.interpretation}
                  </p>

                  {/* Severity gradient bar */}
                  <div className="mb-[34px] max-w-[480px]">
                    <div
                      className="relative h-3.5 rounded-full"
                      style={{ background: SEVERITY_GRADIENT }}
                    >
                      <div
                        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-full bg-white"
                        style={{
                          left: `${thumbPos}%`,
                          transition: 'left 800ms cubic-bezier(0.34, 1.0, 0.64, 1.0)',
                          boxShadow: `0 3px 10px -2px rgba(20,24,22,0.4), 0 0 0 3px ${THUMB_RING[result.band]}`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-3 text-[12px] font-semibold tracking-[0.02em] text-text-4">
                      <span>Minimal</span>
                      <span>Mild</span>
                      <span
                        style={
                          result.band === 'Moderate'
                            ? { color: BAND_COLORS[result.band] }
                            : undefined
                        }
                      >
                        Moderate
                      </span>
                      <span
                        style={
                          result.band === 'High'
                            ? { color: BAND_COLORS[result.band] }
                            : undefined
                        }
                      >
                        Significant
                      </span>
                    </div>
                  </div>

                  {/* Bridge message */}
                  <p className="text-[15px] leading-[1.6] text-text-2 max-w-[480px] mb-[30px] [text-wrap:pretty]">
                    {BRIDGE[result.band]}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleSeeHelp}
                      disabled={isPending}
                      className="inline-flex items-center gap-2.5 rounded-[12px] bg-primary px-7 py-4 font-heading text-[16px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-70"
                      style={{ boxShadow: '0 12px 24px -10px rgba(47,110,122,0.6)' }}
                    >
                      {isPending
                        ? 'Saving…'
                        : isLoggedIn
                        ? 'Save my check-in'
                        : 'See what could help'}
                      {!isPending && (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      )}
                    </button>
                    <Link
                      href="/screener/1"
                      className="inline-flex items-center gap-2 rounded-[12px] border border-[#D9E0DA] bg-white px-[26px] py-4 font-heading text-[16px] font-semibold text-[#2F5049] hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Retake the check-in
                    </Link>
                  </div>
                </motion.div>

                {/* ── Right: What stood out ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.52, delay: 0.18, ease: EASE_CALM }}
                  className="rounded-[18px] border border-[#E7E2DA] bg-white px-[26px] py-7"
                  style={{ boxShadow: '0 20px 44px -30px rgba(20,24,22,0.35)' }}
                >
                  <h2 className="font-heading text-[16px] font-semibold mb-1">What stood out</h2>
                  <p className="text-[13.5px] leading-[1.55] text-text-3 mb-[22px]">
                    The areas your answers touched most.
                  </p>

                  <div className="flex flex-col gap-5">
                    {INSIGHT_GROUPS.map(({ label: catLabel, indices }) => {
                      const avg = avgScore(answers, indices);
                      const pct = Math.max(10, Math.round((avg / 3) * 100));
                      const { label: intLabel, color: intColor } = intensityLabel(avg);
                      const barCol = barColor(avg);
                      return (
                        <div key={catLabel}>
                          <div className="flex justify-between items-baseline mb-2.5">
                            <span className="text-[14.5px] font-semibold text-text-1">
                              {catLabel}
                            </span>
                            <span
                              className="text-[12.5px] font-semibold"
                              style={{ color: intColor }}
                            >
                              {intLabel}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-[#EFEAE2] overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: barsReady ? `${pct}%` : '0%',
                                background: barCol,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Footer: disclaimer + crisis link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35, ease: EASE_CALM }}
                className="mt-10 flex flex-col gap-2 border-t border-[#EFEAE2] pt-8"
              >
                <p className="text-[12px] leading-[1.55] text-text-4">
                  This is a self-reflection tool, not a medical or psychological diagnosis. Results
                  are based on your self-reported responses and are intended to help you understand
                  your patterns, not to confirm or rule out any condition.{' '}
                  <Link
                    href="/disclaimer"
                    className="underline underline-offset-2 hover:text-foreground transition-colors"
                  >
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
