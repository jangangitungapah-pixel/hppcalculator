import React from 'react';
import { Button } from '../ui/Button';

export const ResetModuleCard = ({ title, description, onReset, variant = "secondary" }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-ui-border rounded-xl bg-ui-surface">
      <div className="mb-3 sm:mb-0 pr-4">
        <h4 className="font-semibold text-text-primary mb-1">{title}</h4>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
      <div className="shrink-0">
        <Button 
          variant={variant} 
          onClick={onReset}
          className="w-full sm:w-auto"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
