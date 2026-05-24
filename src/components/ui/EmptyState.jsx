import React from 'react';

export const EmptyState = ({ icon, title, description, action, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-surface border border-dashed border-border rounded-xl ${className}`}>
      {icon && (
        <div className="w-16 h-16 mb-4 flex items-center justify-center bg-surface-muted rounded-full text-text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary mb-6 max-w-sm">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
