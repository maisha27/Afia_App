'use server';

import { createClient } from '@/lib/supabase/server';

const VALID_TOOLS = [
  'breathe',
  'ocean-breath',
  'grounding',
  'body-scan',
  'loving-kindness',
  'safe-place',
] as const;
type CalmTool = (typeof VALID_TOOLS)[number];

export async function recordCalmSession(tool: string): Promise<{ error?: string }> {
  if (!VALID_TOOLS.includes(tool as CalmTool)) return { error: 'Invalid tool.' };

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
