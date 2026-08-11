import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';

export const metadata: Metadata = { title: 'Privacy Policy — Afia' };

export default function PrivacyPage() {
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
          Privacy policy
        </h1>
        <p className="text-[13.5px] text-text-4 mb-[30px]">Last updated August 2026</p>

        <div className="flex flex-col gap-6">
          <Section title="Who we are">
            <p>
              Afia is a self-help platform for health anxiety, operated by Afia Ltd. In this policy,
              &ldquo;Afia&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, and &ldquo;our&rdquo; refer to
              Afia Ltd. We are the data controller for personal information collected through this
              platform.
            </p>
            <p className="mt-3">
              If you have any questions about how we handle your data, please contact us at{' '}
              <a href="mailto:privacy@afia.me" className="font-medium text-primary hover:underline">
                privacy@afia.me
              </a>
              .
            </p>
          </Section>

          <Section title="Your privacy comes first">
            <p>
              Afia is built to ask for as little as possible. The screener runs entirely on your
              device, and your answers are never sent to us before you choose to create an account.
            </p>
          </Section>

          <Section title="What we collect">
            <p>We collect the following categories of personal data:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Account information</strong> — your email address when you create an account.
              </li>
              <li>
                <strong>Screener responses</strong> — your anonymised answers to the health anxiety
                check-in, and the resulting score band. These are linked to your account only if you
                choose to save them by signing up.
              </li>
              <li>
                <strong>Exercise and progress data</strong> — records of which exercises you have
                completed and on which dates, used to generate your streak and progress view.
              </li>
              <li>
                <strong>Subscription and billing data</strong> — your subscription status, plan type,
                and billing period. Payment card details are processed by Stripe and never stored by us.
              </li>
              <li>
                <strong>Usage data</strong> — standard server logs including IP address, browser type,
                and pages visited. We use this only for security and to understand how the platform
                performs.
              </li>
            </ul>
          </Section>

          <Section title="How we use it">
            <p>We use your personal data to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Provide and maintain your Afia account and subscription.</li>
              <li>Save and display your screener results and exercise progress.</li>
              <li>Process subscription payments through Stripe.</li>
              <li>Send transactional emails (account confirmation, password reset).</li>
              <li>Detect and prevent fraud and security issues.</li>
              <li>Comply with legal obligations.</li>
            </ul>
            <p className="mt-3">
              We do not use your data to train AI models, sell it to third parties, or use it for
              advertising.
            </p>
          </Section>

          <Section title="Who we share it with">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Supabase</strong> — our database and authentication provider. Your account
                and app data is stored on Supabase infrastructure hosted in the EU.
              </li>
              <li>
                <strong>Stripe</strong> — our payment processor. When you subscribe, your payment
                details are handled directly by Stripe under their own privacy policy.
              </li>
            </ul>
            <p className="mt-3">
              We do not use advertising networks or any third-party data processors beyond those
              listed above.
            </p>
          </Section>

          <Section title="Your rights &amp; contact">
            <p>Under UK GDPR you have the right to access, rectify, erase, and port your data, and
            to object to processing. To exercise any of these rights, email us at{' '}
              <a href="mailto:privacy@afia.me" className="font-medium text-primary hover:underline">
                privacy@afia.me
              </a>
              . We will respond within 30 days.
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
