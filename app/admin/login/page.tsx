import type { Metadata } from 'next';
import { AdminLoginForm } from './AdminLoginForm';

export const metadata: Metadata = { title: 'Admin login' };

export default function AdminLoginPage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden"
      style={{ background: '#1B2624' }}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#25322F 1px, transparent 1px), linear-gradient(90deg, #25322F 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          opacity: 0.55,
        }}
        aria-hidden="true"
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 38%, rgba(47,122,109,.14) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        className="relative w-[412px] max-w-full rounded-[18px] px-[34px] pt-[36px] pb-[30px]"
        style={{
          background: '#232F2C',
          border: '1px solid #33413D',
          boxShadow: '0 30px 60px -30px rgba(0,0,0,.6)',
        }}
      >
        {/* Logo + Admin badge */}
        <div className="flex items-center gap-[10px] mb-[26px]">
          <span
            className="font-heading text-[20px] font-semibold tracking-[-0.01em]"
            style={{ color: '#EAF3EF' }}
          >
            afia
          </span>
          <span
            className="text-[10px] font-semibold tracking-[0.14em] uppercase rounded-[6px] px-[7px] py-[4px]"
            style={{
              color: '#7FB3A6',
              background: 'rgba(47,122,109,.2)',
              border: '1px solid #35544C',
            }}
          >
            Admin
          </span>
        </div>

        <h1
          className="font-heading text-[22px] font-semibold tracking-[-0.02em] mb-[5px]"
          style={{ color: '#F4F8F6' }}
        >
          Staff sign in
        </h1>
        <p className="text-[13.5px] mb-[22px]" style={{ color: '#9DB3AC' }}>
          This area is restricted to the Afia team.
        </p>

        <AdminLoginForm />

        {/* Footer */}
        <div className="flex items-center justify-center gap-[7px] mt-[22px]">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6E847D"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="text-[12px]" style={{ color: '#7E938C' }}>
            Afia staff only. Access is monitored.
          </span>
        </div>
      </div>
    </div>
  );
}
