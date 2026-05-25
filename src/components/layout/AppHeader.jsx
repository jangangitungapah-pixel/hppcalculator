import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header } from './Header';

export const AppHeader = ({ title, onBack }) => {
  return (
    <div className="sticky top-0 z-10 bg-surface border-b border-border shadow-sm">
      <div className="h-14 px-4 flex items-center gap-3">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 text-text-secondary hover:text-brand-primary rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <h1 className="font-bold text-lg text-text-primary truncate flex-1">
          {title}
        </h1>
      </div>
    </div>
  );
};
