'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function saveJournalEntry(
  content: string,
): Promise<{ error?: string; id?: string }> {
  const trimmed = content.trim();
  if (!trimmed) return { error: 'Entry cannot be empty.' };
  if (trimmed.length > 10000) return { error: 'Entry is too long (max 10,000 characters).' };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({ user_id: user.id, content: trimmed })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/journal');
  return { id: data.id as string };
}

export async function deleteJournalEntry(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };

  // RLS ensures users can only delete their own entries
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/journal');
  return {};
}
