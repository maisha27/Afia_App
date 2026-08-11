import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function ReaderLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/log-in');
  return <div className="min-h-screen bg-[#FAF8F5]">{children}</div>;
}
