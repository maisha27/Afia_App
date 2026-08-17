// Re-export motion primitives from motion/react so consumers
// only need one import path for common animation needs.
export { AnimatePresence } from 'motion/react';

export { FadeIn, SlideIn, InViewReveal } from './primitives';
export { StaggerList, StaggerItem } from './stagger';
export { AnimatedNumber } from './number';
