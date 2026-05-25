import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/ui/cn';
import { motion } from 'framer-motion';

const cardVariants = cva(
  "rounded-2xl overflow-hidden transition-premium",
  {
    variants: {
      variant: {
        default: "bg-surface border border-border/60",
        elevated: "bg-surface shadow-card border border-border/40",
        soft: "bg-surface-muted border-none",
        glass: "bg-surface-glass backdrop-blur-md border border-white/20 shadow-sm",
        premium: "bg-gradient-to-br from-surface to-surface-muted shadow-floating border border-brand-soft",
        result: "bg-primary-softer border border-primary/20",
        warning: "bg-status-lowBg border border-status-low/20",
        success: "bg-status-goodBg border border-status-good/20",
        clickable: "bg-surface border border-border hover:border-primary/40 hover:shadow-card-hover cursor-pointer active:scale-[0.99]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const Card = React.forwardRef(({ className, variant, ...props }, ref) => {
  if (variant === 'clickable' || props.onClick) {
    return (
      <motion.div
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        className={cn(cardVariants({ variant: variant === 'default' && props.onClick ? 'clickable' : variant, className }))}
        {...props}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  );
});

Card.displayName = "Card";
