'use server';

import { createClient } from '@/lib/supabase/server';

export async function saveExerciseProgress(
  exerciseId: string,
  response: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase.from('user_exercise_progress').upsert(
    {
      user_id: user.id,
      exercise_id: exerciseId,
      completed_date: today,
      completed_at: new Date().toISOString(),
      response: response.trim() || null,
    },
    { onConflict: 'user_id,exercise_id,completed_date' },
  );

  if (error) return { error: error.message };
  return {};
}
