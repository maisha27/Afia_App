'use client';

// Pure-CSS animated rings — zero-cost replacement for the Three.js MagicRings WebGL component.
// Saves ~150 KB gzipped. Respects prefers-reduced-motion via globals.css .calm-ring rule.

const COUNT = 5;
const DURATION = 3.5; // seconds per cycle

export default function CalmRings({ size = 280 }: { size?: number }) {
  return (
    <div className="calm-rings" style={{ width: size, height: size }} aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => (
        <span
          key={i}
          className="calm-ring"
          style={{ animationDelay: `${-(i * (DURATION / COUNT)).toFixed(2)}s` }}
        />
      ))}
    </div>
  );
}
