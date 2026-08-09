'use client';

import { useRouter } from 'next/navigation';
import { useScreener } from './ScreenerProvider';
import type { Question } from '@/lib/data/questions';
import { cn } from '@/lib/utils';

interface Props {
  question: Question;
  step: number;
}

export function QuestionView({ question, step }: Props) {
  const { answers, setAnswer } = useScreener();
  const router = useRouter();
  const selected = answers[step - 1];
  const progress = Math.round((step / 14) * 100);

  const handleNext = () => {
    if (selected === null) return;
    if (step === 14) {
      router.push('/result');
    } else {
      router.push(`/screener/${step + 1}`);
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.push('/screener');
    } else {
      router.push(`/screener/${step - 1}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col px-4 pt-8 pb-6 sm:px-6">
      <div className="mx-auto w-full max-w-lg flex-1 flex flex-col">

        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Question {step} of 14
            </span>
            <span className="text-sm text-muted-foreground" aria-hidden>
              {progress}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={14}
            aria-label={`Question ${step} of 14`}
            className="h-1.5 w-full overflow-hidden rounded-full bg-border"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out motion-reduce:transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h1 className="font-heading text-xl font-semibold leading-snug text-foreground sm:text-2xl mb-6">
          {question.text}
        </h1>

        {/* Options */}
        <div
          role="radiogroup"
          aria-label="Select your answer"
          className="flex flex-col gap-3 flex-1"
        >
          {question.options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <button
                key={option.value}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setAnswer(step, option.value)}
                className={cn(
                  'w-full min-h-[56px] rounded-lg border px-4 py-3.5 text-left text-sm leading-snug transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isSelected
                    ? 'border-primary bg-tint text-foreground font-medium ring-1 ring-primary'
                    : 'border-border bg-surface text-foreground hover:border-mid hover:bg-tint/40',
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            onClick={handleBack}
            className="min-h-[44px] rounded-md px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={selected === null}
            aria-disabled={selected === null}
            className={cn(
              'min-h-[44px] rounded-md px-8 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected !== null
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'cursor-not-allowed bg-border text-muted-foreground',
            )}
          >
            {step === 14 ? 'See my result' : 'Next'}
          </button>
        </div>
      </div>
    </main>
  );
}
