import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-pill text-sm font-semibold";
  
  const variants = {
    neutral: "bg-surface-muted text-text-secondary border border-border",
    loss: "bg-status-lossBg text-status-loss",
    low: "bg-status-lowBg text-status-low",
    okay: "bg-status-okayBg text-status-okay",
    good: "bg-status-goodBg text-status-good",
    excellent: "bg-status-excellentBg text-status-excellent",
    success: "bg-status-goodBg text-status-good",
    warning: "bg-status-lowBg text-status-low",
    danger: "bg-status-lossBg text-status-loss",
    info: "bg-status-okayBg text-status-okay",
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
};
