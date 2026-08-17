import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { PlanRing } from '@/components/home/PlanRing';

export const metadata: Metadata = { title: 'Home — Afia' };

/* ─── Helpers ─── */
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDisplayName(email: string | undefined): string {
  if (!email) return 'there';
  const local = email.split('@')[0].split('.')[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function getDateLabel(): string {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-GB', { weekday: 'long' });
  const day = now.getDate();
  const month = now.toLocaleDateString('en-GB', { month: 'long' });
  return `${weekday} · ${day} ${month}`;
}

/* ─── Streak helpers ─── */
function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function calculateStreak(activeDates: Set<string>): number {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const cursor = new Date(today);
  if (!activeDates.has(toDateStr(cursor))) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (!activeDates.has(toDateStr(cursor))) return 0;
  }

  let streak = 0;
  while (activeDates.has(toDateStr(cursor))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

/* ─── Daily rotating quotes ─── */
const DAILY_NOTES = [
  "Going gently is still going forward. There's no pace you're supposed to keep.",
  "Worry is loudest when it stays vague. Naming it, even badly, is already working.",
  "You don't have to feel calm to be coping. Sometimes doing the next small thing is enough.",
  "One difficult week doesn't undo what you've already built. Progress doesn't disappear.",
  "Reassurance feels like relief, but noticing the urge is the real skill. You're practising it.",
  "Anxiety lies about urgency. Most things can wait the length of one slow breath.",
  "You came back today. That's the whole thing — that's what this is built on.",
  "It's okay if this feels hard. Hard and hopeless are not the same thing.",
  "The goal isn't to stop worrying entirely. It's to let worry take up less of your day.",
  "Every time you sit with uncertainty instead of checking, you're rewiring something real.",
  "Being aware of your patterns is not the same as being stuck in them.",
  "Small and consistent beats large and occasional, every time.",
  "Your nervous system is doing what it thinks is helpful. You can gently teach it otherwise.",
  "Rest is not falling behind. Rest is part of the plan.",
] as const;

function getDailyNote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return DAILY_NOTES[dayOfYear % DAILY_NOTES.length];
}

/* ─── Constants ─── */
const TOTAL_PROGRAMME_DAYS = 21;

/* ─── Decorative quatrefoil ─── */
function Quatrefoil({ size, opacity }: { size: number; opacity: number }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 400 400"
      aria-hidden="true"
      className="pointer-events-none"
    >
      <g
        fill="#2F6E7A"
        fillOpacity=".05"
        stroke="#2F6E7A"
        strokeOpacity={opacity}
        strokeWidth="1.4"
        strokeLinejoin="round"
      >
        {petals.map((deg) => (
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

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = getDisplayName(user?.email);
  const greeting = getGreeting();
  const dateLabel = getDateLabel();

  const [exercisesRes, progressRes, journalRes, calmRes] = await Promise.all([
    supabase
      .from('exercises')
      .select('id, slug, title, description, sort_order, duration_minutes')
      .eq('is_published', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('user_exercise_progress')
      .select('exercise_id, completed_date')
      .eq('user_id', user!.id),
    supabase
      .from('journal_entries')
      .select('id, created_at')
      .eq('user_id', user!.id),
    supabase
      .from('calm_sessions')
      .select('created_at')
      .eq('user_id', user!.id),
  ]);

  const allExercises = exercisesRes.data ?? [];
  const completedIds = new Set((progressRes.data ?? []).map((p) => p.exercise_id as string));
  const firstIncomplete = allExercises.find((e) => !completedIds.has(e.id));
  const currentExercise = firstIncomplete ?? null;

  const currentSortOrder = currentExercise?.sort_order ?? allExercises.length;
  const progressPct = Math.min(100, Math.round((currentSortOrder / TOTAL_PROGRAMME_DAYS) * 100));

  const journalEntries = journalRes.data ?? [];
  const journalCount = journalEntries.length;

  const activeDates = new Set<string>();
  for (const row of progressRes.data ?? []) {
    if (row.completed_date) activeDates.add(row.completed_date as string);
  }
  for (const row of journalEntries) {
    activeDates.add((row.created_at as string).slice(0, 10));
  }
  for (const row of calmRes.data ?? []) {
    activeDates.add((row.created_at as string).slice(0, 10));
  }

  const streak = calculateStreak(activeDates);

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-9 pb-11 lg:px-10">
      {/* Corner quatrefoil — top right, no entrance animation (decorative) */}
      <div
        className="absolute pointer-events-none"
        style={{ top: -150, right: -130, transform: 'rotate(14deg)', opacity: 0.45 }}
        aria-hidden="true"
      >
        <Quatrefoil size={380} opacity={0.26} />
      </div>

      <div className="relative">

        {/* ── Greeting row ── stagger-0 */}
        <div
          className="flex items-end justify-between mb-7 flex-wrap gap-3 animate-fade-up"
          style={{ animationDelay: '0ms' }}
        >
          <div>
            <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
              {dateLabel}
            </span>
            <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29] mt-2">
              {greeting}, {name}.
            </h1>
          </div>

          {/* Streak pill — scale-in, slightly delayed so it pops in after greeting */}
          {streak > 0 && (
            <div
              className="flex items-center gap-2.5 bg-white border border-[#E7E2DA] rounded-full px-[15px] py-2 text-[13.5px] font-semibold text-[#3A403C] shadow-sm animate-scale-in"
              style={{ animationDelay: '120ms' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#E0A93F" aria-hidden="true">
                <path d="M12 2c.4 3.6 2.4 5.6 6 6-3.6.4-5.6 2.4-6 6-.4-3.6-2.4-5.6-6-6 3.6-.4 5.6-2.4 6-6Z" />
              </svg>
              {streak === 1 ? '1-day streak' : `${streak}-day streak`}
            </div>
          )}
        </div>

        {/* ── Plan hero card ── stagger-1 */}
        <div
          className="bg-[#2F5049] rounded-[20px] px-8 py-[30px] mb-[22px] relative overflow-hidden flex items-center gap-[30px] animate-fade-up"
          style={{ animationDelay: '80ms' }}
        >
          <div className="flex-1 min-w-0">
            <span className="text-[11.5px] font-semibold tracking-[0.09em] uppercase text-[#9FC9BC]">
              Your plan · Day {currentSortOrder} of {TOTAL_PROGRAMME_DAYS}
            </span>
            {currentExercise ? (
              <>
                <h2 className="font-heading text-[24px] font-semibold tracking-[-0.02em] text-white mt-2.5 mb-2">
                  {currentExercise.title}
                </h2>
                <p className="text-[14.5px] leading-[1.55] text-[#D4E4DE] mb-5 max-w-[400px] [text-wrap:pretty]">
                  {currentExercise.description ??
                    `A ${currentExercise.duration_minutes}-minute reading and writing exercise.`}
                </p>
                <Link
                  href={`/plan/${currentExercise.slug}`}
                  className="inline-flex items-center gap-2.5 bg-white text-[#2F5049] font-heading text-[15px] font-semibold px-6 py-[13px] rounded-[11px] hover:bg-[#EAF3EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Continue
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
                </Link>
              </>
            ) : (
              <>
                <h2 className="font-heading text-[24px] font-semibold tracking-[-0.02em] text-white mt-2.5 mb-2">
                  Week 1 complete
                </h2>
                <p className="text-[14.5px] leading-[1.55] text-[#D4E4DE] mb-5 max-w-[400px] [text-wrap:pretty]">
                  You&rsquo;ve finished all four exercises in Week 1. Week 2 is coming soon.
                </p>
                <Link
                  href="/exercises"
                  className="inline-flex items-center gap-2.5 bg-white text-[#2F5049] font-heading text-[15px] font-semibold px-6 py-[13px] rounded-[11px] hover:bg-[#EAF3EF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  View plan
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
                </Link>
              </>
            )}
          </div>

          {/* Animated progress ring — client component */}
          <PlanRing progressPct={progressPct} />
        </div>

        {/* ── Support tiles ── stagger-2, each tile cascades */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-[22px]">

          {/* Calm tools */}
          <Link
            href="/calm-tool"
            className="bg-white border border-[#E7E2DA] rounded-[16px] p-5 block hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring animate-fade-up"
            style={{ animationDelay: '160ms' }}
          >
            <span className="flex w-[38px] h-[38px] rounded-[11px] bg-[#E3F1EE] items-center justify-center mb-[14px]">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#2F6E7A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="2.3" />
                <path d="M7.4 12a4.6 4.6 0 0 1 9.2 0" />
                <path d="M3.5 12a8.5 8.5 0 0 1 17 0" />
              </svg>
            </span>
            <div className="font-heading text-[16px] font-semibold text-[#3A403C] mb-1">
              Calm tools
            </div>
            <div className="text-[13px] leading-[1.5] text-[#767D79]">
              Breathe or ground when worry spikes.
            </div>
          </Link>

          {/* Weekly check-in */}
          <Link
            href="/screener"
            className="bg-white border border-[#E7E2DA] rounded-[16px] p-5 block hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring animate-fade-up"
            style={{ animationDelay: '210ms' }}
          >
            <span className="flex w-[38px] h-[38px] rounded-[11px] bg-[#F3EEE6] items-center justify-center mb-[14px]">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#B26A44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="16" rx="3" />
                <path d="M8 3v4M16 3v4M3.5 10h17" />
                <path d="M12 13.4c-1-1.2-3-.7-3 .9 0 1.3 1.8 2.4 3 3.2 1.2-.8 3-1.9 3-3.2 0-1.6-2-2.1-3-.9Z" />
              </svg>
            </span>
            <div className="font-heading text-[16px] font-semibold text-[#3A403C] mb-1">
              Weekly check-in
            </div>
            <div className="text-[13px] leading-[1.5] text-[#767D79]">
              Due Friday · see what&rsquo;s shifting.
            </div>
          </Link>

          {/* Journal */}
          <Link
            href="/journal"
            className="bg-white border border-[#E7E2DA] rounded-[16px] p-5 block hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring animate-fade-up"
            style={{ animationDelay: '260ms' }}
          >
            <span className="flex w-[38px] h-[38px] rounded-[11px] bg-[#EDEBF3] items-center justify-center mb-[14px]">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#6A5FA0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 4C11 5 6 10 5 19l3-3c6-1 10-5 12-12Z" />
                <path d="M8.5 15.5c2.6-2.6 4.6-4.8 6.5-8" />
                <path d="M4 20l3.5-3.5" />
              </svg>
            </span>
            <div className="font-heading text-[16px] font-semibold text-[#3A403C] mb-1">
              Your journal
            </div>
            <div className="text-[13px] leading-[1.5] text-[#767D79]">
              {journalCount === 0
                ? 'No reflections yet — start writing.'
                : `${journalCount} ${journalCount === 1 ? 'reflection' : 'reflections'} saved so far.`}
            </div>
          </Link>
        </div>

        {/* ── Gentle note ── stagger-3 */}
        <div
          className="relative overflow-hidden rounded-[18px] border border-[#E2E6DD] px-[38px] py-[32px] animate-fade-up"
          style={{
            background: 'linear-gradient(115deg, #EAF3EF 0%, #F4EFE7 100%)',
            animationDelay: '320ms',
          }}
        >
          {/* Decorative quatrefoil bottom-right */}
          <div
            className="absolute pointer-events-none"
            style={{ bottom: -118, right: -90, transform: 'rotate(18deg)', opacity: 0.5 }}
            aria-hidden="true"
          >
            <svg width="300" height="300" viewBox="0 0 400 400" aria-hidden="true">
              <g fill="#2F6E7A" fillOpacity=".06" stroke="#2F6E7A" strokeOpacity=".22" strokeWidth="1.6" strokeLinejoin="round">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <path
                    key={deg}
                    d="M200 200 Q167 128 200 58 Q233 128 200 200 Z"
                    transform={deg === 0 ? undefined : `rotate(${deg} 200 200)`}
                  />
                ))}
              </g>
            </svg>
          </div>

          <div className="relative">
            <span
              className="font-heading text-[78px] leading-[0.5] text-primary opacity-[0.24] inline-block h-[38px]"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="font-heading text-[23px] leading-[1.42] font-medium italic tracking-[-0.012em] text-[#2F5049] max-w-[540px] mt-2 mb-4 [text-wrap:pretty]">
              {getDailyNote()}
            </p>
            <span className="text-[11.5px] font-semibold tracking-[0.1em] uppercase text-[#8A928D]">
              A note for today
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}
