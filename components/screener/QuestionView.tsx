'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { useScreener } from './ScreenerProvider';
import { SiteHeader } from '@/components/layout/SiteHeader';
import type { Question } from '@/lib/data/questions';

interface Props {
  question: Question;
  step: number;
}

export function QuestionView({ question, step }: Props) {
  const { answers, setAnswer } = useScreener();
  const router = useRouter();
  const selected = answers[step - 1];
  const progressPct = (step / 14) * 100;

  const handleSelect = (value: number) => {
    setAnswer(step, value);
  };

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
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader variant="screener" />

      <div className="relative overflow-hidden px-6 py-[52px] pb-[66px] sm:px-11">
        {/* Fading tile pattern at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none opacity-[0.1]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='60'%3E%3Cpath d='M22 0Q44 0 44 30 44 60 22 60 0 60 0 30 0 0 22 0Z' fill='none' stroke='%232F6E7A' stroke-width='1.5'/%3E%3C/svg%3E\")",
            backgroundSize: '44px 60px',
            WebkitMaskImage: 'linear-gradient(#000, transparent)',
            maskImage: 'linear-gradient(#000, transparent)',
          }}
        />

        <motion.div
          className="relative max-w-[640px] mx-auto"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.34, ease: [0.25, 0, 0.15, 1] }}
        >
          {/* Progress header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold tracking-[0.1em] uppercase text-primary">
              Question {step} of 14
            </span>
            <span className="text-[12px] text-text-3" aria-hidden>
              A few minutes, no rush
            </span>
          </div>

          {/* Progress bar */}
          <div
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={14}
            aria-label={`Question ${step} of 14`}
            className="h-[7px] w-full overflow-hidden rounded-full bg-[#E7E2DA] mb-[34px]"
          >
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out motion-reduce:transition-none"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Question */}
          <h1 className="font-heading text-[29px] leading-[1.22] font-semibold tracking-[-0.02em] mb-[26px] [text-wrap:pretty]">
            {question.text}
          </h1>

          {/* Options */}
          <div role="radiogroup" aria-label="Select your answer" className="flex flex-col gap-3">
            {question.options.map((option) => {
              const isSelected = selected === option.value;
              return (
                <button
                  key={option.value}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-center gap-3.5 w-full rounded-[13px] text-left text-[15.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isSelected
                      ? 'border-2 border-primary bg-tint px-[19px] py-4 font-semibold text-[#1F4B43]'
                      : 'border border-[1.5px] border-[#CBD7D2] bg-white px-5 py-[17px] text-[#262B29] hover:border-primary/40 hover:bg-tint/30'
                  }`}
                >
                  {/* Radio indicator */}
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full ${
                      isSelected
                        ? 'border-[6px] border-primary bg-white'
                        : 'border border-[1.5px] border-[#BBC7C2]'
                    }`}
                    aria-hidden="true"
                  />
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-[34px]">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-[9px] border border-[#D8DED9] bg-white px-[26px] py-3.5 text-[15px] font-semibold text-text-2 hover:text-foreground hover:border-[#B8C4BE] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={selected === null}
              aria-disabled={selected === null}
              className={`inline-flex items-center gap-2 rounded-[9px] px-10 py-3.5 text-[15px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selected !== null
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer'
                  : 'bg-[#D8DED9] text-[#9AA29C] cursor-not-allowed'
              }`}
            >
              {step === 14 ? 'See my result' : 'Next'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
