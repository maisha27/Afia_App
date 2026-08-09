import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Auth guard for all (app) routes.
// Phase D: also check subscriptions.status here and redirect to /pricing if not active/trialing.
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

  return <>{children}</>;
}
