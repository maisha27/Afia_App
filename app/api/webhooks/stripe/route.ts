// Stripe webhook handler — Phase D implements the full logic.
// Handles: checkout.session.completed, customer.subscription.updated,
//          customer.subscription.deleted, invoice.payment_failed
// Uses createServiceClient() to write to subscriptions (bypasses RLS).
export async function POST(_request: Request) {
  return new Response("Stripe webhook handler not yet implemented.", {
    status: 501,
  });
}
