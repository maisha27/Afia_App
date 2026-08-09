import { redirect } from 'next/navigation';

export default function LegacyAdminContentRedirect() {
  redirect('/admin/content');
}
