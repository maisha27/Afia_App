'use client';

import CalmRings from '@/components/calm/CalmRings';

const ICON = '#EAF3EF';

export function OceanWaveAnimation() {
  return (
    <div className="relative" style={{ width: 280, height: 280 }} aria-hidden="true">
      <CalmRings size={280} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
          <path d="M2 17c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
        </svg>
      </div>
    </div>
  );
}

export function GroundingAnimation() {
  return (
    <div className="relative" style={{ width: 280, height: 280 }} aria-hidden="true">
      <CalmRings size={280} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 11V6a2 2 0 0 1 4 0v4" />
          <path d="M10 10V4.5a2 2 0 0 1 4 0V10" />
          <path d="M14 10V6a2 2 0 0 1 4 0v7a6 6 0 0 1-6 6h-1a6 6 0 0 1-5.2-3L4 14a2 2 0 0 1 3-2.6" />
        </svg>
      </div>
    </div>
  );
}

export function BodyScanAnimation() {
  return (
    <div className="relative" style={{ width: 280, height: 280 }} aria-hidden="true">
      <CalmRings size={280} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="5" r="2.4" />
          <path d="M12 7.5v7M8.5 10.5 12 12l3.5-1.5M9.5 21l2.5-6.5L14.5 21" />
        </svg>
      </div>
    </div>
  );
}

export function LovingKindnessAnimation() {
  return (
    <div className="relative" style={{ width: 280, height: 280 }} aria-hidden="true">
      <CalmRings size={280} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="50" height="50" viewBox="0 0 24 24" fill={ICON} stroke="none">
          <path d="M12 20s-7-4.5-7-9.5A3.8 3.8 0 0 1 12 7a3.8 3.8 0 0 1 7 3.5C19 15.5 12 20 12 20Z" />
        </svg>
      </div>
    </div>
  );
}

export function SafePlaceAnimation() {
  return (
    <div className="relative" style={{ width: 280, height: 280 }} aria-hidden="true">
      <CalmRings size={280} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={ICON} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v10h14V10" />
          <path d="M10 20v-5h4v5" />
        </svg>
      </div>
    </div>
  );
}
