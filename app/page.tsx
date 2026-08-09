import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { Logo } from '@/components/brand/Logo';

export const metadata: Metadata = {
  title: 'Afia — Calm in Mind',
  description:
    'A self-help tool for health anxiety, grounded in CBT and ERP.',
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-deep text-white">
        <Image
          src="/Images/islamic_pattern1.png"
          alt=""
          aria-hidden
          fill
          className="object-cover opacity-10 pointer-events-none select-none"
          priority
        />
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28 text-center">
          <div className="mb-6 flex justify-center">
            <Logo variant="full" href="/" priority />
          </div>

          {/* PLACEHOLDER: pending copy from Hasnain */}
          <h1 className="font-heading text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl mt-8">
            [Hero headline — pending copy from Hasnain]
          </h1>

          {/* PLACEHOLDER: pending copy from Hasnain */}
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/80">
            [Hero subheading — pending copy from Hasnain]
          </p>

          <Link
            href="/screener"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-md bg-white px-8 py-3 text-sm font-semibold text-deep hover:bg-white/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Take the free test
          </Link>

          {/* Trust banner */}
          <p className="mt-6 text-xs text-white/60">
            Built on evidence-based approaches recommended by therapists for health anxiety
          </p>
        </div>
      </section>

      {/* Why Afia exists */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl">
            {/* PLACEHOLDER: pending copy from Hasnain — section label */}
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-mid">
              [Section label — pending copy from Hasnain]
            </p>
            <p className="text-base leading-relaxed text-foreground/90">
              Health anxiety can feel isolating. You search for answers, you
              check symptoms, you seek reassurance, and the cycle continues.
              Afia was built because we believe people dealing with health
              anxiety deserve a structured, private, and accessible way to start
              breaking that cycle. Our approach is grounded in CBT and ERP, the
              same evidence-based methods used by therapists who specialise in
              health anxiety. Afia puts these tools in your hands, on your
              phone, on your own terms.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-tint/30">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid gap-8 sm:grid-cols-3">
            <FeatureCard
              title="Calm Tool"
              description="A quick breathing and grounding exercise to help you through anxious moments. Use it whenever you need it."
            />
            <FeatureCard
              title="Daily exercises"
              description="Short, structured practices based on CBT and ERP techniques. Designed to fit into your day without adding pressure."
            />
            <FeatureCard
              title="Progress tracking"
              description="Track your daily practice and see your progress over time. Consistency matters more than intensity."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20">
          {/* PLACEHOLDER: pending copy from Hasnain */}
          <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
            [Final CTA headline — pending copy from Hasnain]
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
            The screener is free. No account needed. Your answers stay on your device.
          </p>
          <Link
            href="/screener"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Take the free test
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-accent bg-surface p-6">
      <h3 className="font-heading text-base font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
