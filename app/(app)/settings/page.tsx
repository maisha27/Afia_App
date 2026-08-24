import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/log-in');

  const [profileRes, subRes] = await Promise.all([
    supabase.from('profiles').select('notification_prefs, first_name').eq('id', user.id).maybeSingle(),
    supabase
      .from('subscriptions')
      .select('plan, status, current_period_end, cancel_at_period_end')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  const rawPrefs = profileRes.data?.notification_prefs as Record<string, boolean> | null;
  const notificationPrefs = {
    daily: rawPrefs?.daily ?? true,
    weekly: rawPrefs?.weekly ?? true,
    encourage: rawPrefs?.encourage ?? false,
  };

  const sub = subRes.data;
  const subscription = sub
    ? {
        plan: sub.plan as 'monthly' | 'yearly' | null,
        status: sub.status as string,
        currentPeriodEnd: sub.current_period_end as string | null,
        cancelAtPeriodEnd: (sub.cancel_at_period_end as boolean) ?? false,
      }
    : null;

  return (
    <SettingsClient
      email={user.email ?? ''}
      firstName={profileRes.data?.first_name ?? null}
      initialPrefs={notificationPrefs}
      subscription={subscription}
    />
  );
}
