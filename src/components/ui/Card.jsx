import React from 'react';

export const Card = ({ children, variant = 'default', className = '', ...props }) => {
  const baseStyles = "rounded-lg overflow-hidden";
  
  const variants = {
    default: "bg-surface border border-border",
    elevated: "bg-surface shadow-card",
    soft: "bg-surface-muted",
    result: "bg-brand-soft border border-brand-primary/20",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
