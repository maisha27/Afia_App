import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// /calm/breathe is linked from the public crisis-support page and must remain
// accessible without login so users in distress are never blocked.
const PUBLIC_CALM_PATHS = ['/calm/breathe'];

export default async function ReaderLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';

  if (PUBLIC_CALM_PATHS.some((p) => pathname.startsWith(p))) {
    return <div className="min-h-screen bg-[#FAF8F5]">{children}</div>;
  }

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
