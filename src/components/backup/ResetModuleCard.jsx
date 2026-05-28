import React from 'react';
import { Button } from '../ui/Button';

export const ResetModuleCard = ({ title, description, onReset, variant = "secondary" }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 border border-border-soft rounded-2xl bg-surface-cream/45 hover:border-border transition-all gap-4">
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-text-primary text-xs sm:text-sm mb-0.5">{title}</h4>
        <p className="text-xs font-semibold text-text-secondary leading-relaxed">{description}</p>
      </div>
      <div className="shrink-0">
        <Button 
          variant="ghost" 
          onClick={onReset}
          className="w-full sm:w-auto h-9 px-4 bg-red-500/10 hover:bg-red-500/15 text-red-750 border border-red-500/10 rounded-xl text-xs font-bold transition-all"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
