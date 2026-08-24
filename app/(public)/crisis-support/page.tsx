import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Crisis Support — Afia',
  description: 'Real, immediate help for when things feel like too much.',
};

export default function CrisisSupportPage() {
  return (
    <div className="min-h-screen bg-[#FBF7F4]">
      {/* Minimal header */}
      <header className="flex items-center justify-between bg-white border-b border-[#F0E6E2] px-4 sm:px-8 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <Image
            src="/Images/Official_Logo.png"
            alt="Afia"
            width={34}
            height={34}
            className="h-[34px] w-auto object-contain"
            priority
          />
          <span className="font-heading text-[20px] font-semibold text-primary tracking-[-0.01em]">
            afia
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[#5F6863] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          Close
        </Link>
      </header>

      <main className="max-w-[640px] mx-auto px-4 sm:px-8 py-[44px] pb-[52px]">
        {/* Reassurance header */}
        <div className="text-center mb-[34px]">
          <h1 className="font-heading text-[30px] leading-[1.2] font-semibold tracking-[-0.02em] mb-2.5 [text-wrap:pretty]">
            If things feel like too much right now
          </h1>
          <p className="text-[16.5px] leading-[1.55] text-text-2 [text-wrap:pretty]">
            You don't have to hold it alone. Reaching out is a strong thing to do — help is
            available any hour, any day.
          </p>
        </div>

        {/* Primary help actions */}
        <div className="flex flex-col gap-3.5 mb-4">
          <a
            href="tel:116123"
            className="flex items-center gap-[18px] rounded-[16px] px-[26px] py-[22px] text-white no-underline"
            style={{
              background: '#B0503F',
              boxShadow: '0 16px 32px -16px rgba(176,80,63,0.6)',
            }}
          >
            <span className="flex-shrink-0 w-[54px] h-[54px] rounded-[14px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.16)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
              </svg>
            </span>
            <div className="flex-1">
              <div className="font-heading text-[20px] font-semibold">Call 116 123</div>
              <div className="text-[14px] mt-0.5" style={{ color: '#FBE4DE' }}>
                Samaritans · free, 24/7
              </div>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </a>

          <a
            href="sms:85258"
            className="flex items-center gap-[18px] rounded-[16px] px-[26px] py-[22px] text-white no-underline"
            style={{
              background: '#2F5049',
              boxShadow: '0 16px 32px -18px rgba(47,80,73,0.6)',
            }}
          >
            <span className="flex-shrink-0 w-[54px] h-[54px] rounded-[14px] flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.14)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.4-.6L3 21l1.7-4.6A8.4 8.4 0 1 1 21 11.5Z" />
              </svg>
            </span>
            <div className="flex-1">
              <div className="font-heading text-[20px] font-semibold">Text SHOUT to 85258</div>
              <div className="text-[14px] mt-0.5" style={{ color: '#D4E4DE' }}>
                Crisis Text Line · free, 24/7
              </div>
            </div>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <p className="text-center text-[14px] text-text-4 mb-[34px]">
          If you're in immediate danger, please call{' '}
          <a href="tel:999" className="font-semibold text-crisis">
            999
          </a>
          .
        </p>

        {/* While you wait */}
        <div className="border-t border-[#EFE6E1] pt-[30px]">
          <h2 className="font-heading text-[17px] font-semibold text-text-1 mb-1">
            While you're waiting, or if you just need a moment
          </h2>
          <p className="text-[14px] text-text-4 mb-[18px]">
            Small things that can help you feel a little steadier.
          </p>
          <div className="grid grid-cols-2 gap-3.5">
            <Link
              href="/calm/breathe"
              className="flex items-center gap-3.5 rounded-[14px] border border-[#EFE6E1] bg-white px-5 py-[18px] hover:border-[#D8EBE5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-[11px] bg-tint flex items-center justify-center text-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="2.3" />
                  <path d="M7.4 12a4.6 4.6 0 0 1 9.2 0" />
                  <path d="M3.5 12a8.5 8.5 0 0 1 17 0" />
                </svg>
              </span>
              <div>
                <div className="text-[15px] font-semibold text-text-1">A grounding breath</div>
                <div className="text-[12.5px] text-text-4 mt-px">3 minutes</div>
              </div>
            </Link>
            <a
              href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3.5 rounded-[14px] border border-[#EFE6E1] bg-white px-5 py-[18px] hover:border-[#E0D5CA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-[11px] flex items-center justify-center" style={{ background: '#F3EEE6', color: '#B26A44' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M6 11V6a2 2 0 0 1 4 0v4" />
                  <path d="M10 10V4.5a2 2 0 0 1 4 0V10" />
                  <path d="M14 10V6a2 2 0 0 1 4 0v7a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3L4 14a2 2 0 0 1 3-2.6" />
                </svg>
              </span>
              <div>
                <div className="text-[15px] font-semibold text-text-1">5-4-3-2-1 senses</div>
                <div className="text-[12.5px] text-text-4 mt-px">3 minutes</div>
              </div>
            </a>
          </div>

          {/* Other services */}
          <div className="mt-6 flex flex-col gap-2">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-text-4 mb-1">
              Other UK services
            </p>
            {[
              { name: 'NHS urgent mental health', detail: 'Call 111, option 2 · 24/7', href: 'tel:111' },
              { name: 'Muslim Youth Helpline', detail: '0808 808 2008 · 4pm–10pm daily', href: 'tel:08088082008' },
              { name: 'Muslim Community Helpline', detail: '020 8908 6715 · Mon–Fri, 10am–1pm', href: 'tel:02089086715' },
              { name: 'Muslim Women Network UK', detail: '0800 999 5786 · Mon–Fri, 10am–4pm', href: 'tel:08009995786' },
            ].map(({ name, detail, href }) => (
              <a
                key={name}
                href={href}
                className="flex justify-between items-center py-2.5 border-b border-[#F0E9E5] text-[14px] hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                <span className="font-medium text-text-1">{name}</span>
                <span className="text-text-4 text-[13px]">{detail}</span>
              </a>
            ))}
          </div>

          <p className="text-[13px] leading-[1.55] text-text-4 mt-5 text-center [text-wrap:pretty]">
            Afia isn't an emergency service and can't provide crisis care. The lines above are
            staffed by trained people who can.
          </p>
        </div>
      </main>
    </div>
  );
}
