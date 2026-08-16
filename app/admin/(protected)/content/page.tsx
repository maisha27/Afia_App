import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { ContentClient, type AdminExercise } from './ContentClient';

export const metadata: Metadata = { title: 'Content — Admin · Afia' };

export default async function AdminContentPage() {
  const [supabase, service] = [await createClient(), createServiceClient()];
  const { data: { user: adminUser } } = await supabase.auth.getUser();

  const { data } = await service
    .from('exercises')
    .select('id, title, description, content, writing_prompt, duration_minutes, week_number, day_number, sort_order, is_published')
    .order('sort_order', { ascending: true });

  const exercises = (data ?? []) as AdminExercise[];

  return (
    <div className="flex min-h-screen" style={{ background: '#F5F6F5' }}>
      <AdminSidebar active="content" adminEmail={adminUser?.email} />
      <ContentClient exercises={exercises} />
    </div>
  );
}
