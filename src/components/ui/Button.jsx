import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/ui/cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-all duration-300 ease-[var(--ease-premium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white shadow-md hover:bg-primary-hover shadow-glow-primary",
        secondary: "border border-border-strong bg-white text-text-primary shadow-sm hover:bg-surface-muted hover:border-primary/40 hover:text-primary",
        soft: "bg-primary-soft text-primary hover:bg-primary-softer",
        ghost: "bg-transparent text-text-secondary hover:bg-surface-muted hover:text-text-primary",
        destructive: "bg-status-loss text-white shadow-sm hover:bg-[#C53030]",
        premium: "bg-gradient-to-r from-primary to-accent-coral text-white shadow-floating hover:shadow-glow-primary relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-700",
        success: "bg-status-good text-white shadow-sm hover:bg-[#009040] shadow-glow-success",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-lg",
        md: "h-11 px-4 text-base",
        lg: "h-14 px-6 text-lg rounded-2xl",
        xl: "h-16 px-8 text-xl rounded-2xl",
        icon: "h-11 w-11",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export const Button = React.forwardRef(({ 
  className,
  variant,
  size,
  fullWidth,
  iconLeft,
  iconRight,
  loading = false,
  asChild = false,
  children,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      ref={ref}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && iconLeft && <span className="mr-2 shrink-0">{iconLeft}</span>}
      {children}
      {!loading && iconRight && <span className="ml-2 shrink-0">{iconRight}</span>}
    </Comp>
  );
});

Button.displayName = 'Button';
