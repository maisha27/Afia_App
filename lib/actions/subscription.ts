'use server';

import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { stripe } from '@/lib/stripe';

function friendlyStripeError(err: unknown): string {
  if (err instanceof Stripe.errors.StripeInvalidRequestError) {
    if (err.code === 'resource_missing') {
      return "We couldn't find your subscription record. This can happen if your account was set up during testing. Please contact us and we'll sort it out.";
    }
    return 'There was a problem with your request. Please try again or contact support.';
  }
  if (err instanceof Stripe.errors.StripeRateLimitError) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (
    err instanceof Stripe.errors.StripeConnectionError ||
    err instanceof Stripe.errors.StripeAPIError
  ) {
    return 'Our payment provider is temporarily unavailable. Please try again in a few minutes.';
  }
  if (err instanceof Stripe.errors.StripeAuthenticationError) {
    return "There's a configuration issue on our end. Please contact support.";
  }
  return 'Something went wrong. Please try again or contact support.';
}

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
    return { error: friendlyStripeError(err) };
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
    .select('stripe_subscription_id, plan, status')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!sub?.stripe_subscription_id) return { error: 'No active subscription found' };
  if (sub.plan === billing) return {};
  if (sub.status === 'canceled') {
    return { error: 'Your subscription has ended. Please start a new one to change your plan.' };
  }

  const newPriceId =
    billing === 'yearly'
      ? process.env.STRIPE_PRICE_YEARLY!
      : process.env.STRIPE_PRICE_MONTHLY!;

  try {
    const stripeSub = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);
    if (stripeSub.status === 'canceled') {
      return { error: 'Your subscription has ended. Please start a new one to change your plan.' };
    }
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
    return { error: friendlyStripeError(err) };
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.afia.me';

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${siteUrl}/subscription`,
    });
    redirect(session.url);
  } catch (err) {
    // Re-throw Next.js redirect signals; catch actual Stripe/network failures
    if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err;
    redirect('/subscription?error=portal-unavailable');
  }
}
