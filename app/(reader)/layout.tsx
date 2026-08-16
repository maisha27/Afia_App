import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ReaderLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/log-in');

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!sub || !['active', 'trialing'].includes(sub.status)) {
    redirect('/plan');
  }

  return <div className="min-h-screen bg-[#FAF8F5]">{children}</div>;
}
