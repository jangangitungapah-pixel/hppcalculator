import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/ui/cn';

const badgeVariants = cva(
  "inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-pill leading-tight transition-premium",
  {
    variants: {
      variant: {
        neutral: "bg-surface-muted text-text-secondary border border-border/50",
        primary: "bg-primary-softer text-primary-active border border-primary/20",
        success: "bg-status-goodBg text-status-good border border-status-good/20",
        warning: "bg-status-lowBg text-status-low border border-status-low/20",
        danger: "bg-status-lossBg text-status-loss border border-status-loss/20",
        info: "bg-status-okayBg text-status-okay border border-status-okay/20",
        loss: "bg-status-lossBg text-status-loss border border-status-loss/20",
        low: "bg-status-lowBg text-status-low border border-status-low/20",
        okay: "bg-status-okayBg text-status-okay border border-status-okay/20",
        good: "bg-status-goodBg text-status-good border border-status-good/20",
        excellent: "bg-status-excellentBg text-status-excellent border border-status-excellent/20",
        demo: "bg-purple-100 text-purple-700 border border-purple-200",
        premium: "bg-gradient-to-r from-accent-gold/20 to-primary/20 text-primary-active border border-accent-gold/30 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
);

export const Badge = ({ children, variant, className, ...props }) => {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props}>
      {children}
    </span>
  );
};
