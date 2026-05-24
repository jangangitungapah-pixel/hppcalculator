import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';

export const LanguageSwitch = ({ className = '' }) => {
  const { lang, setLanguage } = useLanguage();

  return (
    <div className={`flex bg-surface-muted p-1 rounded-md border border-border inline-flex ${className}`}>
      <button
        onClick={() => setLanguage('id')}
        className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${
          lang === 'id' ? 'bg-surface shadow-sm text-brand-primary' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        ID
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${
          lang === 'en' ? 'bg-surface shadow-sm text-brand-primary' : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        EN
      </button>
    </div>
  );
};
