'use server';

import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

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

  // Service client bypasses RLS for the upsert — the UPDATE path of an upsert
  // requires a separate UPDATE RLS policy which is not present on this table.
  // User identity is already verified above.
  const service = createServiceClient();
  const { error } = await service.from('user_exercise_progress').upsert(
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
