import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/service';

function planFromPriceId(priceId: string): 'monthly' | 'yearly' | null {
  if (priceId === process.env.STRIPE_PRICE_MONTHLY) return 'monthly';
  if (priceId === process.env.STRIPE_PRICE_YEARLY) return 'yearly';
  return null;
}

// In API version 2026-07-29.dahlia, current_period_end lives on SubscriptionItem, not Subscription
function getPeriodEnd(sub: Stripe.Subscription): string | null {
  const ts = sub.items.data[0]?.current_period_end;
  return ts ? new Date(ts * 1000).toISOString() : null;
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook verification failed: ${message}` }, { status: 400 });
  }

  const db = createServiceClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      if (!userId || !session.subscription || !session.customer) break;

      const sub = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = sub.items.data[0]?.price.id ?? '';

      await db.from('subscriptions').upsert(
        {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: sub.id,
          status: sub.status,
          plan: planFromPriceId(priceId),
          current_period_end: getPeriodEnd(sub),
        },
        { onConflict: 'user_id' }
      );
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const priceId = sub.items.data[0]?.price.id ?? '';

      await db.from('subscriptions').update({
        status: sub.status,
        plan: planFromPriceId(priceId),
        current_period_end: getPeriodEnd(sub),
      }).eq('stripe_subscription_id', sub.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await db.from('subscriptions').update({
        status: 'canceled',
        current_period_end: getPeriodEnd(sub),
      }).eq('stripe_subscription_id', sub.id);
      break;
    }

    case 'invoice.payment_failed': {
      // In 2026-07-29.dahlia, Invoice.subscription is now Invoice.parent.subscription_details.subscription
      const invoice = event.data.object as Stripe.Invoice;
      const subRef = invoice.parent?.subscription_details?.subscription;
      if (!subRef) break;
      const subscriptionId = typeof subRef === 'string' ? subRef : subRef.id;

      await db.from('subscriptions').update({
        status: 'past_due',
      }).eq('stripe_subscription_id', subscriptionId);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
