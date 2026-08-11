'use client';

import { useState } from 'react';
import Link from 'next/link';

export function PricingCard() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const isYearly = billing === 'yearly';

  return (
    <div
      className="bg-white border border-[#E7E2DA] rounded-[20px] p-[30px] pb-[28px]"
      style={{ boxShadow: '0 24px 50px -32px rgba(20,24,22,.4)' }}
    >
      {/* Billing toggle */}
      <div className="flex bg-[#F3EEE6] rounded-[11px] p-[4px] mb-6">
        <button
          type="button"
          onClick={() => setBilling('monthly')}
          className={`flex-1 text-center text-[13.5px] font-semibold py-[9px] rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            !isYearly ? 'bg-primary text-white' : 'text-[#767D79]'
          }`}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBilling('yearly')}
          className={`flex-1 flex items-center justify-center gap-1.5 text-[13.5px] font-semibold py-[9px] rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            isYearly ? 'bg-primary text-white' : 'text-[#767D79]'
          }`}
        >
          Yearly
          <span
            className={`text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full ${
              isYearly
                ? 'bg-[#EBD3A0] text-[#6B4E1E]'
                : 'bg-[#E4F0F2] text-primary'
            }`}
          >
            Save 55%
          </span>
        </button>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-heading text-[44px] font-semibold tracking-[-0.03em] text-[#2F5049]">
          {isYearly ? '£5.83' : '£12.99'}
        </span>
        <span className="text-[15px] text-[#767D79]">/ month</span>
      </div>
      <p className="text-[13px] text-[#8A928D] mb-[22px]">
        {isYearly ? 'Billed £69.99 yearly' : 'Billed monthly'} ·{' '}
        <span className="text-[#5F6863]">7 days free first</span>
      </p>

      {/* CTA */}
      <Link
        href="/welcome"
        className="flex items-center justify-center gap-2.5 bg-primary text-white font-heading text-[16px] font-semibold py-[16px] rounded-[12px] mb-[14px] hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ boxShadow: '0 12px 24px -10px rgba(47,122,109,.6)' }}
      >
        Start my 7 days free
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </Link>

      {/* Reminder note */}
      <div className="flex items-center gap-2 justify-center text-[12.5px] text-[#5F6863] mb-[20px]">
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#276358"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" />
          <path d="M6 1v3M10 1v3M14 1v3" />
        </svg>
        We&rsquo;ll remind you 2 days before your trial ends
      </div>

      {/* Footer assurances */}
      <div className="flex items-center gap-[14px] text-[12px] text-[#9A9E99] justify-center pt-[18px] border-t border-[#F0EBE3]">
        <span className="flex items-center gap-1.5">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9AA29C"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Cancel anytime
        </span>
        <span className="w-[3px] h-[3px] rounded-full bg-[#CFC9BE]" aria-hidden="true" />
        <span className="flex items-center gap-1.5">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9AA29C"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          No ads, ever
        </span>
      </div>
    </div>
  );
}
