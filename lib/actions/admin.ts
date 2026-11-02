'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { stripe } from '@/lib/stripe';

async function requireAdmin(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'Not authenticated.';
  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.id)
    .single();
  if (!adminUser) return 'Admin access required.';
  return null;
}

export async function adminLogin(data: {
  email: string;
  password: string;
}): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error || !authData.user) return { error: 'Invalid email or password.' };

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', authData.user.id)
    .single();

  if (!adminUser) {
    await supabase.auth.signOut();
    return { error: 'This account does not have admin access.' };
  }

  redirect('/admin/users');
}

export async function adminSignOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

export async function setExercisePublished(
  id: string,
  published: boolean,
): Promise<{ error?: string }> {
  const adminError = await requireAdmin();
  if (adminError) return { error: adminError };
  const service = createServiceClient();
  const { error } = await service
    .from('exercises')
    .update({ is_published: published })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/content');
  revalidatePath('/exercises');
  revalidatePath('/home');
  return {};
}

export async function deleteExercise(id: string): Promise<{ error?: string }> {
  const adminError = await requireAdmin();
  if (adminError) return { error: adminError };
  const service = createServiceClient();
  const { error } = await service.from('exercises').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/content');
  revalidatePath('/exercises');
  return {};
}

function sanitise(val: string | null | undefined): string | null {
  if (!val) return null;
  return val.replace(/—/g, ' - ').trim() || null;
}

const VALID_EXERCISE_TYPES = [
  'Psychoeducation', 'CBT', 'ERP', 'Behavioural',
  'Body awareness', 'ACT-adjacent', 'Reflection', 'Relapse prevention',
] as const;

const VALID_BANDS = ['mild', 'moderate'] as const;

export async function createExercise(data: {
  title: string;
  slug: string;
  week_number: number;
  day_number: number;
  sort_order: number;
  duration_minutes: number;
  description: string | null;
  content: string | null;
  writing_prompt: string | null;
  exercise_type: string | null;
  therapy_focus: string | null;
  minimum_band: string | null;
}): Promise<{
  exercise?: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    content: string | null;
    writing_prompt: string | null;
    duration_minutes: number;
    week_number: number;
    day_number: number;
    sort_order: number;
    is_published: boolean;
    exercise_type: string | null;
    therapy_focus: string | null;
    minimum_band: string | null;
  };
  error?: string;
}> {
  if (!data.title.trim()) return { error: 'Title is required.' };
  if (data.title.trim().length > 100) return { error: 'Title must be 100 characters or fewer.' };
  if (!data.slug.trim()) return { error: 'Slug is required.' };
  if (!/^[a-z0-9-]+$/.test(data.slug.trim())) {
    return { error: 'Slug must only contain lowercase letters, numbers, and hyphens.' };
  }
  if (data.week_number < 1 || data.day_number < 1 || data.sort_order < 1) {
    return { error: 'Week, day, and sort order must each be at least 1.' };
  }
  if (data.duration_minutes < 1 || data.duration_minutes > 120) {
    return { error: 'Duration must be between 1 and 120 minutes.' };
  }
  if ((data.description ?? '').length > 500) return { error: 'Description must be 500 characters or fewer.' };
  if ((data.content ?? '').length > 10000) return { error: 'Content must be 10,000 characters or fewer.' };
  if ((data.writing_prompt ?? '').length > 500) return { error: 'Writing prompt must be 500 characters or fewer.' };
  if (data.exercise_type && !VALID_EXERCISE_TYPES.includes(data.exercise_type as typeof VALID_EXERCISE_TYPES[number])) {
    return { error: 'Invalid exercise type.' };
  }
  if (data.minimum_band && !VALID_BANDS.includes(data.minimum_band as typeof VALID_BANDS[number])) {
    return { error: 'Invalid minimum band.' };
  }

  const adminError = await requireAdmin();
  if (adminError) return { error: adminError };

  const service = createServiceClient();
  const { data: created, error } = await service
    .from('exercises')
    .insert({
      title: sanitise(data.title.trim())!,
      slug: data.slug.trim(),
      week_number: data.week_number,
      day_number: data.day_number,
      sort_order: data.sort_order,
      duration_minutes: data.duration_minutes,
      description: sanitise(data.description),
      content: sanitise(data.content),
      writing_prompt: sanitise(data.writing_prompt),
      exercise_type: data.exercise_type || null,
      therapy_focus: sanitise(data.therapy_focus),
      minimum_band: data.minimum_band || null,
      is_published: false,
    })
    .select('id, slug, title, description, content, writing_prompt, duration_minutes, week_number, day_number, sort_order, is_published, exercise_type, therapy_focus, minimum_band')
    .single();

  if (error) {
    if (error.code === '23505') return { error: 'An exercise with this slug already exists.' };
    return { error: error.message };
  }

  revalidatePath('/admin/content');
  revalidatePath('/exercises');
  return { exercise: created as typeof created & { is_published: boolean; exercise_type: string | null; therapy_focus: string | null; minimum_band: string | null } };
}

