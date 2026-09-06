import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as 'signup' | 'recovery' | 'email_change' | null;
  const next = searchParams.get('next') ?? '/plan';

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  let userId: string | null = null;
  let authError = false;

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) userId = data.user.id;
    if (error) authError = true;
  } else if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error && data.user) userId = data.user.id;
    if (error) authError = true;
  } else {
    authError = true;
  }

  if (authError || !userId) {
    return NextResponse.redirect(new URL('/log-in?error=link-expired', origin));
  }

  // Save any pending screener result (set during sign-up when email confirmation was required)
  const VALID_BANDS = ['Low', 'Mild', 'Moderate', 'High', 'Very High'];
  const pending = cookieStore.get('afia_pending_result');
  if (pending) {
    try {
      const parsed = JSON.parse(pending.value) as { score: unknown; band: unknown; answers?: unknown };
      const hasValidResult =
        Number.isInteger(parsed.score) &&
        (parsed.score as number) >= 0 &&
        (parsed.score as number) <= 42 &&
        VALID_BANDS.includes(parsed.band as string);

      if (hasValidResult) {
        const answers =
          Array.isArray(parsed.answers) &&
          parsed.answers.length === 14 &&
          parsed.answers.every((a) => Number.isInteger(a) && a >= 0 && a <= 3)
            ? (parsed.answers as number[])
            : null;
        await supabase.from('screener_results').insert({
          user_id: userId,
          score: parsed.score as number,
          band: parsed.band as string,
          answers,
        });
      }
    } catch {
      // Non-fatal — screener result can be added later
    } finally {
      cookieStore.delete('afia_pending_result');
    }
  }

  return NextResponse.redirect(new URL(next, origin));
}
