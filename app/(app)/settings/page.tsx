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

/* ─── Settings card wrapper ─── */
function SettingsCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#E7E2DA] rounded-[16px] overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/* ─── Row with label + right content ─── */
function SettingsRow({
  title,
  sub,
  right,
  border = true,
}: {
  title: string;
  sub?: string;
  right: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-[22px] py-[18px] ${border ? 'border-b border-[#F0EBE3]' : ''}`}
    >
      <div className="max-w-[380px]">
        <div className="text-[14.5px] font-semibold text-[#3A403C]">{title}</div>
        {sub && <div className="text-[13px] text-[#8A928D] mt-0.5">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

/* ─── Toggle switch ─── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="relative flex-shrink-0 w-[46px] h-[27px] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ background: on ? '#2F6E7A' : '#E4DED4' }}
    >
      <span
        className="absolute top-[3px] w-[21px] h-[21px] rounded-full bg-white transition-all"
        style={{ [on ? 'right' : 'left']: 3 }}
        aria-hidden="true"
      />
    </button>
  );
}

export default function SettingsPage() {
  const [daily, setDaily] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [encourage, setEncourage] = useState(false);

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-9 pb-12 lg:px-10">
      <div className="relative max-w-[600px] mx-auto">
        <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
          Yours to control
        </span>
        <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29] mt-2 mb-7">
          Account &amp; privacy
        </h1>

        {/* ── Account ── */}
        <SectionLabel>Account</SectionLabel>
        <SettingsCard className="mb-7">
          <SettingsRow
            title="Email"
            sub="amira@example.com"
            right={
              <button type="button" className="text-[13.5px] font-semibold text-primary hover:text-primary/80 transition-colors">
                Change
              </button>
            }
          />
          <SettingsRow
            title="Sign-in"
            sub="Magic link · no password"
            border={false}
            right={
              <button type="button" className="text-[13.5px] font-semibold text-primary hover:text-primary/80 transition-colors">
                Manage
              </button>
            }
          />
        </SettingsCard>

        {/* ── Reminders ── */}
        <SectionLabel>Gentle reminders</SectionLabel>
        <SettingsCard className="mb-7">
          <SettingsRow
            title="Daily nudge"
            sub="One quiet reminder for your plan step, at 9:00."
            right={<Toggle on={daily} onToggle={() => setDaily((v) => !v)} />}
          />
          <SettingsRow
            title="Weekly check-in"
            sub="A nudge to notice how the week has felt, on Sundays."
            right={<Toggle on={weekly} onToggle={() => setWeekly((v) => !v)} />}
          />
          <SettingsRow
            title="Encouragement notes"
            sub="Occasional warm words. Off by default."
            border={false}
            right={<Toggle on={encourage} onToggle={() => setEncourage((v) => !v)} />}
          />
        </SettingsCard>

        {/* ── Your data ── */}
        <SectionLabel>Your data</SectionLabel>
        <div className="flex gap-3 mb-7">
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-[9px] bg-white border border-[#D9E0DA] text-[#2F5049] font-heading text-[14.5px] font-semibold py-[14px] rounded-[12px] hover:bg-[#F5FAF8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2F5049"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3v12M8 11l4 4 4-4" />
              <path d="M4 19h16" />
            </svg>
            Export my data
          </button>
          <button
            type="button"
            className="flex-1 inline-flex items-center justify-center gap-[9px] bg-white border border-[#F0D9D2] text-[#B0503F] font-heading text-[14.5px] font-semibold py-[14px] rounded-[12px] hover:bg-[#FBF3F1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B0503F"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13h10l1-13" />
            </svg>
            Delete my account
          </button>
        </div>

        {/* ── Subscription ── */}
        <SectionLabel>Subscription</SectionLabel>
        <SettingsCard>
          <div className="flex items-center justify-between px-[22px] py-5">
            <div>
              <div className="flex items-center gap-[10px]">
                <span className="font-heading text-[16px] font-semibold text-[#3A403C]">
                  Afia · Yearly
                </span>
                <span className="text-[11.5px] font-semibold text-[#276358] bg-[#E3F1EE] px-[9px] py-[3px] rounded-full">
                  Trial
                </span>
              </div>
              <div className="text-[13px] text-[#8A928D] mt-1">
                Free until 4 August · then £69.99/year. Cancel anytime.
              </div>
            </div>
            <Link
              href="/subscription"
              className="text-[13.5px] font-semibold text-[#5F6863] hover:text-foreground transition-colors ml-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Manage plan
            </Link>
          </div>
        </SettingsCard>
      </div>
    </main>
  );
}
