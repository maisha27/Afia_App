'use client';

import { motion, useReducedMotion } from 'motion/react';

const EASE_CALM: [number, number, number, number] = [0.25, 0, 0.15, 1];

export function StaggerList({
  children,
  className,
  delay = 0,
  stagger = 0.07,
  triggerOnView = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  triggerOnView?: boolean;
}) {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  if (triggerOnView) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px' }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: reduced ? 0 : 0.5, ease: EASE_CALM },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
