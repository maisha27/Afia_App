'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cancelSubscription, switchPlan, redirectToCustomerPortal } from '@/lib/actions/subscription';

/* ─── Types ─── */
export interface CardInfo {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface InvoiceItem {
  id: string;
  date: string;
  description: string;
  amountPaid: number;
  currency: string;
  pdfUrl: string | null;
}

export interface SubscriptionClientProps {
  plan: 'monthly' | 'yearly';
  status: string;
  currentPeriodEnd: string;
  initialCancelAtPeriodEnd: boolean;
  card: CardInfo | null;
  invoices: InvoiceItem[];
}

/* ─── Shared UI ─── */
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

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

/* ─── Cancel modal ─── */
function CancelModal({
  onClose,
  onConfirm,
  periodEnd,
  isPending,
}: {
  onClose: () => void;
  onConfirm: () => void;
  periodEnd: string;
  isPending: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-10"
      style={{ background: 'rgba(28,38,34,.42)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-modal-title"
        className="w-[480px] max-w-full bg-white rounded-[22px] px-[34px] pt-[34px] pb-[30px]"
        style={{ boxShadow: '0 40px 80px -24px rgba(20,24,22,.5)' }}
      >
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

        <div className="flex flex-col gap-[14px] mb-[26px]">
          {[
            <>
              Your plan stays active until{' '}
              <strong className="font-semibold">{periodEnd}</strong>. Nothing changes until then.
            </>,
            "You won't be charged again.",
            'Your journal and progress stay saved, in case you’d like to come back.',
          ].map((text, i) => (
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
              <span className="text-[14px] leading-[1.5] text-[#3F463F]">{text}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[10px]">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex items-center justify-center bg-[#2F5049] text-white font-heading text-[15.5px] font-semibold py-[15px] rounded-[12px] hover:bg-[#263F38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            {isPending ? 'Cancelling…' : 'Cancel subscription'}
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

/* ─── Main component ─── */
export default function SubscriptionClient({
  plan,
  status,
  currentPeriodEnd,
  initialCancelAtPeriodEnd,
  card,
  invoices,
}: SubscriptionClientProps) {
  const router = useRouter();
  const [showCancel, setShowCancel] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(initialCancelAtPeriodEnd);
  const [isPending, startTransition] = useTransition();
  const [switchError, setSwitchError] = useState('');

  const isTrialing = status === 'trialing';
  const planName = `Afia · ${plan === 'yearly' ? 'Yearly' : 'Monthly'}`;

  let dateText: string;
  if (cancelAtPeriodEnd) {
    dateText = `Access until ${currentPeriodEnd}, then cancelled.`;
  } else if (isTrialing) {
    const price = plan === 'yearly' ? '£69.99 a year' : '£12.99 a month';
    dateText = `Free until ${currentPeriodEnd}, then ${price}.`;
  } else {
    dateText = `Next payment ${currentPeriodEnd}.`;
  }

  const nextPaymentAmount = plan === 'yearly' ? '£69.99' : '£12.99';

  const cardBrand = card
    ? card.brand.charAt(0).toUpperCase() + card.brand.slice(1)
    : null;
  const expStr = card
    ? `Expires ${String(card.expMonth).padStart(2, '0')} / ${String(card.expYear).slice(-2)}`
    : null;

  function handleCancelConfirm() {
    startTransition(async () => {
      const result = await cancelSubscription();
      if (result?.error) {
        setShowCancel(false);
        return;
      }
      setCancelAtPeriodEnd(true);
      setShowCancel(false);
      router.refresh();
    });
  }

  function handleSwitch(billing: 'monthly' | 'yearly') {
    setSwitchError('');
    startTransition(async () => {
      const result = await switchPlan(billing);
      if (result?.error) {
        setSwitchError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleUpdateCard() {
    startTransition(async () => {
      await redirectToCustomerPortal();
    });
  }

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
            {/* Plan name + status */}
            <div className="flex items-start justify-between px-[22px] py-5 border-b border-[#F0EBE3]">
              <div>
                <div className="flex items-center gap-[10px]">
                  <span className="font-heading text-[16px] font-semibold text-[#3A403C]">
                    {planName}
                  </span>
                  {isTrialing && !cancelAtPeriodEnd && (
                    <span className="text-[11.5px] font-semibold text-[#276358] bg-[#E3F1EE] px-[9px] py-[3px] rounded-full">
                      Trial
                    </span>
                  )}
                  {cancelAtPeriodEnd && (
                    <span className="text-[11.5px] font-semibold text-[#8A6430] bg-[#F3EEE6] px-[9px] py-[3px] rounded-full">
                      Cancelling
                    </span>
                  )}
                </div>
                <div className="text-[13px] text-[#8A928D] mt-[5px]">{dateText}</div>
              </div>
            </div>

            {/* Next payment */}
            {!cancelAtPeriodEnd && (
              <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-[#F0EBE3]">
                <div>
                  <div className="text-[14.5px] font-semibold text-[#3A403C]">Next payment</div>
                  <div className="text-[13px] text-[#8A928D] mt-0.5">
                    {currentPeriodEnd}
                    {isTrialing ? ' · your trial ends' : ''}
                  </div>
                </div>
                <span className="font-heading text-[15px] font-semibold text-[#3A403C]">
                  {nextPaymentAmount}
                </span>
              </div>
            )}

            {/* Card */}
            <div className="flex items-center justify-between px-[22px] py-[18px]">
              {card ? (
                <div className="flex items-center gap-3">
                  <span className="w-[38px] h-[26px] rounded-[5px] bg-[#F1EEE9] border border-[#E4E0DA] flex items-center justify-center text-[9px] font-bold tracking-[0.04em] text-[#5F6863] uppercase">
                    {card.brand}
                  </span>
                  <div>
                    <div className="text-[14.5px] font-semibold text-[#3A403C]">
                      {cardBrand} ending {card.last4}
                    </div>
                    <div className="text-[13px] text-[#8A928D] mt-0.5">{expStr}</div>
                  </div>
                </div>
              ) : (
                <div className="text-[14px] text-[#8A928D]">No payment method on file</div>
              )}
              <button
                type="button"
                onClick={handleUpdateCard}
                disabled={isPending}
                className="text-[13.5px] font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </SettingsCard>

          {/* ── Change plan ── */}
          {!cancelAtPeriodEnd && (
            <div className="mt-7">
              <SectionLabel>Change plan</SectionLabel>
              <div className="flex gap-3 mb-[10px]">
                {/* Yearly */}
                <div
                  className={`flex-1 rounded-[14px] px-[18px] py-4 ${
                    plan === 'yearly'
                      ? 'bg-[#F5FAF8] border-[1.5px] border-[#2F6E7A]'
                      : 'bg-white border border-[#E7E2DA]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-[6px]">
                    <span className="font-heading text-[14.5px] font-semibold text-[#3A403C]">
                      Yearly
                    </span>
                    {plan === 'yearly' ? (
                      <span className="text-[11px] font-semibold text-[#276358] bg-[#DCEEE8] px-2 py-[3px] rounded-full">
                        Current
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSwitch('yearly')}
                        disabled={isPending}
                        className="text-[12.5px] font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm disabled:opacity-50"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-[24px] font-semibold text-[#262B29]">
                      £69.99
                    </span>
                    <span className="text-[13px] text-[#8A928D]">/ year</span>
                  </div>
                </div>

                {/* Monthly */}
                <div
                  className={`flex-1 rounded-[14px] px-[18px] py-4 ${
                    plan === 'monthly'
                      ? 'bg-[#F5FAF8] border-[1.5px] border-[#2F6E7A]'
                      : 'bg-white border border-[#E7E2DA]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-[6px]">
                    <span className="font-heading text-[14.5px] font-semibold text-[#3A403C]">
                      Monthly
                    </span>
                    {plan === 'monthly' ? (
                      <span className="text-[11px] font-semibold text-[#276358] bg-[#DCEEE8] px-2 py-[3px] rounded-full">
                        Current
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSwitch('monthly')}
                        disabled={isPending}
                        className="text-[12.5px] font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm disabled:opacity-50"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-heading text-[24px] font-semibold text-[#262B29]">
                      £12.99
                    </span>
                    <span className="text-[13px] text-[#8A928D]">/ month</span>
                  </div>
                </div>
              </div>
              {switchError && (
                <p className="text-[12.5px] text-[#C99A46] mb-2" role="alert">{switchError}</p>
              )}
              <p className="text-[12.5px] text-[#9AA29C] mb-7">
                Staying yearly saves you about £86 a year. A plan change takes effect at your next
                payment.
              </p>
            </div>
          )}

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
            {invoices.length === 0 ? (
              <div className="px-[22px] py-5 text-[14px] text-[#8A928D]">No invoices yet.</div>
            ) : (
              invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between px-[22px] py-4 border-b border-[#F0EBE3] last:border-0"
                >
                  <div>
                    <div className="text-[14px] font-semibold text-[#3A403C]">{inv.date}</div>
                    <div className="text-[13px] text-[#8A928D] mt-0.5">{inv.description}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[14px] font-semibold text-[#3A403C]">
                      {formatAmount(inv.amountPaid, inv.currency)}
                    </span>
                    {inv.pdfUrl ? (
                      <a
                        href={inv.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      >
                        Receipt
                      </a>
                    ) : (
                      <span className="text-[13px] text-[#C0C8C3]">Receipt</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </SettingsCard>

          {/* ── Leaving ── */}
          {!cancelAtPeriodEnd ? (
            <div className="mt-7">
              <SectionLabel>Leaving Afia</SectionLabel>
              <div className="bg-white border border-[#E7E2DA] rounded-[16px] px-[22px] py-5">
                <p className="text-[14px] leading-[1.6] text-[#565D5A] mb-[14px] [text-wrap:pretty]">
                  You can cancel whenever you like. Your plan stays active until{' '}
                  {currentPeriodEnd}, and you will not be charged if you cancel before then. Your
                  journal and progress stay saved either way.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCancel(true)}
                  disabled={isPending}
                  className="text-[14px] font-semibold text-[#5F6863] underline underline-offset-[3px] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm disabled:opacity-50"
                >
                  Cancel subscription
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-7">
              <SectionLabel>Cancellation scheduled</SectionLabel>
              <div className="bg-[#F9F7F4] border border-[#E7E2DA] rounded-[16px] px-[22px] py-5">
                <p className="text-[14px] leading-[1.6] text-[#565D5A] [text-wrap:pretty]">
                  Your subscription ends on <strong className="font-semibold text-[#3A403C]">{currentPeriodEnd}</strong>. You have full access until then. Your journal and progress will stay saved.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {showCancel && (
        <CancelModal
          onClose={() => setShowCancel(false)}
          onConfirm={handleCancelConfirm}
          periodEnd={currentPeriodEnd}
          isPending={isPending}
        />
      )}
    </>
  );
}
