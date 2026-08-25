import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { InViewReveal } from '@/components/motion';

export const metadata: Metadata = { title: 'My plan' };

const WEEK_TITLES: Record<number, string> = {
  1: 'Understanding worry',
  2: 'Tools that help',
  3: 'Living with uncertainty',
  4: 'Facing your fears',
  5: 'Breaking the cycle',
  6: 'Building resilience',
};

const TOTAL_PROGRAMME_DAYS = 42;

/* ─── Icons ─── */
function CornerQuatrefoil() {
  return (
    <svg width="360" height="360" viewBox="0 0 400 400" aria-hidden="true" className="pointer-events-none">
      <g fill="#2F6E7A" fillOpacity=".05" stroke="#2F6E7A" strokeOpacity=".24" strokeWidth="1.4" strokeLinejoin="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <path key={deg} d="M200 200 Q167 128 200 58 Q233 128 200 200 Z" transform={deg === 0 ? undefined : `rotate(${deg} 200 200)`} />
        ))}
      </g>
    </svg>
  );
}

const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

const Lock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

type ExerciseState = 'done' | 'current' | 'upcoming';

interface Exercise {
  id: string;
  slug: string;
  title: string;
  week_number: number;
  day_number: number;
  duration_minutes: number;
  sort_order: number;
  state: ExerciseState;
}

