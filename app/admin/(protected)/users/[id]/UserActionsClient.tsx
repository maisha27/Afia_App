'use client';

import { useState, useTransition } from 'react';
import { extendTrial, sendPasswordReset, setSuspended } from '@/lib/actions/admin';

interface Props {
  userId: string;
  email: string;
  stripeSubscriptionId: string | null;
  isSuspended: boolean;
  isTrial: boolean;
}

type ActivePanel = null | 'extend-trial' | 'reset-password' | 'suspend';

const BTN_BASE =
  'inline-flex items-center gap-[6px] text-[13px] font-semibold px-[13px] py-[8px] rounded-[9px] transition-colors disabled:opacity-50';

export function UserActionsClient({
  userId,
  email,
  stripeSubscriptionId,
  isSuspended,
  isTrial,
}: Props) {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [trialDate, setTrialDate]     = useState('');
  const [isPending, startTransition]  = useTransition();
  const [result, setResult]           = useState<{ panel: ActivePanel; ok: boolean; message: string } | null>(null);

  function open(panel: ActivePanel) {
    setActivePanel(panel);
    setResult(null);
    setTrialDate('');
  }

  function close() {
    setActivePanel(null);
    setResult(null);
  }

  function finish(panel: ActivePanel, ok: boolean, message: string) {
    setActivePanel(null);
    setResult({ panel, ok, message });
  }

  const handleExtendTrial = () => {
    if (!stripeSubscriptionId || !trialDate) return;
    startTransition(async () => {
      const res = await extendTrial(userId, stripeSubscriptionId, trialDate);
      if (res.error) finish('extend-trial', false, res.error);
      else finish('extend-trial', true, 'Trial extended successfully.');
    });
  };

  const handleResetPassword = () => {
    startTransition(async () => {
      const res = await sendPasswordReset(email);
      if (res.error) finish('reset-password', false, res.error);
      else finish('reset-password', true, `Password reset email sent to ${email}.`);
    });
  };

  const handleSuspend = (suspend: boolean) => {
    startTransition(async () => {
      const res = await setSuspended(userId, suspend);
      if (res.error) finish('suspend', false, res.error);
      else finish('suspend', true, suspend ? 'Account suspended.' : 'Account reinstated.');
    });
  };

  const canExtendTrial = isTrial && !!stripeSubscriptionId;

  // Minimum date for the date input — tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().slice(0, 10);

  return (
    <div className="rounded-[14px] px-[22px] py-[18px]" style={{ background: '#fff', border: '1px solid #E4E6E2' }}>
      <h2 className="text-[11px] font-semibold tracking-[0.06em] uppercase mb-[14px]" style={{ color: '#9AA29C' }}>
        Actions
      </h2>

      {/* Result banner */}
      {result && (
        <div
          className="rounded-[9px] px-[13px] py-[10px] text-[13px] mb-[14px]"
          style={
            result.ok
              ? { background: '#E3F1EE', color: '#276358', border: '1px solid #CBE6DE' }
              : { background: '#F5EBE8', color: '#9A3B2A', border: '1px solid #E8D8D2' }
          }
        >
          {result.message}
        </div>
      )}

      {/* Action buttons row */}
      <div className="flex items-center gap-[10px] flex-wrap mb-[14px]">

        {/* Extend trial */}
        <button
          type="button"
          onClick={() => open('extend-trial')}
          disabled={!canExtendTrial || isPending || activePanel === 'extend-trial'}
          title={!canExtendTrial ? (isTrial ? 'No Stripe subscription ID on record' : 'Only available for trial accounts') : undefined}
          className={`${BTN_BASE}`}
          style={
            canExtendTrial && activePanel !== 'extend-trial'
              ? { background: '#F0F7F5', color: '#276358', border: '1px solid #CBE6DE' }
              : { background: '#F5F6F5', color: '#A8ADA6', border: '1px solid #E4E6E2' }
          }
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          Extend trial
        </button>

        {/* Reset password */}
        <button
          type="button"
          onClick={() => open('reset-password')}
          disabled={isPending || activePanel === 'reset-password'}
          className={`${BTN_BASE}`}
          style={
            activePanel !== 'reset-password'
              ? { background: '#F5F6F5', color: '#3A403C', border: '1px solid #E4E6E2' }
              : { background: '#EFEDEA', color: '#3A403C', border: '1px solid #E1DED8' }
          }
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Reset password
        </button>

        {/* Suspend / Unsuspend */}
        <button
          type="button"
          onClick={() => open('suspend')}
          disabled={isPending || activePanel === 'suspend'}
          className={`${BTN_BASE}`}
          style={
            isSuspended
              ? { background: '#FBF1E1', color: '#8A6410', border: '1px solid #EFE0C2' }
              : { background: '#F5F6F5', color: '#3A403C', border: '1px solid #E4E6E2' }
          }
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {isSuspended
              ? <><circle cx="12" cy="12" r="10" /><path d="M8 12l3 3 5-5" /></>
              : <><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></>
            }
          </svg>
          {isSuspended ? 'Unsuspend account' : 'Suspend account'}
        </button>
      </div>

      {/* Expanded panels */}

      {activePanel === 'extend-trial' && (
        <div className="rounded-[10px] px-[16px] py-[14px]" style={{ background: '#F8FAF9', border: '1px solid #DDE5E2' }}>
          <p className="text-[13px] mb-[12px]" style={{ color: '#4A514C' }}>
            Set a new trial end date. This updates the Stripe subscription immediately.
          </p>
          <div className="flex items-center gap-[10px] flex-wrap">
            <input
              type="date"
              value={trialDate}
              min={minDateStr}
              onChange={(e) => setTrialDate(e.target.value)}
              className="rounded-[9px] px-[12px] py-[8px] text-[13.5px] outline-none transition-colors"
              style={{ background: '#fff', border: '1.5px solid #D1D8D4', color: '#2E3330' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#4A786E')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#D1D8D4')}
            />
            <button
              type="button"
              onClick={handleExtendTrial}
              disabled={isPending || !trialDate}
              className={`${BTN_BASE}`}
              style={
                trialDate && !isPending
                  ? { background: '#2F7A6D', color: '#EAF3EF' }
                  : { background: '#EDF0EE', color: '#5F6863' }
              }
            >
              {isPending ? 'Saving…' : 'Confirm'}
            </button>
            <button
              type="button"
              onClick={close}
              disabled={isPending}
              className="text-[13px] hover:opacity-70 transition-opacity"
              style={{ color: '#5F6863' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activePanel === 'reset-password' && (
        <div className="rounded-[10px] px-[16px] py-[14px]" style={{ background: '#F8FAF9', border: '1px solid #DDE5E2' }}>
          <p className="text-[13px] mb-[12px]" style={{ color: '#4A514C' }}>
            Send a password reset email to <strong>{email}</strong>. The link expires in 24 hours.
          </p>
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={isPending}
              className={`${BTN_BASE}`}
              style={{ background: '#2F7A6D', color: '#EAF3EF' }}
            >
              {isPending ? 'Sending…' : 'Yes, send reset email'}
            </button>
            <button
              type="button"
              onClick={close}
              disabled={isPending}
              className="text-[13px] hover:opacity-70 transition-opacity"
              style={{ color: '#5F6863' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {activePanel === 'suspend' && (
        <div className="rounded-[10px] px-[16px] py-[14px]" style={{ background: '#FDF5F4', border: '1px solid #EDD5D0' }}>
          {isSuspended ? (
            <>
              <p className="text-[13px] mb-[12px]" style={{ color: '#4A514C' }}>
                This account is currently suspended. Reinstating will allow the user to log in again immediately.
              </p>
              <div className="flex items-center gap-[10px]">
                <button
                  type="button"
                  onClick={() => handleSuspend(false)}
                  disabled={isPending}
                  className={`${BTN_BASE}`}
                  style={{ background: '#2F7A6D', color: '#EAF3EF' }}
                >
                  {isPending ? 'Reinstating…' : 'Yes, reinstate account'}
                </button>
                <button
                  type="button"
                  onClick={close}
                  disabled={isPending}
                  className="text-[13px] hover:opacity-70 transition-opacity"
                  style={{ color: '#5F6863' }}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-[13px] mb-[12px]" style={{ color: '#4A514C' }}>
                Suspending this account will immediately block{' '}
                <strong>{email}</strong> from logging in. Their data is not deleted.
              </p>
              <div className="flex items-center gap-[10px]">
                <button
                  type="button"
                  onClick={() => handleSuspend(true)}
                  disabled={isPending}
                  className={`${BTN_BASE}`}
                  style={{ background: '#B0503F', color: '#fff' }}
                >
                  {isPending ? 'Suspending…' : 'Yes, suspend account'}
                </button>
                <button
                  type="button"
                  onClick={close}
                  disabled={isPending}
                  className="text-[13px] hover:opacity-70 transition-opacity"
                  style={{ color: '#5F6863' }}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
