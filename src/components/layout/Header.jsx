import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/ui/cn';
import { OfflineBadge } from '../pwa/OfflineBadge';
import { useSync } from '../../hooks/useSync';

export const Header = ({ title }) => {
  const { t } = useLanguage();
  const { syncStatus } = useSync();

  const getSyncDotColor = () => {
    switch (syncStatus) {
      case 'synced': return 'bg-emerald-500 shadow-emerald-500/50';
      case 'syncing': return 'bg-orange-500 animate-pulse';
      case 'error': return 'bg-red-500 animate-ping';
      case 'offline':
      case 'local_unapproved':
      default: return 'bg-amber-500';
    }
  };

  const getSyncLabel = () => {
    switch (syncStatus) {
      case 'synced': return 'Synced';
      case 'syncing': return 'Syncing';
      case 'error': return 'Sync Error';
      case 'offline': return 'Offline';
      case 'local_unapproved': return 'Local';
      case 'ready': return 'Ready';
      default: return 'Local';
    }
  };

  const getSyncBgClass = () => {
    switch (syncStatus) {
      case 'synced': return 'bg-emerald-500/5 border-emerald-500/10 text-emerald-800';
      case 'syncing': return 'bg-orange-500/5 border-orange-500/10 text-orange-800';
      case 'error': return 'bg-red-500/5 border-red-500/10 text-red-800';
      case 'offline':
      case 'local_unapproved':
      default: return 'bg-amber-500/5 border-amber-500/10 text-amber-800';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 border-b border-border/40 shadow-xs transition-premium">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 max-w-page mx-auto w-full">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-accent-coral text-white shadow-sm shadow-glow-primary transition-transform group-hover:scale-105">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight text-text-primary hidden sm:inline-block">
              {t('app.name')}
            </span>
          </Link>
          
          {title && (
            <div className="flex items-center gap-3">
              <span className="text-border-strong hidden lg:inline-block">|</span>
              <h1 className="font-black text-lg sm:text-xl tracking-tight text-text-primary truncate">
                {title}
              </h1>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-800 border border-amber-500/20 rounded-full hidden sm:inline-flex shadow-xs select-none">
            Premium MVP
          </span>
          <Link 
            to="/sync" 
            className={cn(
              "px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border shadow-xs flex items-center gap-1.5 transition-all duration-300 hover:scale-105 active:scale-95", 
              getSyncBgClass()
            )}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${getSyncDotColor()}`} />
            <span>{getSyncLabel()}</span>
          </Link>
          <OfflineBadge />
          <LanguageSwitch />
        </div>
      </div>
    </header>
  );
};
