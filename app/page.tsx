import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { InViewReveal, StaggerList, StaggerItem } from '@/components/motion';

export const metadata: Metadata = {
  title: { absolute: 'Afia — Calm in Mind' },
  description:
    'Understand the patterns behind health anxiety with a free, private check-in — no signup needed. Built on CBT and ERP techniques.',
  openGraph: {
    title: 'Afia — Calm in Mind',
    description:
      'Understand the patterns behind health anxiety with a free, private check-in — no signup needed. Built on CBT and ERP techniques.',
    url: '/',
    type: 'website',
  },
};

const APPROACH_CARDS = [
  {
    title: 'Calm Tool',
    description:
      'A quick breathing and grounding exercise to help you through anxious moments. Use it whenever you need it.',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="8.5" strokeLinecap="square" />
        <circle cx="12" cy="12" r="3.2" />
      </svg>
    ),
  },
  {
    title: 'Daily exercises',
    description:
      'Short, structured practices based on CBT and ERP techniques. Designed to fit into your day without adding pressure.',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M5 4h14v16l-7-3-7 3z" />
        <path d="M9 9h6M9 13h4" />
      </svg>
    ),
  },
  {
    title: 'Tracking',
    description:
      'Track your daily practice and see your progress over time. Consistency matters more than intensity.',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M4 19V5M4 19h16M8 15l3.5-4 3 2.5L20 8" />
      </svg>
    ),
  },
] as const;

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (sub && (sub.status === 'active' || sub.status === 'trialing')) {
      redirect('/home');
    }
    redirect('/plan');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader variant="landing" />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-tile-afia opacity-10 pointer-events-none" />
        <div className="relative mx-auto max-w-[1060px] px-5 sm:px-11 py-16 lg:py-[64px]">
          <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-[1.34fr_0.82fr]">

            {/* Left: text — each element fades up independently */}
            <div>
              <h1
                className="font-heading text-[38px] leading-[1.06] font-semibold tracking-[-0.028em] sm:text-[49px] max-w-[600px] [text-wrap:balance] mb-5 animate-fade-up"
                style={{ animationDelay: '0ms' }}
              >
                Understand the patterns behind health anxiety
              </h1>
              <p
                className="text-[18px] leading-[1.6] text-text-2 max-w-[520px] mb-8 [text-wrap:pretty] animate-fade-up"
                style={{ animationDelay: '80ms' }}
              >
                Afia helps you recognise and interrupt the patterns that keep health anxiety going,
                one step at a time.
              </p>
              <div
                className="flex flex-wrap gap-4 items-center mb-5 animate-fade-up"
                style={{ animationDelay: '160ms' }}
              >
                <Link
                  href="/screener"
                  className="inline-flex items-center justify-center rounded-[9px] bg-primary px-[30px] py-[15px] text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Take the free test
                </Link>
                <a
                  href="#approach"
                  className="text-[15px] text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  See how it works
                </a>
              </div>
              <p
                className="text-[13px] text-text-3 animate-fade-up"
                style={{ animationDelay: '230ms' }}
              >
                Free. No signup. Two to four minutes. Your answers stay on your device.
              </p>
            </div>

            {/* Right: quatrefoil — fades in, then spins slowly forever */}
            <div
              className="hidden lg:flex justify-center items-center animate-fade-up"
              style={{ animationDelay: '100ms' }}
            >
              <div className="animate-slow-rotate">
                <svg
                  width="460"
                  height="460"
                  viewBox="0 0 400 400"
                  aria-hidden="true"
                  className="max-w-full h-auto"
                >
                  <defs>
                    <radialGradient id="qOrb" cx="42%" cy="38%" r="65%">
                      <stop offset="0%" stopColor="#8FD0C1" />
                      <stop offset="55%" stopColor="#3E9284" />
                      <stop offset="100%" stopColor="#276358" />
                    </radialGradient>
                    <radialGradient id="qHalo" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2F6E7A" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#2F6E7A" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="200" cy="200" r="190" fill="url(#qHalo)" />
                  <circle cx="200" cy="200" r="150" fill="none" stroke="#2F6E7A" strokeOpacity="0.10" strokeWidth="1" />
                  <circle cx="200" cy="200" r="163" fill="none" stroke="#2F6E7A" strokeOpacity="0.07" strokeWidth="1" />
                  <g fill="#2F6E7A" fillOpacity="0.05" stroke="#2F6E7A" strokeOpacity="0.22" strokeWidth="1.3" strokeLinejoin="round">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
                      <path
                        key={r}
                        d="M200 200 Q167 128 200 58 Q233 128 200 200 Z"
                        transform={r ? `rotate(${r} 200 200)` : undefined}
                      />
                    ))}
                  </g>
                  <g transform="rotate(22.5 200 200)" fill="#2F6E7A" fillOpacity="0.08" stroke="#2F6E7A" strokeOpacity="0.18" strokeWidth="1.1" strokeLinejoin="round">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
                      <path
                        key={r}
                        d="M200 200 Q179 158 200 108 Q221 158 200 200 Z"
                        transform={r ? `rotate(${r} 200 200)` : undefined}
                      />
                    ))}
                  </g>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Our Approach ────────────────────────────────────────── */}
      <section id="approach" className="py-3 pb-[60px]">
        <div className="mx-auto max-w-[1000px] px-5 sm:px-11">

          <InViewReveal className="text-center mb-[34px]">
            <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-primary">
              OUR APPROACH
            </span>
            <h2 className="font-heading text-[28px] font-semibold tracking-[-0.02em] mt-2">
              Tools you use on your own terms
            </h2>
          </InViewReveal>

          <StaggerList
            className="grid grid-cols-1 gap-[22px] sm:grid-cols-3"
            triggerOnView
            stagger={0.12}
            delay={0.05}
          >
            {APPROACH_CARDS.map(({ title, description, icon }) => (
              <StaggerItem key={title}>
                <div className="rounded-[18px] border border-[#E7E2DA] bg-white p-[28px] h-full">
                  <div className="mb-[18px] flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-tint text-primary">
                    {icon}
                  </div>
                  <h3 className="font-heading text-[18px] font-semibold mb-2.5">{title}</h3>
                  <p className="text-[14.5px] leading-[1.6] text-text-2">{description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerList>

        </div>
      </section>

      {/* ── Founder band ────────────────────────────────────────── */}
      <section
        id="how-it-helps"
        className="relative overflow-hidden py-[66px] px-5 sm:px-11"
        style={{ background: '#1B2320', color: '#F3F1EC' }}
      >
        {/* Vesica tile overlay — always visible, no animation */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.1]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='60'%3E%3Cpath d='M22 0Q44 0 44 30 44 60 22 60 0 60 0 30 0 0 22 0Z' fill='none' stroke='%23FFFFFF' stroke-width='1.5'/%3E%3C/svg%3E\")",
            backgroundSize: '44px 60px',
          }}
        />

        <div className="relative max-w-[720px] mx-auto text-center">
          <InViewReveal y={14} duration={0.55}>
            <Image
              src="/Images/Official_Logo.png"
              alt=""
              width={45}
              height={45}
              className="h-[45px] w-auto mx-auto mb-[22px] opacity-90 object-contain"
            />
            <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-[#8FB4AB]">
              Why Afia exists
            </span>
          </InViewReveal>

          <InViewReveal delay={0.15} y={18} duration={0.6}>
            <p className="font-heading text-[23px] leading-[1.5] font-medium tracking-[-0.01em] text-[#F3F1EC] mt-4 mb-0 [text-wrap:pretty]">
              Health anxiety can feel isolating. You search for answers, you check symptoms, you seek
              reassurance, and the cycle continues. Afia was built because we believe people dealing
              with health anxiety deserve a structured, private, and accessible way to start breaking
              that cycle.
            </p>
          </InViewReveal>

          <InViewReveal delay={0.28} y={14} duration={0.55}>
            <p className="text-[16px] leading-[1.7] text-[#AEB6B0] mt-[22px] [text-wrap:pretty]">
              Our approach is grounded in CBT and ERP, the same evidence-based methods used by
              therapists who specialise in health anxiety. Afia puts these tools in your hands, on
              your phone, on your own terms.
            </p>
          </InViewReveal>
        </div>
      </section>

      {/* ── Crisis support prompt ────────────────────────────────── */}
      <section className="px-5 sm:px-11 pt-10 pb-2">
        <div className="mx-auto max-w-[1000px]">
          <InViewReveal y={16} duration={0.5}>
            <div className="flex items-center gap-[18px] rounded-[16px] border border-[#D8EBE5] bg-[#F1F8F6] px-[26px] py-[22px]">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-tint text-primary">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  aria-hidden="true"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-[#262B29] mb-0.5">
                  Need to talk to someone?
                </p>
                <p className="text-[14px] leading-[1.55] text-text-2">
                  Afia is a self-help tool, not a substitute for professional care. If you are in
                  distress or crisis, support is available.
                </p>
              </div>
              <Link
                href="/crisis-support"
                className="text-[14px] font-medium whitespace-nowrap text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                See crisis support
              </Link>
            </div>
          </InViewReveal>
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 sm:px-11 py-[60px] pb-[66px] text-center">
        <div className="absolute inset-0 bg-tile-afia opacity-10 pointer-events-none" />
        <div className="relative max-w-[560px] mx-auto">
          <InViewReveal y={20} duration={0.6}>
            <h2 className="font-heading text-[30px] font-semibold tracking-[-0.02em] mb-3.5 [text-wrap:balance]">
              Start with a quiet moment of understanding
            </h2>
          </InViewReveal>
          <InViewReveal delay={0.14} y={14} duration={0.5}>
            <p className="text-[16px] leading-[1.6] text-text-2 mb-[26px]">
              The screener is free, takes a few minutes, and shows you a real reflection of your own
              patterns before anything else.
            </p>
            <Link
              href="/screener"
              className="inline-flex items-center justify-center rounded-[9px] bg-primary px-8 py-[15px] text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Take the free test
            </Link>
          </InViewReveal>
        </div>
      </section>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Afia',
            description:
              'A self-help tool for health anxiety, grounded in CBT and ERP.',
            url: 'https://afia-app.vercel.app',
            applicationCategory: 'HealthApplication',
            operatingSystem: 'All',
            inLanguage: 'en-GB',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'GBP',
              description: 'Free health anxiety check-in — no signup required',
            },
          }),
        }}
      />
    </div>
  );
}
