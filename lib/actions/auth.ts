'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Band } from '@/lib/scoring';

export type AuthActionResult =
  | { error: string }
  | { success: 'check-email' }
  | undefined;

const VALID_BANDS: Band[] = ['Low', 'Mild', 'Moderate', 'High', 'Very High'];

export async function signUp(data: {
  email: string;
  password: string;
  score: number | null;
  band: string | null;
}): Promise<AuthActionResult> {
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (error) return { error: error.message };
  if (!authData.user) return { error: 'Something went wrong. Please try again.' };

  const hasValidResult =
    data.score !== null &&
    data.band !== null &&
    Number.isInteger(data.score) &&
    data.score >= 0 &&
    data.score <= 42 &&
    VALID_BANDS.includes(data.band as Band);

  if (authData.session) {
    // Email confirmation disabled — save screener result now while session is live
    if (hasValidResult) {
      await supabase.from('screener_results').insert({
        user_id: authData.user.id,
        score: data.score,
        band: data.band,
      });
    }
    redirect('/pricing');
  }

  // Email confirmation required — stash result in a short-lived cookie
  if (hasValidResult) {
    const cookieStore = await cookies();
    cookieStore.set(
      'afia_pending_result',
      JSON.stringify({ score: data.score, band: data.band }),
      { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60, path: '/' },
    );
  }

  return { success: 'check-email' };
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
    .single();

  if (sub && (sub.status === 'active' || sub.status === 'trialing')) {
    redirect('/home');
  }

  redirect('/pricing');
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
