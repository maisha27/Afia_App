import type { ReactNode } from 'react';

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#FAF8F5]">{children}</div>;
}
