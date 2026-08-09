import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Users — Admin' };

export default function AdminUsersPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <p className="text-muted-foreground">Admin: user management — Phase F</p>
    </main>
  );
}
