import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Calm tools — Afia' };

/* ─── Breathing bloom for the hero card (pure CSS, no JS) ─── */
function BreathingBloom() {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div className="flex-shrink-0 w-[150px] h-[150px] relative flex items-center justify-center">
      {/* Outer ring */}
      <div
        className="absolute w-[150px] h-[150px] rounded-full animate-breathe"
        style={{ background: 'rgba(159,201,188,.14)' }}
        aria-hidden="true"
      />
      {/* Middle ring */}
      <div
        className="absolute w-[104px] h-[104px] rounded-full animate-breathe"
        style={{ background: 'rgba(159,201,188,.20)', animationDelay: '.2s' }}
        aria-hidden="true"
      />
      {/* Centre quatrefoil — animate with it */}
      <div className="animate-breathe flex items-center justify-center" aria-hidden="true">
        <svg width="76" height="76" viewBox="0 0 400 400" aria-hidden="true">
          <g fill="#EAF3EF" fillOpacity=".9" stroke="none">
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
    </div>
  );
}

/* ─── Tool grid card ─── */
interface ToolCardProps {
  iconBg: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  duration: string;
}

function ToolCard({ iconBg, icon, title, body, duration }: ToolCardProps) {
  return (
    <Link
      href="/calm/breathe"
      className="bg-white border border-[#E7E2DA] rounded-[16px] p-5 block hover:shadow-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className={`flex w-[38px] h-[38px] rounded-[11px] ${iconBg} items-center justify-center mb-[14px]`}
      >
        {icon}
      </span>
      <div className="font-heading text-[16px] font-semibold text-[#3A403C] mb-1">{title}</div>
      <div className="text-[13px] leading-[1.5] text-[#767D79] mb-3">{body}</div>
      <span className="text-[12px] font-semibold text-[#8A928D] bg-[#F3EEE6] px-[10px] py-[4px] rounded-full">
        {duration}
      </span>
    </Link>
  );
}

const TOOLS: ToolCardProps[] = [
  {
    iconBg: 'bg-[#E3F1EE]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F6E7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="3" />
      </svg>
    ),
    title: 'Box breathing',
    body: 'Four counts in, hold, out, hold.',
    duration: '4 min',
  },
  {
    iconBg: 'bg-[#E3F1EE]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F6E7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
        <path d="M2 17c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
      </svg>
    ),
    title: 'Ocean breath',
    body: 'Long exhales, like a slow tide.',
    duration: '5 min',
  },
  {
    iconBg: 'bg-[#F3EEE6]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B26A44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 11V6a2 2 0 0 1 4 0v4" />
        <path d="M10 10V4.5a2 2 0 0 1 4 0V10" />
        <path d="M14 10V6a2 2 0 0 1 4 0v7a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3L4 14a2 2 0 0 1 3-2.6" />
      </svg>
    ),
    title: '5-4-3-2-1 senses',
    body: 'Ground through what\'s around you.',
    duration: '3 min',
  },
  {
    iconBg: 'bg-[#F3EEE6]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B26A44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="5" r="2.4" />
        <path d="M12 7.5v7M8.5 10.5 12 12l3.5-1.5M9.5 21l2.5-6.5L14.5 21" />
      </svg>
    ),
    title: 'Body scan',
    body: 'Soften tension, head to toe.',
    duration: '8 min',
  },
  {
    iconBg: 'bg-[#EDEBF3]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6A5FA0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.5 12 20 12 20Z" />
      </svg>
    ),
    title: 'Loving-kindness',
    body: 'A few warm words, toward yourself.',
    duration: '6 min',
  },
  {
    iconBg: 'bg-[#EDEBF3]',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6A5FA0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10v10h14V10" />
        <path d="M10 20v-5h4v5" />
      </svg>
    ),
    title: 'Safe place',
    body: 'Picture somewhere that feels held.',
    duration: '5 min',
  },
];

export default function CalmToolPage() {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <main className="relative flex-1 overflow-hidden px-6 py-9 pb-11 lg:px-10">
      <div className="relative">
        {/* ── Header ── */}
        <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
          Reach for these anytime
        </span>
        <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29] mt-2 mb-1.5">
          Calm tools
        </h1>
        <p className="text-[15px] leading-[1.55] text-[#565D5A] mb-[26px] max-w-[440px] [text-wrap:pretty]">
          Small resets for the moments worry spikes. There&rsquo;s no wrong one to pick.
        </p>

        {/* ── Featured breathing tool ── */}
        <div className="bg-[#2F5049] rounded-[20px] px-[34px] py-[30px] mb-[26px] relative overflow-hidden flex items-center gap-[34px]">
          <div className="flex-1 min-w-0">
            <span className="text-[11.5px] font-semibold tracking-[0.09em] uppercase text-[#9FC9BC]">
              Suggested right now
            </span>
            <h2 className="font-heading text-[25px] font-semibold tracking-[-0.02em] text-white mt-[10px] mb-2">
              Take a breath
            </h2>
            <p className="text-[14.5px] leading-[1.55] text-[#D4E4DE] mb-5 max-w-[360px] [text-wrap:pretty]">
              A slow, guided breathing circle to settle your body in about three minutes. Follow the
              bloom as it opens and closes.
            </p>
            <Link
              href="/calm/breathe"
              className="inline-flex items-center gap-[9px] bg-white text-[#2F5049] font-heading text-[15px] font-semibold px-6 py-[13px] rounded-[11px] hover:bg-[#EAF3EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Start · 3 min
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#2F5049"
                stroke="none"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </Link>
          </div>
          <BreathingBloom />
        </div>

        {/* ── Tool grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
        </div>
      </div>
    </main>
  );
}
