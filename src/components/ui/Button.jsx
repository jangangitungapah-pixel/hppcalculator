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
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {iconLeft && <span className="mr-2 flex-shrink-0">{iconLeft}</span>}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
