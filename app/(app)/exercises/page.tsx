import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'My plan — Afia' };

/* ─── Decorative quatrefoil ─── */
function CornerQuatrefoil() {
  return (
    <svg
      width="360"
      height="360"
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="pointer-events-none"
    >
      <g
        fill="#2F6E7A"
        fillOpacity=".05"
        stroke="#2F6E7A"
        strokeOpacity=".24"
        strokeWidth="1.4"
        strokeLinejoin="round"
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
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

/* ─── Arrow icon ─── */
const ArrowRight = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

/* ─── Lock icon ─── */
const Lock = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

export default function ExercisesPage() {
  return (
    <main className="relative flex-1 overflow-hidden px-6 py-9 pb-12 lg:px-10">
      {/* Corner quatrefoil — bottom right */}
      <div
        className="absolute pointer-events-none"
        style={{ bottom: -150, right: -120, transform: 'rotate(14deg)', opacity: 0.4 }}
        aria-hidden="true"
      >
        <CornerQuatrefoil />
      </div>

      <div className="relative max-w-[620px]">
        {/* ── Header ── */}
        <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
          Shaped from your check-in
        </span>
        <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29] mt-2 mb-[18px]">
          A gentle plan for anxiety
        </h1>

        {/* ── Overall progress bar ── */}
        <div className="flex items-center gap-[14px] mb-[34px]">
          <div className="flex-1 h-[8px] rounded-full bg-[#EAE4DB] max-w-[340px]">
            <div className="w-[10%] h-full rounded-full bg-[#2F6E7A]" />
          </div>
          <span className="text-[13px] font-semibold text-[#5F6863]">Day 2 of 21 · 10%</span>
        </div>

        {/* ══ Week 1 ══ */}
        <div className="flex items-center gap-3 mb-[18px]">
          <span className="font-heading text-[13px] font-semibold tracking-[0.08em] uppercase text-[#2F5049]">
            Week 1 · Understanding worry
          </span>
          <div className="flex-1 h-px bg-[#EAE4DB]" />
        </div>

        {/* Timeline */}
        <div className="relative pl-[52px] mb-9">
          {/* Connector line */}
          <div
            className="absolute bg-[#EAE4DB]"
            style={{ left: 19, top: 14, bottom: 14, width: 2 }}
            aria-hidden="true"
          />

          {/* ── Day 1 — Done ── */}
          <div className="relative flex mb-[14px]">
            <span
              className="absolute flex w-[38px] h-[38px] rounded-full bg-[#2F6E7A] items-center justify-center"
              style={{ left: -52 }}
              aria-label="Completed"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <div className="flex-1 bg-white border border-[#EBE6DE] rounded-[14px] px-[20px] py-[15px] flex items-center justify-between opacity-[.72]">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#9AA29C]">
                  Day 1
                </div>
                <div className="text-[15.5px] font-semibold text-[#3A403C] mt-0.5">
                  What anxiety is doing
                </div>
              </div>
              <span className="text-[12.5px] font-semibold text-[#2F6E7A]">Done</span>
            </div>
          </div>

          {/* ── Day 2 — Current (Today) ── */}
          <div className="relative flex mb-[14px]">
            <span
              className="absolute flex w-[38px] h-[38px] rounded-full bg-white items-center justify-center"
              style={{ left: -52, border: '3px solid #2F6E7A' }}
              aria-label="Today's step"
            >
              <span className="w-[11px] h-[11px] rounded-full bg-[#2F6E7A]" aria-hidden="true" />
            </span>
            <div
              className="flex-1 bg-white border-[1.5px] border-[#2F6E7A] rounded-[14px] px-[22px] py-[18px] flex items-center justify-between"
              style={{ boxShadow: '0 16px 34px -26px rgba(47,122,109,.7)' }}
            >
              <div>
                <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#2F6E7A]">
                  Day 2 · Today
                </div>
                <div className="font-heading text-[17px] font-semibold text-[#2F5049] mt-[3px]">
                  Naming the worry
                </div>
                <div className="text-[12.5px] text-[#8A928D] mt-[3px]">
                  6 min · reading + writing
                </div>
              </div>
              <Link
                href="/plan/day-2"
                className="inline-flex items-center gap-2 bg-[#2F6E7A] text-white font-heading text-[14px] font-semibold px-[20px] py-[11px] rounded-[10px] hover:bg-[#275E69] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ml-4 flex-shrink-0"
              >
                Continue
                <ArrowRight />
              </Link>
            </div>
          </div>

          {/* ── Day 3 — Upcoming ── */}
          <div className="relative flex mb-[14px]">
            <span
              className="absolute flex w-[38px] h-[38px] rounded-full bg-white items-center justify-center"
              style={{ left: -52, border: '2px solid #E4DED4' }}
              aria-hidden="true"
            >
              <span className="w-[8px] h-[8px] rounded-full bg-[#D3CCC0]" aria-hidden="true" />
            </span>
            <div className="flex-1 bg-[#FCFBF9] border border-[#EBE6DE] rounded-[14px] px-[20px] py-[15px] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#B3B7B0]">
                  Day 3
                </div>
                <div className="text-[15.5px] font-semibold text-[#6C736E] mt-0.5">
                  Where worry sits in the body
                </div>
              </div>
              <span className="text-[12.5px] text-[#A6A79F]">5 min</span>
            </div>
          </div>

          {/* ── Day 4 — Upcoming ── */}
          <div className="relative flex">
            <span
              className="absolute flex w-[38px] h-[38px] rounded-full bg-white items-center justify-center"
              style={{ left: -52, border: '2px solid #E4DED4' }}
              aria-hidden="true"
            >
              <span className="w-[8px] h-[8px] rounded-full bg-[#D3CCC0]" aria-hidden="true" />
            </span>
            <div className="flex-1 bg-[#FCFBF9] border border-[#EBE6DE] rounded-[14px] px-[20px] py-[15px] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#B3B7B0]">
                  Day 4
                </div>
                <div className="text-[15.5px] font-semibold text-[#6C736E] mt-0.5">
                  The worry-thought trap
                </div>
              </div>
              <span className="text-[12.5px] text-[#A6A79F]">7 min</span>
            </div>
          </div>
        </div>

        {/* ══ Week 2 — Locked ══ */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-heading text-[13px] font-semibold tracking-[0.08em] uppercase text-[#A6A79F]">
            Week 2 · Tools that help
          </span>
          <div className="flex-1 h-px bg-[#EAE4DB]" />
          <span className="inline-flex items-center gap-[6px] text-[11.5px] font-semibold text-[#A6A79F]">
            <Lock />
            Unlocks Day 5
          </span>
        </div>
        <div className="bg-[#FBF9F5] border border-dashed border-[#E0DACF] rounded-[14px] px-[22px] py-[18px] text-[13.5px] leading-[1.55] text-[#8A928D] [text-wrap:pretty]">
          Grounding, breathing you can trust, and gentler responses to anxious thoughts. These open
          once Week 1 feels settled — no need to rush ahead.
        </div>
      </div>
    </main>
  );
}
