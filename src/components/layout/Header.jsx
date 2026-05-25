import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/ui/cn';

export const Header = ({ title }) => {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface-glass border-b border-white/20 shadow-sm transition-premium">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 max-w-page mx-auto w-full">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-coral text-white shadow-sm shadow-glow-primary transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-text-primary hidden sm:inline-block">
              {t('app.name')}
            </span>
          </Link>
          
          {title && (
            <div className="flex items-center gap-3">
              <span className="text-border-strong hidden lg:inline-block">|</span>
              <h1 className="font-bold text-lg sm:text-xl tracking-tight text-text-primary truncate">
                {title}
              </h1>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-accent-gold/20 to-primary/20 text-primary-active border border-accent-gold/30 rounded-full hidden sm:inline-flex shadow-sm">
            Premium MVP
          </span>
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
};