export default async function ExercisesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/log-in');

  const [exercisesRes, progressRes] = await Promise.all([
    supabase
      .from('exercises')
      .select('id, slug, title, week_number, day_number, duration_minutes, sort_order')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('user_exercise_progress')
      .select('exercise_id')
      .eq('user_id', user.id),
  ]);

  const rawExercises = exercisesRes.data ?? [];
  const completedIds = new Set((progressRes.data ?? []).map((p) => p.exercise_id as string));

  // Determine the first incomplete exercise (the "current" one)
  const firstIncompleteIndex = rawExercises.findIndex((e) => !completedIds.has(e.id));

  const exercises: Exercise[] = rawExercises.map((e, i) => ({
    ...e,
    state:
      completedIds.has(e.id)
        ? 'done'
        : i === firstIncompleteIndex
        ? 'current'
        : 'upcoming',
  }));

  const currentExercise = firstIncompleteIndex >= 0 ? exercises[firstIncompleteIndex] : null;

  // Group by week
  const weekNumbers = [...new Set(exercises.map((e) => e.week_number))].sort((a, b) => a - b);
  const maxWeekInDb = weekNumbers[weekNumbers.length - 1] ?? 1;
  const currentWeekNumber = currentExercise?.week_number ?? maxWeekInDb;

  // Progress
  const completedCount = completedIds.size;
  const currentSortOrder = currentExercise?.sort_order ?? (rawExercises[rawExercises.length - 1]?.sort_order ?? 1);
  const progressPct = Math.min(100, Math.round((currentSortOrder / TOTAL_PROGRAMME_DAYS) * 100));
  const dayLabel = currentExercise
    ? `Day ${currentSortOrder} of ${TOTAL_PROGRAMME_DAYS}`
    : `${completedCount} of ${rawExercises.length} complete`;

  // Next locked week — computed from actual DB data, not hardcoded
  const lastExercise = rawExercises[rawExercises.length - 1];
  const nextWeekNum = maxWeekInDb + 1;
  const nextWeekTitle = WEEK_TITLES[nextWeekNum];
  const unlockDay = (lastExercise?.sort_order ?? 0) + 1;

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-9 pb-12 lg:px-10">
      {/* Corner quatrefoil — bottom right */}
      <div
        className="absolute pointer-events-none"
        style={{ bottom: -150, right: -120, transform: 'rotate(14deg)', opacity: 0.4 }}
        aria-hidden="true"
      >
        <CornerQuatrefoil />
      </div>

      <div className="relative">
        {/* ── Header ── */}
        <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
          Shaped from your check-in
        </span>
        <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29] mt-2 mb-[18px]">
          A gentle plan for anxiety
        </h1>

        {/* ── Overall progress bar ── */}
        <div className="flex items-center gap-[14px] mb-[34px]">
          <div className="flex-1 h-[8px] rounded-full bg-[#EAE4DB] max-w-[340px]">
            <div
              className="h-full rounded-full bg-[#2F6E7A] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[13px] font-semibold text-[#5F6863]">
            {dayLabel} · {progressPct}%
          </span>
        </div>

        {/* ── Weeks ── */}
        {weekNumbers.map((weekNum) => {
          const weekExercises = exercises.filter((e) => e.week_number === weekNum);
          const weekTitle = WEEK_TITLES[weekNum] ?? `Week ${weekNum}`;

          return (
            <InViewReveal key={weekNum} y={12} duration={0.55}>
              <div className="flex items-center gap-3 mb-[18px]">
                <span className="font-heading text-[13px] font-semibold tracking-[0.08em] uppercase text-[#2F5049]">
                  Week {weekNum} · {weekTitle}
                </span>
                <div className="flex-1 h-px bg-[#EAE4DB]" />
              </div>

              {/* Timeline */}
              <div className="relative pl-[52px] mb-9">
                <div
                  className="absolute bg-[#EAE4DB]"
                  style={{ left: 19, top: 14, bottom: 14, width: 2 }}
                  aria-hidden="true"
                />

                {weekExercises.map((exercise, i) => (
                  <div
                    key={exercise.id}
                    className={`relative flex ${i < weekExercises.length - 1 ? 'mb-[14px]' : ''}`}
                  >
                    {/* Node */}
                    {exercise.state === 'done' && (
                      <span
                        className="absolute flex w-[38px] h-[38px] rounded-full bg-[#2F6E7A] items-center justify-center"
                        style={{ left: -52 }}
                        aria-label="Completed"
                      >
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                    )}
                    {exercise.state === 'current' && (
                      <span
                        className="absolute flex w-[38px] h-[38px] rounded-full bg-white items-center justify-center"
                        style={{ left: -52, border: '3px solid #2F6E7A' }}
                        aria-label="Today's step"
                      >
                        <span className="w-[11px] h-[11px] rounded-full bg-[#2F6E7A]" aria-hidden="true" />
                      </span>
                    )}
                    {exercise.state === 'upcoming' && (
                      <span
                        className="absolute flex w-[38px] h-[38px] rounded-full bg-white items-center justify-center"
                        style={{ left: -52, border: '2px solid #E4DED4' }}
                        aria-hidden="true"
                      >
                        <span className="w-[8px] h-[8px] rounded-full bg-[#D3CCC0]" aria-hidden="true" />
                      </span>
                    )}

                    {/* Card */}
                    {exercise.state === 'done' && (
                      <div className="flex-1 bg-white border border-[#EBE6DE] rounded-[14px] px-[20px] py-[15px] flex items-center justify-between opacity-[.72]">
                        <div>
                          <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#9AA29C]">
                            Day {exercise.day_number}
                          </div>
                          <div className="text-[15.5px] font-semibold text-[#3A403C] mt-0.5">
                            {exercise.title}
                          </div>
                        </div>
                        <span className="text-[12.5px] font-semibold text-[#2F6E7A]">Done</span>
                      </div>
                    )}

                    {exercise.state === 'current' && (
                      <div
                        className="flex-1 bg-white border-[1.5px] border-[#2F6E7A] rounded-[14px] px-[22px] py-[18px] flex items-center justify-between"
                        style={{ boxShadow: '0 16px 34px -26px rgba(47,122,109,.7)' }}
                      >
                        <div>
                          <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#2F6E7A]">
                            Day {exercise.day_number} · Today
                          </div>
                          <div className="font-heading text-[17px] font-semibold text-[#2F5049] mt-[3px]">
                            {exercise.title}
                          </div>
                          <div className="text-[12.5px] text-[#6E7672] mt-[3px]">
                            {exercise.duration_minutes} min · reading + writing
                          </div>
                        </div>
                        <Link
                          href={`/plan/${exercise.slug}`}
                          className="inline-flex items-center gap-2 bg-[#2F6E7A] text-white font-heading text-[14px] font-semibold px-[20px] py-[11px] rounded-[10px] hover:bg-[#275E69] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ml-4 flex-shrink-0"
                        >
                          Continue
                          <ArrowRight />
                        </Link>
                      </div>
                    )}

                    {exercise.state === 'upcoming' && (
                      <div className="flex-1 bg-[#FCFBF9] border border-[#EBE6DE] rounded-[14px] px-[20px] py-[15px] flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-semibold tracking-[0.06em] uppercase text-[#B3B7B0]">
                            Day {exercise.day_number}
                          </div>
                          <div className="text-[15.5px] font-semibold text-[#6C736E] mt-0.5">
                            {exercise.title}
                          </div>
                        </div>
                        <span className="text-[12.5px] text-[#A6A79F]">
                          {exercise.duration_minutes} min
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </InViewReveal>
          );
        })}

        {/* ── Next week locked — shown whenever there are exercises in DB ── */}
        {rawExercises.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-heading text-[13px] font-semibold tracking-[0.08em] uppercase text-[#A6A79F]">
                Week {nextWeekNum}{nextWeekTitle ? ` · ${nextWeekTitle}` : ''}
              </span>
              <div className="flex-1 h-px bg-[#EAE4DB]" />
              <span className="inline-flex items-center gap-[6px] text-[11.5px] font-semibold text-[#A6A79F]">
                <Lock />
                Unlocks Day {unlockDay}
              </span>
            </div>
            <div className="bg-[#FBF9F5] border border-dashed border-[#E0DACF] rounded-[14px] px-[22px] py-[18px] text-[13.5px] leading-[1.55] text-[#6E7672] [text-wrap:pretty]">
              More exercises are on their way. These open once the current week feels settled — no
              need to rush ahead.
            </div>
          </>
        )}

        {/* ── All done state ── */}
        {!currentExercise && rawExercises.length > 0 && (
          <div className="mt-6 bg-[#E3F1EE] border border-[#BFD9D3] rounded-[14px] px-[22px] py-[18px]">
            <div className="font-heading text-[16px] font-semibold text-[#276358] mb-1">
              Week {maxWeekInDb} complete
            </div>
            <p className="text-[13.5px] leading-[1.55] text-[#3F6B60]">
              You&rsquo;ve finished all the exercises in Week {maxWeekInDb}. Week {nextWeekNum} content is on its
              way — come back soon.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
