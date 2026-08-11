import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Home — Afia' };

/* ─── Helpers ─── */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDisplayName(email: string | undefined): string {
  if (!email) return 'there';
  const local = email.split('@')[0].split('.')[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function getDateLabel(): string {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const day = now.getDate();
  const month = now.toLocaleDateString('en-GB', { month: 'long' });
  return `${weekday} · ${day} ${month}`;
}

/* ─── Progress ring constants ─── */
const R = 52;
const CIRC = +(2 * Math.PI * R).toFixed(2); // 326.73
const PROGRESS = 0.095; // Day 2 of 21 ≈ 9.5%
const DASH_OFFSET = +(CIRC * (1 - PROGRESS)).toFixed(2);

/* ─── Decorative quatrefoil ─── */
function Quatrefoil({ size, opacity }: { size: number; opacity: number }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="pointer-events-none"
    >
      <g
        fill="#2F6E7A"
        fillOpacity=".05"
        stroke="#2F6E7A"
        strokeOpacity={opacity}
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

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = getDisplayName(user?.email);
  const greeting = getGreeting();
  const dateLabel = getDateLabel();

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-9 pb-11 lg:px-10">
      {/* Corner quatrefoil — top right */}
      <div
        className="absolute pointer-events-none"
        style={{ top: -150, right: -130, transform: 'rotate(14deg)', opacity: 0.45 }}
        aria-hidden="true"
      >
        <Quatrefoil size={380} opacity={0.26} />
      </div>

      <div className="relative">
        {/* ── Greeting row ── */}
        <div className="flex items-end justify-between mb-7 flex-wrap gap-3">
          <div>
            <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
              {dateLabel}
            </span>
            <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29] mt-2">
              {greeting}, {name}.
            </h1>
          </div>
          {/* Streak pill */}
          <div className="flex items-center gap-2.5 bg-white border border-[#E7E2DA] rounded-full px-[15px] py-2 text-[13.5px] font-semibold text-[#3A403C] shadow-sm">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="#E0A93F"
              aria-hidden="true"
            >
              <path d="M12 2c.4 3.6 2.4 5.6 6 6-3.6.4-5.6 2.4-6 6-.4-3.6-2.4-5.6-6-6 3.6-.4 5.6-2.4 6-6Z" />
            </svg>
            3-day streak
          </div>
        </div>

        {/* ── Plan hero card ── */}
        <div
          className="bg-[#2F5049] rounded-[20px] px-8 py-[30px] mb-[22px] relative overflow-hidden flex items-center gap-[30px]"
        >
          <div className="flex-1 min-w-0">
            <span className="text-[11.5px] font-semibold tracking-[0.09em] uppercase text-[#9FC9BC]">
              Your plan · Day 2 of 21
            </span>
            <h2 className="font-heading text-[24px] font-semibold tracking-[-0.02em] text-white mt-2.5 mb-2">
              Naming the worry
            </h2>
            <p className="text-[14.5px] leading-[1.55] text-[#D4E4DE] mb-5 max-w-[400px] [text-wrap:pretty]">
              A short reading and a two-minute writing exercise to give this week&rsquo;s worry a
              shape. Around 6 minutes.
            </p>
            <Link
              href="/exercises"
              className="inline-flex items-center gap-2.5 bg-white text-[#2F5049] font-heading text-[15px] font-semibold px-6 py-[13px] rounded-[11px] hover:bg-[#EAF3EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Continue
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          {/* Progress ring */}
          <div
            className="flex-shrink-0 w-[120px] h-[120px] relative flex items-center justify-center"
            aria-label="Plan progress: 10% complete"
          >
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              aria-hidden="true"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="white"
                strokeOpacity=".18"
                strokeWidth="9"
              />
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="#9FC9BC"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={DASH_OFFSET}
              />
            </svg>
            <div className="absolute text-center leading-none">
              <div className="font-heading text-[26px] font-semibold text-white">10%</div>
              <div className="text-[10.5px] text-[#9FC9BC] mt-0.5">complete</div>
            </div>
          </div>
        </div>

        {/* ── Support tiles ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-[22px]">
          {/* Calm tools */}
          <Link
            href="/calm-tool"
            className="bg-white border border-[#E7E2DA] rounded-[16px] p-5 block hover:shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex w-[38px] h-[38px] rounded-[11px] bg-[#E3F1EE] items-center justify-center mb-[14px]">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2F6E7A"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="2.3" />
                <path d="M7.4 12a4.6 4.6 0 0 1 9.2 0" />
                <path d="M3.5 12a8.5 8.5 0 0 1 17 0" />
              </svg>
            </span>
            <div className="font-heading text-[16px] font-semibold text-[#3A403C] mb-1">
              Calm tools
            </div>
            <div className="text-[13px] leading-[1.5] text-[#767D79]">
              Breathe or ground when worry spikes.
            </div>
          </Link>

          {/* Weekly check-in */}
          <Link
            href="/progress"
            className="bg-white border border-[#E7E2DA] rounded-[16px] p-5 block hover:shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex w-[38px] h-[38px] rounded-[11px] bg-[#F3EEE6] items-center justify-center mb-[14px]">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B26A44"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3.5" y="5" width="17" height="16" rx="3" />
                <path d="M8 3v4M16 3v4M3.5 10h17" />
                <path d="M12 13.4c-1-1.2-3-.7-3 .9 0 1.3 1.8 2.4 3 3.2 1.2-.8 3-1.9 3-3.2 0-1.6-2-2.1-3-.9Z" />
              </svg>
            </span>
            <div className="font-heading text-[16px] font-semibold text-[#3A403C] mb-1">
              Weekly check-in
            </div>
            <div className="text-[13px] leading-[1.5] text-[#767D79]">
              Due Friday · see what&rsquo;s shifting.
            </div>
          </Link>

          {/* Journal */}
          <Link
            href="/journal"
            className="bg-white border border-[#E7E2DA] rounded-[16px] p-5 block hover:shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex w-[38px] h-[38px] rounded-[11px] bg-[#EDEBF3] items-center justify-center mb-[14px]">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6A5FA0"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 4C11 5 6 10 5 19l3-3c6-1 10-5 12-12Z" />
                <path d="M8.5 15.5c2.6-2.6 4.6-4.8 6.5-8" />
                <path d="M4 20l3.5-3.5" />
              </svg>
            </span>
            <div className="font-heading text-[16px] font-semibold text-[#3A403C] mb-1">
              Your journal
            </div>
            <div className="text-[13px] leading-[1.5] text-[#767D79]">
              4 reflections saved so far.
            </div>
          </Link>
        </div>

        {/* ── Gentle note ── */}
        <div
          className="relative overflow-hidden rounded-[18px] border border-[#E2E6DD] px-[38px] py-[32px]"
          style={{ background: 'linear-gradient(115deg, #EAF3EF 0%, #F4EFE7 100%)' }}
        >
          {/* Decorative quatrefoil bottom-right */}
          <div
            className="absolute pointer-events-none"
            style={{ bottom: -118, right: -90, transform: 'rotate(18deg)', opacity: 0.5 }}
            aria-hidden="true"
          >
            <svg
              width="300"
              height="300"
              viewBox="0 0 400 400"
              aria-hidden="true"
            >
              <g
                fill="#2F6E7A"
                fillOpacity=".06"
                stroke="#2F6E7A"
                strokeOpacity=".22"
                strokeWidth="1.6"
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
          </div>

          <div className="relative">
            <span
              className="font-heading text-[78px] leading-[0.5] text-primary opacity-[0.24] inline-block h-[38px]"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="font-heading text-[23px] leading-[1.42] font-medium italic tracking-[-0.012em] text-[#2F5049] max-w-[540px] mt-2 mb-4 [text-wrap:pretty]">
              Going gently is still going forward. There&rsquo;s no pace you&rsquo;re supposed to
              keep.
            </p>
            <span className="text-[11.5px] font-semibold tracking-[0.1em] uppercase text-[#8A928D]">
              A note for today
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
