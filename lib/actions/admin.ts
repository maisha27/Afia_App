'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

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
  const service = createServiceClient();
  const { error } = await service.from('exercises').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/content');
  revalidatePath('/exercises');
  return {};
}

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
}): Promise<{
  exercise?: {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    writing_prompt: string | null;
    duration_minutes: number;
    week_number: number;
    day_number: number;
    sort_order: number;
    is_published: boolean;
  };
  error?: string;
}> {
  if (!data.title.trim()) return { error: 'Title is required.' };
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

  const service = createServiceClient();
  const { data: created, error } = await service
    .from('exercises')
    .insert({
      title: data.title.trim(),
      slug: data.slug.trim(),
      week_number: data.week_number,
      day_number: data.day_number,
      sort_order: data.sort_order,
      duration_minutes: data.duration_minutes,
      description: data.description?.trim() || null,
      content: data.content?.trim() || null,
      writing_prompt: data.writing_prompt?.trim() || null,
      is_published: false,
    })
    .select('id, title, description, content, writing_prompt, duration_minutes, week_number, day_number, sort_order, is_published')
    .single();

  if (error) {
    if (error.code === '23505') return { error: 'An exercise with this slug already exists.' };
    return { error: error.message };
  }

  revalidatePath('/admin/content');
  revalidatePath('/exercises');
  return { exercise: created as typeof created & { is_published: boolean } };
}

export async function updateExercise(
  id: string,
  data: {
    title: string;
    description: string | null;
    content: string | null;
    writing_prompt: string | null;
    duration_minutes: number;
  },
): Promise<{ error?: string }> {
  if (!data.title.trim()) return { error: 'Title is required.' };
  if (data.duration_minutes < 1 || data.duration_minutes > 120) {
    return { error: 'Duration must be between 1 and 120 minutes.' };
  }

  const service = createServiceClient();
  const { error } = await service
    .from('exercises')
    .update({
      title: data.title.trim(),
      description: data.description?.trim() || null,
      content: data.content?.trim() || null,
      writing_prompt: data.writing_prompt?.trim() || null,
      duration_minutes: data.duration_minutes,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/content');
  revalidatePath('/exercises');
  revalidatePath('/home');
  return {};
}
