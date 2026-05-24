import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = ({ title }) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-nav bg-surface border-b border-border h-14 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 text-brand-primary">
          <Sparkles className="w-6 h-6" />
          <span className="font-bold text-lg hidden sm:inline-block">{t('app.name')}</span>
        </Link>
        {title && (
          <>
            <span className="text-border mx-2 hidden sm:inline-block">|</span>
            <h1 className="font-semibold text-text-primary truncate max-w-[150px] sm:max-w-none">
              {title}
            </h1>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-soft text-brand-primary rounded-sm hidden sm:inline-block">
          MVP
        </span>
        <LanguageSwitch />
      </div>
    </header>
  );
};
