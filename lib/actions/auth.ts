'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import type { Band } from '@/lib/scoring';

export type AuthActionResult =
  | { error: string }
  | { success: 'check-email' }
  | undefined;

const VALID_BANDS: Band[] = ['Low', 'Mild', 'Moderate', 'High', 'Very High'];

export async function signUp(data: {
  email: string;
  password: string;
  firstName: string;
}): Promise<AuthActionResult> {
  const supabase = await createClient();
  const cookieStore = await cookies();

  // Read screener result from httpOnly cookie (set by setPendingScreenerResult before routing to /sign-up)
  const pendingRaw = cookieStore.get('afia_pending_result')?.value ?? null;
  const pending = pendingRaw
    ? (JSON.parse(pendingRaw) as { score: number; band: string; answers: number[] | null })
    : null;

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) return { error: error.message };
  if (!authData.user) return { error: 'Something went wrong. Please try again.' };

  // Save first name — service client bypasses RLS so this works before email confirmation too
  const trimmedName = data.firstName.trim();
  if (trimmedName) {
    const service = createServiceClient();
    await service
      .from('profiles')
      .upsert({ id: authData.user.id, first_name: trimmedName }, { onConflict: 'id' });
  }

  const hasValidResult =
    pending !== null &&
    Number.isInteger(pending.score) &&
    pending.score >= 0 &&
    pending.score <= 42 &&
    VALID_BANDS.includes(pending.band as Band);

  const hasValidAnswers =
    Array.isArray(pending?.answers) &&
    pending.answers!.length === 14 &&
    pending.answers!.every((a) => Number.isInteger(a) && a >= 0 && a <= 3);

  if (authData.session) {
    // Email confirmation disabled — save screener result now while session is live
    if (hasValidResult) {
      await supabase.from('screener_results').insert({
        user_id: authData.user.id,
        score: pending!.score,
        band: pending!.band,
        answers: hasValidAnswers ? pending!.answers : null,
      });
    }
    cookieStore.delete('afia_pending_result');
    redirect('/plan');
  }

  // Email confirmation required — cookie stays; auth/callback reads and clears it
  return { success: 'check-email' };
}

export async function setPendingScreenerResult(data: {
  score: number;
  band: string;
  answers: number[];
}): Promise<void> {
  const hasValidResult =
    Number.isInteger(data.score) &&
    data.score >= 0 &&
    data.score <= 42 &&
    VALID_BANDS.includes(data.band as Band);
  if (!hasValidResult) return;

  const hasValidAnswers =
    Array.isArray(data.answers) &&
    data.answers.length === 14 &&
    data.answers.every((a) => Number.isInteger(a) && a >= 0 && a <= 3);

  const cookieStore = await cookies();
  cookieStore.set(
    'afia_pending_result',
    JSON.stringify({
      score: data.score,
      band: data.band,
      answers: hasValidAnswers ? data.answers : null,
    }),
    { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60, path: '/' },
  );
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/log-in');
}

export async function logIn(data: {
  email: string;
  password: string;
}): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error || !authData.user) {
    return { error: 'Invalid email or password. Please try again.' };
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', authData.user.id)
    .maybeSingle();

  if (sub && (sub.status === 'active' || sub.status === 'trialing')) {
    redirect('/home');
  }

  redirect('/plan');
}

export async function forgotPassword(data: {
  email: string;
}): Promise<AuthActionResult> {
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  // We don't reveal whether the email is registered — Supabase does this automatically.
  await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  return { success: 'check-email' };
}

export async function resetPassword(data: {
  password: string;
}): Promise<AuthActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: data.password });

  if (error) return { error: error.message };

  redirect('/log-in?reset=1');
}

export async function saveScreenerResult(data: {
  score: number;
  band: string;
  answers: number[];
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  if (
    !Array.isArray(data.answers) ||
    data.answers.length !== 14 ||
    !data.answers.every((a) => Number.isInteger(a) && a >= 0 && a <= 3)
  ) {
    return { error: 'Invalid answers' };
  }

  const { error } = await supabase.from('screener_results').insert({
    user_id: user.id,
    score: data.score,
    band: data.band,
    answers: data.answers,
  });

  if (error) return { error: error.message };
  revalidatePath('/progress');
  return {};
}
