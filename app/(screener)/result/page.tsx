import type { Metadata } from 'next';
import { ResultView } from '@/components/screener/ResultView';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Your Result',
  description: 'Your personal health anxiety reflection, based on your answers. See your patterns and decide what to do next.',
};

export default async function ResultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return <ResultView isLoggedIn={!!user} />;
}
