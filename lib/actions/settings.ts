'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

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
  if (error) return { error: error.message };
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
  if (error) return { error: error.message };
  return {};
}

export async function saveNotificationPrefs(prefs: NotificationPrefs): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, notification_prefs: prefs }, { onConflict: 'id' });

  if (error) return { error: error.message };
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

export async function deleteAccount(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const service = createServiceClient();
  const { error } = await service.auth.admin.deleteUser(user.id);
  if (error) return { error: error.message };

  redirect('/');
}
