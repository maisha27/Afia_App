'use client';

import { motion, useReducedMotion } from 'motion/react';

const EASE_CALM: [number, number, number, number] = [0.25, 0, 0.15, 1];

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  y = 16,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease: EASE_CALM,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  from = 'bottom',
  delay = 0,
  duration = 0.45,
  distance = 24,
  className,
}: {
  children: React.ReactNode;
  from?: 'bottom' | 'top' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const offsets: Record<string, { x?: number; y?: number }> = {
    bottom: { y: distance },
    top: { y: -distance },
    left: { x: -distance },
    right: { x: distance },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[from] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease: EASE_CALM,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function InViewReveal({
  children,
  delay = 0,
  duration = 0.6,
  y = 20,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{
        duration: reduced ? 0 : duration,
        delay: reduced ? 0 : delay,
        ease: EASE_CALM,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
