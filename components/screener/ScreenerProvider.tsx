'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { calculateScore, type ScoreResult } from '@/lib/scoring';

interface ScreenerContextValue {
  answers: (number | null)[];
  setAnswer: (step: number, value: number) => void;
  getResult: () => ScoreResult | null;
  isComplete: boolean;
}

const ScreenerContext = createContext<ScreenerContextValue | null>(null);

export function ScreenerProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array<null>(14).fill(null),
  );

  const setAnswer = useCallback((step: number, value: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step - 1] = value;
      return next;
    });
  }, []);

  const isComplete = answers.every((a) => a !== null);

  const getResult = useCallback((): ScoreResult | null => {
    if (!isComplete) return null;
    return calculateScore(answers as number[]);
  }, [answers, isComplete]);

  return (
    <ScreenerContext.Provider value={{ answers, setAnswer, getResult, isComplete }}>
      {children}
    </ScreenerContext.Provider>
  );
}

export function useScreener() {
  const ctx = useContext(ScreenerContext);
  if (!ctx) throw new Error('useScreener must be used within ScreenerProvider');
  return ctx;
}
