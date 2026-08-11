import type { Metadata } from 'next';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PricingCard } from './PricingCard';

export const metadata: Metadata = { title: 'Your plan — Afia' };

/* ─── Decorative quatrefoil (design petal path, 400×400 viewbox) ─── */
function CornerQuatrefoil() {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      width="440"
      height="440"
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="pointer-events-none"
    >
      <g
        fill="#2F6E7A"
        fillOpacity=".05"
        stroke="#2F6E7A"
        strokeOpacity=".28"
        strokeWidth="1.4"
        strokeLinejoin="round"
      >
        {petals.map((deg) => (
          <path
            key={deg}
            d="M200 200 Q167 128 200 58 Q233 128 200 200 Z"
            transform={deg === 0 ? undefined : `rotate(${deg} 200 200)`}
          />
        ))}
      </g>
    </svg>
  );
}

/* ─── Feature item ─── */
function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex gap-[14px] items-start">
      <span className="flex-shrink-0 w-[30px] h-[30px] rounded-[9px] bg-[#E3F1EE] flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2F6E7A"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <div>
        <div className="text-[15.5px] font-semibold text-[#3A403C] mb-0.5">{title}</div>
        <div className="text-[13.5px] leading-[1.5] text-[#767D79]">{body}</div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <SiteHeader variant="screener" />

      <main className="relative flex-1 overflow-hidden px-6 py-[56px] pb-[72px] sm:px-[44px]">
        {/* Corner quatrefoils */}
        <div
          className="absolute pointer-events-none"
          style={{ top: -186, right: -150, transform: 'rotate(14deg)', opacity: 0.5 }}
          aria-hidden="true"
        >
          <CornerQuatrefoil />
        </div>
        <div
          className="absolute pointer-events-none"
          style={{ bottom: -186, left: -150, transform: 'rotate(14deg)', opacity: 0.5 }}
          aria-hidden="true"
        >
          <CornerQuatrefoil />
        </div>

        {/* 2-col content */}
        <div className="relative max-w-[960px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_.9fr] gap-[52px] items-center">

          {/* Left — plan description */}
          <div>
            <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
              Your plan is ready
            </span>
            <h1 className="font-heading text-[33px] font-semibold leading-[1.16] tracking-[-0.025em] mt-3 mb-4 [text-wrap:pretty]">
              A gentle way through, built around your check-in.
            </h1>
            <p className="text-[16px] leading-[1.62] text-[#565D5A] mb-7 max-w-[440px] [text-wrap:pretty]">
              We&rsquo;ve shaped these around the moderate signs of anxiety you told us about. Open
              them whenever you&rsquo;re ready — there&rsquo;s no rush and no right pace.
            </p>

            <div className="flex flex-col gap-4 max-w-[440px]">
              <Feature
                title="A step-by-step plan for anxiety"
                body="Small, proven CBT-based steps, paced for you."
              />
              <Feature
                title="Breathing & grounding, on demand"
                body="Calm tools for the moments worry spikes."
              />
              <Feature
                title="Weekly check-ins & your journal"
                body="See what's shifting, in a private space only you can read."
              />
            </div>
          </div>

          {/* Right — pricing card */}
          <div>
            <PricingCard />
          </div>
        </div>

        {/* Maybe later link */}
        <div className="relative mt-[34px] text-center">
          <a href="/home" className="text-[14.5px] text-[#767D79] font-medium hover:text-[#565D5A] transition-colors">
            Maybe later — keep my free reflection
          </a>
        </div>
      </main>
    </div>
  );
}
