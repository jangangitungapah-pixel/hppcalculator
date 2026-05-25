import React from 'react';
import { motion } from 'framer-motion';

export const StaggerContainer = ({ children, delayOrder = 0, staggerDelay = 0.05, className }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayOrder * 0.1,
      }
    }
  };

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
};
