import { type NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { sendEncouragement } from '@/lib/email';
import { captureMessage } from '@/lib/monitoring';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const service = createServiceClient();

  const [profilesRes, usersRes] = await Promise.all([
    service.from('profiles').select('id, first_name, notification_prefs').not('notification_prefs', 'is', null),
    service.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  if (profilesRes.error) return NextResponse.json({ error: profilesRes.error.message }, { status: 500 });

  const targets = (profilesRes.data ?? []).filter(
    (p) => (p.notification_prefs as Record<string, boolean> | null)?.encourage === true,
  );
  if (targets.length === 0) return NextResponse.json({ sent: 0 });

  const emailMap = new Map(usersRes.data.users.map((u) => [u.id, u.email ?? '']));

  let sent = 0;
  let failed = 0;
  for (const profile of targets) {
    const email = emailMap.get(profile.id);
    if (!email) continue;
    try {
      await sendEncouragement(email, profile.first_name ?? '');
      sent++;
    } catch (err) {
      failed++;
      console.error('[cron:encourage] send failed:', { userId: profile.id, error: err });
    }
  }

  if (failed > 0 && failed >= Math.ceil(targets.length * 0.1)) {
    captureMessage(`[cron:encourage] high failure rate: ${failed}/${targets.length} emails failed`, 'error');
  }

  return NextResponse.json({ sent, failed });
}
