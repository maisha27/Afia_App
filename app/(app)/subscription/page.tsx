import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import SubscriptionClient from './SubscriptionClient';
import type { CardInfo, InvoiceItem } from './SubscriptionClient';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function SubscriptionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/log-in');

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan, status, current_period_end, cancel_at_period_end, stripe_subscription_id, stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!sub) redirect('/plan');

  const periodEnd = sub.current_period_end
    ? formatDate(sub.current_period_end as string)
    : 'Unknown';

  let card: CardInfo | null = null;
  let invoices: InvoiceItem[] = [];

  if (sub.stripe_customer_id) {
    try {
      const [pmsResult, invoicesResult] = await Promise.all([
        stripe.paymentMethods.list({
          customer: sub.stripe_customer_id as string,
          type: 'card',
          limit: 1,
        }),
        stripe.invoices.list({
          customer: sub.stripe_customer_id as string,
          limit: 10,
        }),
      ]);

      const pm = pmsResult.data[0];
      if (pm?.type === 'card' && pm.card) {
        card = {
          brand: pm.card.brand,
          last4: pm.card.last4,
          expMonth: pm.card.exp_month,
          expYear: pm.card.exp_year,
        };
      }

      invoices = invoicesResult.data.map((inv) => ({
        id: inv.id,
        date: new Date(inv.created * 1000).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        description:
          inv.lines.data[0]?.description ??
          (inv.amount_paid === 0 ? 'Free trial started' : 'Subscription payment'),
        amountPaid: inv.amount_paid,
        currency: inv.currency,
        pdfUrl: inv.invoice_pdf ?? null,
      }));
    } catch {
      // Stripe API unavailable — show page without payment details
    }
  }

  return (
    <SubscriptionClient
      plan={(sub.plan as 'monthly' | 'yearly') ?? 'yearly'}
      status={sub.status as string}
      currentPeriodEnd={periodEnd}
      initialCancelAtPeriodEnd={(sub.cancel_at_period_end as boolean) ?? false}
      card={card}
      invoices={invoices}
    />
  );
}
