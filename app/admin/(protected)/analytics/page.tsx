import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Analytics — Admin' };

export default function AdminAnalyticsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <p className="text-muted-foreground">Admin: analytics overview — Phase F</p>
    </main>
  );
}
