export async function register() {
   if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
     const { init } = await import('@sentry/nextjs');
    init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0,
      environment: process.env.NODE_ENV,
    });
  }
}

export { captureRequestError as onRequestError } from '@sentry/nextjs';
