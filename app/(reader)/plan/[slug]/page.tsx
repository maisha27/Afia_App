import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PlanReaderClient from './PlanReaderClient';

export default async function PlanStepPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/log-in');

  // Fetch exercise by slug + the next exercise (for navigation)
  const { data: exercise, error } = await supabase
    .from('exercises')
    .select('id, slug, title, content, writing_prompt, week_number, day_number, duration_minutes, sort_order')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();

  if (error || !exercise) notFound();

  const [nextRes, progressRes] = await Promise.all([
    // Next exercise in sequence
    supabase
      .from('exercises')
      .select('slug')
      .eq('is_published', true)
      .gt('sort_order', exercise.sort_order)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle(),
    // User's most recent response for this exercise
    supabase
      .from('user_exercise_progress')
      .select('response')
      .eq('user_id', user.id)
      .eq('exercise_id', exercise.id)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const nextSlug = nextRes.data?.slug ?? null;
  const initialResponse = (progressRes.data?.response as string | null) ?? '';

  return (
    <PlanReaderClient
      exercise={{
        id: exercise.id,
        slug: exercise.slug,
        title: exercise.title,
        content: exercise.content ?? '',
        writingPrompt: exercise.writing_prompt ?? '',
        weekNumber: exercise.week_number,
        dayNumber: exercise.day_number,
        durationMinutes: exercise.duration_minutes,
      }}
      nextSlug={nextSlug}
      initialResponse={initialResponse}
    />
  );
}
