import { notFound } from 'next/navigation';
import { questions } from '@/lib/data/questions';
import { QuestionView } from '@/components/screener/QuestionView';

export function generateStaticParams() {
  return Array.from({ length: 14 }, (_, i) => ({ step: String(i + 1) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: stepStr } = await params;
  const step = parseInt(stepStr, 10);
  if (isNaN(step) || step < 1 || step > 14) return {};
  return { title: `Question ${step} of 14` };
}

export default async function ScreenerQuestionPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: stepStr } = await params;
  const step = parseInt(stepStr, 10);

  if (isNaN(step) || step < 1 || step > 14) notFound();

  const question = questions[step - 1];

  return <QuestionView question={question} step={step} />;
}
