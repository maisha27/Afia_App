import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

const TRIAL_DAYS = 7;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json() as { billing?: unknown };
  const { billing } = body;

  if (billing !== 'monthly' && billing !== 'yearly') {
    return NextResponse.json({ error: 'Invalid billing parameter' }, { status: 400 });
  }

  const priceId = billing === 'yearly'
    ? process.env.STRIPE_PRICE_YEARLY!
    : process.env.STRIPE_PRICE_MONTHLY!;

  // Re-use existing Stripe customer if one was created in a previous session
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  let customerId = existing?.stripe_customer_id ?? undefined;
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  try {
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        metadata: { user_id: user.id },
      },
      metadata: { user_id: user.id },
      success_url: `${origin}/welcome`,
      cancel_url: `${origin}/plan`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('[checkout] Stripe API error:', err);
    return NextResponse.json({ error: 'Payment gateway unavailable. Please try again.' }, { status: 503 });
  }
}
