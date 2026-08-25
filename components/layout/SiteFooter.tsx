import Image from 'next/image';
import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E7E2DA] bg-[#F4F0EA]">
      <div className="mx-auto max-w-[1000px] px-11 py-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="max-w-[340px]">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              <Image
                src="/Images/Official_Logo.png"
                alt="Afia"
                width={45}
                height={45}
                className="h-[45px] w-auto object-contain"
              />
              <div className="flex flex-col leading-none gap-[3px]">
                <span className="font-heading text-[21px] font-semibold text-primary tracking-[-0.01em]">
                  afia
                </span>
                <span className="text-[7.5px] font-semibold tracking-[0.22em] uppercase text-[#577169]">
                  calm in mind
                </span>
              </div>
            </Link>
            <p className="text-[13px] leading-relaxed text-text-3">
              Afia is a self-help platform. It is not a substitute for professional medical or
              psychological care.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-14">
            <div className="flex flex-col gap-2.5 text-sm">
              <span className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-4">
                Product
              </span>
              <a href="#how-it-helps" className="text-text-2 hover:text-foreground transition-colors">
                How it helps
              </a>
              <a href="#approach" className="text-text-2 hover:text-foreground transition-colors">
                The approach
              </a>
              <Link href="/log-in" className="text-text-2 hover:text-foreground transition-colors">
                Log in
              </Link>
            </div>
            <div className="flex flex-col gap-2.5 text-sm">
              <span className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-4">
                Support
              </span>
              <Link
                href="/crisis-support"
                className="font-medium text-crisis hover:text-crisis/80 transition-colors"
              >
                Crisis support
              </Link>
              <Link href="/disclaimer" className="text-text-2 hover:text-foreground transition-colors">
                Medical disclaimer
              </Link>
              <Link href="/privacy" className="text-text-2 hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-text-2 hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
