'use client';

// ── Per-tool centre animations for guided calm sessions ─────────────────────
// Each component fills a 260×260 container (matching GuidedSessionClient).
// They receive `accentRgb` ("r,g,b" string) so the tints stay on-brand per tool.

// ── OceanWaveAnimation ───────────────────────────────────────────────────────
// Teal. Three sine-wave paths that oscillate upward with staggered delays,
// layered inside a gentle breathing circle. Evokes slow tidal movement.
export function OceanWaveAnimation({ accentRgb }: { accentRgb: string }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 260, height: 260 }}
      aria-hidden="true"
    >
      {/* Outer breathing ring */}
      <div
        className="absolute inset-0 rounded-full animate-breathe"
        style={{ background: `rgba(${accentRgb},.08)` }}
      />
      {/* Middle breathing ring */}
      <div
        className="absolute rounded-full animate-breathe"
        style={{
          inset: 34,
          background: `rgba(${accentRgb},.13)`,
          animationDelay: '.35s',
        }}
      />
      {/* Wave container */}
      <div
        className="absolute rounded-full flex items-center justify-center overflow-hidden"
        style={{
          inset: 74,
          background: `rgba(${accentRgb},.20)`,
          border: `1px solid rgba(${accentRgb},.32)`,
        }}
      >
        <svg
          viewBox="0 0 72 48"
          width="72"
          height="48"
          aria-hidden="true"
          style={{ overflow: 'visible' }}
        >
          {/* Three wave lines, each oscillating upward at different delays */}
          <path
            d="M0 32 Q9 20 18 32 Q27 44 36 32 Q45 20 54 32 Q63 44 72 32"
            fill="none"
            stroke={`rgb(${accentRgb})`}
            strokeWidth="2.2"
            strokeLinecap="round"
            className="animate-ocean-wave"
          />
          <path
            d="M0 24 Q9 12 18 24 Q27 36 36 24 Q45 12 54 24 Q63 36 72 24"
            fill="none"
            stroke={`rgb(${accentRgb})`}
            strokeWidth="1.6"
            strokeLinecap="round"
            style={{ opacity: 0.6, animationDelay: '.7s' }}
            className="animate-ocean-wave"
          />
          <path
            d="M0 40 Q9 28 18 40 Q27 52 36 40 Q45 28 54 40 Q63 52 72 40"
            fill="none"
            stroke={`rgb(${accentRgb})`}
            strokeWidth="1.2"
            strokeLinecap="round"
            style={{ opacity: 0.38, animationDelay: '1.4s' }}
            className="animate-ocean-wave"
          />
        </svg>
      </div>
    </div>
  );
}

