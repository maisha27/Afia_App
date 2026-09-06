import { createClient } from '@/lib/supabase/server';
import BreatheClient from './BreatheClient';

export default async function BreatheSessionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <BreatheClient isLoggedIn={!!user} />;
}
