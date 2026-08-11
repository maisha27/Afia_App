'use client';

import Link from 'next/link';
import { useState } from 'react';

const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];

const ROUNDS = [
  { past: true },
  { past: true },
  { active: true },
  {},
  {},
  {},
];

type Phase = 'breathe-in' | 'hold' | 'breathe-out' | 'rest';

const PHASE_LABELS: Record<Phase, { heading: string; sub: string }> = {
  'breathe-in': {
    heading: 'Breathe in',
    sub: "Follow the bloom as it opens — slowly, through your nose. There's no wrong way to do this.",
  },
  hold: {
    heading: 'Hold gently',
    sub: 'Stay here for a moment, easy and still.',
  },
  'breathe-out': {
    heading: 'Breathe out',
    sub: 'Let it go slowly through your mouth — longer than the inhale.',
  },
  rest: {
    heading: 'Rest',
    sub: 'Pause here before the next breath. You\'re doing well.',
  },
};

export default function BreatheSessionPage() {
  const [paused, setPaused] = useState(false);
  const [phase] = useState<Phase>('breathe-in');

  const { heading, sub } = PHASE_LABELS[phase];
  const animState = paused ? 'paused' : 'running';

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: 'radial-gradient(120% 90% at 50% 34%, #3A5F56 0%, #2E4C45 46%, #213A34 100%)',
      }}
    >
      {/* Ambient halo */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: -140,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 760,
          height: 760,
          background: 'radial-gradient(circle, rgba(159,201,188,.16), rgba(159,201,188,0) 62%)',
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
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#CADED6"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M15 5l-7 7 7 7" />
          </svg>
          Leave
        </Link>

        <div className="text-center leading-[1.3]">
          <div className="text-[10.5px] font-semibold tracking-[0.16em] uppercase text-[#8FB3A8]">
            Breathing
          </div>
          <div
            className="font-heading text-[15px] font-semibold tracking-[-0.01em]"
            style={{ color: '#EAF3EF' }}
          >
            Take a breath
          </div>
        </div>

        <Link
          href="/crisis-support"
          className="flex items-center gap-2 text-[13px] font-semibold px-[13px] py-2 rounded-[10px] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{ color: '#E7BFB6', background: 'rgba(224,176,172,.14)' }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#E7BFB6"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 2 3 7v6c0 5 3.5 8 9 9 5.5-1 9-4 9-9V7Z" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          Crisis support
        </Link>
      </div>

      {/* ── Breathing bloom + cue ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-10 pt-2 pb-5">
        {/* Bloom container */}
        <div
          className="relative flex items-center justify-center mb-[34px]"
          style={{ width: 300, height: 300 }}
          aria-label={heading}
          role="img"
        >
          {/* Layer 1 — outermost */}
          <div
            className="absolute w-[300px] h-[300px] rounded-full animate-breathe"
            style={{
              background: 'rgba(159,201,188,.10)',
              animationPlayState: animState,
            }}
            aria-hidden="true"
          />
          {/* Layer 2 */}
          <div
            className="absolute w-[232px] h-[232px] rounded-full animate-breathe"
            style={{
              background: 'rgba(159,201,188,.14)',
              animationDelay: '.12s',
              animationPlayState: animState,
            }}
            aria-hidden="true"
          />
          {/* Layer 3 */}
          <div
            className="absolute w-[168px] h-[168px] rounded-full animate-breathe"
            style={{
              background: 'rgba(234,243,239,.16)',
              border: '1px solid rgba(234,243,239,.22)',
              animationDelay: '.24s',
              animationPlayState: animState,
            }}
            aria-hidden="true"
          />
          {/* Centre quatrefoil */}
          <div
            className="animate-breathe flex items-center justify-center"
            style={{ animationDelay: '.24s', animationPlayState: animState }}
            aria-hidden="true"
          >
            <svg width="120" height="120" viewBox="0 0 400 400" aria-hidden="true">
              <g fill="#EAF3EF" fillOpacity=".92" stroke="none">
                {PETALS.map((deg) => (
                  <path
                    key={deg}
                    d="M200 200 Q167 128 200 58 Q233 128 200 200 Z"
                    transform={deg === 0 ? undefined : `rotate(${deg} 200 200)`}
                  />
                ))}
              </g>
            </svg>
          </div>
        </div>

        {/* Phase cue */}
        <p
          className="font-heading text-[34px] font-semibold tracking-[-0.02em] mb-2 text-center"
          style={{ color: '#FBFDFC' }}
        >
          {heading}
        </p>
        <p
          className="text-[15px] leading-[1.55] text-center max-w-[340px] [text-wrap:pretty]"
          style={{ color: '#B9D2C9' }}
        >
          {sub}
        </p>
      </div>

      {/* ── Footer: timeline + controls ── */}
      <div className="relative z-10 px-10 pb-[34px]">
        {/* Round timeline */}
        <div className="flex flex-col items-center gap-3 mb-[26px]">
          <div className="flex items-center gap-[9px]" aria-label="Round 3 of 6" role="img">
            {ROUNDS.map((r, i) => (
              <span
                key={i}
                className="rounded-full"
                style={
                  r.active
                    ? {
                        width: 11,
                        height: 11,
                        background: '#EAF3EF',
                        boxShadow: '0 0 0 4px rgba(234,243,239,.14)',
                      }
                    : r.past
                    ? { width: 9, height: 9, background: '#9FC9BC' }
                    : { width: 9, height: 9, background: 'rgba(234,243,239,.22)' }
                }
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="text-[12.5px] tracking-[0.02em]" style={{ color: '#8FB3A8' }}>
            Round 3 of 6 · about 1:48 left
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center gap-[10px] font-heading text-[15.5px] font-semibold px-[30px] py-[14px] rounded-[12px] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            style={{ background: '#EAF3EF', color: '#2A473F' }}
          >
            {paused ? (
              /* Play icon */
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A473F" stroke="none" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Resume
              </>
            ) : (
              /* Pause icon */
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
