import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS entirely.
 * Server-only. Never import this in a Client Component.
 * Only used by the Stripe webhook handler to write subscription rows.
 */
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
