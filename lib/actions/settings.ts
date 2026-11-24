'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { stripe } from '@/lib/stripe';

function friendlyAuthError(err: { message: string }): string {
  const msg = err.message.toLowerCase();
  if (msg.includes('already') && (msg.includes('registered') || msg.includes('in use'))) {
    return 'That email address is already in use.';
  }
  if (msg.includes('same') && msg.includes('password')) {
    return 'That is the same as your current password. Please choose a different one.';
  }
  if (msg.includes('weak') || (msg.includes('password') && msg.includes('should be at least'))) {
    return 'Please choose a stronger password.';
  }
  if (msg.includes('rate') || msg.includes('security purposes') || msg.includes('too many')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (msg.includes('not confirmed') || msg.includes('email not confirmed')) {
    return 'Please confirm your email address before making changes.';
  }
  return 'Something went wrong. Please try again.';
}

interface NotificationPrefs {
  daily: boolean;
  weekly: boolean;
  encourage: boolean;
}

export async function changeEmail(newEmail: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const trimmed = newEmail.trim().toLowerCase();
  if (!trimmed || !trimmed.includes('@')) return { error: 'Please enter a valid email address.' };
  if (trimmed === user.email?.toLowerCase()) return { error: 'That is already your current email.' };

  const { error } = await supabase.auth.updateUser({ email: trimmed });
  if (error) return { error: friendlyAuthError(error) };
  return {};
}

export async function changePassword(newPassword: string, confirm: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  if (newPassword.length < 8) return { error: 'Password must be at least 8 characters.' };
  if (newPassword !== confirm) return { error: 'Passwords do not match.' };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: friendlyAuthError(error) };
  return {};
}

export async function saveNotificationPrefs(prefs: NotificationPrefs): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const service = createServiceClient();
  const { error } = await service
    .from('profiles')
    .upsert({ id: user.id, notification_prefs: prefs }, { onConflict: 'id' });

  if (error) return { error: "We couldn't save your preferences. Please try again." };
  return {};
}

export async function exportUserData(): Promise<
  | {
      email: string | undefined;
      exportedAt: string;
      screenerResults: unknown[];
      exerciseProgress: unknown[];
      journalEntries: unknown[];
      calmSessions: unknown[];
    }
  | { error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const [screenerRes, progressRes, journalRes, calmRes] = await Promise.all([
    supabase
      .from('screener_results')
      .select('score, band, answers, created_at')
      .eq('user_id', user.id),
    supabase
      .from('user_exercise_progress')
      .select('exercise_id, completed_at, response')
      .eq('user_id', user.id),
    supabase.from('journal_entries').select('content, created_at').eq('user_id', user.id),
    supabase
      .from('calm_sessions')
      .select('tool, created_at')
      .eq('user_id', user.id),
  ]);

  return {
    email: user.email,
    exportedAt: new Date().toISOString(),
    screenerResults: screenerRes.data ?? [],
    exerciseProgress: progressRes.data ?? [],
    journalEntries: journalRes.data ?? [],
    calmSessions: calmRes.data ?? [],
  };
}

export async function updateDisplayName(firstName: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const trimmed = firstName.trim();
  if (!trimmed || trimmed.length > 50) return { error: 'Name must be between 1 and 50 characters.' };

  const service = createServiceClient();
  const { error } = await service
    .from('profiles')
    .upsert({ id: user.id, first_name: trimmed }, { onConflict: 'id' });

  if (error) return { error: "We couldn't update your name. Please try again." };
  revalidatePath('/settings');
  return {};
}

export async function deleteAccount(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Cancel any live Stripe subscription before wiping the user — prevents
  // orphaned subscriptions that keep billing a deleted account.
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id, status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (
    sub?.stripe_subscription_id &&
    ['active', 'trialing', 'past_due'].includes(sub.status ?? '')
  ) {
    try {
      await stripe.subscriptions.cancel(sub.stripe_subscription_id);
    } catch {
      // Non-fatal — if Stripe call fails we still delete the user.
      // Stripe will surface the orphaned subscription in the dashboard.
    }
  }

  const service = createServiceClient();
  const { error } = await service.auth.admin.deleteUser(user.id);
  if (error) return { error: "We couldn't delete your account. Please contact support if this continues." };

  redirect('/');
}
