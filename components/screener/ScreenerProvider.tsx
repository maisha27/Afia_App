'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { calculateScore, type ScoreResult } from '@/lib/scoring';

const STORAGE_KEY = 'afia_screener_answers';

interface ScreenerContextValue {
  answers: (number | null)[];
  setAnswer: (step: number, value: number) => void;
  getResult: () => ScoreResult | null;
  isComplete: boolean;
  hydrated: boolean;
}

const ScreenerContext = createContext<ScreenerContextValue | null>(null);

function loadFromStorage(): (number | null)[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return Array<null>(14).fill(null);
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed) || parsed.length !== 14) return Array<null>(14).fill(null);
    return parsed.map((v) => (typeof v === 'number' && v >= 0 && v <= 3 ? v : null));
  } catch {
    return Array<null>(14).fill(null);
  }
}

export function ScreenerProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array<null>(14).fill(null));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAnswers(loadFromStorage());
    setHydrated(true);
  }, []);

  const setAnswer = useCallback((step: number, value: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step - 1] = value;
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // sessionStorage unavailable — answers stay in memory only
      }
      return next;
    });
  }, []);

  const isComplete = hydrated && answers.every((a) => a !== null);

  const getResult = useCallback((): ScoreResult | null => {
    if (!isComplete) return null;
    return calculateScore(answers as number[]);
  }, [answers, isComplete]);

  return (
    <ScreenerContext.Provider value={{ answers, setAnswer, getResult, isComplete, hydrated }}>
      {children}
    </ScreenerContext.Provider>
  );
}

export function useScreener() {
  const ctx = useContext(ScreenerContext);
  if (!ctx) throw new Error('useScreener must be used within ScreenerProvider');
  return ctx;
}
