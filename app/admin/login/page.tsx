// ADM-001 — Admin login. Lives outside (admin) route group so the
// auth guard in (admin)/layout.tsx does not apply here.
// Phase F builds the real form.
export const metadata = { title: "Admin Login" };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <p className="text-muted-foreground">Admin login — Phase F</p>
    </main>
  );
}
