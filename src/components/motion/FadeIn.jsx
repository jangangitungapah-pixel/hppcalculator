import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const FadeIn = ({ children, direction = 'up', delay = 0, duration = 0.4, className }) => {
  const shouldReduceMotion = useReducedMotion();
  const directions = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
    none: { x: 0, y: 0 }
  };

  const variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      ...(shouldReduceMotion ? directions.none : directions[direction])
    },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
};
