import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = { title: 'Terms of Service — Afia' };

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader variant="legal" />

      <main className="mx-auto w-full max-w-[680px] px-10 py-[44px] pb-[60px]">
        {/* Draft notice banner */}
        <div className="flex items-center gap-2.5 rounded-[10px] border border-[#EAD8B4] bg-[#FBF1E1] px-3.5 py-2.5 mb-7">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9A7526"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span className="text-[12.5px] text-[#8A5A17]">
            Placeholder structure — final wording pending legal review.
          </span>
        </div>

        <h1 className="font-heading text-[32px] font-semibold tracking-[-0.025em] mb-1.5">
          Terms of service
        </h1>
        <p className="text-[13.5px] text-text-4 mb-[30px]">Last updated August 2026</p>

        <div className="flex flex-col gap-6">
          <Section title="Using Afia">
            <p>
              Afia is a self-help platform for health anxiety, operated by Afia Ltd
              (&ldquo;Afia&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or
              using the platform, you agree to these terms. It is a self-help tool, not medical
              care.
            </p>
          </Section>

          <Section title="What Afia is and is not">
            <p>
              Afia provides self-help tools grounded in Cognitive Behavioural Therapy (CBT) and
              Exposure and Response Prevention (ERP) principles. It is not a medical service, mental
              health service, or substitute for professional care. It does not provide diagnosis,
              clinical assessment, or treatment.
            </p>
            <p className="mt-3">
              If you are in distress or crisis, please{' '}
              <Link href="/crisis-support" className="text-primary hover:underline">
                contact a crisis service
              </Link>
              .
            </p>
          </Section>

          <Section title="Your account">
            <p>You must be at least 18 years old to create an account. You are responsible for:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Keeping your login credentials secure and not sharing your account.</li>
              <li>All activity that occurs under your account.</li>
              <li>
                Notifying us at support@afia.me if you suspect unauthorised access.
              </li>
            </ul>
          </Section>

          <Section title="Subscription &amp; billing">
            <p>
              Afia offers monthly and yearly subscription plans, each beginning with a 7-day free
              trial. By starting a trial, your payment method will be charged at the end of the
              trial period unless you cancel beforehand.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Cancellation</strong> — cancel at any time from your account settings.
                Access continues until the end of the current billing period.
              </li>
              <li>
                <strong>Price changes</strong> — we will give you at least 30 days' notice before
                any price change affects your subscription.
              </li>
              <li>
                <strong>Payment processing</strong> — payments are handled by Stripe. By
                subscribing, you agree to Stripe's terms of service.
              </li>
            </ul>
          </Section>

          <Section title="Acceptable use">
            <p>You agree not to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Use Afia in any way that violates applicable UK laws or regulations.</li>
              <li>Attempt to gain unauthorised access to any part of the platform.</li>
              <li>Reverse engineer, copy, or reproduce any part of the platform.</li>
            </ul>
          </Section>

          <Section title="Intellectual property">
            <p>
              All content on Afia — including exercises, copy, design, and the Afia name and logo
              — is owned by Afia Ltd. You may use the platform for your personal, non-commercial
              use only.
            </p>
          </Section>

          <Section title="Limitation of liability">
            <p>
              To the maximum extent permitted by law, Afia is provided &ldquo;as is&rdquo; without
              warranties. We are not liable for any indirect, incidental, or consequential loss
              arising from your use of the platform. Our total liability shall not exceed the amount
              you paid us in the 12 months preceding the claim.
            </p>
          </Section>

          <Section title="Governing law">
            <p>
              These terms are governed by the laws of England and Wales. Any disputes shall be
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms? Email us at{' '}
              <a href="mailto:legal@afia.me" className="font-medium text-primary hover:underline">
                legal@afia.me
              </a>
              .
            </p>
          </Section>
        </div>

        <div className="mt-10 border-t border-border pt-8 text-xs text-text-4">
          <p>
            Afia is a self-help platform. It is not a substitute for professional medical or
            psychological care.{' '}
            <Link href="/disclaimer" className="font-medium text-primary hover:underline">
              Medical disclaimer
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-[18px] font-semibold mb-1.5">{title}</h2>
      <div className="text-[14.5px] leading-[1.65] text-text-2">{children}</div>
    </section>
  );
}
