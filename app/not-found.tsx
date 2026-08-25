import Link from 'next/link';

export default function NotFound() {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center relative overflow-hidden bg-background">
      {/* Decorative quatrefoil */}
      <div
        className="absolute pointer-events-none"
        style={{ top: -160, right: -120, transform: 'rotate(14deg)', opacity: 0.35 }}
        aria-hidden="true"
      >
        <svg width="400" height="400" viewBox="0 0 400 400" aria-hidden="true">
          <g fill="#2F6E7A" fillOpacity=".05" stroke="#2F6E7A" strokeOpacity=".22" strokeWidth="1.4" strokeLinejoin="round">
            {petals.map((deg) => (
              <path
                key={deg}
                d="M200 200 Q167 128 200 58 Q233 128 200 200 Z"
                transform={deg === 0 ? undefined : `rotate(${deg} 200 200)`}
              />
            ))}
          </g>
        </svg>
      </div>

      <div className="relative max-w-[380px]">
        <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
          404
        </span>
        <h1 className="font-heading text-[34px] font-semibold tracking-[-0.025em] text-[#262B29] mt-3 mb-4">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="text-[16px] leading-[1.6] text-[#565D5A] mb-8 [text-wrap:pretty]">
          It may have moved, or the link might have been mistyped. Either way, you haven&rsquo;t lost anything.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 rounded-[12px] bg-primary px-7 py-4 font-heading text-[15.5px] font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Go to home
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </main>
  );
}
