import React from 'react';

export const Badge = ({ children, variant = 'neutral', className = '' }) => {
  const badgeClasses = [
    'badge',
    `badge-${variant}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};
