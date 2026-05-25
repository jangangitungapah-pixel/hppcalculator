import React from 'react';

export const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  iconLeft,
  disabled = false,
  className = '', 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-normal ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary";
  
  const variants = {
    primary: "bg-brand-primary text-white shadow-md hover:shadow-lg hover:bg-[#D95F0D] active:bg-brand-primary transform hover:-translate-y-0.5",
    secondary: "border border-brand-primary text-brand-primary bg-transparent hover:bg-brand-soft",
    ghost: "bg-transparent text-text-secondary hover:bg-surface-muted active:bg-surface-muted",
    destructive: "bg-status-loss text-white hover:opacity-90 active:opacity-100",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-base",
    lg: "h-14 px-6 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";
  const disabledStyle = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${disabledStyle} ${className}`}
      {...props}
    >
      {iconLeft && <span className="mr-2 flex-shrink-0">{iconLeft}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
