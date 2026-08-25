import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { JournalClient, type JournalEntry } from './JournalClient';

export const metadata: Metadata = { title: 'Your journal' };

const DAILY_PROMPTS: Record<number, string> = {
  0: 'How was your week? What felt hard, and what felt okay?',
  1: "What does your week ahead look like? What are you hoping for?",
  2: "What's been on your mind today?",
  3: 'Pause here for a moment. What do you notice in your body right now?',
  4: "What's something you've done recently that felt like care for yourself?",
  5: "What are you carrying into the weekend? What can you set down?",
  6: 'What made today feel bearable? Even one small thing counts.',
};

export default async function JournalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from('journal_entries')
    .select('id, content, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const entries = (data ?? []) as JournalEntry[];
  const dailyPrompt = DAILY_PROMPTS[new Date().getDay()];

  return (
    <main className="relative flex-1 overflow-hidden px-6 py-9 pb-11 lg:px-10">
      <div className="relative">
        {/* ── Header ── */}
        <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[12px] font-semibold italic tracking-[0.1em] uppercase text-primary">
              Private · only you can see this
            </span>
            <span
              className="w-[6px] h-[6px] rounded-full flex-shrink-0"
              style={{ background: '#6A5FA0' }}
              aria-hidden="true"
            />
          </div>
          <h1 className="font-heading text-[30px] font-semibold tracking-[-0.025em] text-[#262B29] mb-7">
            Your journal
          </h1>
        </div>

        <JournalClient initialEntries={entries} dailyPrompt={dailyPrompt} />
      </div>
    </main>
  );
}
