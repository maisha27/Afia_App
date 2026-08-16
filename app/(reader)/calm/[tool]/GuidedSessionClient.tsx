'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { recordCalmSession } from '@/lib/actions/calm';

export interface Step {
  heading: string;
  sub: string;
  durationMs: number;
}

export interface GuidedSessionProps {
  toolId: string;
  title: string;
  steps: Step[];
  completionMessage: string;
  completionDetail: string;
  isBreathing: boolean;
  accentRgb: string;
  cycleLength: number;
  icon: React.ReactNode;
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function GuidedSessionClient({
  toolId,
  title,
  steps,
  completionMessage,
  completionDetail,
  isBreathing,
  accentRgb,
  cycleLength,
  icon,
}: GuidedSessionProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [paused, setPaused] = useState(false);

  const currentStep = steps[stepIndex];
  const totalDurationMs = steps.reduce((sum, s) => sum + s.durationMs, 0);
  const elapsedMs = steps.slice(0, stepIndex).reduce((sum, s) => sum + s.durationMs, 0);
  const progressPct = totalDurationMs > 0 ? Math.min(100, Math.round((elapsedMs / totalDurationMs) * 100)) : 0;
  const remainingSeconds = Math.round((totalDurationMs - elapsedMs) / 1000);

  const totalUnits = isBreathing ? Math.round(steps.length / cycleLength) : steps.length;
  const currentUnit = isBreathing ? Math.floor(stepIndex / cycleLength) + 1 : stepIndex + 1;

  /* ─── Step timer ─── */
  useEffect(() => {
    if (paused || finished || !currentStep) return;
    const id = setTimeout(() => {
      if (stepIndex >= steps.length - 1) {
        setFinished(true);
      } else {
        setStepIndex((i) => i + 1);
      }
    }, currentStep.durationMs);
    return () => clearTimeout(id);
  }, [stepIndex, paused, finished, currentStep, steps.length]);

  /* ─── Record session on completion ─── */
  useEffect(() => {
    if (!finished) return;
    void recordCalmSession(toolId);
  }, [finished, toolId]);

  const accentColor = `rgb(${accentRgb})`;

  /* ─── Finished screen ─── */
  if (finished) {
    return (
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-10 text-center"
        style={{
          background: 'radial-gradient(120% 90% at 50% 34%, #3A5F56 0%, #2E4C45 46%, #213A34 100%)',
        }}
      >
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            top: -140, left: '50%', transform: 'translateX(-50%)',
            width: 760, height: 760,
            background: `radial-gradient(circle, rgba(${accentRgb},.16), rgba(${accentRgb},0) 62%)`,
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[400px]">
          <div className="relative mx-auto mb-10" style={{ width: 140, height: 140 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: `rgba(${accentRgb},.12)` }} />
            <div
              className="absolute rounded-full"
              style={{ inset: 18, background: `rgba(${accentRgb},.20)`, border: `1px solid rgba(${accentRgb},.30)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              {icon}
            </div>
          </div>

          <p className="text-[11px] font-semibold tracking-[0.16em] uppercase mb-3" style={{ color: '#8FB3A8' }}>
            Session complete
          </p>
          <h1 className="font-heading text-[32px] font-semibold tracking-[-0.02em] mb-3" style={{ color: '#FBFDFC' }}>
            {completionMessage}
          </h1>
          <p className="text-[16px] leading-[1.6] mb-9 [text-wrap:pretty]" style={{ color: '#B9D2C9' }}>
            {completionDetail}
          </p>

          <div className="flex flex-col gap-3 items-center">
            <Link
              href="/calm-tool"
              className="inline-flex items-center gap-2 font-heading text-[15.5px] font-semibold px-[30px] py-[14px] rounded-[12px] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{ background: '#EAF3EF', color: '#2A473F' }}
            >
              Back to calm tools
            </Link>
            <Link
              href="/home"
              className="text-[14px] font-medium px-4 py-2 rounded-[10px] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{ color: '#CADED6' }}
            >
              Go to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: 'radial-gradient(120% 90% at 50% 34%, #3A5F56 0%, #2E4C45 46%, #213A34 100%)',
      }}
    >
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: -140, left: '50%', transform: 'translateX(-50%)',
          width: 760, height: 760,
          background: `radial-gradient(circle, rgba(${accentRgb},.16), rgba(${accentRgb},0) 62%)`,
        }}
        aria-hidden="true"
      />

      {/* ── Top bar ── */}
      <div className="relative z-10 flex items-center justify-between px-[26px] py-[22px]">
        <Link
          href="/calm-tool"
          className="flex items-center gap-[9px] text-[13.5px] font-medium px-[10px] py-2 rounded-[10px] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{ color: '#CADED6', background: 'rgba(255,255,255,.06)' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#CADED6" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          Leave
        </Link>

        <div className="text-center leading-[1.3]">
          <div className="text-[10.5px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#8FB3A8' }}>
            Calm tool
          </div>
          <div className="font-heading text-[15px] font-semibold tracking-[-0.01em]" style={{ color: '#EAF3EF' }}>
            {title}
          </div>
        </div>

        <Link
          href="/crisis-support"
          className="flex items-center gap-2 text-[13px] font-semibold px-[13px] py-2 rounded-[10px] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{ color: '#E7BFB6', background: 'rgba(224,176,172,.14)' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#E7BFB6" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7Z" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          Crisis support
        </Link>
      </div>

      {/* ── Center visual + step cue ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 pt-2 pb-5">
        <div
          className="relative flex items-center justify-center mb-[34px]"
          style={{ width: 260, height: 260 }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 rounded-full animate-breathe"
            style={{ background: `rgba(${accentRgb},.08)` }}
          />
          <div
            className="absolute rounded-full animate-breathe"
            style={{ inset: 32, background: `rgba(${accentRgb},.13)`, animationDelay: '.3s' }}
          />
          <div
            className="absolute rounded-full flex items-center justify-center"
            style={{
              inset: 72,
              background: `rgba(${accentRgb},.20)`,
              border: `1px solid rgba(${accentRgb},.30)`,
            }}
          >
            {icon}
          </div>
        </div>

        <p
          className="font-heading text-[34px] font-semibold tracking-[-0.02em] mb-2 text-center"
          style={{ color: '#FBFDFC' }}
        >
          {currentStep?.heading}
        </p>
        <p
          className="text-[15px] leading-[1.6] text-center max-w-[380px] [text-wrap:pretty]"
          style={{ color: '#B9D2C9' }}
        >
          {currentStep?.sub}
        </p>
      </div>

      {/* ── Footer: progress + controls ── */}
      <div className="relative z-10 px-10 pb-[34px]">
        <div className="flex flex-col items-center gap-[10px] mb-[26px]">
          {isBreathing ? (
            <div className="w-full max-w-[320px] h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(234,243,239,.14)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%`, background: accentColor }}
              />
            </div>
          ) : (
            <div
              className="flex items-center gap-[8px]"
              aria-label={`Step ${currentUnit} of ${totalUnits}`}
              role="img"
            >
              {Array.from({ length: totalUnits }, (_, i) => (
                <span
                  key={i}
                  className="rounded-full transition-all duration-500"
                  style={
                    i < stepIndex
                      ? { width: 9, height: 9, background: accentColor }
                      : i === stepIndex
                      ? { width: 11, height: 11, background: '#EAF3EF', boxShadow: '0 0 0 4px rgba(234,243,239,.14)' }
                      : { width: 9, height: 9, background: 'rgba(234,243,239,.22)' }
                  }
                  aria-hidden="true"
                />
              ))}
            </div>
          )}

          <div className="text-[12.5px] tracking-[0.02em]" style={{ color: '#8FB3A8' }}>
            {isBreathing
              ? `Cycle ${currentUnit} of ${totalUnits} · about ${formatTime(remainingSeconds)} left`
              : `Step ${currentUnit} of ${totalUnits} · about ${formatTime(remainingSeconds)} left`}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center gap-[10px] font-heading text-[15.5px] font-semibold px-[30px] py-[14px] rounded-[12px] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ background: '#EAF3EF', color: '#2A473F' }}
          >
            {paused ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A473F" stroke="none" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Resume
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A473F" stroke="none" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
                Pause
              </>
            )}
          </button>
          <Link
            href="/calm-tool"
            className="inline-flex items-center text-[14px] font-medium px-[18px] py-[14px] rounded-[12px] transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ color: '#CADED6', border: '1px solid rgba(202,222,214,.28)' }}
          >
            End session
          </Link>
        </div>
      </div>
    </div>
  );
}
