'use client';

import { useRef, useState, useEffect } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

export interface DomainRowData {
  label: string;
  beforePct: number | null;
  afterPct: number;
  beforeColor: string;
  afterColor: string;
  fromLabel: string | null;
  toLabel: string;
  toColor: string;
}

export function AnimatedDomainBars({
  domains,
  hasMultiple,
}: {
  domains: DomainRowData[];
  hasMultiple: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px 0px' });
  const reduced = useReducedMotion();
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (inView) setTriggered(true);
  }, [inView]);

  const show = triggered || reduced;

  return (
    <div ref={ref} className="flex flex-col gap-5">
      {domains.map((domain, i) => {
        const staggerDelay = `${i * 110}ms`;
        return (
          <div
            key={domain.label}
            className="grid items-center gap-4"
            style={{ gridTemplateColumns: '140px 1fr auto' }}
          >
            <span className="text-[14.5px] font-semibold text-[#3A403C]">{domain.label}</span>

            <div className="h-[8px] rounded-full bg-[#EFEAE2] relative">
              {domain.beforePct !== null && (
                <div
                  className="h-full rounded-full absolute top-0 left-0 transition-all duration-700 ease-out"
                  style={{
                    width: show ? `${domain.beforePct}%` : '0%',
                    background: domain.beforeColor,
                    transitionDelay: staggerDelay,
                  }}
                />
              )}
              <div
                className="h-full rounded-full absolute top-0 left-0 transition-all duration-700 ease-out"
                style={{
                  width: show ? `${Math.max(4, domain.afterPct)}%` : '0%',
                  background: domain.afterColor,
                  transitionDelay: staggerDelay,
                }}
              />
            </div>

            <span className="text-[12.5px] font-semibold text-[#8A928D] whitespace-nowrap">
              {domain.fromLabel ? (
                <>
                  {domain.fromLabel} <span className="text-[#C9C3B8]">→</span>{' '}
                  <span style={{ color: domain.toColor }}>{domain.toLabel}</span>
                </>
              ) : (
                <span style={{ color: domain.toColor }}>{domain.toLabel}</span>
              )}
            </span>
          </div>
        );
      })}

      {!hasMultiple && (
        <p className="text-[12.5px] text-[#8A928D] pt-1">
          After your next check-in you&rsquo;ll see before and after for each area.
        </p>
      )}
    </div>
  );
}
