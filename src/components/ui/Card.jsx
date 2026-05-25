import React from 'react';

export const Card = ({ children, variant = 'default', className = '', ...props }) => {
  const cardClasses = [
    'ui-card',
    variant === 'elevated' ? 'ui-card-elevated' : '',
    variant === 'soft' ? 'ui-card-soft' : '',
    variant === 'result' ? 'ui-card-result' : '',
    variant === 'warning' ? 'ui-card-warning' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};
