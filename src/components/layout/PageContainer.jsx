import React from 'react';
import { PageTransition } from '../motion/PageTransition';
import { cn } from '../../lib/ui/cn';

export const PageContainer = ({ children, className, maxWidth = "max-w-page", ...props }) => {
  return (
    <PageTransition className={cn("app-page-container w-full mx-auto px-4 sm:px-6 py-3 sm:py-5 pb-16 sm:pb-20 lg:pb-6", maxWidth, className)} {...props}>
      {children}
    </PageTransition>
  );
};
