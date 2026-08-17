'use client';

import { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

const ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315];
const INNER_ROTATIONS = ROTATIONS.map((r) => r + 22.5);

// Timing constants for the bloom cycle
const PETAL_STAGGER_MS = 140; // gap between each petal appearing
const HOLD_MS = 1800;         // all petals visible
const FADE_MS = 420;          // all petals fade together
const PAUSE_MS = 360;         // gap before next bloom

type Phase = 'blooming' | 'holding' | 'fading' | 'paused';

// ── AnimatedQuatrefoil ──────────────────────────────────────────────────────
// The Afia quatrefoil with a sequential petal-by-petal bloom cycle.
// Petals fade in one by one → hold → fade together → pause → repeat.
//
// Props
//   size         — SVG width/height in px (default 240)
//   fill         — petal fill colour (default #2F6E7A)
//   fillOpacity  — outer petal fill opacity (default 0.07)
//   stroke       — petal stroke colour (default #2F6E7A)
//   strokeOpacity — outer petal stroke opacity (default 0.38)
//   withHalo     — if true, renders 2 ambient breathing rings behind the SVG
//   haloColor    — rgba string for halo rings e.g. "159,201,188"
//   className    — wrapper div class
export function AnimatedQuatrefoil({
  size = 240,
  fill = '#2F6E7A',
  fillOpacity = 0.07,
  stroke = '#2F6E7A',
  strokeOpacity = 0.38,
  withHalo = false,
  haloColor = '47,110,122',
  className,
}: {
  size?: number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeOpacity?: number;
  withHalo?: boolean;
  haloColor?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const [revealed, setRevealed] = useState(reduced ? 8 : 0);
  const [phase, setPhase] = useState<Phase>(reduced ? 'holding' : 'blooming');

  useEffect(() => {
    if (reduced) return;

    let t: ReturnType<typeof setTimeout>;

    if (phase === 'blooming') {
      if (revealed < ROTATIONS.length) {
        t = setTimeout(() => setRevealed((r) => r + 1), PETAL_STAGGER_MS);
      } else {
        t = setTimeout(() => setPhase('holding'), 0);
      }
    } else if (phase === 'holding') {
      t = setTimeout(() => setPhase('fading'), HOLD_MS);
    } else if (phase === 'fading') {
      t = setTimeout(() => setPhase('paused'), FADE_MS);
    } else if (phase === 'paused') {
      t = setTimeout(() => {
        setRevealed(0);
        setPhase('blooming');
      }, PAUSE_MS);
    }

    return () => clearTimeout(t);
  }, [phase, revealed, reduced]);

  const isPetalVisible = (i: number) =>
    phase === 'fading' || phase === 'paused' ? false : i < revealed;

  const petalTransition =
    phase === 'paused'
      ? 'none'
      : `opacity ${phase === 'fading' ? FADE_MS : 350}ms ease`;

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Ambient halo rings — optional, for use in the calm-tool hub hero */}
      {withHalo && (
        <>
          <div
            className="absolute inset-0 rounded-full animate-breathe pointer-events-none"
            style={{ background: `rgba(${haloColor}, .11)` }}
          />
          <div
            className="absolute rounded-full animate-breathe pointer-events-none"
            style={{
              inset: Math.round(size * 0.12),
              background: `rgba(${haloColor}, .17)`,
              animationDelay: '.22s',
            }}
          />
        </>
      )}

      {/* The quatrefoil SVG */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 1 }}
      >
        <svg width={size} height={size} viewBox="0 0 400 400">
          {/* Inner petals — always visible, static depth layer */}
          <g
            transform="rotate(22.5 200 200)"
            fill={fill}
            fillOpacity={fillOpacity * 0.7}
            stroke={stroke}
            strokeOpacity={strokeOpacity * 0.55}
            strokeWidth="1.4"
            strokeLinejoin="round"
          >
            {INNER_ROTATIONS.map((deg) => (
              <path
                key={deg}
                d="M200 200 Q179 158 200 108 Q221 158 200 200 Z"
                transform={`rotate(${deg - 22.5} 200 200)`}
              />
            ))}
          </g>

          {/* Outer petals — sequentially revealed */}
          <g
            fill={fill}
            fillOpacity={fillOpacity}
            stroke={stroke}
            strokeOpacity={strokeOpacity}
            strokeWidth="2"
            strokeLinejoin="round"
          >
            {ROTATIONS.map((deg, i) => (
              <path
                key={deg}
                d="M200 200 Q167 128 200 58 Q233 128 200 200 Z"
                transform={deg ? `rotate(${deg} 200 200)` : undefined}
                style={{
                  opacity: isPetalVisible(i) ? 1 : 0,
                  transition: petalTransition,
                }}
              />
            ))}
          </g>

          {/* Centre dot */}
          <circle
            cx="200"
            cy="200"
            r="7"
            fill={fill}
            fillOpacity={fillOpacity * 6}
          />
        </svg>
      </div>
    </div>
  );
}
