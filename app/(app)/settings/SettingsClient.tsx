'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { saveNotificationPrefs, exportUserData, deleteAccount, changeEmail, changePassword, updateDisplayName } from '@/lib/actions/settings';
import { signOut } from '@/lib/actions/auth';

/* ─── Shared UI pieces ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] font-semibold tracking-[0.08em] uppercase text-[#9AA29C] mb-3">
      {children}
    </div>
  );
}

function SettingsCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-[#E7E2DA] rounded-[16px] overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

function SettingsRow({
  title,
  sub,
  right,
  border = true,
}: {
  title: string;
  sub?: React.ReactNode;
  right: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-[22px] py-[18px] ${border ? 'border-b border-[#F0EBE3]' : ''}`}
    >
      <div className="max-w-[380px]">
        <div className="text-[14.5px] font-semibold text-[#3A403C]">{title}</div>
        {sub && <div className="text-[13px] text-[#6E7672] mt-0.5">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function Toggle({
  on,
  onToggle,
  disabled,
}: {
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      disabled={disabled}
      className="relative flex-shrink-0 w-[46px] h-[27px] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
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

/* ─── Props ─── */
export interface SettingsClientProps {
  email: string;
  firstName: string | null;
  initialPrefs: {
    daily: boolean;
    weekly: boolean;
    encourage: boolean;
  };
  subscription: {
    plan: 'monthly' | 'yearly' | null;
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function SettingsClient({ email, firstName, initialPrefs, subscription }: SettingsClientProps) {
  const [daily, setDaily] = useState(initialPrefs.daily);
  const [weekly, setWeekly] = useState(initialPrefs.weekly);
  const [encourage, setEncourage] = useState(initialPrefs.encourage);
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Display name change
  const [nameFormOpen, setNameFormOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [nameStatus, setNameStatus] = useState<{ error?: string; success?: boolean } | null>(null);

  // Email change
  const [emailFormOpen, setEmailFormOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ error?: string; success?: boolean } | null>(null);

  // Password change
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ error?: string; success?: boolean } | null>(null);

  function handleNameSubmit() {
    setNameStatus(null);
    startTransition(async () => {
      const result = await updateDisplayName(newName);
      if (result.error) { setNameStatus({ error: result.error }); return; }
      setNameStatus({ success: true });
      setNewName('');
    });
  }

  function handleEmailSubmit() {
    setEmailStatus(null);
    startTransition(async () => {
      const result = await changeEmail(newEmail);
      if (result.error) { setEmailStatus({ error: result.error }); return; }
      setEmailStatus({ success: true });
      setNewEmail('');
    });
  }

  function handlePasswordSubmit() {
    setPasswordStatus(null);
    startTransition(async () => {
      const result = await changePassword(newPassword, confirmPw);
      if (result.error) { setPasswordStatus({ error: result.error }); return; }
      setPasswordStatus({ success: true });
      setNewPassword('');
      setConfirmPw('');
    });
  }

  function handleToggle(field: 'daily' | 'weekly' | 'encourage') {
    const nextDaily = field === 'daily' ? !daily : daily;
    const nextWeekly = field === 'weekly' ? !weekly : weekly;
    const nextEncourage = field === 'encourage' ? !encourage : encourage;
    if (field === 'daily') setDaily(nextDaily);
    if (field === 'weekly') setWeekly(nextWeekly);
    if (field === 'encourage') setEncourage(nextEncourage);
    startTransition(async () => {
      await saveNotificationPrefs({ daily: nextDaily, weekly: nextWeekly, encourage: nextEncourage });
    });
  }

  function handleExport() {
    startTransition(async () => {
      const result = await exportUserData();
      if ('error' in result) return;
      const { generatePDF } = await import('@/lib/export/generatePDF');
      generatePDF({ ...result, firstName });
    });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    startTransition(async () => {
      const result = await deleteAccount();
      if (result?.error) setDeleteError(result.error);
    });
  }

  /* Subscription section */
  const planLabel = subscription
    ? `Afia · ${subscription.plan === 'monthly' ? 'Monthly' : 'Yearly'}`
    : 'Afia';
  const isTrialing = subscription?.status === 'trialing';
  const endDate = subscription?.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : null;
  const priceStr = subscription?.plan === 'monthly' ? '£12.99/month' : '£69.99/year';
  const subDateText = subscription?.cancelAtPeriodEnd
    ? `Access until ${endDate ?? '—'}, then cancelled.`
    : isTrialing
    ? `Free until ${endDate ?? '—'} · then ${priceStr}. Cancel anytime.`
    : endDate
    ? `Next payment ${endDate}. Cancel anytime.`
    : 'Manage your plan';

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-9 pb-12 lg:px-10">
      <div className="relative max-w-[600px] mx-auto">
        <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
          <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
            Yours to control
          </span>
          <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29] mt-2 mb-7">
            Account &amp; privacy
          </h1>
        </div>

        {/* ── Account ── */}
        <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
        <SectionLabel>Account</SectionLabel>
        <SettingsCard className="mb-7">
          {/* Display name row */}
          <SettingsRow
            title="Your name"
            sub={nameStatus?.success ? 'Name updated.' : (firstName ?? 'Not set — add your first name')}
            right={
              <button
                type="button"
                onClick={() => { setNameFormOpen((o) => !o); setNameStatus(null); setNewName(''); }}
                className="text-[13.5px] font-semibold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
              >
                {nameFormOpen ? 'Cancel' : 'Change'}
              </button>
            }
          />
          {nameFormOpen && !nameStatus?.success && (
            <div className="px-[22px] pb-[18px] flex flex-col gap-[10px]">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your first name"
                autoFocus
                maxLength={50}
                className="w-full rounded-[10px] px-[14px] py-[11px] text-[14px] border border-[#E0DACF] bg-[#FAFAF8] text-[#2E332F] placeholder:text-[#B3B7B0] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {nameStatus?.error && (
                <p className="text-[12.5px] text-[#B0503F]">{nameStatus.error}</p>
              )}
              <button
                type="button"
                onClick={handleNameSubmit}
                disabled={isPending || !newName.trim()}
                className="self-start inline-flex items-center gap-2 bg-[#2F5049] text-white font-heading text-[14px] font-semibold px-5 py-[10px] rounded-[10px] hover:bg-[#263F38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                {isPending ? 'Saving…' : 'Save name'}
              </button>
            </div>
          )}

          {/* Email row */}
          <SettingsRow
            title="Email"
            sub={emailStatus?.success ? 'Confirmation sent — check your inbox.' : email}
            right={
              <button
                type="button"
                onClick={() => { setEmailFormOpen((o) => !o); setEmailStatus(null); }}
                className="text-[13.5px] font-semibold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
              >
                {emailFormOpen ? 'Cancel' : 'Change'}
              </button>
            }
          />
          {emailFormOpen && !emailStatus?.success && (
            <div className="px-[22px] pb-[18px] flex flex-col gap-[10px]">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email address"
                autoFocus
                className="w-full rounded-[10px] px-[14px] py-[11px] text-[14px] border border-[#E0DACF] bg-[#FAFAF8] text-[#2E332F] placeholder:text-[#B3B7B0] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {emailStatus?.error && (
                <p className="text-[12.5px] text-[#B0503F]">{emailStatus.error}</p>
              )}
              <button
                type="button"
                onClick={handleEmailSubmit}
                disabled={isPending || !newEmail.trim()}
                className="self-start inline-flex items-center gap-2 bg-[#2F5049] text-white font-heading text-[14px] font-semibold px-5 py-[10px] rounded-[10px] hover:bg-[#263F38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                {isPending ? 'Sending…' : 'Send confirmation'}
              </button>
            </div>
          )}

          {/* Password row */}
          <SettingsRow
            title="Sign-in"
            sub={passwordStatus?.success ? 'Password updated.' : 'Email & password'}
            border={false}
            right={
              <button
                type="button"
                onClick={() => { setPasswordFormOpen((o) => !o); setPasswordStatus(null); }}
                className="text-[13.5px] font-semibold text-primary hover:text-primary/80 transition-colors flex-shrink-0"
              >
                {passwordFormOpen ? 'Cancel' : 'Change password'}
              </button>
            }
          />
          {passwordFormOpen && !passwordStatus?.success && (
            <div className="px-[22px] pb-[18px] flex flex-col gap-[10px]">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (8+ characters)"
                autoFocus
                className="w-full rounded-[10px] px-[14px] py-[11px] text-[14px] border border-[#E0DACF] bg-[#FAFAF8] text-[#2E332F] placeholder:text-[#B3B7B0] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="Confirm new password"
                className="w-full rounded-[10px] px-[14px] py-[11px] text-[14px] border border-[#E0DACF] bg-[#FAFAF8] text-[#2E332F] placeholder:text-[#B3B7B0] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              {passwordStatus?.error && (
                <p className="text-[12.5px] text-[#B0503F]">{passwordStatus.error}</p>
              )}
              <button
                type="button"
                onClick={handlePasswordSubmit}
                disabled={isPending || !newPassword || !confirmPw}
                className="self-start inline-flex items-center gap-2 bg-[#2F5049] text-white font-heading text-[14px] font-semibold px-5 py-[10px] rounded-[10px] hover:bg-[#263F38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                {isPending ? 'Updating…' : 'Update password'}
              </button>
            </div>
          )}
        </SettingsCard>
        </div>

        {/* ── Reminders ── */}
        <div className="animate-fade-up" style={{ animationDelay: '130ms' }}>
        <SectionLabel>Gentle reminders</SectionLabel>
        <SettingsCard className="mb-7">
          <SettingsRow
            title="Daily nudge"
            sub="One quiet reminder for your plan step, at 9:00."
            right={
              <Toggle on={daily} onToggle={() => handleToggle('daily')} disabled={isPending} />
            }
          />
          <SettingsRow
            title="Weekly check-in"
            sub="A nudge to notice how the week has felt, on Sundays."
            right={
              <Toggle on={weekly} onToggle={() => handleToggle('weekly')} disabled={isPending} />
            }
          />
          <SettingsRow
            title="Encouragement notes"
            sub="Occasional warm words. Off by default."
            border={false}
            right={
              <Toggle
                on={encourage}
                onToggle={() => handleToggle('encourage')}
                disabled={isPending}
              />
            }
          />
        </SettingsCard>
        </div>

        {/* ── Your data ── */}
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <SectionLabel>Your data</SectionLabel>
        <button
          type="button"
          onClick={handleExport}
          disabled={isPending}
          className="w-full inline-flex items-center justify-center gap-[9px] bg-white border border-[#D9E0DA] text-[#2F5049] font-heading text-[14.5px] font-semibold py-[14px] rounded-[12px] hover:bg-[#F5FAF8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 mb-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F5049" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12M8 11l4 4 4-4" />
            <path d="M4 19h16" />
          </svg>
          Export my data
        </button>
        <div className="flex gap-3 mb-2">
          <form action={signOut} className="flex-1">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-[9px] bg-white border border-[#D9E0DA] text-[#2F6E7A] font-heading text-[14.5px] font-semibold py-[14px] rounded-[12px] hover:bg-tint transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F6E7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </form>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 inline-flex items-center justify-center gap-[9px] bg-white border border-[#F0D9D2] text-[#B0503F] font-heading text-[14.5px] font-semibold py-[14px] rounded-[12px] hover:bg-[#FBF3F1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B0503F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M6 7l1 13h10l1-13" />
            </svg>
            {confirmDelete ? 'Tap again to confirm' : 'Delete my account'}
          </button>
        </div>
        {confirmDelete && (
          <p className="text-[12.5px] text-[#B0503F] mb-5 mt-1">
            This permanently deletes your account and all your data.{' '}
            <button
              type="button"
              className="underline"
              onClick={() => setConfirmDelete(false)}
            >
              Cancel
            </button>
          </p>
        )}
        {deleteError && (
          <p className="text-[12.5px] text-[#B0503F] mb-5 mt-1">{deleteError}</p>
        )}
        </div>

        {/* ── Subscription ── */}
        <div className="animate-fade-up" style={{ animationDelay: '270ms' }}>
        <SectionLabel>Subscription</SectionLabel>
        <SettingsCard>
          <div className="flex items-center justify-between px-[22px] py-5">
            <div>
              <div className="flex items-center gap-[10px]">
                <span className="font-heading text-[16px] font-semibold text-[#3A403C]">
                  {planLabel}
                </span>
                {isTrialing && !subscription?.cancelAtPeriodEnd && (
                  <span className="text-[11.5px] font-semibold text-[#276358] bg-[#E3F1EE] px-[9px] py-[3px] rounded-full">
                    Trial
                  </span>
                )}
                {subscription?.cancelAtPeriodEnd && (
                  <span className="text-[11.5px] font-semibold text-[#8A6430] bg-[#F3EEE6] px-[9px] py-[3px] rounded-full">
                    Cancelling
                  </span>
                )}
              </div>
              <div className="text-[13px] text-[#6E7672] mt-1">{subDateText}</div>
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
      </div>
    </main>
  );
}
