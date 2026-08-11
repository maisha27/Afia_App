import { redirect } from 'next/navigation';

export default async function ExerciseSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/plan/${slug}`);
}
