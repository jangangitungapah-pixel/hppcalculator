import React from 'react';
import { PageTransition } from '../motion/PageTransition';
import { cn } from '../../lib/ui/cn';

export const PageContainer = ({ children, className, maxWidth = "max-w-page", ...props }) => {
  return (
    <PageTransition className={cn("w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-16 sm:pb-24 lg:pb-8", maxWidth, className)} {...props}>
      {children}
    </PageTransition>
  );
};
