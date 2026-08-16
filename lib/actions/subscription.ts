'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { stripe } from '@/lib/stripe';

export async function cancelSubscription(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!sub?.stripe_subscription_id) return { error: 'No active subscription found' };

  try {
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    // Optimistically mark local row — webhook confirms async
    const service = createServiceClient();
    await service
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('stripe_subscription_id', sub.stripe_subscription_id);

    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to cancel subscription' };
  }
}

export async function switchPlan(billing: 'monthly' | 'yearly'): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id, plan')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!sub?.stripe_subscription_id) return { error: 'No active subscription found' };
  if (sub.plan === billing) return {};

  const newPriceId =
    billing === 'yearly'
      ? process.env.STRIPE_PRICE_YEARLY!
      : process.env.STRIPE_PRICE_MONTHLY!;

  try {
    const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
    const itemId = stripeSub.items.data[0]?.id;
    if (!itemId) return { error: 'Could not retrieve subscription item' };

    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      items: [{ id: itemId, price: newPriceId }],
      proration_behavior: 'create_prorations',
    });

    // Optimistically update plan in local DB
    const service = createServiceClient();
    await service
      .from('subscriptions')
      .update({ plan: billing })
      .eq('stripe_subscription_id', sub.stripe_subscription_id);

    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to switch plan' };
  }
}

export async function redirectToCustomerPortal(): Promise<never> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/log-in');

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) redirect('/subscription');

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${siteUrl}/subscription`,
  });

  redirect(session.url);
}
