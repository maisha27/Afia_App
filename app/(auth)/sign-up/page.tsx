import type { Metadata } from 'next';
import { SignUpForm } from './SignUpForm';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your Afia account to save your reflection and start your personalised self-help plan.',
};

const VALID_BANDS = ['Low', 'Mild', 'Moderate', 'High', 'Very High'] as const;
type Band = (typeof VALID_BANDS)[number];

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

  return <SignUpForm band={band} score={score} />;
}
