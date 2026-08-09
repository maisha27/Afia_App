// This route group is a legacy stub — admin pages now live at app/admin/(protected)/.
// The (admin) group produced wrong URLs (/users, /content, /analytics instead of /admin/*).
// This layout is a passthrough only; the real auth guard is in app/admin/(protected)/layout.tsx.
import type { ReactNode } from 'react';

export default function LegacyAdminGroupLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
