import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = {
  title: 'Medical Disclaimer — Afia',
  description: 'What Afia is, and what it is not.',
};

export default function DisclaimerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader variant="legal" />

      <main className="mx-auto w-full max-w-[680px] px-10 py-[52px] pb-[60px]">
        <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
          Please read this
        </span>
        <h1 className="font-heading text-[34px] font-semibold tracking-[-0.025em] mt-2.5 mb-2.5">
          What Afia is, and isn't
        </h1>
        <p className="text-[16px] leading-[1.65] text-text-2 mb-8 [text-wrap:pretty]">
          Afia is a self-help tool for understanding and easing health anxiety. So you can trust it,
          we want to be completely clear about what it does not do.
        </p>

        <div className="flex flex-col gap-[26px]">
          <section>
            <h2 className="font-heading text-[19px] font-semibold tracking-[-0.015em] mb-1.5">
              Afia is not a medical service
            </h2>
            <p className="text-[15px] leading-[1.65] text-text-2">
              It is not a medical device, and it does not provide medical advice, treatment, or
              care. It cannot diagnose any condition — physical or mental — and it is not a
              substitute for a doctor, therapist, or other qualified professional.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-[19px] font-semibold tracking-[-0.015em] mb-1.5">
              The test is a reflection, not a diagnosis
            </h2>
            <p className="text-[15px] leading-[1.65] text-text-2">
              The screener helps you notice patterns in how you relate to worry about your health.
              Its result is a starting point for reflection — never a clinical assessment, score,
              or label.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-[19px] font-semibold tracking-[-0.015em] mb-1.5">
              Always speak to a professional about your health
            </h2>
            <p className="text-[15px] leading-[1.65] text-text-2">
              If you have symptoms or health concerns, please talk to a qualified healthcare
              professional. Nothing in Afia should delay or replace seeking that care.
            </p>
          </section>

          {/* Crisis urgency box */}
          <div className="rounded-[14px] border border-crisis-border bg-crisis-surface px-[22px] py-5">
            <h2 className="font-heading text-[18px] font-semibold text-crisis mb-1.5">
              If you need urgent help
            </h2>
            <p className="text-[14.5px] leading-[1.6] text-[#8A5647] mb-3">
              If you are in crisis or think you might harm yourself, you deserve real support right
              now.
            </p>
            <Link
              href="/crisis-support"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-crisis hover:text-crisis/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Go to crisis support
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
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
