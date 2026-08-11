'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ─── Section heading ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#9AA29C] mb-3">
      {children}
    </div>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#E7E2DA] rounded-[16px] overflow-hidden">
      {children}
    </div>
  );
}

/* ─── Cancel confirmation modal ─── */
function CancelModal({ onClose }: { onClose: () => void }) {
  const BULLETS = [
    'Your plan stays active until 4 August 2026. Nothing changes until then.',
    "You won’t be charged again.",
    'Your journal and progress stay saved, in case you’d like to come back.',
  ];

  return (
    /* Scrim */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-10"
      style={{ background: 'rgba(28,38,34,.42)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
        className="w-[480px] max-w-full bg-white rounded-[22px] px-[34px] pt-[34px] pb-[30px]"
        style={{ boxShadow: '0 40px 80px -24px rgba(20,24,22,.5)' }}
      >
        {/* Icon */}
        <span className="flex w-[48px] h-[48px] rounded-[14px] bg-[#F3EEE6] items-center justify-center mb-[18px]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B26A44"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 21s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 3.5C19 16.5 12 21 12 21Z" />
          </svg>
        </span>

        <h2
          id="cancel-modal-title"
          className="font-heading text-[23px] font-semibold tracking-[-0.02em] text-[#2A2F2C] mb-[10px]"
        >
          Cancel your subscription?
        </h2>
        <p className="text-[14.5px] leading-[1.6] text-[#565D5A] mb-5 [text-wrap:pretty]">
          That&rsquo;s completely okay — you can do this whenever you like. Here&rsquo;s what
          happens:
        </p>

        {/* Bullet list */}
        <div className="flex flex-col gap-[14px] mb-[26px]">
          {BULLETS.map((text, i) => (
            <div key={i} className="flex items-start gap-3">
              <svg
                className="flex-shrink-0 mt-[1px]"
                width="18"
                height="18"
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
              <span
                className="text-[14px] leading-[1.5] text-[#3F463F]"
                dangerouslySetInnerHTML={{ __html: text.replace('4 August 2026', '<strong class="font-semibold">4 August 2026</strong>') }}
              />
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-[10px]">
          <button
            type="button"
            className="flex items-center justify-center bg-[#2F5049] text-white font-heading text-[15.5px] font-semibold py-[15px] rounded-[12px] hover:bg-[#263F38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Cancel subscription
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center text-[#5F6863] text-[14.5px] font-semibold py-[13px] rounded-[12px] hover:bg-[#F5F3EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Never mind, keep my plan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  const [showCancel, setShowCancel] = useState(false);

  return (
    <>
      <main className="relative flex-1 overflow-hidden px-6 py-9 pb-12 lg:px-10">
        <div className="relative max-w-[600px] mx-auto">
          {/* Back link */}
          <Link
            href="/settings"
            className="inline-flex items-center gap-[7px] text-[13px] font-semibold text-[#5F6863] mb-4 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8A928D"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 5l-7 7 7 7" />
            </svg>
            Account &amp; privacy
          </Link>

          <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
            Manage anytime
          </span>
          <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29] mt-2 mb-7">
            Your subscription
          </h1>

          {/* ── Current plan ── */}
          <SectionLabel>Current plan</SectionLabel>
          <SettingsCard>
            {/* Plan name + trial */}
            <div className="flex items-start justify-between px-[22px] py-5 border-b border-[#F0EBE3]">
              <div>
                <div className="flex items-center gap-[10px]">
                  <span className="font-heading text-[16px] font-semibold text-[#3A403C]">
                    Afia · Yearly
                  </span>
                  <span className="text-[11.5px] font-semibold text-[#276358] bg-[#E3F1EE] px-[9px] py-[3px] rounded-full">
                    Trial
                  </span>
                </div>
                <div className="text-[13px] text-[#8A928D] mt-[5px]">
                  Free until 4 August 2026, then £69.99 a year.
                </div>
              </div>
              <button
                type="button"
                className="text-[13.5px] font-semibold text-primary whitespace-nowrap ml-4 hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Change plan
              </button>
            </div>
            {/* Next payment */}
            <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[#F0EBE3]">
              <div>
                <div className="text-[14.5px] font-semibold text-[#3A403C]">Next payment</div>
                <div className="text-[13px] text-[#8A928D] mt-0.5">
                  4 August 2026 · your trial ends
                </div>
              </div>
              <span className="font-heading text-[15px] font-semibold text-[#3A403C]">£69.99</span>
            </div>
            {/* Card */}
            <div className="flex items-center justify-between px-[22px] py-[18px]">
              <div className="flex items-center gap-3">
                <span className="w-[38px] h-[26px] rounded-[5px] bg-[#F1EEE9] border border-[#E4E0DA] flex items-center justify-center text-[9px] font-bold tracking-[0.04em] text-[#5F6863]">
                  VISA
                </span>
                <div>
                  <div className="text-[14.5px] font-semibold text-[#3A403C]">Visa ending 4242</div>
                  <div className="text-[13px] text-[#8A928D] mt-0.5">Expires 09 / 27</div>
                </div>
              </div>
              <button
                type="button"
                className="text-[13.5px] font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Update
              </button>
            </div>
          </SettingsCard>

          {/* ── Change plan ── */}
          <div className="mt-7">
            <SectionLabel>Change plan</SectionLabel>
            <div className="flex gap-3 mb-[10px]">
              {/* Yearly — current */}
              <div className="flex-1 bg-[#F5FAF8] border-[1.5px] border-[#2F6E7A] rounded-[14px] px-[18px] py-4">
                <div className="flex items-center justify-between mb-[6px]">
                  <span className="font-heading text-[14.5px] font-semibold text-[#3A403C]">
                    Yearly
                  </span>
                  <span className="text-[11px] font-semibold text-[#276358] bg-[#DCEEE8] px-2 py-[3px] rounded-full">
                    Current
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-[24px] font-semibold text-[#262B29]">
                    £69.99
                  </span>
                  <span className="text-[13px] text-[#8A928D]">/ year</span>
                </div>
              </div>
              {/* Monthly */}
              <div className="flex-1 bg-white border border-[#E7E2DA] rounded-[14px] px-[18px] py-4">
                <div className="flex items-center justify-between mb-[6px]">
                  <span className="font-heading text-[14.5px] font-semibold text-[#3A403C]">
                    Monthly
                  </span>
                  <button
                    type="button"
                    className="text-[12.5px] font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    Switch
                  </button>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-heading text-[24px] font-semibold text-[#262B29]">
                    £12.99
                  </span>
                  <span className="text-[13px] text-[#8A928D]">/ month</span>
                </div>
              </div>
            </div>
            <p className="text-[12.5px] text-[#9AA29C] mb-7">
              Staying yearly saves you about £86 a year. A plan change takes effect at your next
              payment.
            </p>
          </div>

          {/* ── Billing history ── */}
          <SectionLabel>Billing history</SectionLabel>
          <SettingsCard>
            <div className="flex items-center justify-between px-[22px] py-4 border-b border-[#F0EBE3] bg-[#FCFBF9]">
              <span className="text-[11px] font-semibold tracking-[0.05em] uppercase text-[#9AA29C]">
                Date
              </span>
              <span className="text-[11px] font-semibold tracking-[0.05em] uppercase text-[#9AA29C]">
                Amount
              </span>
            </div>
            <div className="flex items-center justify-between px-[22px] py-4">
              <div>
                <div className="text-[14px] font-semibold text-[#3A403C]">21 July 2026</div>
                <div className="text-[13px] text-[#8A928D] mt-0.5">Free trial started</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[14px] font-semibold text-[#3A403C]">£0.00</span>
                <button
                  type="button"
                  className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  Receipt
                </button>
              </div>
            </div>
          </SettingsCard>

          {/* ── Leaving ── */}
          <div className="mt-7">
            <SectionLabel>Leaving Afia</SectionLabel>
            <div className="bg-white border border-[#E7E2DA] rounded-[16px] px-[22px] py-5">
              <p className="text-[14px] leading-[1.6] text-[#565D5A] mb-[14px] [text-wrap:pretty]">
                You can cancel whenever you like. Your plan stays active until 4 August 2026, and
                you will not be charged if you cancel before then. Your journal and progress stay
                saved either way.
              </p>
              <button
                type="button"
                onClick={() => setShowCancel(true)}
                className="text-[14px] font-semibold text-[#5F6863] underline underline-offset-[3px] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                Cancel subscription
              </button>
            </div>
          </div>
        </div>
      </main>

      {showCancel && <CancelModal onClose={() => setShowCancel(false)} />}
    </>
  );
}