// ── GroundingAnimation ───────────────────────────────────────────────────────
// Amber. Five concentric rings pulse outward in sequence — one per sense.
// The stagger creates a continuous ripple from the centre outward.
export function GroundingAnimation({ accentRgb }: { accentRgb: string }) {
  const delays = [0, 0.48, 0.96, 1.44, 1.92];

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 260, height: 260 }}
      aria-hidden="true"
    >
      {/* Five pulse rings */}
      {delays.map((delay, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse-ring"
          style={{
            width: 88,
            height: 88,
            border: `1.5px solid rgba(${accentRgb}, ${0.88 - i * 0.08})`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}

      {/* Gentle ambient halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `rgba(${accentRgb},.06)` }}
      />

      {/* Centre circle with hand icon */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: 88,
          height: 88,
          background: `rgba(${accentRgb},.22)`,
          border: `1px solid rgba(${accentRgb},.34)`,
        }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke={`rgb(${accentRgb})`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 11V6a2 2 0 0 1 4 0v4" />
          <path d="M10 10V4.5a2 2 0 0 1 4 0V10" />
          <path d="M14 10V6a2 2 0 0 1 4 0v7a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3L4 14a2 2 0 0 1 3-2.6" />
        </svg>
      </div>
    </div>
  );
}

// ── BodyScanAnimation ────────────────────────────────────────────────────────
// Amber. A tall body-shaped oval with a soft light beam sweeping downward.
// The scan beam repeats on an 8 s cycle, matching the slow pace of a body scan.
export function BodyScanAnimation({ accentRgb }: { accentRgb: string }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 260, height: 260 }}
      aria-hidden="true"
    >
      {/* Outer ambient ring */}
      <div
        className="absolute inset-0 rounded-full animate-breathe"
        style={{ background: `rgba(${accentRgb},.06)` }}
      />

      {/* Body silhouette — tall oval */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 96,
          height: 180,
          borderRadius: '48px 48px 42px 42px',
          background: `rgba(${accentRgb},.13)`,
          border: `1px solid rgba(${accentRgb},.28)`,
        }}
      >
        {/* Scan beam */}
        <div
          className="absolute inset-x-0 animate-scan-beam"
          style={{
            height: 48,
            background: `linear-gradient(180deg,
              rgba(${accentRgb},0) 0%,
              rgba(${accentRgb},.52) 40%,
              rgba(${accentRgb},.52) 60%,
              rgba(${accentRgb},0) 100%)`,
          }}
        />
      </div>

      {/* Head circle */}
      <div
        className="absolute"
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          background: `rgba(${accentRgb},.18)`,
          border: `1px solid rgba(${accentRgb},.28)`,
          top: 26,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
    </div>
  );
}

// ── LovingKindnessAnimation ──────────────────────────────────────────────────
// Purple. A heart that beats with a gentle lub-dub rhythm, surrounded by
// two soft breathing rings. Compassion expanding outward from a warm centre.
export function LovingKindnessAnimation({ accentRgb }: { accentRgb: string }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 260, height: 260 }}
      aria-hidden="true"
    >
      {/* Outer breathing ring */}
      <div
        className="absolute inset-0 rounded-full animate-breathe"
        style={{ background: `rgba(${accentRgb},.07)` }}
      />
      {/* Inner breathing ring */}
      <div
        className="absolute rounded-full animate-breathe"
        style={{
          inset: 38,
          background: `rgba(${accentRgb},.12)`,
          animationDelay: '.45s',
        }}
      />
      {/* Heartbeat container */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          inset: 78,
          background: `rgba(${accentRgb},.20)`,
          border: `1px solid rgba(${accentRgb},.32)`,
        }}
      >
        {/* Heart SVG with heartbeat animation */}
        <div className="animate-heartbeat flex items-center justify-center">
          <svg
            width="46"
            height="46"
            viewBox="0 0 24 24"
            fill={`rgba(${accentRgb},.92)`}
            stroke="none"
            aria-hidden="true"
          >
            <path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.5 12 20 12 20Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── SafePlaceAnimation ───────────────────────────────────────────────────────
// Purple. Three concentric rings breathe inward in a cascading wave,
// creating a sense of being gently enclosed and held. A shelter icon sits
// at the centre.
export function SafePlaceAnimation({ accentRgb }: { accentRgb: string }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 260, height: 260 }}
      aria-hidden="true"
    >
      {/* Three cascading breathing rings */}
      <div
        className="absolute inset-0 rounded-full animate-breathe"
        style={{ background: `rgba(${accentRgb},.07)` }}
      />
      <div
        className="absolute rounded-full animate-breathe"
        style={{
          inset: 30,
          background: `rgba(${accentRgb},.11)`,
          animationDelay: '.38s',
        }}
      />
      <div
        className="absolute rounded-full animate-breathe"
        style={{
          inset: 62,
          background: `rgba(${accentRgb},.16)`,
          animationDelay: '.76s',
        }}
      />

      {/* Centre shelter */}
      <div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          inset: 90,
          background: `rgba(${accentRgb},.24)`,
          border: `1px solid rgba(${accentRgb},.36)`,
        }}
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke={`rgb(${accentRgb})`}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v10h14V10" />
          <path d="M10 20v-5h4v5" />
        </svg>
      </div>
    </div>
  );
}
