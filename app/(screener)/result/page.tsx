import type { Metadata } from 'next';
import { ResultView } from '@/components/screener/ResultView';

export const metadata: Metadata = { title: 'Your Result' };

export default function ResultPage() {
  return <ResultView />;
}
