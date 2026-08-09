import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Content — Admin' };

export default function AdminContentPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <p className="text-muted-foreground">Admin: content management — Phase F</p>
    </main>
  );
}
