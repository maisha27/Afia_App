import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppBottomNav } from "@/components/layout/AppBottomNav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/log-in");
  }

  const service = createServiceClient();
  const [{ data: sub }, { data: profile }] = await Promise.all([
    supabase.from('subscriptions').select('status').eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('first_name').eq('id', user.id).maybeSingle(),
    service.from('profiles').upsert(
      { id: user.id, last_active_at: new Date().toISOString() },
      { onConflict: 'id' },
    ),
  ]);

  if (!sub || !['active', 'trialing'].includes(sub.status)) {
    redirect('/plan');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      <AppSidebar userEmail={user.email} firstName={profile?.first_name ?? null} />
      <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col min-w-0 pb-16 lg:pb-0 focus:outline-none">
        {children}
      </div>
      <AppBottomNav />
    </div>
  );
}
