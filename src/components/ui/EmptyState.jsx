import React from 'react';
import { cn } from '../../lib/ui/cn';

export const EmptyState = ({ icon, title, description, action, className, ...props }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-10 bg-surface rounded-3xl border border-dashed border-border-strong transition-premium hover:border-primary/30", className)} {...props}>
      {icon && (
        <div className="text-primary bg-primary-soft p-4 rounded-full mb-4 shadow-sm shadow-glow-primary">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="flex gap-3 flex-wrap justify-center">{action}</div>}
    </div>
  );
};
