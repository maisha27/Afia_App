import { redirect } from 'next/navigation';

// This stub is at the wrong URL (/users). Real page is at /admin/users.
export default function LegacyAdminUsersRedirect() {
  redirect('/admin/users');
}
