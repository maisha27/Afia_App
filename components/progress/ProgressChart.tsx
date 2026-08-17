'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';

interface ChartPoint {
  x: number;
  y: number;
  date: string;
}

export function ProgressChart({
  points,
  linePath,
  areaPath,
}: {
  points: ChartPoint[];
  linePath: string;
  areaPath: string;
}) {
  const reduced = useReducedMotion();
  const multiPoint = points.length > 1;

  return (
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

        {/* Grid lines — static */}
        <line x1="30" y1="40" x2="640" y2="40" stroke="#EFEAE2" strokeWidth="1" />
        <line x1="30" y1="100" x2="640" y2="100" stroke="#EFEAE2" strokeWidth="1" />
        <line x1="30" y1="160" x2="640" y2="160" stroke="#EFEAE2" strokeWidth="1" />

        {/* Area fill — fades in after line draws */}
        {areaPath && (
          <motion.path
            d={areaPath}
            fill="url(#progFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduced ? { duration: 0 } : { delay: 1.1, duration: 0.55 }}
          />
        )}

        {/* Line — draws left to right */}
        {linePath && (
          <motion.path
            d={linePath}
            fill="none"
            stroke="#2F6E7A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 1.15, ease: [0.25, 0, 0.15, 1] }
            }
          />
        )}

        {/* Dots — fade in after line */}
        {points.map((p, i) => {
          const isLast = i === points.length - 1;
          const dotDelay = multiPoint ? 1.0 + i * 0.09 : 0.3;
          return (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={isLast ? 7 : 6}
              fill={isLast ? '#2F6E7A' : '#fff'}
              stroke="#2F6E7A"
              strokeWidth="3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { delay: dotDelay, duration: 0.28 }
              }
            />
          );
        })}
      </svg>

      {/* Date labels — stagger after dots */}
      <div className="flex pt-1.5" style={{ paddingLeft: 56, paddingRight: 40 }}>
        {points.map((p, i) => {
          const isFirst = i === 0;
          const isLast = i === points.length - 1;
          return (
            <motion.span
              key={i}
              className="text-[12px] font-semibold text-[#9AA29C] flex-1"
              style={{ textAlign: isFirst ? 'left' : isLast ? 'right' : 'center' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { delay: 1.2 + i * 0.06, duration: 0.35 }
              }
            >
              {isFirst ? 'Start' : p.date}
            </motion.span>
          );
        })}
      </div>
    </>
  );
}
