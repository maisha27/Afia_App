// APP-004 — Individual exercise template. Phase E builds the real screen.
export const metadata = { title: "Exercise" };

export default function ExercisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  void params;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <p className="text-muted-foreground">Individual exercise — Phase E</p>
    </main>
  );
}
