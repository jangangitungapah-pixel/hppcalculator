import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 15, filter: 'blur(4px)' },
  animate: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] // Premium ease out
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    filter: 'blur(4px)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const PageTransition = ({ children, className }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};
