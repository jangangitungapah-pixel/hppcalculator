import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/ui/cn';

const buttonVariants = cva(
  "btn",
  {
    variants: {
      variant: {
        primary: "btn-primary",
        secondary: "btn-secondary",
        outline: "btn-outline",
        ghost: "btn-ghost",
        danger: "btn-danger",
        destructive: "btn-destructive",
        success: "btn-success",
        premium: "btn-premium",
        hero: "btn-hero",
        link: "btn-link",
        soft: "btn-soft",
        white: "bg-white text-primary shadow-sm hover:shadow-md hover:bg-white/95 border border-transparent font-bold",
      },
      size: {
        xs: "btn-xs",
        sm: "btn-sm",
        md: "btn-md",
        lg: "btn-lg",
        xl: "btn-xl",
        icon: "btn-icon",
      },
      fullWidth: {
        true: "btn-full",
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
  leftIcon,
  iconRight,
  rightIcon,
  iconOnly,
  loading = false,
  asChild = false,
  children,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  
  // Resolve either leftIcon/iconLeft and rightIcon/iconRight
  const finalLeftIcon = leftIcon || iconLeft;
  const finalRightIcon = rightIcon || iconRight;
  
  // Determine if it is iconOnly
  const isIconOnly = iconOnly || size === "icon";

  return (
    <Comp
      className={cn(
        buttonVariants({ variant, size, fullWidth, className }),
        loading && "btn-loading"
      )}
      ref={ref}
      disabled={loading || props.disabled}
      aria-busy={loading ? "true" : undefined}
      {...props}
    >
      {loading && <span className="btn-spinner" aria-hidden="true" />}
      
      {!loading && finalLeftIcon && (
        <span className="btn-icon-left">{finalLeftIcon}</span>
      )}
      
      {/* Hide children if iconOnly and no children, but keep layout clean if children are present */}
      {(!isIconOnly || children) && (
        <span className="btn-text">{children}</span>
      )}
      
      {!loading && finalRightIcon && (
        <span className="btn-icon-right">{finalRightIcon}</span>
      )}
    </Comp>
  );
});

Button.displayName = 'Button';
