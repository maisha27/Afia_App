import Image from 'next/image';
import Link from 'next/link';
import { AppSidebarNav } from './AppSidebarNav';

interface AppSidebarProps {
  userEmail: string | undefined;
  firstName?: string | null;
}

function getDisplayName(firstName: string | null | undefined, email: string | undefined): string {
  if (firstName?.trim()) return firstName.trim();
  if (!email) return 'You';
  const local = email.split('@')[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function getDisplayInitial(firstName: string | null | undefined, email: string | undefined): string {
  if (firstName?.trim()) return firstName.trim().charAt(0).toUpperCase();
  if (!email) return '?';
  return email.charAt(0).toUpperCase();
}

export function AppSidebar({ userEmail, firstName }: AppSidebarProps) {
  const displayName = getDisplayName(firstName, userEmail);
  const displayInitial = getDisplayInitial(firstName, userEmail);

  return (
    <aside
      className="hidden lg:flex w-[236px] flex-shrink-0 flex-col bg-white border-r border-[#EFEAE2] px-[18px] py-6"
      aria-label="Sidebar"
    >
      {/* Logo */}
      <Link
        href="/home"
        className="flex items-center gap-2.5 px-2 mb-[30px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        <Image
          src="/Images/Official_Logo.png"
          alt="Afia"
          width={45}
          height={45}
          className="h-[45px] w-auto object-contain"
        />
        <div className="flex flex-col leading-none gap-[3px]">
          <span className="font-heading text-[19px] font-semibold text-primary tracking-[-0.01em]">
            afia
          </span>
          <span className="text-[7px] font-semibold tracking-[0.22em] uppercase text-[#577169]">
            calm in mind
          </span>
        </div>
      </Link>

      {/* Nav + bottom items */}
      <AppSidebarNav displayName={displayName} displayInitial={displayInitial} />
    </aside>
  );
}
