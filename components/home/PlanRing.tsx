'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const R = 52;
const CIRC = +(2 * Math.PI * R).toFixed(2); // 326.73

// ── PlanRing ────────────────────────────────────────────────────────────────
// Animated SVG progress ring for the dashboard plan hero card.
// On mount the ring draws from 0% to the actual progress, and the number
// inside counts up over the same 800ms. Extracted from home/page.tsx so the
// animation logic can run client-side while the page stays a server component.
export function PlanRing({
  progressPct,
}: {
  progressPct: number;
}) {
  const reduced = useReducedMotion();

  const targetOffset = +(CIRC * (1 - progressPct / 100)).toFixed(2);

  // Ring starts "empty" (dashoffset = full circumference = 0%)
  const [dashOffset, setDashOffset] = useState(CIRC);
  const [displayPct, setDisplayPct] = useState(reduced ? progressPct : 0);

  useEffect(() => {
    if (reduced) return;

    // Small delay so the card fades in first, then the ring animates
    const delay = setTimeout(() => {
      // Trigger CSS transition on the ring
      setDashOffset(targetOffset);

      // Count up the percentage number in sync
      const START = performance.now();
      const DURATION = 820;
      let last = -1;

      const tick = (now: number) => {
        const elapsed = now - START;
        const t = Math.min(elapsed / DURATION, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);
        const pct = Math.round(eased * progressPct);
        if (pct !== last) {
          last = pct;
          setDisplayPct(pct);
        }
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, 320);

    return () => clearTimeout(delay);
  }, [reduced, targetOffset, progressPct]);

  return (
    <div
      className="flex-shrink-0 w-[120px] h-[120px] relative flex items-center justify-center"
      aria-label={`Plan progress: ${progressPct}% complete`}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        aria-hidden="true"
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke="white"
          strokeOpacity=".18"
          strokeWidth="9"
        />
        {/* Progress arc */}
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke="#9FC9BC"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          style={{
            transition: reduced
              ? 'none'
              : 'stroke-dashoffset 820ms cubic-bezier(0.34, 1.0, 0.64, 1.0)',
          }}
        />
      </svg>

      {/* Percentage label */}
      <div className="absolute text-center leading-none">
        <div className="font-heading text-[26px] font-semibold text-white tabular-nums">
          {displayPct}%
        </div>
        <div className="text-[10.5px] text-[#9FC9BC] mt-0.5">complete</div>
      </div>
    </div>
  );
}
