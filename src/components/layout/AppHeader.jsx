import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header } from './Header';
import { Button } from '../ui/Button';

export const AppHeader = ({ title, onBack }) => {
  return (
    <div className="sticky top-0 z-10 bg-surface border-b border-border shadow-sm">
      <div className="h-14 px-4 flex items-center gap-3">
        {onBack && (
          <Button 
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="-ml-2 text-text-secondary hover:text-brand-primary rounded-full transition-colors w-9 h-9"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="font-bold text-lg text-text-primary truncate flex-1">
          {title}
        </h1>
      </div>
    </div>
  );
};
