import * as Sentry from '@sentry/nextjs';

type Level = 'fatal' | 'error' | 'warning' | 'info';

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  Sentry.captureException(error, context ? { extra: context } : undefined);
}

export function captureMessage(message: string, level: Level = 'error'): void {
  Sentry.captureMessage(message, level);
}
