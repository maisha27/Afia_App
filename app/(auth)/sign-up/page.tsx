import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SignUpForm } from './SignUpForm';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your Afia account to save your reflection and start your personalised self-help plan.',
};

const VALID_BANDS = ['Low', 'Mild', 'Moderate', 'High', 'Very High'] as const;
type Band = (typeof VALID_BANDS)[number];

function ScreenerGate() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      <SiteHeader variant="screener" />
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="text-center max-w-[400px]">
          <h1 className="font-heading text-[28px] font-semibold tracking-[-0.025em] text-[#262B29] mb-3">
            Take the check-in first
          </h1>
          <p className="text-[15px] text-[#565D5A] leading-[1.65] mb-7">
            Your account is personalised around your results. Take the free 2-minute check-in and
            we&rsquo;ll save your reflection when you create your space.
          </p>
          <Link
            href="/screener"
            className="inline-block font-heading text-[16px] font-semibold bg-primary text-white rounded-[12px] px-7 py-[14px] hover:bg-primary/90 transition-colors shadow-[0_10px_24px_-10px_rgba(47,110,122,0.6)]"
          >
            Start the free check-in
          </Link>
          <p className="mt-5 text-[13.5px] text-[#6E7672]">
            Already have an account?{' '}
            <Link
              href="/log-in"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ band?: string; score?: string }>;
}) {
  const params = await searchParams;
  const rawBand = params.band ?? '';
  const rawScore = params.score ? parseInt(params.score, 10) : NaN;

  const band: Band | null = VALID_BANDS.includes(rawBand as Band) ? (rawBand as Band) : null;
  const score: number | null = !Number.isNaN(rawScore) && rawScore >= 0 && rawScore <= 42 ? rawScore : null;

  if (band === null || score === null) {
    return <ScreenerGate />;
  }

  return <SignUpForm band={band} score={score} />;
}
