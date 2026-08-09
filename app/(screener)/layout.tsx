import type { ReactNode } from 'react';
import { ScreenerProvider } from '@/components/screener/ScreenerProvider';

export default function ScreenerLayout({ children }: { children: ReactNode }) {
  return <ScreenerProvider>{children}</ScreenerProvider>;
}