export async function updateExercise(
  id: string,
  data: {
    title: string;
    description: string | null;
    content: string | null;
    writing_prompt: string | null;
    duration_minutes: number;
    exercise_type: string | null;
    therapy_focus: string | null;
    minimum_band: string | null;
  },
): Promise<{ error?: string }> {
  if (!data.title.trim()) return { error: 'Title is required.' };
  if (data.title.trim().length > 100) return { error: 'Title must be 100 characters or fewer.' };
  if (data.duration_minutes < 1 || data.duration_minutes > 120) {
    return { error: 'Duration must be between 1 and 120 minutes.' };
  }
  if ((data.description ?? '').length > 500) return { error: 'Description must be 500 characters or fewer.' };
  if ((data.content ?? '').length > 10000) return { error: 'Content must be 10,000 characters or fewer.' };
  if ((data.writing_prompt ?? '').length > 500) return { error: 'Writing prompt must be 500 characters or fewer.' };
  if (data.exercise_type && !VALID_EXERCISE_TYPES.includes(data.exercise_type as typeof VALID_EXERCISE_TYPES[number])) {
    return { error: 'Invalid exercise type.' };
  }
  if (data.minimum_band && !VALID_BANDS.includes(data.minimum_band as typeof VALID_BANDS[number])) {
    return { error: 'Invalid minimum band.' };
  }

  const adminError = await requireAdmin();
  if (adminError) return { error: adminError };

  const service = createServiceClient();
  const { error } = await service
    .from('exercises')
    .update({
      title: sanitise(data.title.trim())!,
      description: sanitise(data.description),
      content: sanitise(data.content),
      writing_prompt: sanitise(data.writing_prompt),
      duration_minutes: data.duration_minutes,
      exercise_type: data.exercise_type || null,
      therapy_focus: sanitise(data.therapy_focus),
      minimum_band: data.minimum_band || null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/content');
  revalidatePath('/exercises');
  revalidatePath('/home');
  return {};
}

/* ─── Bulk content actions ─── */

export async function bulkSetPublished(
  ids: string[],
  published: boolean,
): Promise<{ error?: string }> {
  const adminError = await requireAdmin();
  if (adminError) return { error: adminError };
  if (!ids.length) return {};
  const service = createServiceClient();
  const { error } = await service
    .from('exercises')
    .update({ is_published: published })
    .in('id', ids);
  if (error) return { error: error.message };
  revalidatePath('/admin/content');
  revalidatePath('/exercises');
  revalidatePath('/home');
  return {};
}

/* ─── User account actions ─── */

export async function extendTrial(
  userId: string,
  stripeSubscriptionId: string,
  trialEndIso: string,
): Promise<{ error?: string }> {
  const adminError = await requireAdmin();
  if (adminError) return { error: adminError };

  const end = new Date(trialEndIso);
  if (isNaN(end.getTime())) return { error: 'Invalid date.' };
  if (end <= new Date()) return { error: 'Trial end date must be in the future.' };

  try {
    await stripe.subscriptions.update(stripeSubscriptionId, {
      trial_end: Math.floor(end.getTime() / 1000),
    });

    const service = createServiceClient();
    await service
      .from('subscriptions')
      .update({ current_period_end: end.toISOString() })
      .eq('user_id', userId);

    revalidatePath(`/admin/users/${userId}`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to extend trial.' };
  }
}

export async function sendPasswordReset(email: string): Promise<{ error?: string }> {
  const adminError = await requireAdmin();
  if (adminError) return { error: adminError };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { error: error.message };
  return {};
}

export async function setSuspended(
  userId: string,
  suspend: boolean,
): Promise<{ error?: string }> {
  const adminError = await requireAdmin();
  if (adminError) return { error: adminError };

  const service = createServiceClient();
  const { error } = await service.auth.admin.updateUserById(userId, {
    ban_duration: suspend ? '87600h' : 'none',
  });

  if (error) return { error: error.message };
  revalidatePath(`/admin/users/${userId}`);
  return {};
}
