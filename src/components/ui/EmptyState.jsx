import React from 'react';

export const EmptyState = ({ icon, title, description, action, className = '' }) => {
  return (
    <div className={`empty-state ${className}`}>
      {icon && (
        <div className="empty-icon">
          {icon}
        </div>
      )}
      <h3 className="empty-title">{title}</h3>
      {description && (
        <p className="empty-description">
          {description}
        </p>
      )}
      {action && <div className="empty-actions">{action}</div>}
    </div>
  );
};
