import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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

  // TODO: Phase D — subscription check
  // const { data: sub } = await supabase
  //   .from('subscriptions')
  //   .select('status')
  //   .eq('user_id', user.id)
  //   .single()
  // if (!sub || !['active', 'trialing'].includes(sub.status)) {
  //   redirect('/pricing')
  // }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar userEmail={user.email} />
      <div className="flex flex-1 flex-col min-w-0 pb-16 lg:pb-0">
        {children}
      </div>
      <AppBottomNav />
    </div>
  );
}
