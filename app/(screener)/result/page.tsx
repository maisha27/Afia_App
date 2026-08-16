import type { Metadata } from 'next';
import { ResultView } from '@/components/screener/ResultView';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Your Result' };

export default async function ResultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <ResultView isLoggedIn={!!user} />;
}
