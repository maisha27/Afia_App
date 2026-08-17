'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { saveExerciseProgress } from '@/lib/actions/exercises';

export interface PlanExercise {
  id: string;
  slug: string;
  title: string;
  content: string;
  writingPrompt: string;
  weekNumber: number;
  dayNumber: number;
  durationMinutes: number;
}

export interface PlanReaderClientProps {
  exercise: PlanExercise;
  nextSlug: string | null;
  initialResponse: string;
}

const WEEK_THEMES: Record<number, string> = {
  1: 'Understanding worry',
  2: 'Tools that help',
  3: 'Living with uncertainty',
};

function MiniQuatrefoil() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="absolute top-0 left-1/2 -translate-x-1/2"
    >
      <g
        fill="#2F6E7A"
        fillOpacity=".16"
        stroke="#2F6E7A"
        strokeOpacity=".55"
        strokeWidth="10"
        strokeLinejoin="round"
      >
        {[0, 90, 180, 270].map((deg) => (
          <path
            key={deg}
            d="M200 200 Q167 128 200 58 Q233 128 200 200 Z"
            transform={deg === 0 ? undefined : `rotate(${deg} 200 200)`}
          />
        ))}
      </g>
    </svg>
  );
}

export default function PlanReaderClient({
  exercise,
  nextSlug,
  initialResponse,
}: PlanReaderClientProps) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [response, setResponse] = useState(initialResponse);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaveError('');
    startTransition(async () => {
      const result = await saveExerciseProgress(exercise.id, response);
      if (result?.error) {
        setSaveError(result.error);
        return;
      }
      setSaved(true);
      setTimeout(() => {
        router.push(nextSlug ? `/plan/${nextSlug}` : '/exercises');
      }, 480);
    });
  }

  // Split content into paragraphs on double newlines
  const paragraphs = exercise.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  // 4 header segments: fill dayNumber of them (capped at 4)
  const filled = Math.min(exercise.dayNumber, 4);
  const segments = Array.from({ length: 4 }, (_, i) => i < filled);

  const weekTheme = WEEK_THEMES[exercise.weekNumber] ?? `Week ${exercise.weekNumber}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* ── Top bar ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#EFEAE2]">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Back */}
          <Link
            href="/exercises"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[#5F6863] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="M11 18l-6-6 6-6" />
            </svg>
            Your plan
          </Link>

          {/* Centre title */}
          <div className="text-center leading-[1.2] hidden sm:block">
            <div className="text-[10.5px] font-semibold tracking-[0.09em] uppercase text-[#9AA29C]">
              Week {exercise.weekNumber} · Day {exercise.dayNumber}
            </div>
            <div className="font-heading text-[15px] font-semibold text-[#2F5049] mt-[2px]">
              {exercise.title}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/crisis-support"
              className="text-[13.5px] font-medium text-[#B0503F] hover:underline hidden sm:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Crisis support
            </Link>
            <Link
              href="/exercises"
              className="flex w-[32px] h-[32px] rounded-[9px] bg-[#F3EEE6] items-center justify-center text-[#767D79] hover:bg-[#EAE5DB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close and return to plan"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Sub-progress — day position within week (4 segments) */}
        <div className="flex gap-[6px] px-8 pt-[14px] pb-0">
          {segments.map((isFilled, i) => (
            <span
              key={i}
              className={`flex-1 h-[4px] rounded-full ${isFilled ? 'bg-[#2F6E7A]' : 'bg-[#E4DED4]'}`}
            />
          ))}
        </div>
      </header>

      {/* ── Reading area ── */}
      <main className="flex-1">
        <div className="max-w-[600px] mx-auto px-6 pt-[44px] pb-[40px] sm:px-8">
          <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
            {weekTheme}
          </span>
          <h1 className="font-heading text-[32px] leading-[1.18] font-semibold tracking-[-0.025em] mt-3 mb-[22px] [text-wrap:pretty]">
            {exercise.title}
          </h1>

          {paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-[17px] leading-[1.68] text-[#3F463F] mb-[18px] [text-wrap:pretty]"
            >
              {para}
            </p>
          ))}

          {/* ── Writing exercise ── */}
          <div className="mt-[30px]">
            <div className="flex items-center gap-[10px] mb-[10px]">
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B26A44"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 4C11 5 6 10 5 19l3-3c6-1 10-5 12-12Z" />
                <path d="M8.5 15.5c2.6-2.6 4.6-4.8 6.5-8" />
              </svg>
              <h2 className="font-heading text-[18px] font-semibold text-[#3A403C]">
                Your turn — about 2 minutes
              </h2>
            </div>
            <p className="text-[15.5px] leading-[1.6] text-[#565D5A] mb-4 [text-wrap:pretty]">
              {exercise.writingPrompt}
            </p>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write your thoughts here…"
              rows={5}
              className="w-full bg-white border border-[#E0DACF] rounded-[14px] px-[20px] py-[18px] text-[16px] leading-[1.6] text-foreground placeholder:text-[#B3B7B0] placeholder:italic resize-none focus:outline-none focus:border-[#2F6E7A] focus:ring-2 focus:ring-[#2F6E7A]/20 transition-colors"
              style={{ boxShadow: 'inset 0 1px 3px rgba(20,24,22,.03)', minHeight: 118 }}
            />
            {saveError && (
              <p className="text-[13px] text-[#B0503F] mt-2">{saveError}</p>
            )}
          </div>

          {/* ── Closing quote ── */}
          <div className="relative text-center mt-[40px] pt-[36px]">
            <MiniQuatrefoil />
            <p className="font-heading text-[22px] leading-[1.45] font-medium italic tracking-[-0.012em] text-[#2F5049] max-w-[440px] mx-auto mb-4 [text-wrap:pretty]">
              You don&rsquo;t have to quiet the worry to name it. Naming is already the brave part.
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="w-[26px] h-px bg-[#CBBFA9]" aria-hidden="true" />
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#A08A63]">
                Afia
              </span>
              <span className="w-[26px] h-px bg-[#CBBFA9]" aria-hidden="true" />
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="sticky bottom-0 bg-white border-t border-[#EFEAE2]">
        <div className="flex items-center justify-between px-8 py-[18px]">
          <Link
            href="/exercises"
            className="inline-flex items-center gap-2 font-heading text-[15px] font-semibold text-[#5F6863] px-[18px] py-[12px] rounded-[11px] hover:bg-[#F5F3EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5" />
              <path d="M11 18l-6-6 6-6" />
            </svg>
            Back
          </Link>
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={isPending || saved}
            whileTap={reduced || isPending || saved ? {} : { scale: 0.97 }}
            transition={{ duration: 0.1 }}
            className="inline-flex items-center gap-[9px] text-white font-heading text-[15.5px] font-semibold px-[26px] py-[14px] rounded-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed overflow-hidden"
            style={{
              background: saved ? '#3B9B72' : 'var(--color-primary)',
              boxShadow: saved
                ? '0 12px 24px -10px rgba(59,155,114,.55)'
                : '0 12px 24px -10px rgba(47,122,109,.6)',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {saved ? (
                <motion.span
                  key="done"
                  className="flex items-center gap-[9px]"
                  initial={{ opacity: 0, scale: reduced ? 1 : 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.25, 0, 0.15, 1] }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Done!
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  className="flex items-center gap-[9px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isPending ? 'Saving…' : nextSlug ? 'Save & continue' : 'Mark as done'}
                  {!isPending && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </footer>
    </div>
  );
}
