'use server';

import { createClient } from '@/lib/supabase/server';

export async function recordCalmSession(tool: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { error } = await supabase.from('calm_sessions').insert({
    user_id: user.id,
    tool,
  });

  if (error) return { error: error.message };
  return {};
}
