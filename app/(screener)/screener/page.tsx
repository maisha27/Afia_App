import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = { title: 'Health Anxiety Screener — Afia' };

const HOW_IT_WORKS = [
  { label: 'Answer at your own pace', detail: 'One question at a time, nothing timed.' },
  { label: 'See a reflection', detail: 'A calm, honest read of your own patterns.' },
  { label: "Decide what's next", detail: 'Entirely your choice – no pressure either way.' },
] as const;

function QuatrefoilDecor({ className }: { className?: string }) {
  return (
    <svg
      width="470"
      height="470"
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={`pointer-events-none ${className ?? ''}`}
    >
      <g
        fill="#2F6E7A"
        fillOpacity="0.05"
        stroke="#2F6E7A"
        strokeOpacity="0.30"
        strokeWidth="1.4"
        strokeLinejoin="round"
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <path
            key={r}
            d="M200 200 Q167 128 200 58 Q233 128 200 200 Z"
            transform={r ? `rotate(${r} 200 200)` : undefined}
          />
        ))}
      </g>
      <g
        transform="rotate(22.5 200 200)"
        fill="#2F6E7A"
        fillOpacity="0.07"
        stroke="#2F6E7A"
        strokeOpacity="0.24"
        strokeWidth="1.2"
        strokeLinejoin="round"
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
          <path
            key={r}
            d="M200 200 Q179 158 200 108 Q221 158 200 200 Z"
            transform={r ? `rotate(${r} 200 200)` : undefined}
          />
        ))}
      </g>
    </svg>
  );
}

export default function ScreenerIntroPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader variant="screener" />

      {/* Top band with tiled pattern fading down */}
      <div className="relative overflow-hidden pt-[70px] px-11 pb-10">
        <div
          className="absolute top-0 left-0 right-0 h-[360px] opacity-[0.1] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='60'%3E%3Cpath d='M22 0Q44 0 44 30 44 60 22 60 0 60 0 30 0 0 22 0Z' fill='none' stroke='%232F6E7A' stroke-width='1.5'/%3E%3C/svg%3E\")",
            backgroundSize: '44px 60px',
            WebkitMaskImage: 'linear-gradient(#000, transparent)',
            maskImage: 'linear-gradient(#000, transparent)',
          }}
        />
        <div className="relative max-w-[600px] mx-auto text-center">
          <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
            <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-primary">
              Before you begin
            </span>
            <h1 className="font-heading text-[40px] leading-[1.1] font-semibold tracking-[-0.025em] mt-3 mb-4 [text-wrap:balance]">
              A few honest questions, just for you
            </h1>
            <p className="text-[17px] leading-[1.65] text-text-2 max-w-[500px] mx-auto mb-[30px] [text-wrap:pretty]">
              This short check-in helps you notice the patterns behind health anxiety more clearly.
              There are no right or wrong answers — only what feels true for you right now.
            </p>
          </div>

          {/* Info pills */}
          <div className="flex flex-wrap justify-center gap-2.5 animate-fade-up" style={{ animationDelay: '80ms' }}>
            <span className="inline-flex items-center gap-[7px] rounded-full border border-[#CFE7E0] bg-tint px-[15px] py-2 text-[13.5px] text-[#276358]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              2–4 minutes
            </span>
            <span className="inline-flex items-center gap-[7px] rounded-full border border-[#CFE7E0] bg-tint px-[15px] py-2 text-[13.5px] text-[#276358]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M9 6h11M9 12h11M9 18h11" />
                <circle cx="4.5" cy="6" r="1" />
                <circle cx="4.5" cy="12" r="1" />
                <circle cx="4.5" cy="18" r="1" />
              </svg>
              14 questions
            </span>
            <span className="inline-flex items-center gap-[7px] rounded-full border border-[#CFE7E0] bg-tint px-[15px] py-2 text-[13.5px] text-[#276358]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              No signup
            </span>
          </div>
        </div>
      </div>

      {/* How it works card with corner quatrefoils */}
      <div className="relative overflow-hidden px-11 pt-5 pb-[60px] animate-fade-up" style={{ animationDelay: '160ms' }}>
        {/* Top-left quatrefoil */}
        <QuatrefoilDecor className="absolute top-[-188px] left-[-172px] rotate-[-17deg]" />
        {/* Bottom-right quatrefoil */}
        <QuatrefoilDecor className="absolute bottom-[-188px] right-[-172px] rotate-[-17deg]" />

        {/* Card */}
        <div className="relative z-10 max-w-[880px] mx-auto rounded-[22px] border border-[#E7E2DA] bg-white px-10 py-9 shadow-[0_26px_60px_-40px_rgba(20,24,22,0.5)]">
          <div className="text-center mb-[30px]">
            <span className="text-[12px] font-semibold tracking-[0.12em] uppercase text-primary">
              How it works
            </span>
            <h2 className="font-heading text-[22px] font-semibold tracking-[-0.02em] mt-1.5 text-[#262B29]">
              Three calm steps, then it's your call
            </h2>
          </div>

          {/* Steps with connector line */}
          <div className="relative grid grid-cols-3 gap-2.5">
            <div
              className="absolute top-[29px] h-0.5 bg-[#CFE7E0] z-0"
              style={{ left: '16.7%', right: '16.7%' }}
            />
            {HOW_IT_WORKS.map(({ label, detail }, i) => (
              <div key={label} className="relative z-10 text-center px-3.5">
                <div className="w-[58px] h-[58px] rounded-full bg-primary text-primary-foreground font-heading text-[23px] font-semibold flex items-center justify-center mx-auto mb-[18px] border-[5px] border-white shadow-[0_10px_22px_-8px_rgba(47,110,122,0.7)]">
                  {i + 1}
                </div>
                <h3 className="font-heading text-[16.5px] font-semibold mb-1.5 text-[#262B29]">
                  {label}
                </h3>
                <p className="text-[14px] leading-[1.55] text-text-2">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-11 pb-[66px] text-center animate-fade-up" style={{ animationDelay: '260ms' }}>
        <Link
          href="/screener/1"
          className="inline-flex items-center justify-center rounded-[10px] bg-primary px-[68px] py-[19px] text-[18px] font-bold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Start
        </Link>
        <p className="mt-[18px]">
          <Link
            href="/"
            className="text-[14px] font-bold text-text-3 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
