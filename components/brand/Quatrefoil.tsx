import { cn } from '@/lib/utils';

interface QuatrefoilProps {
  size?: number;
  className?: string;
}

const ROTATIONS = [0, 45, 90, 135, 180, 225, 270, 315];
const CX = 200;
const CY = 200;
const OUTER_PATH = 'M200 200 Q167 128 200 58 Q233 128 200 200 Z';
const INNER_PATH = 'M200 200 Q179 158 200 108 Q221 158 200 200 Z';

/**
 * 8-petal Islamic quatrefoil used as a decorative accent.
 * Always aria-hidden — purely decorative.
 * Colour inherits from `currentColor`; set via Tailwind text-* on the parent.
 */
export function Quatrefoil({ size = 400, className }: QuatrefoilProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={cn('pointer-events-none', className)}
    >
      {/* Outer petals */}
      <g
        fill="currentColor"
        fillOpacity={0.05}
        stroke="currentColor"
        strokeOpacity={0.28}
        strokeWidth={1.4}
        strokeLinejoin="round"
      >
        {ROTATIONS.map((r) => (
          <path
            key={r}
            d={OUTER_PATH}
            transform={r ? `rotate(${r} ${CX} ${CY})` : undefined}
          />
        ))}
      </g>
      {/* Inner petals, offset 22.5° */}
      <g
        transform={`rotate(22.5 ${CX} ${CY})`}
        fill="currentColor"
        fillOpacity={0.08}
        stroke="currentColor"
        strokeOpacity={0.18}
        strokeWidth={1.1}
        strokeLinejoin="round"
      >
        {ROTATIONS.map((r) => (
          <path
            key={r}
            d={INNER_PATH}
            transform={r ? `rotate(${r} ${CX} ${CY})` : undefined}
          />
        ))}
      </g>
    </svg>
  );
}
