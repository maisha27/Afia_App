import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: "You're all set — Afia" };

/* ─── Sparkle 4-pointed star ─── */
const STAR_PATH = 'M12 2c.5 4.4 3.1 7 7.5 7.5C15.1 10 12.5 12.6 12 17c-.5-4.4-3.1-7-7.5-7.5C8.9 9 11.5 6.4 12 2Z';

/* ─── Bloomed quatrefoil with sparkles ─── */
function BloomedQuatrefoil() {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div className="relative mx-auto mb-[34px]" style={{ width: 230, height: 230 }}>
      {/* Radial halo */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          inset: -20,
          background: 'radial-gradient(circle at 50% 47%, rgba(47,110,122,.16), rgba(47,110,122,0) 66%)',
        }}
        aria-hidden="true"
      />

      {/* SVG — outer + inner rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg width="230" height="230" viewBox="0 0 400 400" aria-hidden="true">
          {/* Outer ring */}
          <g
            fill="#2F6E7A"
            fillOpacity=".08"
            stroke="#2F6E7A"
            strokeOpacity=".4"
            strokeWidth="2"
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
          {/* Inner ring — rotated 22.5°, smaller petals */}
          <g
            transform="rotate(22.5 200 200)"
            fill="#2F6E7A"
            fillOpacity=".12"
            stroke="#2F6E7A"
            strokeOpacity=".32"
            strokeWidth="1.6"
            strokeLinejoin="round"
          >
            {petals.map((deg) => (
              <path
                key={deg}
                d="M200 200 Q179 158 200 108 Q221 158 200 200 Z"
                transform={deg === 0 ? undefined : `rotate(${deg} 200 200)`}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Sparkles */}
      <svg
        style={{ position: 'absolute', top: -4, right: 2 }}
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="#2F6E7A"
        fillOpacity=".85"
        aria-hidden="true"
      >
        <path d={STAR_PATH} />
      </svg>
      <svg
        style={{ position: 'absolute', top: 34, right: -8 }}
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="#B26A44"
        fillOpacity=".7"
        aria-hidden="true"
      >
        <path d={STAR_PATH} />
      </svg>
      <svg
        style={{ position: 'absolute', bottom: -2, left: 0 }}
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="#2F6E7A"
        fillOpacity=".85"
        aria-hidden="true"
      >
        <path d={STAR_PATH} />
      </svg>
      <svg
        style={{ position: 'absolute', bottom: 40, left: -10 }}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="#B26A44"
        fillOpacity=".7"
        aria-hidden="true"
      >
        <path d={STAR_PATH} />
      </svg>
    </div>
  );
}

export default async function WelcomePage() {
  /* Read trial end from subscription row; fall back to today + 7 if webhook hasn't fired yet */
  let trialEndStr: string;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('current_period_end')
        .eq('user_id', user.id)
        .maybeSingle();
      if (sub?.current_period_end) {
        trialEndStr = new Date(sub.current_period_end as string).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
        });
      } else {
        throw new Error('no row yet');
      }
    } else {
      throw new Error('no user');
    }
  } catch {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 7);
    trialEndStr = fallback.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  }

  const TILE_BG = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='60'%3E%3Cpath d='M22 0Q44 0 44 30 44 60 22 60 0 60 0 30 0 0 22 0Z' fill='none' stroke='%232F6E7A' stroke-width='1.5'/%3E%3C/svg%3E\")",
    backgroundSize: '44px 60px',
    WebkitMaskImage: 'radial-gradient(circle at 50% 30%, #000, transparent 60%)',
    maskImage: 'radial-gradient(circle at 50% 30%, #000, transparent 60%)',
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <SiteHeader variant="screener" />

      <main className="relative flex-1 overflow-hidden px-6 py-[72px] pb-[80px] sm:px-[44px]">
        {/* Tile background with radial mask */}
        <div
          className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={TILE_BG}
          aria-hidden="true"
        />

        {/* Centered content */}
        <div className="relative max-w-[600px] mx-auto text-center">
          <BloomedQuatrefoil />

          <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
            You&rsquo;re all set
          </span>

          <h1 className="font-heading text-[36px] font-semibold leading-[1.14] tracking-[-0.025em] mt-3 mb-[14px] [text-wrap:pretty]">
            Welcome to your space.
          </h1>

          <p className="text-[16.5px] leading-[1.6] text-[#565D5A] max-w-[460px] mx-auto mb-[26px] [text-wrap:pretty]">
            Your plan is ready and waiting. You&rsquo;re free until{' '}
            <strong className="text-[#3A403C] font-semibold">{trialEndStr}</strong> — cancel
            any time before then and you won&rsquo;t be charged a thing.
          </p>

          {/* First step card */}
          <div
            className="text-left bg-white border border-[#E7E2DA] rounded-[16px] px-[22px] py-[20px] max-w-[440px] mx-auto mb-[28px] flex items-center gap-4"
            style={{ boxShadow: '0 18px 40px -30px rgba(20,24,22,.4)' }}
          >
            <div className="flex-shrink-0 w-[46px] h-[46px] rounded-[12px] bg-[#E3F1EE] flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2F6E7A"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3a4 4 0 0 0-4 4c0 2 1.5 3 1.5 5h5c0-2 1.5-3 1.5-5a4 4 0 0 0-4-4Z" />
                <path d="M9.5 16h5M10 19h4" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#8A928D] mb-0.5">
                Your first gentle step
              </div>
              <div className="text-[15.5px] font-semibold text-[#3A403C] leading-[1.35]">
                A 3-minute grounding breath
              </div>
            </div>
            <span className="text-[12.5px] text-[#8A928D] flex-shrink-0">3 min</span>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/home"
              className="inline-flex items-center gap-2.5 bg-primary text-white font-heading text-[16px] font-semibold py-[16px] px-[30px] rounded-[12px] hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ boxShadow: '0 12px 24px -10px rgba(47,122,109,.6)' }}
            >
              Open my plan
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/home"
              className="inline-flex items-center gap-2.5 bg-white text-[#2F5049] font-heading text-[16px] font-semibold py-[16px] px-[26px] rounded-[12px] border border-[#D9E0DA] hover:bg-[#F7F5F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Take a look around
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
